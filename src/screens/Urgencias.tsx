import { Icon } from '../components/Icon'
import { Tag } from '../components/ui'
import { GUARD_BRANCH, URGENCY_PHONE, URGENCY_TIPS } from '../data/settings'
import { useApp } from '../store'

export function Urgencias() {
  const { go } = useApp()

  return (
    <section className="screen scroll urg">
      <div className="urg__hero">
        <button type="button" className="urg__back" onClick={() => go('home')} aria-label="Volver">
          <Icon name="chevronLeft" size={18} color="#fff" />
        </button>
        <span className="urg__open">ABIERTO AHORA · 24/7</span>
        <h1 className="urg__title">Urgencias veterinarias</h1>
        <p className="urg__sub">
          Si tu peludito está en riesgo, llama primero: te guiamos por teléfono mientras llegas.
        </p>
        <div className="urg__actions">
          <a className="btn btn--pink btn--icon urg__call" href={`tel:${URGENCY_PHONE.replace(/ /g, '')}`}>
            <Icon name="phone" size={20} color="#fff" />
            Llamar {URGENCY_PHONE}
          </a>
          <button type="button" className="urg__route">
            <Icon name="pin" size={18} color="#46DED5" />
            Ver ruta a la sucursal
          </button>
        </div>
      </div>

      <div className="urg__sheet">
        <h2 className="section-title section-title--16">Sucursal de guardia</h2>
        <div className="card urg__branch">
          <div className="urg__branch-name">{GUARD_BRANCH.name}</div>
          <p className="urg__branch-line">{GUARD_BRANCH.line}</p>
          <div className="urg__branch-tags">
            {GUARD_BRANCH.tags.map((t, i) => (
              <Tag key={t} bg={i === 0 ? '#EAFBFA' : '#F5F3FF'} fg={i === 0 ? '#0F8F88' : '#6F6AA0'}>
                {t}
              </Tag>
            ))}
          </div>
        </div>

        <h2 className="section-title section-title--16 urg__while">Mientras llegas</h2>
        <div className="card urg__tips">
          {URGENCY_TIPS.map((text, i) => (
            <div key={i} className="urg__tip">
              <span className="urg__tip-n">{i + 1}</span>
              <p className="urg__tip-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
