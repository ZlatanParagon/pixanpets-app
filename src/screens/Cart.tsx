import { Icon } from '../components/Icon'
import { Avatar, BackHeader } from '../components/ui'
import { FREE_SHIPPING_FROM } from '../data/products'
import { useApp } from '../store'
import { money } from '../utils'

export function Cart() {
  const { lines, subtotal, shipping, total, go, set, bump } = useApp()
  const empty = lines.length === 0

  return (
    <section className="screen cart">
      <BackHeader title="Tu carrito" onBack={() => go('shop')} className="back-header--sheet" />

      <div className="scroll cart__body">
        {empty ? (
          <div className="empty">
            <div className="empty__icon">
              <Icon name="bag" size={38} color="#A29CCB" stroke={1.8} />
            </div>
            <h2 className="empty__title">Tu carrito está vacío</h2>
            <p className="empty__text">
              Croquetas, antipulgas y juguetes esperan a Frida y Nube.
            </p>
            <button type="button" className="empty__cta" onClick={() => go('shop')}>
              Ir a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="stack stack--11">
              {lines.map((l) => (
                <article key={l.id} className="cart-line">
                  <Avatar label={l.mono} tint={l.tint} ink={l.ink} size={64} radius={15} />
                  <div className="cart-line__main">
                    <h2 className="cart-line__name">{l.name}</h2>
                    <div className="cart-line__size">{l.size}</div>
                    <div className="cart-line__price">{money(l.sub)}</div>
                  </div>
                  <div className="cart-line__qty">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => bump(l.id, 1)}
                      aria-label={`Agregar un ${l.name}`}
                    >
                      +
                    </button>
                    <span className="cart-line__count">{l.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => bump(l.id, -1)}
                      aria-label={`Quitar un ${l.name}`}
                    >
                      −
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="totals">
              <div className="totals__row">
                <span>Subtotal</span>
                <span className="totals__val">{money(subtotal)}</span>
              </div>
              <div className="totals__row">
                <span>Envío estimado</span>
                <span className="totals__val totals__val--teal">
                  {shipping === 0 ? 'Gratis' : money(shipping)}
                </span>
              </div>
              <div className="rule" />
              <div className="totals__grand">
                <span className="totals__grand-label">Total</span>
                <span className="totals__grand-value">{money(total)}</span>
              </div>
              <p className="totals__note">
                Envío gratis a partir de {money(FREE_SHIPPING_FROM)}. Te faltan{' '}
                {money(Math.max(0, FREE_SHIPPING_FROM - subtotal))}.
              </p>
            </div>
          </>
        )}
      </div>

      {!empty && (
        <footer className="sticky-foot sticky-foot--white">
          <button
            type="button"
            className="btn btn--pink"
            onClick={() => set({ screen: 'checkout', coStep: 1 })}
          >
            Continuar · {money(total)}
          </button>
        </footer>
      )}
    </section>
  )
}
