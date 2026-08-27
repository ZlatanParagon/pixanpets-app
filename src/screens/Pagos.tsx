import { Icon } from '../components/Icon'
import { BackHeader, Tag } from '../components/ui'
import { CARDS } from '../data/settings'
import { useApp } from '../store'

export function Pagos() {
  const { state, set, backFromSetting } = useApp()

  return (
    <section className="screen scroll setting">
      <header className="setting__head">
        <BackHeader title="Métodos de pago" onBack={backFromSetting} />
      </header>

      <div className="setting__body">
        {CARDS.map((c, i) => {
          const on = state.card === i
          return (
            <button
              key={c.name}
              type="button"
              className={on ? 'card paycard paycard--on' : 'card paycard'}
              onClick={() => set({ card: i })}
              aria-pressed={on}
            >
              <span className="paycard__art" style={{ background: c.art }} />
              <span className="paycard__main">
                <span className="paycard__name">{c.name}</span>
                <span className="paycard__meta">{c.meta}</span>
              </span>
              {on && (
                <Tag bg="#EAFBFA" fg="#0F8F88">
                  EN USO
                </Tag>
              )}
            </button>
          )
        })}

        <button type="button" className="dashed-row">
          <Icon name="plus" size={17} color="#7A22C4" stroke={2.4} />
          Agregar tarjeta
        </button>

        <p className="fineprint">
          Las tarjetas se guardan tokenizadas en la pasarela de pago; la app nunca almacena el
          número completo.
        </p>
      </div>
    </section>
  )
}
