// Portada: selección de superficie sobre la misma sesión (SPEC s.6).

import { navigate } from '../App'
import { useStore } from '../store'

export function Join() {
  const { config } = useStore()
  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Ejercicio ejecutivo de cibercrisis</span>
        </div>
      </header>

      <div className="tt-card">
        <h1>{config.nombre}</h1>
        <p className="tt-suave">
          {config.cliente} · {config.fecha}
        </p>
        <p className="tt-small tt-suave">
          La aplicación instrumenta el ejercicio y produce evidencia trazable. No califica ni emite
          conclusiones: ARSEG interpreta la evidencia.
        </p>
      </div>

      <div className="tt-card">
        <h2>Entrar como</h2>
        <div className="tt-cta-lista">
          <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={() => navigate('/checkin')}>
            Participante — móvil
          </button>
          <button className="tt-btn tt-btn--bloque" onClick={() => navigate('/facilitador')}>
            Facilitador — consola ARSEG
          </button>
          <button className="tt-btn tt-btn--bloque" onClick={() => navigate('/sala')}>
            Pantalla de sala — proyector
          </button>
        </div>
      </div>

      <p className="tt-aviso">
        Prototipo Fase A: las superficies se sincronizan entre pestañas de este navegador. Abre cada
        superficie en su propia pestaña o ventana.
      </p>
    </div>
  )
}
