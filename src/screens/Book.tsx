import { CheckMark, Icon } from '../components/Icon'
import { Note, PetAvatar, Tag, TickBox } from '../components/ui'
import { AVAILABLE_DAYS, CATALOG, PROVIDERS, SLOTS } from '../data/services'
import { useApp } from '../store'
import { C } from '../theme'
import type { ServiceType } from '../types'

const TITLES = [
  '¿Quién viene a la cita?',
  'Tipo de servicio',
  'Elige prestador',
  'Fecha y hora',
  'Confirma tu cita',
]

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const DAYS_IN_MONTH = 31
/** The grid shows August 2026; only days from the 26th on are still bookable. */
const FIRST_BOOKABLE = 26

function isAvailable(day: number): boolean {
  return AVAILABLE_DAYS.includes(day) && day >= FIRST_BOOKABLE
}

export function Book() {
  const { state, set, setBooking, go } = useApp()
  const { bk, bookStep } = state

  const services = CATALOG[bk.type]
  const providers = PROVIDERS[bk.type]
  const service = bk.service != null ? services[bk.service] : null
  const provider = bk.provider != null ? providers[bk.provider] : null
  const pet = state.pets[bk.pet] ?? state.pets[0]
  const isMed = bk.type === 'Médico'
  const duration = service ? service.dur : '30 min'

  const ready = [
    true,
    bk.service != null,
    bk.provider != null,
    bk.day != null && bk.time != null,
    true,
  ][bookStep - 1]

  const back = () => (bookStep === 1 ? go('citas') : set({ bookStep: bookStep - 1 }))
  const next = () => {
    if (!ready) return
    if (bookStep === 5) go('bookdone')
    else set({ bookStep: bookStep + 1 })
  }

  const pickType = (type: ServiceType) => setBooking({ type, service: null, provider: null })

  return (
    <section className="screen book">
      <header className="book__head">
        <div className="book__head-row">
          <button type="button" className="icon-btn" onClick={back} aria-label="Volver">
            <Icon name="chevronLeft" size={18} color={C.indigo} />
          </button>
          <div>
            <div className="book__step">PASO {bookStep} DE 5</div>
            <h1 className="book__title">{TITLES[bookStep - 1]}</h1>
          </div>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={bookStep}
          aria-valuemin={1}
          aria-valuemax={5}
        >
          <div className="progress__fill" style={{ width: `${(bookStep / 5) * 100}%` }} />
        </div>
      </header>

      <div className="book__body scroll">
        {bookStep === 1 && (
          <div className="stack stack--11 slide-in">
            {state.pets.map((p, i) => {
              const on = bk.pet === i
              return (
                <button
                  key={p.name + i}
                  type="button"
                  className={on ? 'pick-row pick-row--on' : 'pick-row'}
                  onClick={() => setBooking({ pet: i })}
                  aria-pressed={on}
                >
                  <PetAvatar pet={p} size={52} radius={16} font={22} />
                  <span className="pick-row__main">
                    <span className="pick-row__name">{p.name}</span>
                    <span className="pick-row__meta">{p.meta}</span>
                  </span>
                  <span className={on ? 'radio radio--on' : 'radio'}>
                    {on && <CheckMark color="#fff" />}
                  </span>
                </button>
              )
            })}
            <button type="button" className="dashed-row" onClick={() => go('petnew')}>
              <Icon name="plus" size={17} color={C.purple} stroke={2.4} />
              Agregar otra mascota
            </button>
          </div>
        )}

        {bookStep === 2 && (
          <div className="slide-in">
            <div className="type-pair">
              <button
                type="button"
                className={isMed ? 'type-card type-card--med-on' : 'type-card'}
                onClick={() => pickType('Médico')}
                aria-pressed={isMed}
              >
                <Icon name="cross" size={26} color={isMed ? C.tealInk : C.idle} />
                <span className="type-card__name">Médico</span>
                <span className="type-card__sub">Consulta, vacunas, análisis</span>
              </button>
              <button
                type="button"
                className={!isMed ? 'type-card type-card--est-on' : 'type-card'}
                onClick={() => pickType('Estética')}
                aria-pressed={!isMed}
              >
                <Icon name="scissors" size={26} color={!isMed ? C.pink : C.idle} />
                <span className="type-card__name">Estética</span>
                <span className="type-card__sub">Baño, corte, uñas</span>
              </button>
            </div>

            <h2 className="book__subhead">Servicios disponibles</h2>
            <div className="stack stack--10">
              {services.map((s, i) => {
                const on = bk.service === i
                return (
                  <button
                    key={s.name}
                    type="button"
                    className={on ? 'pick-row pick-row--on' : 'pick-row'}
                    onClick={() => setBooking({ service: i })}
                    aria-pressed={on}
                  >
                    <span className="pick-row__main">
                      <span className="pick-row__name pick-row__name--sm">{s.name}</span>
                      <span className="pick-row__meta">
                        {s.dur} · desde {s.price}
                      </span>
                    </span>
                    <Icon name="chevronRight" size={17} color="#C9BEF6" />
                  </button>
                )
              })}
            </div>
            <Note decision>
              El catálogo y las duraciones los administra la veterinaria desde el panel web.
            </Note>
          </div>
        )}

        {bookStep === 3 && (
          <div className="stack stack--11 slide-in">
            {providers.map((d, i) => {
              const on = bk.provider === i
              return (
                <button
                  key={d.name}
                  type="button"
                  className={on ? 'pick-row pick-row--on' : 'pick-row'}
                  onClick={() => setBooking({ provider: i })}
                  aria-pressed={on}
                >
                  <span
                    className="avatar avatar--circle provider__badge"
                    style={{ background: d.tint, color: d.ink }}
                  >
                    {d.initials}
                  </span>
                  <span className="pick-row__main">
                    <span className="pick-row__name pick-row__name--sm">{d.name}</span>
                    <span className="pick-row__meta">{d.role}</span>
                  </span>
                  <span className="provider__next">{d.next}</span>
                </button>
              )
            })}
          </div>
        )}

        {bookStep === 4 && (
          <div className="slide-in">
            <div className="cal__head">
              <h2 className="book__subhead book__subhead--flush">Agosto 2026</h2>
              <span className="cal__branch">Sucursal Del Valle · L–S</span>
            </div>

            <div className="cal__weekdays">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className={i === 6 ? 'cal__wd cal__wd--off' : 'cal__wd'}>
                  {w}
                </span>
              ))}
            </div>

            <div className="cal__grid">
              {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((n) => {
                const free = isAvailable(n)
                const on = bk.day === n
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={!free}
                    aria-pressed={on}
                    className={`cal__day${free ? ' cal__day--free' : ''}${on ? ' cal__day--on' : ''}`}
                    onClick={() => setBooking({ day: n })}
                  >
                    {n}
                  </button>
                )
              })}
            </div>

            <h2 className="book__subhead">
              Horarios libres · {bk.day ? `${bk.day} de agosto` : 'elige un día'}
            </h2>
            <div className="slots">
              {SLOTS.map(([h, free]) => {
                const on = bk.time === h
                return (
                  <button
                    key={h}
                    type="button"
                    disabled={!free}
                    aria-pressed={on}
                    className={`slot${free ? ' slot--free' : ' slot--taken'}${on ? ' slot--on' : ''}`}
                    onClick={() => setBooking({ time: h })}
                  >
                    {h}
                  </button>
                )
              })}
            </div>

            <Note>
              Disponibilidad real según agenda del prestador, duración del servicio ({duration}) y
              horario de la sucursal.
            </Note>
          </div>
        )}

        {bookStep === 5 && (
          <div className="slide-in">
            <div className="summary">
              <div className="summary__pet">
                <PetAvatar pet={pet} size={48} radius={15} font={20} />
                <div>
                  <div className="summary__pet-name">{pet.name}</div>
                  <div className="summary__pet-meta">{pet.meta}</div>
                </div>
                <span className="summary__type">
                  <Tag
                    bg={isMed ? '#EAFBFA' : '#FFE6F1'}
                    fg={isMed ? '#0F8F88' : '#C0186A'}
                    wide
                  >
                    {bk.type.toUpperCase()}
                  </Tag>
                </span>
              </div>

              <SummaryRow label="Servicio" value={service ? service.name : '—'} />
              <SummaryRow label="Prestador" value={provider ? provider.name : '—'} />
              <SummaryRow
                label="Fecha y hora"
                value={`${bk.day ? `${bk.day} ago` : '—'} · ${bk.time ?? '—'}`}
              />
              <SummaryRow label="Duración" value={duration} />
              <div className="summary__total">
                <span className="summary__label">Costo estimado</span>
                <span className="summary__price">{service ? service.price : '—'}</span>
              </div>
            </div>

            <div className="callout callout--teal">
              <div className="callout__title">Pago en sitio</div>
              <p className="callout__text">
                Esta reserva solo aparta el espacio. El pago se realiza en la sucursal al terminar el
                servicio.
              </p>
            </div>

            <div className="book__reminder">
              <TickBox>Quiero recordatorios push 24 h y 2 h antes de la cita.</TickBox>
            </div>
          </div>
        )}
      </div>

      <footer className="sticky-foot">
        <button
          type="button"
          className={ready ? 'btn btn--pink' : 'btn btn--disabled'}
          onClick={next}
          disabled={!ready}
        >
          {bookStep === 5 ? 'Confirmar cita' : 'Continuar'}
        </button>
      </footer>
    </section>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary__row">
      <span className="summary__label">{label}</span>
      <span className="summary__value">{value}</span>
    </div>
  )
}
