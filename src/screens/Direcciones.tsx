import { Icon } from '../components/Icon'
import { BackHeader, Tag } from '../components/ui'
import { ADDRESSES } from '../data/settings'
import { useApp } from '../store'

export function Direcciones() {
  const { state, set, backFromSetting } = useApp()

  return (
    <section className="screen scroll setting">
      <header className="setting__head">
        <BackHeader title="Direcciones" onBack={backFromSetting} />
      </header>

      <div className="setting__body">
        {ADDRESSES.map((d, i) => {
          const on = state.addr === i
          return (
            <button
              key={d.label}
              type="button"
              className={on ? 'card addr addr--on' : 'card addr'}
              onClick={() => set({ addr: i })}
              aria-pressed={on}
            >
              <span className="addr__top">
                <span className="addr__label">{d.label}</span>
                {on && (
                  <Tag bg="#EAFBFA" fg="#0F8F88">
                    PREDETERMINADA
                  </Tag>
                )}
              </span>
              <span className="addr__line">{d.line}</span>
              <span className="addr__foot">
                <span className="addr__action">Editar</span>
                <span className="addr__action addr__action--soft">Eliminar</span>
              </span>
            </button>
          )
        })}

        <button type="button" className="dashed-row">
          <Icon name="plus" size={17} color="#7A22C4" stroke={2.4} />
          Agregar dirección
        </button>
      </div>
    </section>
  )
}
