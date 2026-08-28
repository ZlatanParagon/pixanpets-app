// F5 — Cierre y exportación (SPEC s.20, s.36; Fase A: cronología CSV + paquete JSON).

import { useState } from 'react'
import { Chip, descargar } from '../../components/ui'
import { EVENT_TYPES, makeEvent } from '../../domain/events'
import { cronologiaCSV, paqueteEvidenciaJSON } from '../../domain/export'
import { useStore } from '../../store'
import { FACILITADOR_ID } from './Console'

export function Cierre() {
  const { config, events, estado, append, reset } = useStore()
  const [confirmaCierre, setConfirmaCierre] = useState(false)
  const [confirmaReset, setConfirmaReset] = useState(false)

  const disparadas = config.inyecciones.filter((i) =>
    ['activa', 'cerrada'].includes(estado.inyecciones[i.id].estado),
  ).length

  const totales: [string, number][] = [
    ['Participantes', estado.participantes.length],
    ['Inyecciones disparadas', disparadas],
    ['Decisiones registradas', estado.decisiones.length],
    ['Eventos de bitácora', events.length],
  ]

  const stamp = new Date().toISOString().slice(0, 10)

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
          <button
            className="tt-btn tt-btn--primario tt-btn--bloque"
            onClick={() => descargar(`cronologia-${config.id}-${stamp}.csv`, cronologiaCSV(config, events), 'text/csv')}
          >
            Descargar cronología (CSV)
          </button>
          <button
            className="tt-btn tt-btn--bloque"
            onClick={() =>
              descargar(`evidencia-${config.id}-${stamp}.json`, paqueteEvidenciaJSON(config, events), 'application/json')
            }
          >
            Descargar paquete de evidencia (JSON)
          </button>
        </div>
        <hr className="tt-sep" />
        <h3>Demostración</h3>
        <p className="tt-small tt-suave">Reinicia la cronología local para una nueva corrida de demo.</p>
        {!confirmaReset ? (
          <button className="tt-btn tt-btn--fantasma" onClick={() => setConfirmaReset(true)}>
            Reiniciar sesión de demostración
          </button>
        ) : (
          <div className="tt-fila">
            <button className="tt-btn tt-btn--peligro" onClick={() => { reset(); setConfirmaReset(false) }}>
              Borrar cronología y reiniciar
            </button>
            <button className="tt-btn tt-btn--fantasma" onClick={() => setConfirmaReset(false)}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
