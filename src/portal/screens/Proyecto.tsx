// Detalle de proyecto: alcance vigente, hitos, publicaciones, compromisos
// recíprocos, entregables y expediente (SPEC v0.3, 5.4, 5.5, 5.7).

import { useState } from 'react'
import { useStore } from '../store'
import {
  cerrarProyecto,
  compromisoVencido,
  publicarAvance,
  registrarAcuse,
  resolverCompromiso,
  responderCompromiso,
  solicitarAclaracion,
} from '../domain/comandos'
import { actualizarHito, crearCompromiso, crearHito } from '../domain/gestion'
import {
  avancesDeProyecto,
  bitacoraVisible,
  compromisosDeProyecto,
  entregablesDeProyecto,
  hitosDeProyecto,
  proyectoVisible,
} from '../domain/consultas'
import { generarPaqueteExpediente } from '../domain/expediente'
import { PARTE_POR_ROL, type CompromisoCompartido, type Proyecto } from '../domain/types'
import { Aviso, ChipClasificacion, Estado, Tarjeta, bytesLegibles, fechaCorta } from '../components/ui'

const ESTADO_COMPROMISO: Record<string, string> = {
  abierto: 'Abierto',
  respondido: 'Respondido — pendiente de validación',
  requiere_aclaracion: 'Requiere aclaración',
  resuelto: 'Resuelto',
  cancelado: 'Cancelado',
}

function FilaCompromiso({ c, proyectoCerrado }: { c: CompromisoCompartido; proyectoCerrado: boolean }) {
  const { estado, ctx, ahora, ejecutar } = useStore()
  const [texto, setTexto] = useState('')
  const [error, setError] = useState<string | null>(null)
  if (!ctx) return null

  const parteUsuario = PARTE_POR_ROL[ctx.membresia.rol]
  const puedeResponder =
    !proyectoCerrado &&
    parteUsuario === c.parte_responsable &&
    (c.estado === 'abierto' || c.estado === 'requiere_aclaracion') &&
    ctx.membresia.rol !== 'consulta' &&
    ctx.membresia.rol !== 'administracion'
  const esSolicitante = c.solicitante_membresia_id === ctx.membresia.id
  const respuestas = estado.respuestasCompromiso.filter((r) => r.compromiso_id === c.id)
  const contacto = estado.contactos.find((x) => x.id === c.contacto_responsable_id)

  const responder = () => {
    setError(ejecutar((e, cx, g, ah) => responderCompromiso(e, cx, g, ah, { compromiso_id: c.id, texto })))
    setTexto('')
  }

  return (
    <li className="compromiso">
      <div className="compromiso-encabezado">
        <strong>{c.descripcion}</strong>
        <Estado tono={c.estado === 'resuelto' ? 'estable' : compromisoVencido(c, ahora) ? 'atencion' : 'neutro'}>
          {compromisoVencido(c, ahora) ? 'Vencido' : ESTADO_COMPROMISO[c.estado]}
        </Estado>
      </div>
      <p className="texto-secundario">
        Responsable: {c.parte_responsable === 'cliente' ? 'Cliente' : 'ARSEG'}
        {contacto ? ` (${contacto.nombre})` : ''} · Fecha comprometida: {fechaCorta(c.fecha_vigente)}
        {c.fecha_vigente !== c.fecha_original && ` (original: ${fechaCorta(c.fecha_original)})`}
      </p>
      <p className="texto-secundario">Criterio de resolución: {c.criterio_resolucion}</p>
      {c.impacto_previsto && <p className="texto-secundario">Consecuencia prevista: {c.impacto_previsto}</p>}
      {respuestas.map((r) => (
        <blockquote key={r.id} className="respuesta">
          <p>{r.texto}</p>
          <footer className="texto-secundario">Respuesta del {fechaCorta(r.registrada_en)} · origen: {r.origen === 'portal' ? 'portal' : 'comunicación externa'}</footer>
        </blockquote>
      ))}
      {puedeResponder && (
        <div className="acciones-compromiso">
          <label>
            Respuesta
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} />
          </label>
          <button className="boton-primario" onClick={responder} disabled={!texto.trim()}>
            Responder
          </button>
        </div>
      )}
      {esSolicitante && c.estado === 'respondido' && !proyectoCerrado && (
        <div className="acciones-compromiso">
          <button
            className="boton-primario"
            onClick={() => setError(ejecutar((e, cx, g, ah) => resolverCompromiso(e, cx, g, ah, { compromiso_id: c.id, motivo: 'Respuesta validada conforme al criterio de resolución.' })))}
          >
            Validar y resolver
          </button>
          <button
            className="boton-secundario"
            onClick={() => setError(ejecutar((e, cx, g, ah) => solicitarAclaracion(e, cx, g, ah, { compromiso_id: c.id, motivo: 'Se requiere mayor detalle para dar por resuelto el compromiso.' })))}
          >
            Requiere aclaración
          </button>
        </div>
      )}
      {error && <Aviso tono="error">{error}</Aviso>}
    </li>
  )
}

/** Gestión operativa del PM y cierre del socio (SPEC 5.4/5.7). */
function HerramientasArseg({ p }: { p: Proyecto }) {
  const { estado, ctx, ahora, ejecutar } = useStore()
  const [error, setError] = useState<string | null>(null)
  // nuevo hito
  const [hClave, setHClave] = useState('')
  const [hNombre, setHNombre] = useState('')
  const [hFecha, setHFecha] = useState('')
  const [hCriterio, setHCriterio] = useState('')
  // evidencia por hito para cumplir
  const [evidencias, setEvidencias] = useState<Record<string, string>>({})
  // nuevo compromiso
  const [cDesc, setCDesc] = useState('')
  const [cParte, setCParte] = useState<'cliente' | 'arseg'>('cliente')
  const [cTipo, setCTipo] = useState<CompromisoCompartido['tipo']>('solicitud_insumo')
  const [cContacto, setCContacto] = useState('')
  const [cFecha, setCFecha] = useState('')
  const [cCriterio, setCCriterio] = useState('')
  const [cImpacto, setCImpacto] = useState('')
  // cierre
  const [zFecha, setZFecha] = useState('')
  if (!ctx) return null

  const hitos = hitosDeProyecto(estado, ctx, p.id, ahora)
  const contactos = estado.contactos.filter((c) => c.cliente_id === p.cliente_id && c.activo)

  return (
    <>
      <Tarjeta>
        <h2>Gestión operativa (ARSEG)</h2>
        <h3>Hitos publicables</h3>
        <ul className="lista-compromisos">
          {hitos.map((h) => (
            <li key={h.id}>
              <span className="mono">{h.clave}</span> {h.nombre} · {fechaCorta(h.fecha_vigente)} · {h.estado}
              {h.estado !== 'cumplido' && (
                <span className="acciones-linea">
                  {h.estado === 'pendiente' && (
                    <button
                      className="boton-secundario"
                      onClick={() => setError(ejecutar((e, cx, g, ah) => actualizarHito(e, cx, g, ah, { hito_id: h.id, estado: 'en_curso' })))}
                    >
                      Iniciar
                    </button>
                  )}
                  <input
                    className="campo-linea"
                    placeholder="Evidencia (evd/minuta.pdf)"
                    value={evidencias[h.id] ?? ''}
                    onChange={(e) => setEvidencias({ ...evidencias, [h.id]: e.target.value })}
                    aria-label={`Evidencia de cumplimiento del hito ${h.clave}`}
                  />
                  <button
                    className="boton-secundario"
                    disabled={!(evidencias[h.id] ?? '').trim()}
                    onClick={() => setError(ejecutar((e, cx, g, ah) => actualizarHito(e, cx, g, ah, { hito_id: h.id, estado: 'cumplido', evidencia_ref: evidencias[h.id] })))}
                  >
                    Marcar cumplido
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="rejilla-form">
          <label>Clave<input value={hClave} onChange={(e) => setHClave(e.target.value)} placeholder="H-04" /></label>
          <label>Nombre<input value={hNombre} onChange={(e) => setHNombre(e.target.value)} /></label>
          <label>Fecha comprometida<input type="date" value={hFecha} onChange={(e) => setHFecha(e.target.value)} /></label>
          <label>Criterio de terminación<input value={hCriterio} onChange={(e) => setHCriterio(e.target.value)} /></label>
        </div>
        <button
          className="boton-secundario"
          disabled={!hClave.trim() || !hNombre.trim() || !hFecha || !hCriterio.trim()}
          onClick={() => {
            setError(ejecutar((e, cx, g, ah) => crearHito(e, cx, g, ah, { proyecto_id: p.id, clave: hClave, nombre: hNombre, fecha: hFecha, criterio_terminacion: hCriterio })))
            setHClave(''); setHNombre(''); setHFecha(''); setHCriterio('')
          }}
        >
          Agregar hito
        </button>

        <h3>Nuevo compromiso compartido</h3>
        <div className="rejilla-form">
          <label>Parte responsable
            <select value={cParte} onChange={(e) => setCParte(e.target.value as 'cliente' | 'arseg')}>
              <option value="cliente">Cliente</option>
              <option value="arseg">ARSEG</option>
            </select>
          </label>
          <label>Tipo
            <select value={cTipo} onChange={(e) => setCTipo(e.target.value as CompromisoCompartido['tipo'])}>
              <option value="solicitud_insumo">Solicitud de insumo</option>
              <option value="decision">Decisión</option>
              <option value="acceso_coordinado">Acceso coordinado</option>
              <option value="validacion">Validación</option>
            </select>
          </label>
          <label>Persona responsable
            <select value={cContacto} onChange={(e) => setCContacto(e.target.value)}>
              <option value="">Elegir…</option>
              {contactos.map((c) => <option key={c.id} value={c.id}>{c.nombre} — {c.cargo}</option>)}
            </select>
          </label>
          <label>Fecha de respuesta<input type="date" value={cFecha} onChange={(e) => setCFecha(e.target.value)} /></label>
          <label className="campo-ancho">Descripción inequívoca<input value={cDesc} onChange={(e) => setCDesc(e.target.value)} /></label>
          <label className="campo-ancho">Criterio de resolución<input value={cCriterio} onChange={(e) => setCCriterio(e.target.value)} /></label>
          <label className="campo-ancho">Consecuencia prevista<input value={cImpacto} onChange={(e) => setCImpacto(e.target.value)} placeholder="Sin X, la fecha del hito Y debe revisarse." /></label>
        </div>
        <button
          className="boton-secundario"
          disabled={!cDesc.trim() || !cContacto || !cFecha || !cCriterio.trim()}
          onClick={() => {
            setError(ejecutar((e, cx, g, ah) => crearCompromiso(e, cx, g, ah, { proyecto_id: p.id, tipo: cTipo, descripcion: cDesc, parte_responsable: cParte, contacto_responsable_id: cContacto, fecha: cFecha, criterio_resolucion: cCriterio, impacto_previsto: cImpacto })))
            setCDesc(''); setCContacto(''); setCFecha(''); setCCriterio(''); setCImpacto('')
          }}
        >
          Registrar compromiso
        </button>
        <p className="texto-secundario">
          Lo que se registra aquí es visible para el cliente y queda en bitácora. Las tareas internas del equipo ARSEG
          no se gestionan en el portal (1.3).
        </p>
      </Tarjeta>

      {ctx.membresia.rol === 'socio_responsable' && (
        <Tarjeta>
          <h2>Cierre del proyecto (socio)</h2>
          <p className="texto-secundario">
            El cierre exige resolver o documentar los compromisos abiertos (5.7). Después, el expediente queda en solo
            consulta hasta la fecha acordada.
          </p>
          <div className="rejilla-form">
            <label>Consulta histórica hasta<input type="date" value={zFecha} onChange={(e) => setZFecha(e.target.value)} /></label>
          </div>
          <button
            className="boton-secundario"
            disabled={!zFecha}
            onClick={() =>
              setError(ejecutar((e, cx, g, ah) => cerrarProyecto(e, cx, g, ah, { proyecto_id: p.id, consulta_historica_hasta: `${zFecha}T23:59:59Z`, evidencia_conformidad_ref: 'evd/acta-cierre.pdf', pendientes_transferidos_ref: 'evd/pendientes-transferidos.pdf' })))
            }
          >
            Cerrar proyecto
          </button>
        </Tarjeta>
      )}
      {error && <Aviso tono="error">{error}</Aviso>}
    </>
  )
}

export function ProyectoDetalle({ proyectoId }: { proyectoId: string }) {
  const { estado, ctx, ahora, ejecutar } = useStore()
  const [error, setError] = useState<string | null>(null)
  const [avance, setAvance] = useState('')
  if (!ctx) return null

  const p = proyectoVisible(estado, ctx, proyectoId, ahora)
  if (!p) {
    // PA-01: la denegación no revela contenido ni metadatos.
    return <Aviso tono="error">No tienes acceso a este recurso.</Aviso>
  }

  const hitos = hitosDeProyecto(estado, ctx, p.id, ahora)
  const avances = avancesDeProyecto(estado, ctx, p.id, ahora)
  const compromisos = compromisosDeProyecto(estado, ctx, p.id, ahora)
  const entregables = entregablesDeProyecto(estado, ctx, p.id, ahora)
  const bitacora = bitacoraVisible(estado, ctx, ahora, p.id)
  const revisionAlcance = estado.acuerdoRevisiones.find((r) => r.id === p.acuerdo_inicial_revision_id)
  const formalizacion = estado.formalizaciones.find((f) => f.id === p.formalizacion_inicial_id)
  const cerrado = p.fase === 'cerrado'
  const esArsegPublicador = ctx.membresia.rol === 'lider_proyecto' || ctx.membresia.rol === 'socio_responsable'

  const exportar = () => {
    const paquete = generarPaqueteExpediente(estado, ctx, p.id, ahora)
    if ('error' in paquete) {
      setError(paquete.error)
      return
    }
    const blob = new Blob([JSON.stringify(paquete, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expediente-${p.clave}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <h1>{p.nombre}</h1>
      <p className="texto-secundario">
        {p.clave} · {p.modalidad === 'puntual' ? 'Servicio puntual' : 'Servicio recurrente'} · Corte de información:{' '}
        {fechaCorta(p.fecha_corte_publicada)}
      </p>
      {cerrado && (
        <Aviso>
          Proyecto cerrado el {p.fin_real ? fechaCorta(p.fin_real) : '—'}. Expediente en solo consulta
          {p.consulta_historica_hasta ? ` hasta el ${fechaCorta(p.consulta_historica_hasta)}` : ''}. Los accesos siguen
          registrándose.
        </Aviso>
      )}

      <Tarjeta>
        <h2>Alcance vigente</h2>
        {revisionAlcance && (
          <p>
            {revisionAlcance.titulo} — revisión {revisionAlcance.numero_revision}{' '}
            <span className="texto-secundario">(ver en <a href="#/acuerdos">Acuerdos</a>)</span>
          </p>
        )}
        {formalizacion && (
          <p className="texto-secundario">
            Formalizado fuera del portal el {fechaCorta(formalizacion.fecha_acto)} · Firmante según instrumento:{' '}
            {formalizacion.firmante_segun_instrumento} · Evidencia registrada y validada por ARSEG.
          </p>
        )}
      </Tarjeta>

      <Tarjeta>
        <h2>Hitos</h2>
        <div className="tabla-envoltura">
          <table>
            <thead>
              <tr>
                <th scope="col">Clave</th>
                <th scope="col">Hito</th>
                <th scope="col">Fecha original</th>
                <th scope="col">Fecha vigente</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {hitos.map((h) => (
                <tr key={h.id}>
                  <td className="mono">{h.clave}</td>
                  <td>
                    {h.nombre}
                    {h.cambios_fecha.length > 0 && (
                      <div className="texto-secundario">Último cambio: {h.cambios_fecha.at(-1)!.motivo}</div>
                    )}
                  </td>
                  <td className="mono">{fechaCorta(h.fecha_original)}</td>
                  <td className="mono">{fechaCorta(h.fecha_vigente)}</td>
                  <td>
                    <Estado tono={h.estado === 'cumplido' ? 'estable' : h.fecha_vigente < ahora ? 'atencion' : 'neutro'}>
                      {h.estado === 'cumplido' ? 'Cumplido' : h.estado === 'en_curso' ? 'En curso' : 'Pendiente'}
                    </Estado>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2>Compromisos de ambas partes</h2>
        <ul className="lista-compromisos-detalle">
          {compromisos.map((c) => (
            <FilaCompromiso key={c.id} c={c} proyectoCerrado={cerrado} />
          ))}
          {compromisos.length === 0 && <li className="texto-secundario">Sin compromisos registrados.</li>}
        </ul>
      </Tarjeta>

      <Tarjeta>
        <h2>Entregables</h2>
        {entregables.map(({ entregable, revisiones, vigente }) => (
          <div key={entregable.id} className="entregable">
            <h3>{entregable.titulo}</h3>
            {vigente && (
              <p className="fila-estados">
                <ChipClasificacion valor={vigente.clasificacion} />
                <span className="texto-secundario">
                  Revisión vigente: {vigente.numero_revision} · {bytesLegibles(vigente.bytes)} · publicada el{' '}
                  {vigente.publicado_en ? fechaCorta(vigente.publicado_en) : '—'}
                </span>
              </p>
            )}
            {entregable.criterio_conformidad && (
              <p className="texto-secundario">Criterio de conformidad: {entregable.criterio_conformidad}</p>
            )}
            <ul className="lista-revisiones">
              {revisiones.map((r) => {
                const acuses = estado.acuses.filter((a) => a.entregable_revision_id === r.id)
                const yaAcuso = acuses.some((a) => a.actor_membresia_id === ctx.membresia.id && a.tipo === 'recepcion')
                const yaConforme = acuses.some((a) => a.tipo === 'conformidad')
                return (
                  <li key={r.id}>
                    <span className="mono">rev. {r.numero_revision}</span>{' '}
                    {r.estado_editorial === 'superado' && <Estado tono="neutro">Versión anterior</Estado>}
                    <span className="texto-secundario mono"> hash {r.hash_archivo}</span>
                    {acuses.map((a) => (
                      <span key={a.id} className="texto-secundario">
                        {' '}· {a.tipo === 'recepcion' ? 'Recepción acusada' : 'Conformidad'} el {fechaCorta(a.registrado_en)}
                      </span>
                    ))}
                    {!cerrado && r.estado_editorial === 'publicado' && (
                      <span className="acciones-linea">
                        {!yaAcuso && (ctx.membresia.rol === 'patrocinador' || ctx.membresia.rol === 'responsable_operativo') && (
                          <button
                            className="boton-secundario"
                            onClick={() => setError(ejecutar((e, cx, g, ah) => registrarAcuse(e, cx, g, ah, { entregable_revision_id: r.id, tipo: 'recepcion' })))}
                          >
                            Acusar recepción
                          </button>
                        )}
                        {!yaConforme && entregable.criterio_conformidad && (
                          <button
                            className="boton-secundario"
                            onClick={() => setError(ejecutar((e, cx, g, ah) => registrarAcuse(e, cx, g, ah, { entregable_revision_id: r.id, tipo: 'conformidad' })))}
                          >
                            Dar conformidad
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        {entregables.length === 0 && <p className="texto-secundario">No hay entregables visibles con tus permisos.</p>}
        <p className="texto-secundario">
          El acuse de recepción no implica conformidad; la conformidad se declara contra el criterio acordado y no
          sustituye una firma contractual cuando sea necesaria.
        </p>
      </Tarjeta>

      {esArsegPublicador && !cerrado && <HerramientasArseg p={p} />}

      {esArsegPublicador && !cerrado && (
        <Tarjeta>
          <h2>Publicar avance (ARSEG)</h2>
          <label>
            Texto revisado a publicar
            <textarea value={avance} onChange={(e) => setAvance(e.target.value)} rows={2} />
          </label>
          <button
            className="boton-primario"
            disabled={!avance.trim()}
            onClick={() => {
              setError(ejecutar((e, cx, g, ah) => publicarAvance(e, cx, g, ah, { proyecto_id: p.id, texto: avance, fecha_corte: ah.slice(0, 10) })))
              setAvance('')
            }}
          >
            Publicar corte de hoy
          </button>
        </Tarjeta>
      )}

      <Tarjeta>
        <h2>Publicaciones de avance</h2>
        <ul className="lista-compromisos">
          {avances.map((a) => (
            <li key={a.id}>
              <span className="texto-secundario mono">{fechaCorta(a.fecha_corte)}</span> {a.texto_publicado}
              {a.sistema_origen !== 'portal' && (
                <span className="texto-secundario"> · origen: {a.sistema_origen} ({a.id_origen})</span>
              )}
            </li>
          ))}
          {avances.length === 0 && <li className="texto-secundario">Sin publicaciones.</li>}
        </ul>
      </Tarjeta>

      <Tarjeta>
        <h2>Expediente y trazabilidad</h2>
        <p className="texto-secundario">
          El paquete se genera con tus permisos vigentes: no incluye contenido que no puedas consultar (PA-32).
        </p>
        <button className="boton-secundario" onClick={exportar}>Exportar expediente (JSON con manifiesto)</button>
        <h3>Bitácora del proyecto</h3>
        <ul className="lista-bitacora">
          {bitacora.slice().reverse().slice(0, 12).map((ev) => (
            <li key={ev.id}>
              <span className="mono texto-secundario">{ev.ocurrido_en_servidor.slice(0, 16).replace('T', ' ')}</span>{' '}
              {ev.detalle_minimo}
            </li>
          ))}
          {bitacora.length === 0 && <li className="texto-secundario">Sin eventos visibles con tus permisos.</li>}
        </ul>
      </Tarjeta>

      {error && <Aviso tono="error">{error}</Aviso>}
    </>
  )
}
