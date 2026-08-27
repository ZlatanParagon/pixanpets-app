import { Icon } from '../components/Icon'
import { PetAvatar, Tag } from '../components/ui'
import { useApp } from '../store'
import type { Screen } from '../types'

interface Row {
  mono: string
  label: string
  hint: string
  tint: string
  ink: string
  to: Screen
  /** Checkout opens on this step when the row points at it. */
  step?: number
}

export function Profile() {
  const { state, set, go } = useApp()

  const rows: Row[] = [
    {
      mono: 'CD',
      label: 'Cartilla digital de mis mascotas',
      hint: String(state.pets.length),
      tint: '#EAFBFA',
      ink: '#0F8F88',
      to: 'record',
    },
    { mono: 'PD', label: 'Mis pedidos', hint: '3', tint: '#FFF0E6', ink: '#C05A12', to: 'orders' },
    {
      mono: 'DI',
      label: 'Direcciones de envío',
      hint: '1',
      tint: '#F0E6FF',
      ink: '#7A22C4',
      to: 'checkout',
      step: 1,
    },
    {
      mono: 'PA',
      label: 'Métodos de pago',
      hint: 'Visa ···· 4821',
      tint: '#E6F0FF',
      ink: '#2A55A0',
      to: 'checkout',
      step: 2,
    },
    {
      mono: 'NO',
      label: 'Notificaciones',
      hint: 'Push activado',
      tint: '#FFE6F1',
      ink: '#E9207F',
      to: 'notifs',
    },
    {
      mono: 'PR',
      label: 'Privacidad y datos',
      hint: 'ARCO',
      tint: '#F1EDFD',
      ink: '#6F6AA0',
      to: 'tips',
    },
  ]

  const openRow = (r: Row) =>
    r.step ? set({ screen: r.to, coStep: r.step }) : go(r.to)

  return (
    <section className="screen scroll scroll--tabbed profile">
      <header className="profile__hero">
        <span className="profile__avatar">AR</span>
        <div className="profile__id">
          <h1 className="profile__name">Ana Robles</h1>
          <p className="profile__contact">ana.robles@correo.com · 55 4821 0093</p>
        </div>
        <button type="button" className="profile__edit">
          Editar
        </button>
      </header>

      <div className="profile__body">
        <div>
          <div className="section-head">
            <h2 className="section-title">Mis mascotas</h2>
            <button type="button" className="link" onClick={() => go('petnew')}>
              Agregar
            </button>
          </div>
          <div className="stack stack--10">
            {state.pets.map((p, i) => (
              <button
                key={p.name + i}
                type="button"
                className="pet-row"
                onClick={() => set({ screen: 'record', recPet: i })}
              >
                <PetAvatar pet={p} size={52} radius={16} font={21} />
                <span className="pet-row__main">
                  <span className="pet-row__name">{p.name}</span>
                  <span className="pet-row__meta">{p.meta}</span>
                </span>
                <Tag bg={p.badgeBg} fg={p.badgeFg}>
                  {p.badge}
                </Tag>
                <Icon name="chevronRight" size={17} color="#C9BEF6" />
              </button>
            ))}
          </div>
        </div>

        <div className="settings">
          {rows.map((r) => (
            <button key={r.label} type="button" className="settings__row" onClick={() => openRow(r)}>
              <span className="settings__mono" style={{ background: r.tint, color: r.ink }}>
                {r.mono}
              </span>
              <span className="settings__label">{r.label}</span>
              <span className="settings__hint">{r.hint}</span>
              <Icon name="chevronRight" size={16} color="#C9BEF6" />
            </button>
          ))}
        </div>

        <div className="profile__foot">
          <button
            type="button"
            className="profile__logout"
            onClick={() => set({ screen: 'auth', authMode: 'login' })}
          >
            Cerrar sesión
          </button>
          <button type="button" className="profile__delete">
            Eliminar mi cuenta y mis datos
          </button>
          <p className="profile__legal">PIXANPETS v1.0 · Aviso de privacidad · Derechos ARCO</p>
        </div>
      </div>
    </section>
  )
}
