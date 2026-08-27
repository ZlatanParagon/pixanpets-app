import { Icon } from '../components/Icon'
import { useApp } from '../store'
import { money } from '../utils'

export function OrderDone() {
  const { state, go } = useApp()
  const order = state.lastOrder

  return (
    <section className="screen done done--light">
      <div className="done__seal done__seal--mint">
        <Icon name="check" size={46} color="#17B5AC" />
      </div>
      <h1 className="done__title">¡Pedido confirmado!</h1>
      <p className="done__text">Te avisamos por push en cada cambio de estado.</p>

      <dl className="recap">
        <Row label="Número de orden" value={order?.id ?? '—'} />
        <Row label="Estado" value="Pagado" accent />
        <Row
          label="Entrega"
          value={order?.delivery === 'pickup' ? 'Recolección en tienda' : 'Envío a domicilio'}
        />
        <Row label="Total" value={order ? money(order.total) : '—'} strong />
      </dl>

      <div className="done__spacer" />

      <div className="done__actions">
        <button type="button" className="btn btn--indigo btn--54" onClick={() => go('orders')}>
          Seguir mi pedido
        </button>
        <button type="button" className="btn btn--soft btn--54" onClick={() => go('home')}>
          Volver al inicio
        </button>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  accent = false,
  strong = false,
}: {
  label: string
  value: string
  accent?: boolean
  strong?: boolean
}) {
  const cls = [
    'recap__value',
    accent ? 'recap__value--teal' : '',
    strong ? 'recap__value--strong' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className="recap__row">
      <dt className="recap__label">{label}</dt>
      <dd className={cls}>{value}</dd>
    </div>
  )
}
