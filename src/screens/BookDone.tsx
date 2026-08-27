import { Icon } from '../components/Icon'
import { CATALOG, PROVIDERS } from '../data/services'
import { useApp } from '../store'

export function BookDone() {
  const { state, go } = useApp()
  const { bk } = state
  const service = bk.service != null ? CATALOG[bk.type][bk.service] : null
  const provider = bk.provider != null ? PROVIDERS[bk.type][bk.provider] : null
  const pet = state.pets[bk.pet] ?? state.pets[0]

  return (
    <section className="screen done done--indigo">
      <div className="done__seal done__seal--teal">
        <Icon name="check" size={48} color="#14126B" />
      </div>
      <h1 className="done__title done__title--light">¡Cita confirmada!</h1>
      <p className="done__text done__text--light">
        Te enviamos recordatorio 24 h y 2 h antes. {pet.name} ya está en la agenda.
      </p>

      <dl className="recap recap--glass">
        <Row label="Servicio" value={service ? service.name : '—'} />
        <Row label="Prestador" value={provider ? provider.name : '—'} />
        <Row
          label="Cuándo"
          value={`${bk.day ? `${bk.day} ago` : '—'} · ${bk.time ?? '—'}`}
          accent
        />
        <Row label="Dónde" value="Sucursal Del Valle" />
      </dl>

      <div className="done__spacer" />

      <div className="done__actions">
        <button type="button" className="btn btn--teal btn--54" onClick={() => go('citas')}>
          Ver mis citas
        </button>
        <button type="button" className="btn btn--ghost btn--54" onClick={() => go('home')}>
          Volver al inicio
        </button>
      </div>
    </section>
  )
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="recap__row">
      <dt className="recap__label">{label}</dt>
      <dd className={accent ? 'recap__value recap__value--accent' : 'recap__value'}>{value}</dd>
    </div>
  )
}
