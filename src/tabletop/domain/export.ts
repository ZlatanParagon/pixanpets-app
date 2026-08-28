// Exportación — Fase A: cronología completa (CA-20) en CSV y paquete JSON.
// El paquete NO es un "informe final": es evidencia; ARSEG emite el dictamen (SPEC s.36).

import { elapsedMsAt, fmtHMS, fmtHora } from './clock'
import { sortEvents } from './events'
import { deriveState } from './reducer'
import type { EjercicioConfig, EventoBitacora } from './types'
import type {
  DecisionCreatedPayload,
  InjectPayload,
  ParticipantConnectedPayload,
  PhaseChangedPayload,
  TimeJumpPayload,
} from './events'

const TIPO_LABEL: Record<string, string> = {
  'exercise.started': 'Inicio del ejercicio',
  'exercise.paused': 'Pausa',
  'exercise.resumed': 'Reanudación',
  'exercise.closed': 'Cierre del ejercicio',
  'phase.changed': 'Cambio de fase',
  'narrative.time_jump': 'Salto temporal narrativo',
  'inject.prepared': 'Inyección preparada',
  'inject.dispatched': 'Inyección disparada',
  'inject.closed': 'Inyección cerrada',
  'inject.omitted': 'Inyección omitida',
  'participant.connected': 'Participante conectado',
  'decision.created': 'Decisión registrada',
}

export function describeEvento(config: EjercicioConfig, e: EventoBitacora): string {
  const iny = (id: string) => {
    const x = config.inyecciones.find((i) => i.id === id)
    return x ? `${x.clave} — ${x.titulo}` : id
  }
  const rol = (id: string) => config.roles.find((r) => r.id === id)?.nombre ?? id
  switch (e.type) {
    case 'phase.changed': {
      const p = e.payload as PhaseChangedPayload
      return config.fases.find((f) => f.id === p.fase_id)?.nombre ?? p.fase_id
    }
    case 'narrative.time_jump': {
      const p = e.payload as TimeJumpPayload
      return p.etiqueta
    }
    case 'inject.prepared':
    case 'inject.dispatched':
    case 'inject.closed':
    case 'inject.omitted':
      return iny((e.payload as InjectPayload).inyeccion_id)
    case 'participant.connected': {
      const p = (e.payload as ParticipantConnectedPayload).participante
      return `${p.nombre_visible} (${rol(p.rol_id)})`
    }
    case 'decision.created': {
      const d = (e.payload as DecisionCreatedPayload).decision
      const que =
        d.tipo === 'no_actuar'
          ? 'No actuar por ahora'
          : d.tipo === 'posponer'
            ? 'Posponer'
            : (d.accion_elegida ?? d.accion_libre ?? 'Decisión')
      const lat = d.latencia_seg != null ? ` · latencia ${d.latencia_seg}s` : ''
      return `${rol(d.rol_id)} · ${que} — «${d.justificacion}»${lat}`
    }
    default:
      return ''
  }
}

export function tipoLabel(type: string): string {
  return TIPO_LABEL[type] ?? type
}

function csvCell(v: string | number | null): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Cronología completa en CSV (CA-20). */
export function cronologiaCSV(config: EjercicioConfig, events: EventoBitacora[]): string {
  const ordered = sortEvents(events)
  const participantes = deriveState(config, ordered).participantes
  const rows = [
    ['secuencia', 'hora_real', 'tiempo_ejercicio', 'tipo', 'actor_tipo', 'actor', 'detalle', 'evento_id'],
    ...ordered.map((e) => {
      const actor =
        e.actor_tipo === 'participante'
          ? (participantes.find((p) => p.id === e.actor_id)?.nombre_visible ?? (e.actor_id || ''))
          : (e.actor_id ?? '')
      return [
        String(e.sequence ?? ''),
        fmtHora(e.client_timestamp),
        fmtHMS(elapsedMsAt(ordered, e.client_timestamp) / 1000),
        tipoLabel(e.type),
        e.actor_tipo,
        actor,
        describeEvento(config, e),
        e.id,
      ]
    }),
  ]
  return rows.map((r) => r.map(csvCell).join(',')).join('\n')
}

/** Paquete de evidencia JSON (contenido de la Fase A; se amplía en Fase B). */
export function paqueteEvidenciaJSON(config: EjercicioConfig, events: EventoBitacora[]): string {
  const ordered = sortEvents(events)
  const estado = deriveState(config, ordered)
  return JSON.stringify(
    {
      generado_en: new Date().toISOString(),
      nota: 'Paquete de evidencia del ejercicio. No constituye informe final ni dictamen; ARSEG interpreta la evidencia.',
      ficha: {
        id: config.id,
        nombre: config.nombre,
        cliente: config.cliente,
        fecha: config.fecha,
        escenario: config.escenario,
        estado: estado.estado,
        iniciado_en: estado.iniciado_en,
        cerrado_en: estado.cerrado_en,
      },
      objetivos: config.objetivos,
      fases: config.fases,
      roles: config.roles,
      participantes: estado.participantes,
      msel: config.inyecciones.map((i) => ({ ...i, ...estado.inyecciones[i.id] })),
      decisiones: estado.decisiones,
      cronologia: ordered,
    },
    null,
    2,
  )
}
