import { CheckMark, Icon } from '../components/Icon'
import { Avatar, Field } from '../components/ui'
import { ADDRESSES, CARDS } from '../data/settings'
import { useApp } from '../store'
import { C } from '../theme'
import { money } from '../utils'

const TITLES = ['Entrega', 'Método de pago', 'Revisa tu pedido']
const STEPS = ['ENTREGA', 'PAGO', 'REVISIÓN']

export function Checkout() {
  const { state, set, go, lines, subtotal, shipping, total, placeOrder, openSetting } = useApp()
  const step = state.coStep
  const atHome = state.delivery === 'home'
  const address = ADDRESSES[state.addr] ?? ADDRESSES[0]
  const card = CARDS[state.card] ?? CARDS[0]

  const back = () => (step === 1 ? go('cart') : set({ coStep: step - 1 }))
  const next = () => (step === 3 ? placeOrder() : set({ coStep: step + 1 }))

  const ctas = ['Continuar al pago', 'Revisar pedido', `Pagar ${money(total)}`]

  return (
    <section className="screen checkout">
      <header className="checkout__head">
        <div className="checkout__head-row">
          <button type="button" className="icon-btn" onClick={back} aria-label="Volver">
            <Icon name="chevronLeft" size={18} color={C.indigo} />
          </button>
          <h1 className="checkout__title">{TITLES[step - 1]}</h1>
        </div>
        <ol className="steps">
          {STEPS.map((label, i) => (
            <li key={label} className={step >= i + 1 ? 'steps__item steps__item--on' : 'steps__item'}>
              <span className="steps__bar" />
              <span className="steps__label">{label}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="scroll checkout__body">
        {step === 1 && (
          <div className="stack stack--11 slide-in">
            <button
              type="button"
              className={atHome ? 'option option--on' : 'option'}
              onClick={() => set({ delivery: 'home' })}
              aria-pressed={atHome}
            >
              <span className="option__row">
                <Icon name="truckWheels" size={22} color={C.indigo} />
                <span className="option__main">
                  <span className="option__title">Envío a domicilio</span>
                  <span className="option__sub">Llega mañana · $79 (gratis desde $899)</span>
                </span>
              </span>
              {atHome && (
                <span className="option__detail">
                  <span className="address">
                    <span className="address__name">{address.label} · Ana Robles</span>
                    <span className="address__line">{address.line}</span>
                  </span>
                  <span
                    className="address__change"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      openSetting('direcciones')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        openSetting('direcciones')
                      }
                    }}
                  >
                    Cambiar
                  </span>
                </span>
              )}
            </button>

            <button
              type="button"
              className={!atHome ? 'option option--on' : 'option'}
              onClick={() => set({ delivery: 'pickup' })}
              aria-pressed={!atHome}
            >
              <span className="option__row">
                <Icon name="store" size={22} color={C.indigo} />
                <span className="option__main">
                  <span className="option__title">Recoger en sucursal</span>
                  <span className="option__sub">Hoy después de las 14 h · sin costo</span>
                </span>
              </span>
              {!atHome && (
                <span className="option__detail option__detail--text">
                  Sucursal Del Valle · Av. Coyoacán 1234. Te avisamos por push cuando esté listo para
                  recoger.
                </span>
              )}
            </button>

          </div>
        )}

        {step === 2 && (
          <div className="stack stack--11 slide-in">
            <div className="pay pay--on">
              <span className="pay__chip" style={{ background: card.art }} />
              <div className="pay__main">
                <div className="pay__title">{card.name}</div>
                <div className="pay__sub">{card.meta}</div>
              </div>
              <span className="radio radio--on radio--sm">
                <CheckMark color="#fff" />
              </span>
            </div>

            <button type="button" className="pay" onClick={() => openSetting('pagos')}>
              <Icon name="card" size={22} color={C.purple} />
              <span className="pay__main">
                <span className="pay__title">Agregar otra tarjeta</span>
                <span className="pay__sub">Tokenizada por la pasarela · no se guarda en la app</span>
              </span>
            </button>

            <button type="button" className="pay" onClick={() => openSetting('pagos')}>
              <Icon name="circlePlus" size={22} color={C.tealDark} />
              <span className="pay__main">
                <span className="pay__title">Apple Pay o Google Pay</span>
                <span className="pay__sub">Autoriza con Face ID desde tu wallet</span>
              </span>
            </button>

            <div className="cfdi-block">
              <div className="cfdi">
                <div>
                  <div className="cfdi__title">Factura fiscal (CFDI)</div>
                  <div className="cfdi__sub">Te la enviamos por correo</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={state.cfdi}
                  aria-label="Solicitar factura fiscal CFDI"
                  className={state.cfdi ? 'switch switch--on' : 'switch'}
                  onClick={() => set({ cfdi: !state.cfdi })}
                >
                  <span className="switch__knob" />
                </button>
              </div>
              {state.cfdi && (
                <div className="cfdi-form">
                  <div className="cfdi-form__row">
                    <Field label="RFC" style={{ flex: 1.2 }}>
                      <input className="input input--sm" defaultValue="ROAN890314H2A" />
                    </Field>
                    <Field label="Régimen" style={{ flex: 1 }}>
                      <input className="input input--sm" defaultValue="605" />
                    </Field>
                  </div>
                  <Field label="Uso del CFDI">
                    <input className="input input--sm" defaultValue="G03 · Gastos en general" />
                  </Field>
                </div>
              )}
            </div>

            <p className="fineprint">
              Pago cifrado en tránsito (TLS). La app nunca almacena datos de tarjeta.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="stack stack--12 slide-in">
            <div className="review">
              {lines.map((l) => (
                <div key={l.id} className="review__line">
                  <Avatar label={l.mono} tint={l.tint} ink={l.ink} size={44} radius={12} font={17} />
                  <div className="review__main">
                    <div className="review__name">{l.name}</div>
                    <div className="review__qty">
                      {l.qty} × {l.size}
                    </div>
                  </div>
                  <div className="review__price">{money(l.sub)}</div>
                </div>
              ))}
            </div>

            <div className="totals totals--outline">
              <div className="totals__row">
                <span>Entrega</span>
                <span className="totals__val">
                  {atHome ? 'Envío a domicilio' : 'Recolección en tienda'}
                </span>
              </div>
              <div className="totals__row">
                <span>Pago</span>
                <span className="totals__val">{card.name}</span>
              </div>
              <div className="totals__row">
                <span>Subtotal</span>
                <span className="totals__val">{money(subtotal)}</span>
              </div>
              <div className="totals__row">
                <span>Envío</span>
                <span className="totals__val totals__val--teal">
                  {shipping === 0 ? 'Gratis' : money(shipping)}
                </span>
              </div>
              <div className="rule" />
              <div className="totals__grand">
                <span className="totals__grand-label">Total</span>
                <span className="totals__grand-value">{money(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="sticky-foot">
        <button type="button" className="btn btn--pink" onClick={next}>
          {ctas[step - 1]}
        </button>
      </footer>
    </section>
  )
}
