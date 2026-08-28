import { useState } from 'react'
import { Icon } from '../components/Icon'
import { BackHeader, Field, Note, Primary } from '../components/ui'
import { PLANS } from '../data/track'
import { useApp } from '../store'
import { C } from '../theme'
import { usd } from '../utils'

export function Checkout() {
  const { state, back, set, buy } = useApp()
  const plan = PLANS.find((p) => p.id === state.planId) ?? PLANS[0]
  const [card, setCard] = useState('')
  const ready = state.payMethod === 'wallet' || card.replace(/\s/g, '').length >= 15

  if (state.coStep === 2) {
    return (
      <section className="screen scroll checkout">
        <BackHeader title="Confirma tu compra" onBack={() => set({ coStep: 1 })} />

        <div className="card checkout__summary">
          <div className="checkout__row">
            <span>{plan.name}</span>
            <strong>{usd(plan.price)}</strong>
          </div>
          <div className="checkout__row checkout__row--muted">
            <span>Impuestos incluidos</span>
            <span>—</span>
          </div>
          <div className="checkout__row checkout__row--total">
            <span>Total</span>
            <strong>{usd(plan.price)}</strong>
          </div>
          <div className="checkout__row checkout__row--muted">
            <span>Método</span>
            <span>
              {state.payMethod === 'wallet'
                ? 'Apple Pay / Google Pay'
                : `Tarjeta ···· ${card.replace(/\s/g, '').slice(-4) || '0000'}`}
            </span>
          </div>
        </div>

        <Note tone="ok" icon="shield">
          Pago procesado por Stripe. Garantía de reembolso de 14 días si no avanzas ninguna
          lección del nivel comprado.
        </Note>

        <Primary onClick={() => buy(plan.id)}>Pagar {usd(plan.price)}</Primary>
      </section>
    )
  }

  return (
    <section className="screen scroll checkout">
      <BackHeader title="Método de pago" onBack={back} sub={`${plan.name} · ${usd(plan.price)}`} />

      <div className="paymethods">
        <button
          type="button"
          className={state.payMethod === 'wallet' ? 'paymethod paymethod--on' : 'paymethod'}
          onClick={() => set({ payMethod: 'wallet' })}
          aria-pressed={state.payMethod === 'wallet'}
        >
          <Icon name="sparkle" size={18} color={C.brand} />
          <span>
            <strong>Apple Pay / Google Pay</strong>
            <small>Un toque, sin escribir la tarjeta</small>
          </span>
        </button>
        <button
          type="button"
          className={state.payMethod === 'card' ? 'paymethod paymethod--on' : 'paymethod'}
          onClick={() => set({ payMethod: 'card' })}
          aria-pressed={state.payMethod === 'card'}
        >
          <Icon name="card" size={18} color={C.brand} />
          <span>
            <strong>Tarjeta</strong>
            <small>Crédito o débito</small>
          </span>
        </button>
      </div>

      {state.payMethod === 'card' && (
        <div className="card checkout__card">
          <Field label="Número de tarjeta">
            <input
              className="input"
              inputMode="numeric"
              value={card}
              placeholder="4242 4242 4242 4242"
              onChange={(e) => setCard(e.target.value)}
            />
          </Field>
          <div className="checkout__pair">
            <Field label="Vence">
              <input className="input" placeholder="09/29" />
            </Field>
            <Field label="CVC">
              <input className="input" placeholder="123" />
            </Field>
          </div>
        </div>
      )}

      <Primary disabled={!ready} onClick={() => set({ coStep: 2 })}>
        Revisar compra
      </Primary>
    </section>
  )
}
