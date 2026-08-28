import { Icon } from '../components/Icon'
import { Bar, Primary, Note } from '../components/ui'
import { DIAGNOSTIC, TRACK, WEEKS_BY_TIME } from '../data/track'
import { levelMinutes } from '../data/modules'
import { useApp } from '../store'
import { C } from '../theme'
import { hours } from '../utils'

/**
 * Cuestionario posterior al registro. Su salida no es decorativa: la respuesta
 * de tiempo semanal fija la fecha estimada de examen que el dashboard usa.
 */
export function Diagnostic() {
  const { state, set, go } = useApp()
  const total = DIAGNOSTIC.length
  const finished = state.diagStep >= total

  if (finished) {
    const weeks = WEEKS_BY_TIME[state.diag.time ?? 1]
    const exp = state.diag.exp ?? 0
    return (
      <section className="screen scroll diag">
        <div className="diag__done">
          <span className="diag__check">
            <Icon name="check" size={26} color="#fff" />
          </span>
          <h1>Tu plan está listo, {state.name}</h1>
          <p>
            Con {exp === 0 ? 'cero experiencia previa' : 'la experiencia que ya traes'} y el
            tiempo que puedes dedicar, esta es la ruta que te proponemos.
          </p>
        </div>

        <div className="card diag__plan">
          <div className="diag__plan-row">
            <span>Ruta</span>
            <strong>{TRACK.name}</strong>
          </div>
          <div className="diag__plan-row">
            <span>Empiezas en</span>
            <strong>Nivel 1 · Fundamentos</strong>
          </div>
          <div className="diag__plan-row">
            <span>Contenido del Nivel 1</span>
            <strong>{hours(levelMinutes(1))}</strong>
          </div>
          <div className="diag__plan-row">
            <span>Listo para examen en</span>
            <strong>{weeks} semanas</strong>
          </div>
        </div>

        <Note tone="info" icon="sparkle">
          Ajustaremos esta estimación con tu desempeño real en los quizzes y simuladores.
        </Note>

        <Primary onClick={() => go('home')}>Empezar el Nivel 1</Primary>
      </section>
    )
  }

  const q = DIAGNOSTIC[state.diagStep]
  const picked = state.diag[q.id]

  return (
    <section className="screen scroll diag">
      <header className="diag__head">
        <span className="diag__count">
          Pregunta {state.diagStep + 1} de {total}
        </span>
        <Bar value={((state.diagStep + 1) / total) * 100} label="Avance del diagnóstico" />
      </header>

      <h1 className="diag__q">{q.q}</h1>

      <div className="options">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            className={picked === i ? 'option option--on' : 'option'}
            onClick={() => set({ diag: { ...state.diag, [q.id]: i } })}
            aria-pressed={picked === i}
          >
            <span className="option__radio">{picked === i && <Icon name="check" size={13} color="#fff" />}</span>
            {opt}
          </button>
        ))}
      </div>

      <div className="diag__actions">
        <Primary
          disabled={picked === undefined}
          onClick={() => set({ diagStep: state.diagStep + 1 })}
        >
          {state.diagStep + 1 === total ? 'Ver mi plan' : 'Siguiente'}
        </Primary>
        {state.diagStep > 0 && (
          <button type="button" className="linkish" onClick={() => set({ diagStep: state.diagStep - 1 })}>
            Anterior
          </button>
        )}
        <p className="diag__hint" style={{ color: C.muted }}>
          Cuatro preguntas, treinta segundos. Nos sirven para no hacerte perder el tiempo.
        </p>
      </div>
    </section>
  )
}
