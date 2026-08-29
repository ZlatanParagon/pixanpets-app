// Detalle de proyecto: alcance vigente, hitos, publicaciones, compromisos
// recíprocos, entregables y expediente (SPEC v0.3, 5.4, 5.5, 5.7).

import { useState } from 'react'
import { useStore } from '../store'
import {
  compromisoVencido,
  publicarAvance,
  registrarAcuse,
  resolverCompromiso,
  responderCompromiso,
  solicitarAclaracion,
} from '../domain/comandos'
import {
  avancesDeProyecto,
  bitacoraVisible,
  compromisosDeProyecto,
  entregablesDeProyecto,
  hitosDeProyecto,
  proyectoVisible,
} from '../domain/consultas'
import { generarPaqueteExpediente } from '../domain/expediente'
import { PARTE_POR_ROL, type CompromisoCompartido } from '../domain/types'
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
