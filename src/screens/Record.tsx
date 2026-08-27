import { Icon } from '../components/Icon'
import { BackHeader, PetAvatar, Tag } from '../components/ui'
import { CONSULTATIONS, VACCINES } from '../data/records'
import { useApp } from '../store'

export function Record() {
  const { state, go, startBooking } = useApp()
  const pet = state.pets[state.recPet] ?? state.pets[0]

  return (
    <section className="screen scroll record">
      <header className="record__head">
        <BackHeader title="Cartilla digital" onBack={() => go('profile')} />
        <div className="record__pet">
          <PetAvatar pet={pet} size={70} radius={22} font={28} />
          <div className="record__id">
            <h1 className="record__name">{pet.name}</h1>
            <p className="record__meta">{pet.meta}</p>
            <div className="record__badges">
              <Tag bg={pet.badgeBg} fg={pet.badgeFg}>
                {pet.badge}
              </Tag>
              <Tag bg="#F5F3FF" fg="#6F6AA0">
                {pet.weight}
              </Tag>
            </div>
          </div>
        </div>
      </header>

      <div className="record__body">
        <div className="booster">
          <span className="booster__icon">
            <Icon name="clock" size={22} color="#46DED5" />
          </span>
          <span className="booster__main">
            <span className="booster__title">Próximo refuerzo en 3 semanas</span>
            <span className="booster__sub">Rabia anual · sugerido 18 sep 2026</span>
          </span>
          <button type="button" className="booster__cta" onClick={startBooking}>
            Agendar
          </button>
        </div>

        <div>
          <h2 className="section-title section-title--16">Vacunas y desparasitaciones</h2>
          <div className="vaccines">
            {VACCINES.map((v) => (
              <div key={v.name + v.date} className="vaccine">
                <span
                  className="vaccine__dot"
                  style={{ background: v.dot, boxShadow: `0 0 0 4px ${v.halo}` }}
                />
                <span className="vaccine__main">
                  <span className="vaccine__name">{v.name}</span>
                  <span className="vaccine__note">{v.note}</span>
                </span>
                <span className="vaccine__when">
                  <span className="vaccine__date" style={{ color: v.dateFg }}>
                    {v.date}
                  </span>
                  <span className="vaccine__status">{v.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title section-title--16">Consultas</h2>
          <div className="stack stack--10">
            {CONSULTATIONS.map((c) => (
              <article key={c.title + c.date} className="consult">
                <div className="consult__top">
                  <h3 className="consult__title">{c.title}</h3>
                  <span className="consult__date">{c.date}</span>
                </div>
                <p className="consult__detail">{c.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
