import { Icon } from '../components/Icon'
import { BackHeader, Note, Primary, Tag } from '../components/ui'
import { PLANS, TRACK } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'
import { usd } from '../utils'

export function Paywall() {
  const { state, back, set, open, startExam } = useApp()
  const plan = PLANS.find((p) => p.id === state.planId) ?? PLANS[0]

  return (
    <section className="screen scroll paywall">
      <BackHeader title="Desbloquea tu siguiente nivel" onBack={back} />

      <div className="paywall__pitch">
        <h1>
          El 85 % de quienes completan el Nivel 2 aprueban el examen certificador a la primera.
        </h1>
        <p>
          Elige cómo quieres avanzar en la ruta de {TRACK.name}. Un solo pago, acceso de por
          vida al contenido de ese nivel.
        </p>
      </div>

      <div className="plans">
        {PLANS.map((p) => {
          const on = p.id === state.planId
          const owned =
            (p.id === 'level2' && state.ent.level2) || (p.id === 'level3' && state.ent.level3)
          return (
            <button
              key={p.id}
              type="button"
              className={on ? 'plan plan--on' : 'plan'}
              onClick={() => set({ planId: p.id })}
              aria-pressed={on}
              disabled={owned}
            >
              <span className="plan__top">
                <span className="plan__name">{p.name}</span>
                {owned ? (
                  <Tag bg={C.okBg} fg={C.ok}>
                    Ya lo tienes
                  </Tag>
                ) : (
                  <span className="plan__price">
                    {usd(p.price)}
                    <small>{p.period}</small>
                  </span>
                )}
              </span>
              <span className="plan__tagline">{p.tagline}</span>
              <ul className="plan__list">
                {p.includes.map((inc) => (
                  <li key={inc}>
                    <Icon name="check" size={13} color={on ? C.brand : C.muted} />
                    {inc}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <Note tone="info" icon="info">
        El voucher del Nivel 3 es nominativo, tiene 12 meses de vigencia y se canjea con{' '}
        {TRACK.registrar}. La certificación externa la emite esa entidad, no AAE.
      </Note>

      <Primary onClick={() => open('checkout')}>Continuar · {usd(plan.price)}</Primary>

      <button
        type="button"
        className="linkish linkish--center"
        onClick={() => startExam('practice')}
      >
        Antes, prueba gratis un examen de ejemplo
      </button>
    </section>
  )
}
