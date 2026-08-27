import { CheckMark, Icon } from '../components/Icon'
import { Avatar, Note } from '../components/ui'
import { useApp } from '../store'
import { C } from '../theme'
import { money } from '../utils'

const TITLES = ['Entrega', 'Método de pago', 'Revisa tu pedido']
const STEPS = ['ENTREGA', 'PAGO', 'REVISIÓN']

export function Checkout() {
  const { state, set, go, lines, subtotal, shipping, total, placeOrder } = useApp()
  const step = state.coStep
  const atHome = state.delivery === 'home'

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
                    <span className="address__name">Casa · Ana Robles</span>
                    <span className="address__line">
                      Av. Coyoacán 1234, Del Valle Centro, 03100 CDMX
                    </span>
                  </span>
                  <span className="address__change">Cambiar</span>
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

            <Note decision>
              Reglas de costo de envío por definir (fijo, por zona o gratis sobre monto).
            </Note>
          </div>
        )}

        {step === 2 && (
          <div className="stack stack--11 slide-in">
            <div className="pay pay--on">
              <span className="pay__chip" />
              <div className="pay__main">
                <div className="pay__title">Visa ···· 4821</div>
                <div className="pay__sub">Vence 09/29</div>
              </div>
              <span className="radio radio--on radio--sm">
                <CheckMark color="#fff" />
              </span>
            </div>

            <button type="button" className="pay">
              <Icon name="card" size={22} color={C.purple} />
              <span className="pay__main">
                <span className="pay__title">Agregar otra tarjeta</span>
                <span className="pay__sub">Tokenizada por la pasarela · no se guarda en la app</span>
              </span>
            </button>

            <button type="button" className="pay">
              <Icon name="circlePlus" size={22} color={C.tealDark} />
              <span className="pay__main">
                <span className="pay__title">Otro método</span>
                <span className="pay__sub">
                  Pasarela por definir: Stripe / Mercado Pago / Conekta
                </span>
              </span>
            </button>

            <div className="cfdi">
              <div>
                <div className="cfdi__title">Factura fiscal (CFDI)</div>
                <div className="cfdi__sub">RFC, régimen y uso · por confirmar</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={state.cfdi}
                aria-label="Solicitar factura fiscal"
                className={state.cfdi ? 'switch switch--on' : 'switch'}
                onClick={() => set({ cfdi: !state.cfdi })}
              >
                <span className="switch__knob" />
              </button>
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
                <span className="totals__val">Visa ···· 4821</span>
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
