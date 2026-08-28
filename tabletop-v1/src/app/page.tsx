// Portada: selección de superficie (SPEC s.6).

export default function Home() {
  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Ejercicio ejecutivo de cibercrisis</span>
        </div>
      </header>

      <div className="tt-card">
        <h1>Bienvenido</h1>
        <p className="tt-small tt-suave">
          La aplicación instrumenta el ejercicio y produce evidencia trazable. No califica ni emite
          conclusiones: ARSEG interpreta la evidencia.
        </p>
      </div>

      <div className="tt-card">
        <h2>Entrar como</h2>
        <div className="tt-cta-lista">
          <a className="tt-btn tt-btn--primario tt-btn--bloque" href="/entrar">
            Participante — móvil
          </a>
          <a className="tt-btn tt-btn--bloque" href="/login">
            Facilitador / Observador — consola ARSEG
          </a>
          <a className="tt-btn tt-btn--bloque" href="/sala">
            Pantalla de sala — proyector
          </a>
        </div>
      </div>
    </div>
  )
}
