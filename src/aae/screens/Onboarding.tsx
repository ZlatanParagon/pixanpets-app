import { Icon, type IconName } from '../components/Icon'
import { Primary } from '../components/ui'
import { TRACK } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'

const SLIDES: { icon: IconName; tint: string; bg: string; title: string; body: string }[] = [
  {
    icon: 'book',
    tint: C.l1,
    bg: C.l1Bg,
    title: 'Empieza gratis por los fundamentos',
    body: 'Cuatro módulos cortos con video, infografías y quizzes. Sin tarjeta, sin compromiso: primero comprueba la calidad.',
  },
  {
    icon: 'target',
    tint: C.l2,
    bg: C.l2Bg,
    title: 'Practica con casos y simuladores',
    body: 'Casos de auditorías reales anonimizadas y un simulador que ajusta la dificultad a tu desempeño, con tu coach de IA al lado.',
  },
  {
    icon: 'award',
    tint: C.l3,
    bg: C.l3Bg,
    title: 'Certifícate con credencial verificable',
    body: `Examen supervisado, certificado digital con QR y voucher canjeable para tu certificación como ${TRACK.name}.`,
  },
]

export function Onboarding() {
  const { state, set, go } = useApp()
  const slide = SLIDES[state.ob]
  const last = state.ob === SLIDES.length - 1

  return (
    <section className="screen onboard">
      <div className="onboard__top">
        <div className="brand">
          <span className="brand__mark">AAE</span>
          <span className="brand__name">Arseg Academy Express</span>
        </div>
        <button type="button" className="onboard__skip" onClick={() => go('auth')}>
          Saltar
        </button>
      </div>

      <div className="onboard__art" style={{ background: slide.bg }}>
        <Icon name={slide.icon} size={72} color={slide.tint} strokeWidth={1.4} />
        <span className="onboard__level" style={{ color: slide.tint }}>
          Nivel {state.ob + 1}
        </span>
      </div>

      <div className="onboard__copy">
        <h1>{slide.title}</h1>
        <p>{slide.body}</p>
      </div>

      <div className="onboard__dots" role="tablist" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === state.ob}
            aria-label={`Slide ${i + 1}`}
            className={i === state.ob ? 'dot dot--on' : 'dot'}
            onClick={() => set({ ob: i })}
          />
        ))}
      </div>

      <div className="onboard__actions">
        <Primary onClick={() => (last ? go('auth') : set({ ob: state.ob + 1 }))}>
          {last ? 'Crear mi cuenta' : 'Siguiente'}
        </Primary>
        <button type="button" className="linkish" onClick={() => set({ authMode: 'login', screen: 'auth' })}>
          Ya tengo cuenta
        </button>
      </div>
    </section>
  )
}
