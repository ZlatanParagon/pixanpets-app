import { useEffect, useState, type ReactNode } from 'react'
import { StoreProvider, useStore } from './store'
import { Acceso } from './screens/Acceso'
import { Inicio } from './screens/Inicio'
import { ProyectoDetalle } from './screens/Proyecto'
import { Acuerdos } from './screens/Acuerdos'
import { Cuenta } from './screens/Cuenta'
import { AltaCliente } from './screens/AltaCliente'

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#\/?/, '')
}

export function navegar(a: string) {
  window.location.hash = a
}

function Marco({ ruta, children }: { ruta: string; children: ReactNode }) {
  const { usuario, membresia, estado, membresiasDelUsuario, salir, elegirCuenta } = useStore()
  const cliente = membresia ? estado.clientes.find((c) => c.id === membresia.cliente_id) : null
  const enlaces = [
    { a: '', etiqueta: 'Inicio' },
    { a: 'acuerdos', etiqueta: 'Acuerdos' },
    { a: 'cuenta', etiqueta: 'Cuenta' },
    // La alta guiada es la consola del socio responsable (2.4).
    ...(membresia?.rol === 'socio_responsable' ? [{ a: 'alta', etiqueta: 'Alta de cliente' }] : []),
  ]
  return (
    <div className="marco">
      <a className="salto" href="#contenido">Ir al contenido</a>
      <div className="filete" aria-hidden="true" />
      <header className="cabecera">
        {/* Marca: los SVG oficiales de /public/marca/ no han sido suministrados y no se
            recrean (II.10.5, DP-13). Marca tipográfica provisional. */}
        <div className="marca" aria-label="ARSEG Cyber, Portal de Cliente">
          <span className="marca-nombre">ARSEG</span>
          <span className="marca-sub">CYBER · Portal de Cliente</span>
        </div>
        <nav aria-label="Secciones">
          {enlaces.map((e) => (
            <a key={e.a} href={`#/${e.a}`} aria-current={ruta === e.a ? 'page' : undefined}>
              {e.etiqueta}
            </a>
          ))}
        </nav>
        <div className="sesion">
          {membresiasDelUsuario.length > 1 && membresia && (
            <label className="cambio-cuenta">
              <span className="visualmente-oculto">Cuenta activa</span>
              <select value={membresia.id} onChange={(e) => elegirCuenta(e.target.value)}>
                {membresiasDelUsuario.map((m) => {
                  const c = estado.clientes.find((x) => x.id === m.cliente_id)
                  return (
                    <option key={m.id} value={m.id}>
                      {c?.nombre_visible ?? m.cliente_id}
                    </option>
                  )
                })}
              </select>
            </label>
          )}
          <span className="sesion-nombre">{usuario?.nombre}</span>
          <button className="boton-terciario" onClick={salir}>Salir</button>
        </div>
      </header>
      <p className="banda-sintetica">Demostración con datos sintéticos — ningún cliente, persona o servicio es real.</p>
      {cliente && (
        <p className="banda-cliente">
          <strong>{cliente.nombre_visible}</strong> · {cliente.razon_social}
        </p>
      )}
      <main id="contenido" className="contenido">{children}</main>
      <footer className="pie">
        Prototipo del Portal de Cliente conforme a la SPEC v0.3 (Parte II). No constituye autorización de producción.
      </footer>
    </div>
  )
}

function Rutas() {
  const { usuario, membresia } = useStore()
  const ruta = useHashRoute()
  if (!usuario || !membresia) return <Acceso />
  let pantalla
  if (ruta.startsWith('proyecto/')) pantalla = <ProyectoDetalle proyectoId={ruta.slice('proyecto/'.length)} />
  else if (ruta === 'acuerdos') pantalla = <Acuerdos />
  else if (ruta === 'cuenta') pantalla = <Cuenta />
  else if (ruta === 'alta') pantalla = <AltaCliente />
  else pantalla = <Inicio />
  return <Marco ruta={ruta}>{pantalla}</Marco>
}

export default function App() {
  return (
    <StoreProvider>
      <Rutas />
    </StoreProvider>
  )
}
