import { Icon } from '../components/Icon'
import { Bar, Chip, LockedCard, SectionTitle, Tag } from '../components/ui'
import { CASES } from '../data/cases'
import { QUESTIONS, TOPICS } from '../data/questions'
import { TRACK } from '../data/track'
import { EXAM_CONFIG, useApp } from '../store'
import { C } from '../theme'
import { clock, pct } from '../utils'

export function Practice() {
  const { state, set, open, startExam, readiness, sims, topicStats } = useApp()
  const paid = state.ent.level2

  return (
    <section className="screen scroll scroll--tabbed practice">
      <header className="practice__head">
        <h1>Práctica</h1>
        <p>
          Banco de {QUESTIONS.length} preguntas · {TOPICS.length} temas · aprobatorio{' '}
          {TRACK.passMark}%
        </p>
      </header>

      <div className="card sim">
        <div className="sim__top">
          <span className="sim__icon" style={{ background: C.l2Bg }}>
            <Icon name="clock" size={19} color={C.l2} />
          </span>
          <div className="sim__text">
            <h2>Simulador de examen</h2>
            <p>
              {EXAM_CONFIG.exam.n} preguntas · {EXAM_CONFIG.exam.minutes} min · dificultad
              adaptativa
            </p>
          </div>
          <Tag bg="#F1F5FA" fg={C.label}>
            {sims}/{TRACK.requiredSims}
          </Tag>
        </div>
        <p className="sim__hint">
          Condiciones reales: temporizador corriendo, sin explicación hasta el final. Necesitas{' '}
          {TRACK.requiredSims} simuladores completos para agendar la certificación.
        </p>
        {paid ? (
          <button type="button" className="primary primary--l2" onClick={() => startExam('exam')}>
            Iniciar simulador
          </button>
        ) : (
          <button
            type="button"
            className="primary primary--l2"
            onClick={() => open('paywall', { planId: 'level2' })}
          >
            Desbloquear con el Nivel 2
          </button>
        )}
      </div>

      <SectionTitle>Modo práctica</SectionTitle>
      <div className="card practice__free">
        <p>
          {EXAM_CONFIG.practice.n} preguntas sin temporizador, con la explicación después de cada
          respuesta. Gratis, también en el Nivel 1.
        </p>
        <div className="chips">
          {['Todos', ...TOPICS].map((t) => (
            <Chip
              key={t}
              label={t}
              on={state.practiceTopic === t}
              onClick={() => set({ practiceTopic: t })}
            />
          ))}
        </div>
        <button type="button" className="ghost ghost--wide" onClick={() => startExam('practice')}>
          <Icon name="target" size={16} color={C.brand} />
          Practicar ahora
        </button>
      </div>

      <SectionTitle>Casos de estudio</SectionTitle>
      {paid ? (
        <div className="card list">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="mod"
              onClick={() => open('case', { caseId: c.id })}
            >
              <span
                className="mod__mark"
                style={{ background: state.casesRead.includes(c.id) ? C.okBg : '#F1F5FA' }}
              >
                <Icon
                  name={state.casesRead.includes(c.id) ? 'check' : 'folder'}
                  size={15}
                  color={state.casesRead.includes(c.id) ? C.ok : C.muted}
                />
              </span>
              <span className="mod__text">
                <span className="mod__title">{c.title}</span>
                <span className="mod__sub">
                  {c.sector} · {c.read}
                </span>
              </span>
              <Icon name="chevronRight" size={16} color={C.idle} />
            </button>
          ))}
        </div>
      ) : (
        <LockedCard
          title="Auditorías reales, anonimizadas"
          body="Cuatro casos documentados con su resolución paso a paso y el hallazgo final tal como se redactó."
          cta="Ver el Nivel 2"
          onClick={() => open('paywall', { planId: 'level2' })}
        />
      )}

      {state.attempts.length > 0 && (
        <>
          <SectionTitle
            action={
              <button type="button" className="linkish" onClick={() => open('progress')}>
                Dashboard
              </button>
            }
          >
            Tus intentos
          </SectionTitle>
          <div className="card list">
            {state.attempts
              .slice()
              .reverse()
              .map((a) => {
                const p = pct(a.score, a.total)
                return (
                  <div key={a.id} className="attempt">
                    <span
                      className="attempt__score"
                      style={{ color: p >= TRACK.passMark ? C.ok : C.l2 }}
                    >
                      {p}%
                    </span>
                    <span className="attempt__text">
                      <span className="attempt__title">{EXAM_CONFIG[a.mode].label}</span>
                      <span className="attempt__meta">
                        {a.date} · {a.score}/{a.total}
                        {a.seconds > 0 && ` · ${clock(a.seconds)}`}
                      </span>
                    </span>
                  </div>
                )
              })}
          </div>
          <div className="card practice__ready">
            <div className="practice__ready-top">
              <span>Acierto acumulado</span>
              <strong style={{ color: readiness >= TRACK.passMark ? C.ok : C.l2 }}>
                {readiness}%
              </strong>
            </div>
            <Bar
              value={readiness}
              color={readiness >= TRACK.passMark ? C.ok : C.l2}
              label="Acierto acumulado"
            />
            <p>
              {Object.entries(topicStats).filter(([, v]) => v.total > 0).length} de {TOPICS.length}{' '}
              temas con datos.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
