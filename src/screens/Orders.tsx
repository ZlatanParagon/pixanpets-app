import { BackHeader, Tag } from '../components/ui'
import { useApp } from '../store'

export function Orders() {
  const { state, go } = useApp()

  return (
    <section className="screen scroll orders">
      <BackHeader title="Mis pedidos" onBack={() => go('home')} className="back-header--sheet" />

      <div className="orders__list">
        {state.orders.map((o) => (
          <article key={o.id} className="card order">
            <div className="order__top">
              <h2 className="order__id">{o.id}</h2>
              <Tag bg={o.tagBg} fg={o.tagFg}>
                {o.status}
              </Tag>
            </div>
            <p className="order__meta">{o.meta}</p>
            <div className="order__foot">
              <span className="order__total">{o.total}</span>
              <button type="button" className="btn-sm btn-sm--soft" onClick={() => go('shop')}>
                Volver a pedir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
