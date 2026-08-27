import { ONBOARDING } from '../data/content'
import { useApp } from '../store'
import logo from '../assets/pixanpets-logo.png'

export function Onboarding() {
  const { state, set } = useApp()
  const slide = ONBOARDING[state.ob]
  const last = state.ob === ONBOARDING.length - 1

  const next = () =>
    last ? set({ screen: 'auth', authMode: 'register' }) : set({ ob: state.ob + 1 })

  return (
    <section className="screen onboard">
      <div className="onboard__top">
        <button
          type="button"
          className="onboard__skip"
          onClick={() => set({ screen: 'auth', authMode: 'login' })}
        >
          Saltar
        </button>
      </div>

      <div className="onboard__body">
        <div className="onboard__halo">
          <img className="onboard__logo" src={logo} alt="PIXANPETS" />
        </div>
        <div className="onboard__copy">
          <h1 className="onboard__title">{slide.title}</h1>
          <p className="onboard__text">{slide.body}</p>
        </div>
      </div>

      <div className="onboard__foot">
        <div className="onboard__dots" role="tablist" aria-label="Progreso">
          {ONBOARDING.map((s, i) => (
            <span
              key={s.title}
              className={i === state.ob ? 'dot dot--on' : 'dot'}
              role="tab"
              aria-selected={i === state.ob}
              aria-label={`Paso ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="btn btn--teal" onClick={next}>
          {last ? 'Crear mi cuenta' : 'Siguiente'}
        </button>
      </div>
    </section>
  )
}
