import logo from '../assets/pixanpets-logo.png'
import { Icon } from '../components/Icon'
import { Tag } from '../components/ui'
import { NEXT_APPOINTMENT } from '../data/appointments'
import { LATEST_ORDER, ORDER_STAGES } from '../data/orders'
import { useApp } from '../store'

/**
 * "Frida y Nube te esperan". The greeting is one line in the design, so past
 * two pets the tail collapses into a count rather than wrapping the header.
 */
function greeting(names: string[]): string {
  if (names.length === 0) return 'Tus peluditos te esperan'
  if (names.length === 1) return `${names[0]} te espera`
  if (names.length === 2) return `${names[0]} y ${names[1]} te esperan`
  return `${names[0]} y ${names.length - 1} más te esperan`
}

export function Home() {
  const { state, go, set, startBooking } = useApp()

  return (
    <section className="screen scroll scroll--tabbed home">
      <header className="home__hero">
        <div className="home__hero-row">
          <div className="home__greeting">
            <img className="home__logo" src={logo} alt="" />
            <div>
              <div className="home__hello">¡Hola, Ana!</div>
              <div className="home__names">{greeting(state.pets.map((p) => p.name))}</div>
            </div>
          </div>
          <button
            type="button"
            className="home__bell"
            onClick={() => go('notifs')}
            aria-label="Notificaciones"
          >
            <Icon name="bell" size={20} color="#fff" />
            <span className="home__bell-dot" />
          </button>
        </div>

        <div className="home__actions">
          <button type="button" className="action action--teal" onClick={startBooking}>
            <Icon name="calendar" size={24} color="#14126B" />
            <span className="action__title">Agendar cita</span>
            <span className="action__sub">Médico o estética</span>
          </button>
          <button type="button" className="action" onClick={() => go('shop')}>
            <Icon name="bag" size={24} color="#E9207F" />
            <span className="action__title">Comprar</span>
            <span className="action__sub action__sub--muted">Alimento y más</span>
          </button>
        </div>
      </header>

      <div className="home__body">
        <div>
          <h2 className="section-title">Tu próxima cita</h2>
          <button type="button" className="card next-appt" onClick={() => go('citas')}>
            <span className="next-appt__date">
              <span className="next-appt__day">{NEXT_APPOINTMENT.day}</span>
              <span className="next-appt__month">{NEXT_APPOINTMENT.month}</span>
            </span>
            <span className="next-appt__main">
              <span className="next-appt__meta">
                <Tag bg="#EAFBFA" fg="#0F8F88" wide>
                  {NEXT_APPOINTMENT.type}
                </Tag>
                <span className="next-appt__time">{NEXT_APPOINTMENT.time}</span>
              </span>
              <span className="next-appt__title">{NEXT_APPOINTMENT.title}</span>
              <span className="next-appt__provider">{NEXT_APPOINTMENT.provider}</span>
            </span>
            <Icon name="chevronRight" size={18} color="#C9BEF6" />
          </button>
        </div>

        <div>
          <div className="section-head">
            <h2 className="section-title">Último pedido</h2>
            <button type="button" className="link" onClick={() => go('orders')}>
              Ver todos
            </button>
          </div>
          <button type="button" className="card order-card" onClick={() => go('orders')}>
            <span className="order-card__top">
              <span className="order-card__id">Pedido {LATEST_ORDER.id}</span>
              <Tag bg="#FFF0E6" fg="#C05A12">
                {LATEST_ORDER.status}
              </Tag>
            </span>
            <span className="order-card__meta">{LATEST_ORDER.meta}</span>
            <span className="order-card__track">
              {ORDER_STAGES.map((stage, i) => (
                <span
                  key={stage}
                  className={i < LATEST_ORDER.stagesDone ? 'track track--on' : 'track'}
                />
              ))}
            </span>
            <span className="order-card__stages">
              {ORDER_STAGES.map((stage) => (
                <span key={stage}>{stage}</span>
              ))}
            </span>
          </button>
        </div>

        <div>
          <h2 className="section-title">Mis peluditos</h2>
          <div className="pet-strip">
            {state.pets.map((p, i) => (
              <button
                key={p.name + i}
                type="button"
                className="card pet-tile"
                onClick={() => set({ screen: 'record', recPet: i })}
              >
                <span className="pet-tile__photo">
                  {p.photo ? (
                    <img className="pet-tile__img" src={p.photo} alt="" />
                  ) : (
                    <span className="pet-tile__initial" style={{ background: p.tint, color: p.ink }}>
                      {p.initial}
                    </span>
                  )}
                </span>
                <span className="pet-tile__name">{p.name}</span>
                <span className="pet-tile__meta">{p.meta}</span>
                <span className="pet-tile__badge">
                  <Tag bg={p.badgeBg} fg={p.badgeFg}>
                    {p.badge}
                  </Tag>
                </span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="emergency" onClick={() => go('notifs')}>
          <span className="emergency__icon">
            <Icon name="phone" size={20} color="#FF6BAE" />
          </span>
          <span className="emergency__main">
            <span className="emergency__title">Urgencias 24/7</span>
            <span className="emergency__sub">Llamar · Ruta a la sucursal · Horarios</span>
          </span>
          <Icon name="chevronRight" size={18} color="rgba(255,255,255,.5)" />
        </button>
      </div>
    </section>
  )
}
