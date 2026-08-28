export type Screen =
  | 'onboard'
  | 'auth'
  | 'diagnostic'
  | 'home'
  | 'path'
  | 'module'
  | 'lesson'
  | 'quiz'
  | 'paywall'
  | 'checkout'
  | 'practice'
  | 'exam'
  | 'examresult'
  | 'case'
  | 'coach'
  | 'progress'
  | 'community'
  | 'thread'
  | 'cert'
  | 'certificate'
  | 'profile'
  | 'achievements'
  | 'notifs'

/** 1 = Fundamentos (gratis), 2 = Avanzado (pago), 3 = Certificación (pago). */
export type Level = 1 | 2 | 3

/** What the user has unlocked. Level 1 is always open. */
export interface Entitlements {
  level2: boolean
  level3: boolean
}

export interface Lesson {
  id: string
  title: string
  /** Minutes of video, as shown next to the play button. */
  min: number
  kind: 'video' | 'infografía' | 'caso' | 'lectura'
  /** Two or three bullets the lesson screen shows as "lo esencial". */
  points: string[]
}

export interface Module {
  id: string
  level: Level
  title: string
  /** One line under the title in the path. */
  summary: string
  /** Cláusula / tema de la norma que cubre. */
  topic: string
  lessons: Lesson[]
  /** Ids of the questions asked by the module quiz. */
  quiz: string[]
}

export interface Question {
  id: string
  /** Tema — feeds the strengths/weaknesses breakdown. */
  topic: string
  text: string
  options: string[]
  answer: number
  /** Shown after answering, in práctica mode and in the review. */
  why: string
  /** 1 = fácil, 2 = media, 3 = difícil. The simulator adapts on this. */
  difficulty: 1 | 2 | 3
}

export interface CaseStudy {
  id: string
  title: string
  sector: string
  /** "12 min" */
  read: string
  context: string
  /** Guided resolution, step by step. */
  steps: { title: string; body: string }[]
  finding: string
}

export type ExamMode = 'practice' | 'exam' | 'proctored'

export interface Attempt {
  id: string
  mode: ExamMode
  /** "14 sep" */
  date: string
  score: number
  total: number
  /** Seconds spent. */
  seconds: number
  /** Correct answers per topic, for the progress dashboard. */
  byTopic: Record<string, { ok: number; total: number }>
}

export interface Achievement {
  id: string
  title: string
  detail: string
  icon: string
  /** XP awarded when unlocked. */
  xp: number
}

export interface Thread {
  id: string
  topic: string
  title: string
  author: string
  initials: string
  /** "hace 2 h" */
  when: string
  body: string
  replies: Reply[]
  /** Level required to read the thread; 3 = comunidad de graduados. */
  level: Level
}

export interface Reply {
  author: string
  initials: string
  when: string
  body: string
  /** Instructor answers get the verified pill. */
  staff?: boolean
}

export interface Notification {
  id: string
  icon: string
  title: string
  body: string
  when: string
  kind: 'racha' | 'contenido' | 'examen' | 'oferta' | 'comunidad'
}

export interface CoachMessage {
  from: 'user' | 'coach'
  text: string
}

export interface Plan {
  id: 'level2' | 'level3' | 'premium'
  name: string
  price: number
  /** "pago único" | "al año" */
  period: string
  tagline: string
  includes: string[]
}
