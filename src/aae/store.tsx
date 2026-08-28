import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ACHIEVEMENTS } from './data/achievements'
import { CASES } from './data/cases'
import { coachReply } from './data/coach'
import { BY_LEVEL, MODULES, moduleById } from './data/modules'
import { BY_ID, QUESTIONS, TOPICS } from './data/questions'
import { TRACK } from './data/track'
import type {
  Achievement,
  Attempt,
  CoachMessage,
  Entitlements,
  ExamMode,
  Level,
  Question,
  Reply,
  Screen,
} from './types'
import { pct, today } from './utils'

/** Longitud y tiempo de cada modalidad del simulador. */
export const EXAM_CONFIG: Record<ExamMode, { n: number; minutes: number; label: string }> = {
  practice: { n: 10, minutes: 0, label: 'Modo práctica' },
  exam: { n: 20, minutes: 30, label: 'Simulador de examen' },
  proctored: { n: TRACK.finalQuestions, minutes: TRACK.finalMinutes, label: 'Examen certificador' },
}

export interface AppState {
  screen: Screen
  /** Pila de regreso: `open` empuja la pantalla actual y `back` la saca. */
  stack: Screen[]
  /** Slide del onboarding, 0–2. */
  ob: number
  authMode: 'login' | 'register'
  name: string
  email: string
  /** Paso del cuestionario de diagnóstico. */
  diagStep: number
  /** Respuestas del diagnóstico, por id de pregunta. */
  diag: Record<string, number>
  ent: Entitlements
  /** Ids de lecciones completadas. */
  done: string[]
  /** Mejor resultado de cada quiz de módulo. */
  quizzes: Record<string, { score: number; total: number }>
  /** Minutos de estudio acumulados. */
  minutes: number
  /** XP de actividad; los logros suman aparte. */
  xp: number
  streak: number
  moduleId: string
  lessonId: string
  /** Apuntes por lección. */
  notes: Record<string, string>
  bookmarks: string[]
  /** Quiz en curso. */
  quizIdx: number
  quizAnswers: (number | null)[]
  /** Ya se respondió la pregunta actual y se muestra la explicación. */
  quizRevealed: boolean
  /** Simulador en curso. */
  examMode: ExamMode
  examIds: string[]
  examIdx: number
  examAnswers: (number | null)[]
  examFlags: string[]
  examLeft: number
  examRunning: boolean
  attempts: Attempt[]
  lastAttempt: Attempt | null
  /** La pantalla de resultado muestra la revisión pregunta por pregunta. */
  review: boolean
  practiceTopic: string
  caseId: string
  casesRead: string[]
  /** Verificación de identidad y agenda del examen proctoreado. */
  idVerified: boolean
  certSlot: string | null
  certified: boolean
  voucher: string | null
  threadId: string
  communityTopic: string
  /** Respuestas que el usuario agrega a los hilos. */
  replies: Record<string, Reply[]>
  coach: CoachMessage[]
  coachTyping: boolean
  planId: 'level2' | 'level3' | 'premium'
  /** Paso del checkout, 1–2. */
  coStep: number
  payMethod: 'card' | 'wallet'
  notifsRead: string[]
}

const INITIAL: AppState = {
  screen: 'onboard',
  stack: [],
  ob: 0,
  authMode: 'register',
  name: 'Ana',
  email: '',
  diagStep: 0,
  diag: {},
  ent: { level2: false, level3: false },
  done: [],
  quizzes: {},
  minutes: 0,
  xp: 0,
  streak: 3,
  moduleId: 'f1',
  lessonId: 'f1l1',
  notes: {},
  bookmarks: [],
  quizIdx: 0,
  quizAnswers: [],
  quizRevealed: false,
  examMode: 'exam',
  examIds: [],
  examIdx: 0,
  examAnswers: [],
  examFlags: [],
  examLeft: 0,
  examRunning: false,
  attempts: [],
  lastAttempt: null,
  review: false,
  practiceTopic: 'Todos',
  caseId: 'c1',
  casesRead: [],
  idVerified: false,
  certSlot: null,
  certified: false,
  voucher: null,
  threadId: 't1',
  communityTopic: 'Todos',
  replies: {},
  coach: [
    {
      from: 'coach',
      text: 'Soy AAE Coach. Puedo explicarte cualquier tema del temario, decirte qué estudiar según tu desempeño o simular preguntas de examen. ¿Por dónde empezamos?',
    },
  ],
  coachTyping: false,
  planId: 'level2',
  coStep: 1,
  payMethod: 'card',
  notifsRead: [],
}

/** Baraja una copia — el simulador nunca debe repetir el mismo orden. */
function shuffle<T>(items: T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Selección adaptativa: con acierto bajo el simulador carga preguntas fáciles
 * y medias; conforme sube, pesa las difíciles. Es la versión determinista de
 * lo que en producción decide el modelo con el historial del usuario.
 */
export function buildExam(mode: ExamMode, accuracy: number, topic = 'Todos'): string[] {
  const bank = topic === 'Todos' ? QUESTIONS : QUESTIONS.filter((q) => q.topic === topic)
  const n = Math.min(EXAM_CONFIG[mode].n, bank.length)
  const wanted: Record<1 | 2 | 3, number> =
    accuracy >= 80
      ? { 1: 0.2, 2: 0.4, 3: 0.4 }
      : accuracy >= 60
        ? { 1: 0.3, 2: 0.45, 3: 0.25 }
        : { 1: 0.45, 2: 0.4, 3: 0.15 }

  const pools: Record<1 | 2 | 3, Question[]> = {
    1: shuffle(bank.filter((q) => q.difficulty === 1)),
    2: shuffle(bank.filter((q) => q.difficulty === 2)),
    3: shuffle(bank.filter((q) => q.difficulty === 3)),
  }

  const picked: Question[] = []
  for (const d of [1, 2, 3] as const) {
    picked.push(...pools[d].slice(0, Math.round(n * wanted[d])))
  }
  // Rellena con lo que quede si el redondeo dejó huecos.
  const rest = shuffle(bank.filter((q) => !picked.includes(q)))
  while (picked.length < n && rest.length) picked.push(rest.shift() as Question)

  return shuffle(picked).slice(0, n).map((q) => q.id)
}

export interface Store {
  state: AppState
  set: (patch: Partial<AppState>) => void
  go: (screen: Screen) => void
  /** Navega a una vista de detalle recordando desde dónde se abrió. */
  open: (screen: Screen, patch?: Partial<AppState>) => void
  back: () => void
  completeLesson: (id: string, minutes: number) => void
  toggleBookmark: (id: string) => void
  startQuiz: (moduleId: string) => void
  answerQuiz: (option: number) => void
  nextQuiz: () => void
  startExam: (mode: ExamMode) => void
  answerExam: (option: number) => void
  toggleFlag: (id: string) => void
  finishExam: () => void
  tickExam: () => void
  buy: (plan: 'level2' | 'level3' | 'premium') => void
  readCase: (id: string) => void
  askCoach: (text: string) => void
  reply: (threadId: string, body: string) => void
  markNotifsRead: () => void
  reset: () => void
  /** Derivados. */
  unlocked: (level: Level) => boolean
  levelProgress: (level: Level) => { done: number; total: number; pct: number }
  topicStats: Record<string, { ok: number; total: number }>
  readiness: number
  weakest: string | null
  sims: number
  canCertify: boolean
  achievements: { badge: Achievement; on: boolean }[]
  totalXp: number
}

const Ctx = createContext<Store | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL)

  const set = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }))
  }, [])

  // Las pestañas son raíces de navegación: entrar a una vacía la pila.
  const go = useCallback((screen: Screen) => set({ screen, stack: [] }), [set])

  const open = useCallback((screen: Screen, patch?: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch, stack: [...s.stack, s.screen], screen }))
  }, [])

  const back = useCallback(() => {
    setState((s) => ({
      ...s,
      screen: s.stack.at(-1) ?? 'home',
      stack: s.stack.slice(0, -1),
    }))
  }, [])

  const unlocked = useCallback(
    (level: Level) => level === 1 || (level === 2 ? state.ent.level2 : state.ent.level3),
    [state.ent],
  )

  const levelProgress = useCallback(
    (level: Level) => {
      const lessons = BY_LEVEL[level].flatMap((m) => m.lessons.map((l) => l.id))
      const done = lessons.filter((id) => state.done.includes(id)).length
      return { done, total: lessons.length, pct: pct(done, lessons.length) }
    },
    [state.done],
  )

  /** Aciertos por tema sobre todos los intentos — alimenta el dashboard. */
  const topicStats = useMemo(() => {
    const acc: Record<string, { ok: number; total: number }> = {}
    for (const t of TOPICS) acc[t] = { ok: 0, total: 0 }
    for (const a of state.attempts) {
      for (const [topic, v] of Object.entries(a.byTopic)) {
        const row = acc[topic] ?? (acc[topic] = { ok: 0, total: 0 })
        row.ok += v.ok
        row.total += v.total
      }
    }
    return acc
  }, [state.attempts])

  const readiness = useMemo(() => {
    const ok = state.attempts.reduce((s, a) => s + a.score, 0)
    const total = state.attempts.reduce((s, a) => s + a.total, 0)
    return pct(ok, total)
  }, [state.attempts])

  const weakest = useMemo(() => {
    const rows = Object.entries(topicStats).filter(([, v]) => v.total >= 2)
    if (rows.length === 0) return null
    rows.sort((a, b) => pct(a[1].ok, a[1].total) - pct(b[1].ok, b[1].total))
    return rows[0][0]
  }, [topicStats])

  const sims = state.attempts.filter((a) => a.mode === 'exam').length
  const canCertify = sims >= TRACK.requiredSims && state.ent.level3

  const achievements = useMemo(() => {
    const l1 = BY_LEVEL[1].flatMap((m) => m.lessons.map((l) => l.id))
    const perfect = Object.values(state.quizzes).some((q) => q.score === q.total && q.total > 0)
    const best = state.attempts.reduce((m, a) => Math.max(m, pct(a.score, a.total)), 0)
    const on: Record<string, boolean> = {
      first: state.done.length > 0,
      quiz: perfect,
      level1: l1.every((id) => state.done.includes(id)),
      streak3: state.streak >= 3 && state.done.length > 0,
      sim1: state.attempts.some((a) => a.mode !== 'practice'),
      sim3: sims >= TRACK.requiredSims,
      score80: best >= 80,
      cases: state.casesRead.length >= CASES.length,
      certified: state.certified,
    }
    return ACHIEVEMENTS.map((badge) => ({ badge, on: on[badge.id] ?? false }))
  }, [state.done, state.quizzes, state.attempts, state.streak, state.casesRead, state.certified, sims])

  const totalXp =
    state.xp + achievements.filter((a) => a.on).reduce((s, a) => s + a.badge.xp, 0)

  const completeLesson = useCallback((id: string, minutes: number) => {
    setState((s) =>
      s.done.includes(id)
        ? s
        : { ...s, done: [...s.done, id], minutes: s.minutes + minutes, xp: s.xp + 15 },
    )
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(id)
        ? s.bookmarks.filter((b) => b !== id)
        : [...s.bookmarks, id],
    }))
  }, [])

  const startQuiz = useCallback((moduleId: string) => {
    const mod = moduleById(moduleId)
    setState((s) => ({
      ...s,
      stack: [...s.stack, s.screen],
      screen: 'quiz',
      moduleId,
      quizIdx: 0,
      quizRevealed: false,
      quizAnswers: new Array(mod?.quiz.length ?? 0).fill(null),
    }))
  }, [])

  const answerQuiz = useCallback((option: number) => {
    setState((s) => {
      if (s.quizRevealed) return s
      const answers = s.quizAnswers.slice()
      answers[s.quizIdx] = option
      return { ...s, quizAnswers: answers, quizRevealed: true }
    })
  }, [])

  const nextQuiz = useCallback(() => {
    setState((s) => {
      const mod = moduleById(s.moduleId)
      if (!mod) return s
      if (s.quizIdx + 1 < mod.quiz.length) {
        return { ...s, quizIdx: s.quizIdx + 1, quizRevealed: false }
      }
      const score = mod.quiz.reduce(
        (sum, id, i) => sum + (BY_ID[id].answer === s.quizAnswers[i] ? 1 : 0),
        0,
      )
      const prev = s.quizzes[s.moduleId]
      const best = prev && prev.score > score ? prev : { score, total: mod.quiz.length }
      return {
        ...s,
        quizzes: { ...s.quizzes, [s.moduleId]: best },
        xp: s.xp + (prev ? 0 : score * 10),
        quizRevealed: true,
        quizIdx: mod.quiz.length,
      }
    })
  }, [])

  const startExam = useCallback(
    (mode: ExamMode) => {
      const ids = buildExam(mode, readiness, mode === 'practice' ? state.practiceTopic : 'Todos')
      setState((s) => ({
        ...s,
        stack: [mode === 'proctored' ? 'cert' : 'practice'],
        screen: 'exam',
        examMode: mode,
        examIds: ids,
        examIdx: 0,
        examAnswers: new Array(ids.length).fill(null),
        examFlags: [],
        examLeft: EXAM_CONFIG[mode].minutes * 60,
        examRunning: true,
        review: false,
      }))
    },
    [readiness, state.practiceTopic],
  )

  const answerExam = useCallback((option: number) => {
    setState((s) => {
      const answers = s.examAnswers.slice()
      answers[s.examIdx] = option
      return { ...s, examAnswers: answers }
    })
  }, [])

  const toggleFlag = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      examFlags: s.examFlags.includes(id)
        ? s.examFlags.filter((f) => f !== id)
        : [...s.examFlags, id],
    }))
  }, [])

  const finishExam = useCallback(() => {
    setState((s) => {
      const byTopic: Record<string, { ok: number; total: number }> = {}
      let score = 0
      s.examIds.forEach((id, i) => {
        const q = BY_ID[id]
        const ok = q.answer === s.examAnswers[i]
        if (ok) score++
        const row = byTopic[q.topic] ?? (byTopic[q.topic] = { ok: 0, total: 0 })
        row.total++
        if (ok) row.ok++
      })
      const spent = EXAM_CONFIG[s.examMode].minutes * 60 - s.examLeft
      const attempt: Attempt = {
        id: `at${s.attempts.length + 1}`,
        mode: s.examMode,
        date: today(),
        score,
        total: s.examIds.length,
        seconds: s.examMode === 'practice' ? 0 : Math.max(0, spent),
        byTopic,
      }
      const passed = pct(score, attempt.total) >= TRACK.passMark
      const certifying = s.examMode === 'proctored' && passed
      return {
        ...s,
        attempts: [...s.attempts, attempt],
        lastAttempt: attempt,
        examRunning: false,
        screen: 'examresult',
        stack: [s.examMode === 'proctored' ? 'cert' : 'practice'],
        xp: s.xp + score * 2,
        minutes: s.minutes + Math.round(attempt.seconds / 60),
        certified: s.certified || certifying,
        voucher: certifying && !s.voucher ? newVoucher() : s.voucher,
      }
    })
  }, [])

  const tickExam = useCallback(() => {
    setState((s) => {
      if (!s.examRunning || s.examLeft <= 0) return s
      return { ...s, examLeft: s.examLeft - 1 }
    })
  }, [])

  const buy = useCallback((plan: 'level2' | 'level3' | 'premium') => {
    setState((s) => ({
      ...s,
      ent:
        plan === 'premium'
          ? { level2: true, level3: true }
          : plan === 'level2'
            ? { ...s.ent, level2: true }
            : { level2: true, level3: true },
      screen: plan === 'level3' ? 'cert' : 'path',
      coStep: 1,
    }))
  }, [])

  const readCase = useCallback((id: string) => {
    setState((s) =>
      s.casesRead.includes(id) ? s : { ...s, casesRead: [...s.casesRead, id], xp: s.xp + 25 },
    )
  }, [])

  const askCoach = useCallback(
    (text: string) => {
      const ctx = { weak: weakest, readiness, name: state.name }
      setState((s) => ({
        ...s,
        coach: [...s.coach, { from: 'user', text }],
        coachTyping: true,
      }))
      window.setTimeout(() => {
        setState((s) => ({
          ...s,
          coach: [...s.coach, { from: 'coach', text: coachReply(text, ctx) }],
          coachTyping: false,
        }))
      }, 550)
    },
    [weakest, readiness, state.name],
  )

  const reply = useCallback((threadId: string, body: string) => {
    setState((s) => ({
      ...s,
      replies: {
        ...s.replies,
        [threadId]: [
          ...(s.replies[threadId] ?? []),
          {
            author: `${s.name} (tú)`,
            initials: s.name.slice(0, 2).toUpperCase(),
            when: 'ahora',
            body,
          },
        ],
      },
      xp: s.xp + 5,
    }))
  }, [])

  const markNotifsRead = useCallback(() => {
    setState((s) => ({ ...s, notifsRead: ['n1', 'n2', 'n3', 'n4', 'n5'] }))
  }, [])

  const reset = useCallback(() => setState(INITIAL), [])

  const value: Store = {
    state,
    set,
    go,
    open,
    back,
    completeLesson,
    toggleBookmark,
    startQuiz,
    answerQuiz,
    nextQuiz,
    startExam,
    answerExam,
    toggleFlag,
    finishExam,
    tickExam,
    buy,
    readCase,
    askCoach,
    reply,
    markNotifsRead,
    reset,
    unlocked,
    levelProgress,
    topicStats,
    readiness,
    weakest,
    sims,
    canCertify,
    achievements,
    totalXp,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): Store {
  const store = useContext(Ctx)
  if (!store) throw new Error('useApp fuera de AppProvider')
  return store
}

/** "AAE-9001-4F72" — nominativo y con vigencia de 12 meses. */
function newVoucher(): string {
  const s = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `AAE-9001-${s}`
}

/** Módulo siguiente sin terminar — lo usan el inicio y la ruta. */
export function nextModule(done: string[]) {
  return MODULES.find((m) => m.lessons.some((l) => !done.includes(l.id)))
}
