// F2 — MSEL / Inyecciones (SPEC s.20). Disparar, preparar, omitir, cerrar.
// No se modifica una inyección ya disparada: la cronología es intocable.

import { Chip, SeveridadChip } from '../../components/ui'
import { fmtHora } from '../../domain/clock'
import { EVENT_TYPES, makeEvent } from '../../domain/events'
import type { EstadoInyeccion, Inyeccion } from '../../domain/types'
import { useStore } from '../../store'
import { FACILITADOR_ID } from './Console'

const ESTADO_TONE: Record<EstadoInyeccion, { label: string; tone?: 'activa' | 'ok' | 'warn' | 'err' }> = {
  pendiente: { label: 'Pendiente' },
  preparada: { label: 'Preparada', tone: 'warn' },
  activa: { label: 'Activa', tone: 'activa' },
  cerrada: { label: 'Cerrada', tone: 'ok' },
  omitida: { label: 'Omitida', tone: 'err' },
}

export function Msel() {
  const { config, estado, append } = useStore()
  const iniciado = estado.iniciado_en != null
  const cerrado = estado.estado === 'cerrado'

  const emit = (type: (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES], inyeccion_id: string) =>
    append(makeEvent(config.id, type, { inyeccion_id }, 'facilitador', FACILITADOR_ID))

  return (
    <>
      {!iniciado && (
        <p className="tt-aviso">El ejercicio aún no inicia: inicia el reloj desde el Tablero antes de disparar.</p>
      )}
      {config.fases.map((fase) => {
        const inys = config.inyecciones
          .filter((i) => i.fase_id === fase.id)
          .sort((a, b) => a.orden - b.orden)
        if (inys.length === 0) return null
        return (
          <div key={fase.id} className="tt-card">
            <h2>
              {fase.orden}. {fase.nombre}
            </h2>
            {inys.map((iny) => (
              <FilaInyeccion
                key={iny.id}
                iny={iny}
                puedeOperar={iniciado && !cerrado}
                onDisparar={() => emit(EVENT_TYPES.INJECT_DISPATCHED, iny.id)}
                onPreparar={() => emit(EVENT_TYPES.INJECT_PREPARED, iny.id)}
                onCerrar={() => emit(EVENT_TYPES.INJECT_CLOSED, iny.id)}
                onOmitir={() => emit(EVENT_TYPES.INJECT_OMITTED, iny.id)}
              />
            ))}
          </div>
        )
      })}
    </>
  )
}

function FilaInyeccion({
  iny,
  puedeOperar,
  onDisparar,
  onPreparar,
  onCerrar,
  onOmitir,
}: {
  iny: Inyeccion
  puedeOperar: boolean
  onDisparar: () => void
  onPreparar: () => void
  onCerrar: () => void
  onOmitir: () => void
}) {
  const { config, estado } = useStore()
  const est = estado.inyecciones[iny.id]
  const { label, tone } = ESTADO_TONE[est.estado]
  const objetivos = iny.objetivo_ids
    .map((id) => config.objetivos.find((o) => o.id === id)?.clave ?? id)
    .join(', ')
  const audiencia =
    iny.audiencia_rol_ids === null
      ? 'Todos los roles'
      : iny.audiencia_rol_ids.map((r) => config.roles.find((x) => x.id === r)?.nombre ?? r).join(', ')
  const esperados = iny.respuesta_esperada_rol_ids
    .map((r) => config.roles.find((x) => x.id === r)?.nombre ?? r)
    .join(', ')

  return (
    <details style={{ borderTop: '1px solid var(--borde)', padding: '10px 0' }}>
      <summary className="tt-fila" style={{ cursor: 'pointer', listStyle: 'none' }}>
        <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
        <strong style={{ flex: 1 }}>{iny.titulo}</strong>
        {iny.audiencia_rol_ids !== null && <Chip>Privada</Chip>}
        {!iny.visible_en_sala && <Chip>No visible en sala</Chip>}
        <Chip tone={tone}>{label}</Chip>
      </summary>
      <div style={{ padding: '10px 0 4px' }}>
        <p className="tt-small">{iny.cuerpo}</p>
        <div className="tt-fila tt-small tt-suave">
          <SeveridadChip severidad={iny.severidad_disenada} />
          <span>Tipo: {iny.tipo.replace(/_/g, ' ')}</span>
          <span>Objetivos: {objetivos}</span>
          <span>Audiencia: {audiencia}</span>
          {esperados && <span>Respuesta esperada: {esperados}</span>}
          {iny.ventana_decision_seg != null && <span>Ventana: {Math.round(iny.ventana_decision_seg / 60)} min</span>}
          {iny.evidencia_origen_ref && <span className="tt-mono">Origen: {iny.evidencia_origen_ref}</span>}
        </div>
        {est.disparada_en && (
          <p className="tt-small tt-mono tt-suave">
            Disparada {fmtHora(est.disparada_en)}
            {est.cerrada_en && <> · cerrada {fmtHora(est.cerrada_en)}</>}
          </p>
        )}
        <div className="tt-fila" style={{ marginTop: 8 }}>
          {est.estado === 'pendiente' && (
            <button className="tt-btn" disabled={!puedeOperar} onClick={onPreparar}>
              Preparar
            </button>
          )}
          {(est.estado === 'pendiente' || est.estado === 'preparada') && (
            <>
              <button className="tt-btn tt-btn--primario" disabled={!puedeOperar} onClick={onDisparar}>
                Disparar inyección
              </button>
              <button className="tt-btn tt-btn--fantasma" disabled={!puedeOperar} onClick={onOmitir}>
                Omitir
              </button>
            </>
          )}
          {est.estado === 'activa' && (
            <button className="tt-btn" disabled={!puedeOperar} onClick={onCerrar}>
              Cerrar inyección
            </button>
          )}
        </div>
      </div>
    </details>
  )
}
