// F5 — Cierre y exportación (SPEC s.20, s.36; Fase A: cronología CSV + paquete JSON).

import { useState } from 'react'
import { Chip } from '../../components/ui'
import { EVENT_TYPES, makeEvent } from '../../domain/events'
import { useStore } from '../../store'
import { FACILITADOR_ID } from './Console'

export function Cierre() {
  const { config, events, estado, append } = useStore()
  const [confirmaCierre, setConfirmaCierre] = useState(false)

  const disparadas = estado.msel.filter((i) =>
    ['activa', 'cerrada'].includes(estado.inyecciones[i.id].estado),
  ).length

  const totales: [string, number][] = [
    ['Participantes', estado.participantes.length],
    ['Inyecciones disparadas', disparadas],
    ['Decisiones registradas', estado.decisiones.length],
    ['Escalamientos', estado.escalamientos.length],
    ['Solicitudes de información', estado.solicitudes.length],
    ['Compromisos', estado.compromisos.length],
    ['Observaciones ARSEG', estado.observaciones.length],
    ['Evidencias vinculadas', estado.vinculos.length],
    ['Debriefings recibidos', estado.debriefings.length],
    ['Eventos de bitácora', events.length],
  ]

  return (
    <div className="tt-grid tt-grid--2">
      <div className="tt-card">
        <h2>Totales de la sesión</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <tbody>
              {totales.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="tt-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="tt-sep" />
        {estado.estado !== 'cerrado' ? (
          !confirmaCierre ? (
            <button className="tt-btn tt-btn--peligro" onClick={() => setConfirmaCierre(true)}>
              Cerrar ejercicio
            </button>
          ) : (
            <div>
              <p className="tt-small">
                Al cerrar, el ejercicio ya no aceptará nuevos registros. La evidencia queda íntegra
                para exportación.
              </p>
              <div className="tt-fila">
                <button
                  className="tt-btn tt-btn--peligro"
                  onClick={() => {
                    append(makeEvent(config.id, EVENT_TYPES.EXERCISE_CLOSED, {}, 'facilitador', FACILITADOR_ID))
                    setConfirmaCierre(false)
                  }}
                >
                  Confirmar cierre
                </button>
                <button className="tt-btn tt-btn--fantasma" onClick={() => setConfirmaCierre(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )
        ) : (
          <Chip tone="err">Ejercicio cerrado — solo lectura y exportación</Chip>
        )}
      </div>

      <div className="tt-card">
        <h2>Paquete de evidencia</h2>
        <p className="tt-small tt-suave">
          La aplicación produce evidencia; no es un informe final. ARSEG emite el dictamen
          profesional a partir de este paquete.
        </p>
        <div className="tt-cta-lista">
          <a className="tt-btn tt-btn--primario tt-btn--bloque" href={`/consola/${config.id}/informe`}>
            Ver paquete de evidencia (imprimir / PDF)
          </a>
          <a className="tt-btn tt-btn--bloque" href={`/api/ejercicios/${config.id}/export?fmt=csv`}>
            Descargar cronología (CSV)
          </a>
          <a className="tt-btn tt-btn--bloque" href={`/api/ejercicios/${config.id}/export?fmt=matriz`}>
            Descargar matriz objetivo → evidencia (CSV)
          </a>
          <a className="tt-btn tt-btn--bloque" href={`/api/ejercicios/${config.id}/export?fmt=json`}>
            Descargar paquete de evidencia D5 (JSON)
          </a>
        </div>
        <hr className="tt-sep" />
        <Reinicio />
      </div>
    </div>
  )
}

/** Purga la cronología para repetir un recorrido de prueba (solo director). */
function Reinicio() {
  const { config, events } = useStore()
  const [confirma, setConfirma] = useState(false)
  const [error, setError] = useState('')
  const [trabajando, setTrabajando] = useState(false)

  const reiniciar = async () => {
    setTrabajando(true)
    setError('')
    const res = await fetch(`/api/ejercicios/${config.id}/reset`, { method: 'POST' })
    if (res.ok) {
      window.location.reload()
      return
    }
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    setError(data?.error ?? 'No fue posible reiniciar.')
    setTrabajando(false)
  }

  return (
    <div>
      <h3>Reiniciar ejercicio</h3>
      <p className="tt-small tt-suave">
        Borra permanentemente la cronología completa ({events.length} eventos: decisiones,
        escalamientos, observaciones, participantes…) y conserva la configuración y el código de
        sala, para repetir un recorrido de prueba. Exporta la evidencia antes si quieres conservarla.
        Los participantes conectados volverán al check-in.
      </p>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      {!confirma ? (
        <button className="tt-btn" onClick={() => setConfirma(true)}>
          Reiniciar ejercicio…
        </button>
      ) : (
        <div className="tt-fila">
          <button className="tt-btn tt-btn--peligro" disabled={trabajando} onClick={reiniciar}>
            {trabajando ? 'Reiniciando…' : `Borrar ${events.length} eventos y reiniciar`}
          </button>
          <button className="tt-btn tt-btn--fantasma" onClick={() => setConfirma(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
