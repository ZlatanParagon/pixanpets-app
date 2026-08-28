// Tipos de evento — SPEC sección 31 (subconjunto de la Fase A).

import type {
  ActorTipo,
  Compromiso,
  Debriefing,
  Decision,
  Escalamiento,
  EventoBitacora,
  EvidenciaVinculo,
  FuenteRespuesta,
  Inyeccion,
  Observacion,
  Participante,
  SolicitudInformacion,
} from './types'

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
  ESCALATION_CREATED: 'escalation.created',
  ESCALATION_ACKNOWLEDGED: 'escalation.acknowledged',
  INFORMATION_REQUESTED: 'information.requested',
  INFORMATION_RESPONDED: 'information.responded',
  COMMITMENT_CREATED: 'commitment.created',
  OBSERVATION_CREATED: 'observation.created',
  OBSERVATION_LINKED: 'observation.linked',
  BRANCH_SELECTED: 'branch.selected',
  INJECT_ADHOC_CREATED: 'inject.adhoc_created',
  INJECT_REORDERED: 'inject.reordered',
  INJECT_AUDIENCE_CHANGED: 'inject.audience_changed',
  DEBRIEFING_SUBMITTED: 'debriefing.submitted',
  ROOM_DISPLAY_CHANGED: 'room.display_changed',
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
export interface EscalationCreatedPayload {
  escalamiento: Escalamiento
}
export interface EscalationAcknowledgedPayload {
  escalamiento_id: string
  participante_id: string
}
export interface InformationRequestedPayload {
  solicitud: SolicitudInformacion
}
export interface InformationRespondedPayload {
  solicitud_id: string
  respuesta: string
  fuente_respuesta: FuenteRespuesta
}
export interface CommitmentCreatedPayload {
  compromiso: Compromiso
}
export interface ObservationCreatedPayload {
  observacion: Observacion
}
export interface ObservationLinkedPayload {
  vinculo: EvidenciaVinculo
}
export interface BranchSelectedPayload {
  inyeccion_id: string
  consecuencia_id: string
}
export interface InjectAdhocCreatedPayload {
  inyeccion: Inyeccion
}
export interface InjectReorderedPayload {
  inyeccion_id: string
  nuevo_orden: number
}
export interface InjectAudienceChangedPayload {
  inyeccion_id: string
  audiencia_rol_ids: string[] | null
  visible_en_sala: boolean
}
export interface DebriefingSubmittedPayload {
  debriefing: Debriefing
}
export interface RoomDisplayChangedPayload {
  mostrar_inyeccion: boolean
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
