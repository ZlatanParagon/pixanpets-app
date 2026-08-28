import { useEffect } from 'react'
import { Icon } from '../components/Icon'
import { Bar, Primary } from '../components/ui'
import { BY_ID } from '../data/questions'
import { EXAM_CONFIG, useApp } from '../store'
import { C } from '../theme'
import { clock } from '../utils'

export function Exam() {
  const { state, set, back, answerExam, toggleFlag, finishExam, tickExam } = useApp()
  const cfg = EXAM_CONFIG[state.examMode]
  const timed = cfg.minutes > 0
  const id = state.examIds[state.examIdx]
  const q = id ? BY_ID[id] : undefined
  const picked = state.examAnswers[state.examIdx]
  const practice = state.examMode === 'practice'
  const revealed = practice && picked !== null && picked !== undefined
  const answered = state.examAnswers.filter((a) => a !== null).length
  const last = state.examIdx === state.examIds.length - 1

  // El reloj sólo corre en las modalidades con tiempo; al llegar a cero se
  // entrega automáticamente, como haría un examen real.
  useEffect(() => {
    if (!timed || !state.examRunning) return
    const t = window.setInterval(tickExam, 1000)
    return () => window.clearInterval(t)
  }, [timed, state.examRunning, tickExam])

  useEffect(() => {
    if (timed && state.examRunning && state.examLeft <= 0) finishExam()
  }, [timed, state.examRunning, state.examLeft, finishExam])

  if (!q) return null

  const low = timed && state.examLeft < 300

  return (
    <section className="screen scroll exam">
      <header className="exam__head">
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            set({ examRunning: false })
            back()
          }}
          aria-label="Salir"
        >
          <Icon name="close" size={17} color={C.idle} />
        </button>
        <div className="exam__title">
          <span>{cfg.label}</span>
          <strong>
            {state.examIdx + 1} / {state.examIds.length}
          </strong>
        </div>
        {timed ? (
          <span className="exam__timer" style={{ color: low ? C.bad : C.ink, background: low ? C.badBg : '#F1F5FA' }}>
            <Icon name="clock" size={14} color={low ? C.bad : C.label} />
            {clock(state.examLeft)}
          </span>
        ) : (
          <span className="exam__timer exam__timer--free">sin tiempo</span>
        )}
      </header>

      {state.examMode === 'proctored' && (
        <div className="proctor">
          <span className="proctor__dot" />
          <Icon name="camera" size={14} color={C.bad} />
          Sesión supervisada · cámara y pantalla en grabación
        </div>
      )}

      <Bar value={(answered / state.examIds.length) * 100} label="Preguntas respondidas" />

      <div className="exam__topic">
        <span>{q.topic}</span>
        <button
          type="button"
          className={state.examFlags.includes(q.id) ? 'flagbtn flagbtn--on' : 'flagbtn'}
          onClick={() => toggleFlag(q.id)}
          aria-pressed={state.examFlags.includes(q.id)}
        >
          <Icon name="flag" size={14} color={state.examFlags.includes(q.id) ? C.l2 : C.idle} />
          {state.examFlags.includes(q.id) ? 'Marcada' : 'Marcar'}
        </button>
      </div>

      <h1 className="exam__q">{q.text}</h1>

      <div className="options">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const isRight = q.answer === i
          const cls = !revealed
            ? isPicked
              ? 'option option--on'
              : 'option'
            : isRight
              ? 'option option--right'
              : isPicked
                ? 'option option--wrong'
                : 'option option--dim'
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              onClick={() => answerExam(i)}
              disabled={revealed}
            >
              <span className="option__radio">
                {isPicked && <Icon name={revealed && !isRight ? 'close' : 'check'} size={13} color="#fff" />}
                {revealed && isRight && !isPicked && <Icon name="check" size={13} color="#fff" />}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="explain">
          <h2>
            <Icon name="info" size={15} color={C.brand} /> Por qué
          </h2>
          <p>{q.why}</p>
        </div>
      )}

      <div className="exam__nav">
        <button
          type="button"
          className="ghost"
          disabled={state.examIdx === 0}
          onClick={() => set({ examIdx: state.examIdx - 1 })}
        >
          Anterior
        </button>
        {last ? (
          <Primary
            tone={state.examMode === 'proctored' ? 'l3' : 'brand'}
            onClick={finishExam}
            disabled={practice && !revealed}
          >
            Entregar
          </Primary>
        ) : (
          <Primary
            onClick={() => set({ examIdx: state.examIdx + 1 })}
            disabled={practice && !revealed}
          >
            Siguiente
          </Primary>
        )}
      </div>

      {!practice && (
        <div className="exam__grid">
          {state.examIds.map((qid, i) => (
            <button
              key={qid}
              type="button"
              className={[
                'gridbox',
                i === state.examIdx ? 'gridbox--cur' : '',
                state.examAnswers[i] !== null ? 'gridbox--done' : '',
                state.examFlags.includes(qid) ? 'gridbox--flag' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => set({ examIdx: i })}
              aria-label={`Ir a la pregunta ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
