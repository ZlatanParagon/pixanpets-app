// F3 — Sala de decisiones (SPEC s.20): por inyección, roles esperados, respuestas,
// latencias y no respuesta según la regla de dominio (s.13). Presenta; no juzga.

import { useState } from 'react'
import { Chip, Vacio } from '../../components/ui'
import { elapsedMsAt, fmtHora } from '../../domain/clock'
import { EVENT_TYPES, makeEvent } from '../../domain/events'
import { estadoRespuestaRol, type EstadoRespuestaRol } from '../../domain/rules'
import type { Decision, Inyeccion } from '../../domain/types'
import { useStore } from '../../store'
import { FACILITADOR_ID, getSesionArseg } from './Console'

const RESPUESTA_UI: Record<EstadoRespuestaRol, { label: string; tone?: 'ok' | 'warn' | 'err' }> = {
  respondio: { label: 'Respondió', tone: 'ok' },
  pendiente: { label: 'Ventana abierta', tone: 'warn' },
  no_respuesta: { label: 'No respuesta', tone: 'err' },
  no_aplica: { label: 'No aplica' },
}

export function Decisiones() {
  const { config, events, estado, now } = useStore()
  const elapsedAhora = elapsedMsAt(events, now)

  const disparadas = estado.msel
    .filter((i) => ['activa', 'cerrada'].includes(estado.inyecciones[i.id].estado))
    .sort(
      (a, b) =>
        (estado.inyecciones[b.id].disparada_en ?? 0) - (estado.inyecciones[a.id].disparada_en ?? 0),
    )

  if (disparadas.length === 0) {
    return (
      <Vacio>
        <h2>Aún no hay inyecciones disparadas</h2>
        <p className="tt-small">Las respuestas por inyección aparecerán aquí.</p>
      </Vacio>
    )
  }

  return (
    <>
      {disparadas.map((iny) => {
        const est = estado.inyecciones[iny.id]
        const decisiones = estado.decisiones
          .filter((d) => d.inyeccion_id === iny.id)
          .sort((a, b) => a.registrada_en - b.registrada_en)
        // Roles a mostrar: los esperados + cualquier rol que sí actuó.
        const rolesMostrar = config.roles.filter(
          (r) =>
            iny.respuesta_esperada_rol_ids.includes(r.id) ||
            decisiones.some((d) => d.rol_id === r.id),
        )
        return (
          <div key={iny.id} className="tt-card">
            <div className="tt-fila">
              <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
              <h2 style={{ flex: 1 }}>{iny.titulo}</h2>
              <Chip tone={est.estado === 'activa' ? 'activa' : 'ok'}>
                {est.estado === 'activa' ? 'Activa' : 'Cerrada'}
              </Chip>
            </div>

            <div className="tt-fila" style={{ margin: '10px 0' }}>
              {rolesMostrar.map((r) => {
                const er = estadoRespuestaRol(iny, est, decisiones, r.id, elapsedAhora)
                const ui = RESPUESTA_UI[er]
                return (
                  <span key={r.id} className="tt-fila" style={{ gap: 6 }}>
                    <span className="tt-small">{r.nombre}</span>
                    <Chip tone={ui.tone}>{ui.label}</Chip>
                  </span>
                )
              })}
            </div>

            {decisiones.length > 0 && (
              <div className="tt-tabla-wrap">
                <table className="tt-tabla">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Latencia</th>
                      <th>Rol</th>
                      <th>Participante</th>
                      <th>Registro</th>
                      <th>Justificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decisiones.map((d) => (
                      <FilaDecision key={d.id} d={d} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <CadenasInyeccion iny={iny} />
          </div>
        )
      })}
    </>
  )
}

/** Escalamientos, solicitudes y compromisos de una inyección, con sus tiempos. */
function CadenasInyeccion({ iny }: { iny: Inyeccion }) {
  const { config, estado, append } = useStore()
  const esDirector = getSesionArseg()?.perfil !== 'observador'
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const rol = (id: string | null) => (id ? (config.roles.find((r) => r.id === id)?.nombre ?? id) : '')

  const escalamientos = estado.escalamientos.filter((x) => x.inyeccion_id === iny.id)
  const solicitudes = estado.solicitudes.filter((s) => s.inyeccion_id === iny.id)
  const compromisos = estado.compromisos.filter((c) => c.inyeccion_id === iny.id)
  if (escalamientos.length + solicitudes.length + compromisos.length === 0) return null

  return (
    <div style={{ marginTop: 10 }}>
      {escalamientos.map((x) => (
        <div key={x.id} className="tt-evento">
          <time>{fmtHora(x.escalado_en)}</time>
          <span>
            <strong>Escalamiento</strong> — {rol(x.rol_origen_id)} → {rol(x.rol_destino_id)}: «{x.motivo}»
            {x.urgencia && <> · urgencia {x.urgencia}</>}
            {x.reconocido_en != null ? (
              <> · reconocido <span className="tt-mono">{fmtHora(x.reconocido_en)}</span></>
            ) : (
              <> · <Chip tone="warn">Sin reconocer</Chip></>
            )}
            {x.accion_destino_en != null && (
              <> · acción del destino <span className="tt-mono">{fmtHora(x.accion_destino_en)}</span></>
            )}
          </span>
        </div>
      ))}
      {solicitudes.map((s) => (
        <div key={s.id} className="tt-evento">
          <time>{fmtHora(s.solicitada_en)}</time>
          <span style={{ flex: 1 }}>
            <strong>Solicitud</strong> — {rol(s.solicitada_por_rol_id)} pregunta
            {s.dirigida_a_rol_id ? ` a ${rol(s.dirigida_a_rol_id)}` : ' al facilitador'}: «{s.pregunta}»
            {s.respondida_en != null ? (
              <> · respondida <span className="tt-mono">{fmtHora(s.respondida_en)}</span>: «{s.respuesta}»</>
            ) : !esDirector ? (
              <> · <Chip tone="warn">Sin respuesta</Chip></>
            ) : (
              <span className="tt-fila" style={{ marginTop: 6 }}>
                <input
                  placeholder="Responder como facilitador…"
                  value={respuestas[s.id] ?? ''}
                  onChange={(e) => setRespuestas((r) => ({ ...r, [s.id]: e.target.value }))}
                  style={{ flex: 1, minHeight: 38, border: '1px solid var(--borde)', borderRadius: 8, padding: '0 10px', font: 'inherit' }}
                />
                <button
                  className="tt-btn"
                  disabled={!(respuestas[s.id] ?? '').trim()}
                  onClick={() =>
                    append(
                      makeEvent(
                        config.id,
                        EVENT_TYPES.INFORMATION_RESPONDED,
                        { solicitud_id: s.id, respuesta: respuestas[s.id].trim(), fuente_respuesta: 'facilitador' },
                        'facilitador',
                        FACILITADOR_ID,
                      ),
                    )
                  }
                >
                  Responder
                </button>
              </span>
            )}
          </span>
        </div>
      ))}
      {compromisos.map((c) => (
        <div key={c.id} className="tt-evento">
          <time>{fmtHora(c.declarado_en)}</time>
          <span>
            <strong>Compromiso</strong> — {rol(c.rol_responsable_id)}: «{c.descripcion}»
            {c.plazo_simulado && <> · plazo {c.plazo_simulado}</>}
            {c.criterio_cumplimiento && <> · criterio: {c.criterio_cumplimiento}</>}
          </span>
        </div>
      ))}
    </div>
  )
}

function FilaDecision({ d }: { d: Decision }) {
  const { config, estado } = useStore()
  const rol = config.roles.find((r) => r.id === d.rol_id)
  const participante = estado.participantes.find((p) => p.id === d.participante_id)
  const que =
    d.tipo === 'no_actuar'
      ? 'No actuar por ahora'
      : d.tipo === 'posponer'
        ? 'Posponer'
        : (d.accion_elegida ?? d.accion_libre ?? '—')
  return (
    <tr>
      <td className="tt-mono">{fmtHora(d.registrada_en)}</td>
      <td className="tt-mono">{d.latencia_seg != null ? `${d.latencia_seg}s` : '—'}</td>
      <td>{rol?.nombre ?? d.rol_id}</td>
      <td>{participante?.nombre_visible ?? '—'}</td>
      <td>
        {que}
        {d.tipo === 'decision' && d.accion_elegida && d.accion_libre && (
          <div className="tt-small tt-suave">{d.accion_libre}</div>
        )}
        {d.severidad_percibida && (
          <div className="tt-small tt-suave">Severidad percibida: {d.severidad_percibida}</div>
        )}
      </td>
      <td className="tt-small">«{d.justificacion}»</td>
    </tr>
  )
}
