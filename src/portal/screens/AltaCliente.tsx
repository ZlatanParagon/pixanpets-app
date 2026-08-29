// Alta guiada de un nuevo cliente (SPEC v0.3, 2.4 + 5.2): materializa el flujo
// «firmamos → asignamos socio y PM → alta de datos → servicio contratado →
// hitos → usuarios → cuenta activa». Solo para el socio responsable. En
// producción esta es la herramienta ARSEG de publicación acotada (8.1), con
// las mismas reglas de dominio.

import { useEffect, useState, type ReactNode } from 'react'
import { useStore } from '../store'
import { registrarFormalizacionInicial } from '../domain/comandos'
import { activarCuenta, altaCliente, asignarMembresia, crearHito, registrarAcuerdoInicial } from '../domain/gestion'
import { Aviso, Estado, Tarjeta, fechaCorta } from '../components/ui'
import { navegar } from '../App'

function Paso({ n, titulo, hecho, children }: { n: number; titulo: string; hecho: boolean; children: ReactNode }) {
  return (
    <Tarjeta className={hecho ? 'paso paso-hecho' : 'paso'}>
      <h2>
        <span className="paso-numero" aria-hidden="true">{n}</span> {titulo}{' '}
        {hecho ? <Estado tono="estable">Completado</Estado> : <Estado tono="neutro">Pendiente</Estado>}
      </h2>
      {children}
    </Tarjeta>
  )
}

export function AltaCliente() {
  const { estado, ctx, ejecutar, elegirCuenta, usuario } = useStore()
  const [error, setError] = useState<string | null>(null)

  // Formulario de nueva cuenta
  const [razon, setRazon] = useState('')
  const [visible, setVisible] = useState('')
  const [sector, setSector] = useState('')
  const [evidencia, setEvidencia] = useState('')
  const [buscando, setBuscando] = useState<string | null>(null)

  // Paso 2: PM
  const [pmNombre, setPmNombre] = useState('')
  const [pmCorreo, setPmCorreo] = useState('')
  // Paso 3: acuerdo
  const [soClave, setSoClave] = useState('')
  const [soTitulo, setSoTitulo] = useState('')
  // Paso 4: formalización
  const [fFirmante, setFFirmante] = useState('')
  const [fEvidencia, setFEvidencia] = useState('')
  const [fRevision, setFRevision] = useState('')
  const [pClave, setPClave] = useState('')
  const [pNombre, setPNombre] = useState('')
  const [pPm, setPPm] = useState('')
  const [pInicio, setPInicio] = useState('')
  const [pFin, setPFin] = useState('')
  // Paso 5: hito
  const [hClave, setHClave] = useState('')
  const [hNombre, setHNombre] = useState('')
  const [hFecha, setHFecha] = useState('')
  const [hCriterio, setHCriterio] = useState('')
  // Paso 6: usuario cliente
  const [uNombre, setUNombre] = useState('')
  const [uCorreo, setUCorreo] = useState('')
  const [uRol, setURol] = useState<'patrocinador' | 'responsable_operativo' | 'consulta'>('patrocinador')
  const [uCargo, setUCargo] = useState('')

  // Tras crear la cuenta, cambia a su membresía de socio en cuanto exista.
  useEffect(() => {
    if (!buscando || !usuario) return
    const cliente = estado.clientes.find((c) => c.razon_social === buscando)
    if (!cliente) return
    const m = estado.membresias.find((x) => x.cliente_id === cliente.id && x.usuario_id === usuario.id && x.activa)
    if (m) {
      elegirCuenta(m.id)
      setBuscando(null)
    }
  }, [buscando, estado, usuario, elegirCuenta])

  if (!ctx || ctx.membresia.rol !== 'socio_responsable') {
    return <Aviso tono="error">Esta sección corresponde al socio responsable.</Aviso>
  }

  const cliente = estado.clientes.find((c) => c.id === ctx.membresia.cliente_id)!
  const enIncorporacion = cliente.estado_cuenta === 'incorporacion'

  const equipoArseg = estado.membresias.filter(
    (m) => m.cliente_id === cliente.id && m.activa && (m.rol === 'lider_proyecto' || m.rol === 'socio_responsable'),
  )
  const lideres = equipoArseg.filter((m) => m.rol === 'lider_proyecto')
  const acuerdosAlcance = estado.acuerdos.filter((a) => a.cliente_id === cliente.id && a.tipo === 'alcance_inicial')
  const revisionesSinProyecto = estado.acuerdoRevisiones.filter(
    (r) =>
      r.cliente_id === cliente.id &&
      r.estado_editorial === 'publicada' &&
      acuerdosAlcance.some((a) => a.id === r.acuerdo_id) &&
      !estado.proyectos.some((p) => p.acuerdo_inicial_revision_id === r.id),
  )
  const proyectos = estado.proyectos.filter((p) => p.cliente_id === cliente.id)
  const hitosCuenta = estado.hitos.filter((h) => h.cliente_id === cliente.id)
  const usuariosCliente = estado.membresias.filter(
    (m) => m.cliente_id === cliente.id && m.activa && (m.rol === 'patrocinador' || m.rol === 'responsable_operativo' || m.rol === 'consulta'),
  )

  return (
    <>
      <h1>Alta de cliente</h1>
      <p className="texto-secundario">
        El contrato se firma fuera del portal; aquí se registra la relación y se publica el servicio. Cada paso queda en
        la bitácora de la cuenta.
      </p>

      <Tarjeta>
        <h2>Iniciar el alta de una nueva cuenta</h2>
        <p className="texto-secundario">
          Requiere evidencia de una relación comercial formalizada (2.4): un prospecto o un NDA aislado no habilitan el
          portal como CRM.
        </p>
        <div className="rejilla-form">
          <label>Razón social<input value={razon} onChange={(e) => setRazon(e.target.value)} /></label>
          <label>Nombre visible<input value={visible} onChange={(e) => setVisible(e.target.value)} /></label>
          <label>Sector<input value={sector} onChange={(e) => setSector(e.target.value)} /></label>
          <label>Evidencia de relación (referencia)<input value={evidencia} onChange={(e) => setEvidencia(e.target.value)} placeholder="evd/contrato-firmado.pdf" /></label>
        </div>
        <button
          className="boton-primario"
          disabled={!razon.trim() || !visible.trim() || !evidencia.trim()}
          onClick={() => {
            const razonFinal = razon.trim().endsWith('(sintético)') ? razon.trim() : `${razon.trim()} (sintético)`
            const e = ejecutar((es, cx, g, ah) => altaCliente(es, cx, g, ah, { razon_social: razonFinal, nombre_visible: visible, sector, evidencia_relacion_ref: evidencia }))
            setError(e)
            if (!e) {
              setBuscando(razonFinal)
              setRazon(''); setVisible(''); setSector(''); setEvidencia('')
            }
          }}
        >
          Crear cuenta en incorporación
        </button>
      </Tarjeta>

      {!enIncorporacion && (
        <Aviso>
          La cuenta activa (<strong>{cliente.nombre_visible}</strong>) ya completó su incorporación. Para recorrer el
          flujo, crea una cuenta nueva arriba; el selector de cuenta te cambiará a ella.
        </Aviso>
      )}

      {enIncorporacion && (
        <>
          <Paso n={1} titulo="Organización registrada" hecho>
            <p>
              <strong>{cliente.razon_social}</strong> · {cliente.sector || 'sin sector'} ·{' '}
              <span className="texto-secundario">evidencia: <span className="mono">{cliente.evidencia_relacion_ref}</span> · desde {fechaCorta(cliente.creado_en)}</span>
            </p>
          </Paso>

          <Paso n={2} titulo="Asignar líder de proyecto (PM)" hecho={lideres.length > 0}>
            <ul className="lista-compromisos">
              {equipoArseg.map((m) => {
                const u = estado.usuarios.find((x) => x.id === m.usuario_id)
                return <li key={m.id}>{u?.nombre} — {m.rol === 'socio_responsable' ? 'Socio responsable' : 'Líder de proyecto'}</li>
              })}
            </ul>
            <div className="rejilla-form">
              <label>Nombre<input value={pmNombre} onChange={(e) => setPmNombre(e.target.value)} /></label>
              <label>Correo ARSEG<input value={pmCorreo} onChange={(e) => setPmCorreo(e.target.value)} placeholder="persona@arseg.example" /></label>
            </div>
            <button
              className="boton-secundario"
              disabled={!pmNombre.trim() || !pmCorreo.trim()}
              onClick={() => {
                setError(ejecutar((es, cx, g, ah) => asignarMembresia(es, cx, g, ah, { nombre: pmNombre, correo: pmCorreo, rol: 'lider_proyecto', alcance: 'cuenta' })))
                setPmNombre(''); setPmCorreo('')
              }}
            >
              Asignar PM
            </button>
            <p className="texto-secundario">Si el correo ya existe (p. ej. isalas@arseg.example), se reutiliza esa identidad.</p>
          </Paso>

          <Paso n={3} titulo="Registrar el acuerdo de alcance (SOW)" hecho={acuerdosAlcance.length > 0}>
            <ul className="lista-compromisos">
              {acuerdosAlcance.map((a) => <li key={a.id}><span className="mono">{a.clave}</span></li>)}
            </ul>
            <div className="rejilla-form">
              <label>Clave<input value={soClave} onChange={(e) => setSoClave(e.target.value)} placeholder="SOW-XXX-001" /></label>
              <label>Título<input value={soTitulo} onChange={(e) => setSoTitulo(e.target.value)} placeholder="SOW Servicio contratado" /></label>
            </div>
            <button
              className="boton-secundario"
              disabled={!soClave.trim() || !soTitulo.trim()}
              onClick={() => {
                setError(ejecutar((es, cx, g, ah) => registrarAcuerdoInicial(es, cx, g, ah, { clave: soClave, titulo: soTitulo, tipo: 'alcance_inicial', resumen: 'Versión formalizada fuera del portal.' })))
                setSoClave(''); setSoTitulo('')
              }}
            >
              Publicar revisión 1
            </button>
          </Paso>

          <Paso n={4} titulo="Registrar la formalización externa (crea el proyecto)" hecho={proyectos.length > 0}>
            {proyectos.map((p) => (
              <p key={p.id}><a href={`#/proyecto/${p.id}`}>{p.clave} — {p.nombre}</a> <Estado tono="estable">Formalizado</Estado></p>
            ))}
            {revisionesSinProyecto.length === 0 && proyectos.length === 0 && (
              <p className="texto-secundario">Primero publica el acuerdo de alcance (paso 3).</p>
            )}
            {revisionesSinProyecto.length > 0 && (
              <>
                <div className="rejilla-form">
                  <label>Instrumento formalizado
                    <select value={fRevision} onChange={(e) => setFRevision(e.target.value)}>
                      <option value="">Elegir…</option>
                      {revisionesSinProyecto.map((r) => <option key={r.id} value={r.id}>{r.titulo} (rev. {r.numero_revision})</option>)}
                    </select>
                  </label>
                  <label>Firmante según instrumento<input value={fFirmante} onChange={(e) => setFFirmante(e.target.value)} placeholder="Apoderado legal…" /></label>
                  <label>Evidencia (referencia)<input value={fEvidencia} onChange={(e) => setFEvidencia(e.target.value)} placeholder="evd/sow-firmado.pdf" /></label>
                  <label>PM del proyecto
                    <select value={pPm} onChange={(e) => setPPm(e.target.value)}>
                      <option value="">Elegir…</option>
                      {lideres.map((m) => {
                        const u = estado.usuarios.find((x) => x.id === m.usuario_id)
                        return <option key={m.id} value={m.id}>{u?.nombre}</option>
                      })}
                    </select>
                  </label>
                  <label>Clave del proyecto<input value={pClave} onChange={(e) => setPClave(e.target.value)} placeholder="XXX-2026-01" /></label>
                  <label>Nombre del proyecto<input value={pNombre} onChange={(e) => setPNombre(e.target.value)} /></label>
                  <label>Inicio comprometido<input type="date" value={pInicio} onChange={(e) => setPInicio(e.target.value)} /></label>
                  <label>Fin comprometido<input type="date" value={pFin} onChange={(e) => setPFin(e.target.value)} /></label>
                </div>
                <button
                  className="boton-primario"
                  disabled={!fRevision || !fFirmante.trim() || !fEvidencia.trim() || !pPm || !pClave.trim() || !pNombre.trim() || !pInicio || !pFin}
                  onClick={() => {
                    setError(ejecutar((es, cx, g, ah) => registrarFormalizacionInicial(es, cx, g, ah, {
                      revision_instrumento_id: fRevision,
                      firmante_segun_instrumento: fFirmante,
                      fecha_acto: ah.slice(0, 10),
                      evidencia_ref: fEvidencia,
                      validado_por: cx.membresia.id,
                      proyecto: { clave: pClave, nombre: pNombre, modalidad: 'puntual', lider_membresia_id: pPm, inicio_comprometido: pInicio, fin_original: pFin },
                    })))
                  }}
                >
                  Registrar formalización y crear proyecto
                </button>
                <p className="texto-secundario">
                  Solo un instrumento de alcance formalizado crea un proyecto (H07); registrarlo dos veces no lo duplica (INV-03).
                </p>
              </>
            )}
          </Paso>

          <Paso n={5} titulo="Mapear los hitos publicables" hecho={hitosCuenta.length > 0}>
            <p className="texto-secundario">
              Estos son los hitos que el cliente verá y contra los que se miden los compromisos. Las tareas internas del
              equipo no van aquí (1.3).
            </p>
            <ul className="lista-compromisos">
              {hitosCuenta.map((h) => <li key={h.id}><span className="mono">{h.clave}</span> {h.nombre} · {fechaCorta(h.fecha_vigente)}</li>)}
            </ul>
            {proyectos.length === 0 ? (
              <p className="texto-secundario">Primero crea el proyecto (paso 4).</p>
            ) : (
              <>
                <div className="rejilla-form">
                  <label>Clave<input value={hClave} onChange={(e) => setHClave(e.target.value)} placeholder="H-01" /></label>
                  <label>Nombre<input value={hNombre} onChange={(e) => setHNombre(e.target.value)} /></label>
                  <label>Fecha comprometida<input type="date" value={hFecha} onChange={(e) => setHFecha(e.target.value)} /></label>
                  <label>Criterio de terminación<input value={hCriterio} onChange={(e) => setHCriterio(e.target.value)} /></label>
                </div>
                <button
                  className="boton-secundario"
                  disabled={!hClave.trim() || !hNombre.trim() || !hFecha || !hCriterio.trim()}
                  onClick={() => {
                    setError(ejecutar((es, cx, g, ah) => crearHito(es, cx, g, ah, { proyecto_id: proyectos[0].id, clave: hClave, nombre: hNombre, fecha: hFecha, criterio_terminacion: hCriterio })))
                    setHClave(''); setHNombre(''); setHFecha(''); setHCriterio('')
                  }}
                >
                  Agregar hito
                </button>
              </>
            )}
          </Paso>

          <Paso n={6} titulo="Invitar a los usuarios del cliente" hecho={usuariosCliente.length > 0}>
            <ul className="lista-compromisos">
              {usuariosCliente.map((m) => {
                const u = estado.usuarios.find((x) => x.id === m.usuario_id)
                return <li key={m.id}>{u?.nombre} — {m.rol}</li>
              })}
            </ul>
            <div className="rejilla-form">
              <label>Nombre<input value={uNombre} onChange={(e) => setUNombre(e.target.value)} /></label>
              <label>Correo<input value={uCorreo} onChange={(e) => setUCorreo(e.target.value)} /></label>
              <label>Rol
                <select value={uRol} onChange={(e) => setURol(e.target.value as typeof uRol)}>
                  <option value="patrocinador">Patrocinador</option>
                  <option value="responsable_operativo">Responsable operativo</option>
                  <option value="consulta">Consulta</option>
                </select>
              </label>
              <label>Cargo<input value={uCargo} onChange={(e) => setUCargo(e.target.value)} /></label>
            </div>
            <button
              className="boton-secundario"
              disabled={!uNombre.trim() || !uCorreo.trim()}
              onClick={() => {
                setError(ejecutar((es, cx, g, ah) => asignarMembresia(es, cx, g, ah, { nombre: uNombre, correo: uCorreo, rol: uRol, alcance: 'cuenta', cargo: uCargo })))
                setUNombre(''); setUCorreo(''); setUCargo('')
              }}
            >
              Invitar (nominativo)
            </button>
            <p className="texto-secundario">
              En producción la invitación es de un solo uso, con caducidad y MFA obligatorio (3.4); la demo la da por aceptada.
            </p>
          </Paso>

          <Paso n={7} titulo="Activar la cuenta" hecho={false}>
            <p className="texto-secundario">La cuenta pasa a activa cuando existe al menos un servicio formalizado (2.4).</p>
            <button
              className="boton-primario"
              disabled={proyectos.length === 0}
              onClick={() => {
                const e = ejecutar((es, cx, g, ah) => activarCuenta(es, cx, g, ah))
                setError(e)
                if (!e) navegar('')
              }}
            >
              Activar cuenta
            </button>
          </Paso>
        </>
      )}

      {error && <Aviso tono="error">{error}</Aviso>}
    </>
  )
}
