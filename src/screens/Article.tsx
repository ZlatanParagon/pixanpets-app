import { Icon } from '../components/Icon'
import { useApp } from '../store'

const SCHEDULE = [
  { age: '6–8 sem', what: 'Primera múltiple + desparasitación' },
  { age: '9–11 sem', what: 'Refuerzo múltiple' },
  { age: '12+ sem', what: 'Rabia + refuerzo final' },
]

export function Article() {
  const { state, set, go } = useApp()
  const firstPet = state.pets[0]

  return (
    <section className="screen scroll article">
      <header className="article__hero">
        <button
          type="button"
          className="article__back"
          onClick={() => go('tips')}
          aria-label="Volver a consejos"
        >
          <Icon name="chevronLeft" size={18} color="#fff" />
        </button>
        <div>
          <span className="article__tag">SALUD</span>
          <h1 className="article__title">Calendario de vacunas: qué toca y cuándo</h1>
        </div>
      </header>

      <div className="article__body">
        <p className="article__byline">Dra. Marisol Cruz · 4 min de lectura</p>

        <p className="article__p">
          Las primeras vacunas se aplican entre las 6 y 8 semanas de vida y se refuerzan cada 21 días
          hasta completar el esquema. Después, la mayoría de los biológicos se revacunan una vez al
          año.
        </p>

        <div className="article__box">
          <h2 className="article__box-title">Esquema típico en perros</h2>
          {SCHEDULE.map((row) => (
            <div key={row.age} className="article__row">
              <span className="article__age">{row.age}</span>
              <span className="article__what">{row.what}</span>
            </div>
          ))}
        </div>

        <p className="article__p">
          Si no estás segura de en qué punto va tu peludito, revisa su cartilla digital en la app:
          ahí marcamos la última dosis aplicada y la siguiente fecha sugerida.
        </p>

        <button
          type="button"
          className="btn btn--teal btn--52 article__cta"
          onClick={() => set({ screen: 'record', recPet: 0 })}
        >
          Ver la cartilla de {firstPet.name}
        </button>
      </div>
    </section>
  )
}
