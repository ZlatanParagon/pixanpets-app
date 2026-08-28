import { Icon } from '../components/Icon'
import { BackHeader, Bar, Note, SectionTitle, Stat } from '../components/ui'
import { TOPICS } from '../data/questions'
import { TRACK, WEEKS_BY_TIME } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'
import { hours, pct } from '../utils'

/** Promedio de la cohorte, para la comparativa. Vendría de analytics. */
const COHORT_AVG = 64

export function Progress() {
  const { state, back, levelProgress, topicStats, readiness, weakest, totalXp, sims } = useApp()

  const l1 = levelProgress(1)
  const l2 = levelProgress(2)
  const lessons = l1.done + l2.done
  const weeks = WEEKS_BY_TIME[state.diag.time ?? 1]
  // La fecha estimada se acerca conforme sube el acierto acumulado.
  const remaining = Math.max(1, Math.round(weeks * (1 - Math.min(readiness, 95) / 100)))
  const ready = new Date()
  ready.setDate(ready.getDate() + remaining * 7)

  return (
    <section className="screen scroll progress">
      <BackHeader title="Tu progreso" onBack={back} sub={TRACK.name} />

      <div className="card progress__ring-card">
        <div className="progress__ring" style={{ borderColor: readiness >= TRACK.passMark ? C.ok : C.l2 }}>
          <strong style={{ color: readiness >= TRACK.passMark ? C.ok : C.l2 }}>{readiness}%</strong>
          <span>acierto</span>
        </div>
        <div className="progress__ring-text">
          <h2>
            {readiness >= TRACK.passMark
              ? 'Estás en zona de aprobación'
              : `Te faltan ${TRACK.passMark - readiness} puntos`}
          </h2>
          <p>
            {state.attempts.length === 0
              ? 'Haz un simulador para empezar a medir.'
              : `Promedio de la cohorte: ${COHORT_AVG}%. Tú ${
                  readiness >= COHORT_AVG ? 'vas arriba' : 'vas abajo'
                } por ${Math.abs(readiness - COHORT_AVG)} puntos.`}
          </p>
        </div>
      </div>

      <div className="statgrid">
        <Stat value={hours(state.minutes)} label="Tiempo de estudio" />
        <Stat value={lessons} label="Lecciones" />
        <Stat value={sims} label="Simuladores" />
        <Stat value={totalXp} label="XP" color={C.gold} />
      </div>

      <SectionTitle>Fortalezas y áreas de mejora</SectionTitle>
      <div className="card topics">
        {TOPICS.map((t) => {
          const v = topicStats[t] ?? { ok: 0, total: 0 }
          const tp = pct(v.ok, v.total)
          return (
            <div key={t} className="topicrow">
              <div className="topicrow__top">
                <span>{t}</span>
                <strong style={{ color: v.total === 0 ? C.idle : tp >= 70 ? C.ok : tp >= 50 ? C.l2 : C.bad }}>
                  {v.total === 0 ? 'sin datos' : `${tp}%`}
                </strong>
              </div>
              <Bar
                value={tp}
                color={tp >= 70 ? C.ok : tp >= 50 ? C.l2 : C.bad}
                height={6}
                label={t}
              />
            </div>
          )
        })}
      </div>

      {weakest && (
        <Note tone="warn" icon="alert">
          Tu mayor ganancia está en <strong>{weakest.toLowerCase()}</strong>. Practica ese tema en
          modo práctica antes del siguiente simulador.
        </Note>
      )}

      <SectionTitle>Avance por nivel</SectionTitle>
      <div className="card topics">
        <div className="topicrow">
          <div className="topicrow__top">
            <span>Nivel 1 · Fundamentos</span>
            <strong style={{ color: C.l1 }}>{l1.pct}%</strong>
          </div>
          <Bar value={l1.pct} color={C.l1} height={6} label="Nivel 1" />
        </div>
        <div className="topicrow">
          <div className="topicrow__top">
            <span>Nivel 2 · Avanzado</span>
            <strong style={{ color: state.ent.level2 ? C.l2 : C.idle }}>
              {state.ent.level2 ? `${l2.pct}%` : 'bloqueado'}
            </strong>
          </div>
          <Bar value={state.ent.level2 ? l2.pct : 0} color={C.l2} height={6} label="Nivel 2" />
        </div>
      </div>

      <SectionTitle>Calendario de estudio</SectionTitle>
      <div className="card week">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={`${d}${i}`} className="week__day">
            <span className={i < state.streak ? 'week__dot week__dot--on' : 'week__dot'}>
              {i < state.streak && <Icon name="check" size={11} color="#fff" />}
            </span>
            <span className="week__label">{d}</span>
          </div>
        ))}
      </div>

      <div className="card predict">
        <span className="predict__icon">
          <Icon name="target" size={18} color={C.brand} />
        </span>
        <div>
          <h3>Listo para el examen</h3>
          <p>
            {ready.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} — estimado con
            tu ritmo y tu acierto actual.
          </p>
        </div>
      </div>
    </section>
  )
}
