import { Icon, type IconName } from '../components/Icon'
import { BackHeader, Bar, LevelPill, Primary, Tag } from '../components/ui'
import { moduleById } from '../data/modules'
import { useApp } from '../store'
import { C, levelColors } from '../theme'
import { hours } from '../utils'

const KIND_ICON: Record<string, IconName> = {
  video: 'play',
  infografía: 'chart',
  caso: 'folder',
  lectura: 'book',
}

export function Module() {
  const { state, back, open, startQuiz } = useApp()
  const mod = moduleById(state.moduleId)
  if (!mod) return null

  const done = mod.lessons.filter((l) => state.done.includes(l.id)).length
  const allDone = done === mod.lessons.length
  const minutes = mod.lessons.reduce((s, l) => s + l.min, 0)
  const quiz = state.quizzes[mod.id]
  const c = levelColors(mod.level)

  return (
    <section className="screen scroll module">
      <BackHeader title={mod.title} onBack={back} sub={`${mod.lessons.length} lecciones · ${hours(minutes)}`} />

      <div className="module__head">
        <div className="module__tags">
          <LevelPill level={mod.level} />
          <Tag bg="#F1F5FA" fg={C.label} wide>
            {mod.topic}
          </Tag>
        </div>
        <p className="module__summary">{mod.summary}</p>
        <Bar value={(done / mod.lessons.length) * 100} color={c.fg} label="Avance del módulo" />
        <span className="module__count">
          {done} de {mod.lessons.length} lecciones completadas
        </span>
      </div>

      <div className="card list">
        {mod.lessons.map((l, i) => {
          const isDone = state.done.includes(l.id)
          return (
            <button
              key={l.id}
              type="button"
              className="lessonrow"
              onClick={() => open('lesson', { moduleId: mod.id, lessonId: l.id })}
            >
              <span
                className="lessonrow__icon"
                style={{ background: isDone ? c.bg : '#F1F5FA' }}
              >
                <Icon
                  name={isDone ? 'check' : KIND_ICON[l.kind]}
                  size={15}
                  color={isDone ? c.fg : C.muted}
                />
              </span>
              <span className="lessonrow__text">
                <span className="lessonrow__title">
                  {i + 1}. {l.title}
                </span>
                <span className="lessonrow__meta">
                  {l.kind} · {l.min} min
                </span>
              </span>
              {state.bookmarks.includes(l.id) && (
                <Icon name="bookmark" size={15} color={C.brand} />
              )}
              <Icon name="chevronRight" size={16} color={C.idle} />
            </button>
          )
        })}
      </div>

      <div className="card module__quiz">
        <div className="module__quiz-top">
          <span className="module__quiz-icon" style={{ background: C.brandSoft }}>
            <Icon name="target" size={18} color={C.brand} />
          </span>
          <div>
            <h3>Quiz del módulo</h3>
            <p>{mod.quiz.length} preguntas con explicación inmediata</p>
          </div>
          {quiz && (
            <Tag bg={quiz.score === quiz.total ? C.okBg : '#F1F5FA'} fg={quiz.score === quiz.total ? C.ok : C.label}>
              {quiz.score}/{quiz.total}
            </Tag>
          )}
        </div>
        <Primary onClick={() => startQuiz(mod.id)} disabled={!allDone && !quiz}>
          {quiz ? 'Repetir quiz' : 'Empezar quiz'}
        </Primary>
        {!allDone && !quiz && (
          <p className="module__quiz-hint">Termina las lecciones para desbloquear el quiz.</p>
        )}
      </div>
    </section>
  )
}
