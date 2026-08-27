import { BackHeader } from '../components/ui'
import { PRIV_TOGGLES } from '../data/settings'
import { useApp } from '../store'

export function Privacidad() {
  const { state, set, backFromSetting } = useApp()

  return (
    <section className="screen scroll setting">
      <header className="setting__head">
        <BackHeader title="Privacidad y datos" onBack={backFromSetting} />
      </header>

      <div className="setting__body setting__body--16">
        <div className="card priv__toggles">
          {PRIV_TOGGLES.map((t) => {
            const on = state.priv[t.key]
            return (
              <div key={t.key} className="priv__row">
                <div className="priv__main">
                  <div className="priv__label">{t.label}</div>
                  <div className="priv__hint">{t.hint}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={t.label}
                  className={on ? 'switch switch--on' : 'switch'}
                  onClick={() => set({ priv: { ...state.priv, [t.key]: !on } })}
                >
                  <span className="switch__knob" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="card priv__arco">
          <h2 className="priv__arco-title">Tus derechos ARCO</h2>
          <p className="priv__arco-text">
            Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales
            en cualquier momento, conforme a la LFPDPPP.
          </p>
          <div className="priv__arco-actions">
            <button type="button" className="btn-sm btn-sm--soft priv__arco-btn">
              Descargar mis datos
            </button>
            <button type="button" className="btn-sm btn-sm--danger priv__arco-btn">
              Solicitar eliminación
            </button>
          </div>
        </div>

        <div className="card priv__links">
          <button type="button" className="priv__link">
            Aviso de privacidad
          </button>
          <button type="button" className="priv__link">
            Términos y condiciones
          </button>
        </div>
      </div>
    </section>
  )
}
