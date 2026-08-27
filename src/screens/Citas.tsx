import { Icon } from '../components/Icon'
import { Tag } from '../components/ui'
import { APPTS_PAST, APPTS_UPCOMING } from '../data/appointments'
import { useApp } from '../store'

export function Citas() {
  const { state, set, startBooking } = useApp()
  const upcoming = state.apptTab === 'up'
  const appts = upcoming ? APPTS_UPCOMING : APPTS_PAST

  return (
    <section className="screen scroll scroll--tabbed">
      <header className="sheet-head">
        <h1 className="sheet-head__title">Citas</h1>
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={upcoming}
            className={upcoming ? 'tabs__item tabs__item--on' : 'tabs__item'}
            onClick={() => set({ apptTab: 'up' })}
          >
            Próximas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!upcoming}
            className={!upcoming ? 'tabs__item tabs__item--on' : 'tabs__item'}
            onClick={() => set({ apptTab: 'past' })}
          >
            Historial
          </button>
        </div>
      </header>

      <div className="citas__list">
        {appts.map((a) => (
          <article
            key={`${a.service}-${a.date}-${a.pet}`}
            className="card appt"
            style={{ borderLeftColor: a.accent }}
          >
            <div className="appt__top">
              <div className="appt__info">
                <div className="appt__tags">
                  <Tag bg={a.tagBg} fg={a.tagFg} wide>
                    {a.type}
                  </Tag>
                  <Tag bg="#F5F3FF" fg="#6F6AA0">
                    {a.status}
                  </Tag>
                </div>
                <h2 className="appt__service">{a.service}</h2>
                <p className="appt__who">
                  {a.pet} · {a.provider}
                </p>
              </div>
              <div className="appt__when">
                <div className="appt__date">{a.date}</div>
                <div className="appt__time">{a.time}</div>
              </div>
            </div>

            {a.actionable && (
              <>
                <div className="appt__actions">
                  <button type="button" className="btn-sm btn-sm--soft" onClick={startBooking}>
                    Reprogramar
                  </button>
                  <button
                    type="button"
                    className="btn-sm btn-sm--danger"
                    onClick={() => set({ apptTab: 'past' })}
                  >
                    Cancelar
                  </button>
                </div>
                <p className="appt__policy">Cancelación o cambio sin costo hasta 24 h antes.</p>
              </>
            )}
          </article>
        ))}

        <button type="button" className="btn btn--pink btn--icon citas__new" onClick={startBooking}>
          <Icon name="plus" size={19} color="#fff" stroke={2.4} />
          Agendar nueva cita
        </button>
      </div>
    </section>
  )
}
