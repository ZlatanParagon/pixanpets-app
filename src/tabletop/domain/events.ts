// Tipos de evento — SPEC sección 31 (subconjunto de la Fase A).

import type { ActorTipo, Decision, EventoBitacora, Participante } from './types'

export const EVENT_TYPES = {
  EXERCISE_STARTED: 'exercise.started',
  EXERCISE_PAUSED: 'exercise.paused',
  EXERCISE_RESUMED: 'exercise.resumed',
  EXERCISE_CLOSED: 'exercise.closed',
  PHASE_CHANGED: 'phase.changed',
  NARRATIVE_TIME_JUMP: 'narrative.time_jump',
  INJECT_PREPARED: 'inject.prepared',
  INJECT_DISPATCHED: 'inject.dispatched',
  INJECT_CLOSED: 'inject.closed',
  INJECT_OMITTED: 'inject.omitted',
  PARTICIPANT_CONNECTED: 'participant.connected',
  DECISION_CREATED: 'decision.created',
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export interface PhaseChangedPayload {
  fase_id: string
}
export interface TimeJumpPayload {
  /** Salto narrativo en segundos (no modifica el reloj técnico — s.15). */
  salto_seg: number
  etiqueta: string
}
export interface InjectPayload {
  inyeccion_id: string
}
export interface ParticipantConnectedPayload {
  participante: Participante
}
export interface DecisionCreatedPayload {
  decision: Decision
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'ev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

export function makeEvent<P>(
  ejercicio_id: string,
  type: EventType,
  payload: P,
  actor_tipo: ActorTipo,
  actor_id: string | null = null,
  client_timestamp: number = Date.now(),
): EventoBitacora<P> {
  return { id: uuid(), ejercicio_id, type, actor_tipo, actor_id, client_timestamp, payload }
}

/** Orden canónico de la cronología: por hora de cliente y, en empate, por id. */
export function sortEvents(events: EventoBitacora[]): EventoBitacora[] {
  return [...events]
    .sort((a, b) => a.client_timestamp - b.client_timestamp || a.id.localeCompare(b.id))
    .map((e, i) => ({ ...e, sequence: i + 1 }))
}

/** Fusión idempotente por id (sincronización entre superficies — s.25/s.32). */
export function mergeEvents(a: EventoBitacora[], b: EventoBitacora[]): EventoBitacora[] {
  const seen = new Map<string, EventoBitacora>()
  for (const e of [...a, ...b]) if (!seen.has(e.id)) seen.set(e.id, e)
  return sortEvents([...seen.values()])
}
