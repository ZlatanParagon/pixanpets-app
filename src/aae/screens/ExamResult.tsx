import { Icon } from '../components/Icon'
import { Bar, Ghost, Primary, SectionTitle } from '../components/ui'
import { BY_ID } from '../data/questions'
import { TRACK } from '../data/track'
import { EXAM_CONFIG, useApp } from '../store'
import { C } from '../theme'
import { clock, pct } from '../utils'

export function ExamResult() {
  const { state, set, go, open, startExam } = useApp()
  const a = state.lastAttempt
  if (!a) return null

  const p = pct(a.score, a.total)
  const passed = p >= TRACK.passMark
  const proctored = a.mode === 'proctored'

  return (
    <section className="screen scroll result">
      <header className={`result__hero ${passed ? 'result__hero--ok' : 'result__hero--no'}`}>
        <span className="result__ring">
          <span className="result__pct">{p}%</span>
          <span className="result__frac">
            {a.score} de {a.total}
          </span>
        </span>
        <h1>
          {proctored
            ? passed
              ? '¡Aprobaste el examen certificador!'
              : 'No alcanzaste el mínimo'
            : passed
              ? 'Estás en zona de aprobación'
              : 'Todavía no alcanzas el mínimo'}
        </h1>
        <p>
          {EXAM_CONFIG[a.mode].label} · mínimo {TRACK.passMark}%
          {a.seconds > 0 && ` · ${clock(a.seconds)}`}
        </p>
      </header>

      <SectionTitle>Desempeño por tema</SectionTitle>
      <div className="card topics">
        {Object.entries(a.byTopic).map(([topic, v]) => {
          const tp = pct(v.ok, v.total)
          return (
            <div key={topic} className="topicrow">
              <div className="topicrow__top">
                <span>{topic}</span>
                <strong style={{ color: tp >= 70 ? C.ok : tp >= 50 ? C.l2 : C.bad }}>
                  {v.ok}/{v.total}
                </strong>
              </div>
              <Bar
                value={tp}
                color={tp >= 70 ? C.ok : tp >= 50 ? C.l2 : C.bad}
                height={6}
                label={topic}
              />
            </div>
          )
        })}
      </div>

      <SectionTitle
        action={
          <button type="button" className="linkish" onClick={() => set({ review: !state.review })}>
            {state.review ? 'Ocultar' : 'Ver todas'}
          </button>
        }
      >
        Revisión
      </SectionTitle>
      {state.review && (
        <div className="card list">
          {state.examIds.map((id, i) => {
            const q = BY_ID[id]
            const ok = q.answer === state.examAnswers[i]
            return (
              <div key={id} className="review">
                <span
                  className="review__mark"
                  style={{ background: ok ? C.okBg : C.badBg }}
                >
                  <Icon name={ok ? 'check' : 'close'} size={13} color={ok ? C.ok : C.bad} />
                </span>
                <div className="review__text">
                  <p className="review__q">{q.text}</p>
                  <p className="review__right">Correcta: {q.options[q.answer]}</p>
                  {!ok && <p className="review__why">{q.why}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {proctored && passed ? (
        <Primary tone="gold" onClick={() => open('certificate')}>
          Ver mi certificado y voucher
        </Primary>
      ) : proctored ? (
        <>
          <Primary tone="l3" onClick={() => open('cert')}>
            Reagendar el examen
          </Primary>
          <p className="result__note">
            Tienes un reintento incluido. Se libera 72 horas después del intento anterior.
          </p>
        </>
      ) : (
        <>
          <Primary onClick={() => startExam(a.mode)}>Repetir</Primary>
          <Ghost onClick={() => open('progress')}>Ver mi dashboard</Ghost>
          <Ghost onClick={() => go('practice')}>Volver a práctica</Ghost>
        </>
      )}
    </section>
  )
}
