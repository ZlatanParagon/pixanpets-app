// RBAC en servidor (SPEC s.27): qué tipos de evento puede registrar cada actor,
// y verificación de que el payload pertenece a quien lo firma.

import { EVENT_TYPES } from '@/domain/events'
import type {
  CommitmentCreatedPayload,
  DebriefingSubmittedPayload,
  DecisionCreatedPayload,
  EscalationAcknowledgedPayload,
  EscalationCreatedPayload,
  InformationRequestedPayload,
  InformationRespondedPayload,
} from '@/domain/events'
import type { EventoBitacora } from '@/domain/types'
import type { SesionArseg, SesionParticipante } from './auth'

const DIRECTOR: ReadonlySet<string> = new Set(Object.values(EVENT_TYPES))

const OBSERVADOR: ReadonlySet<string> = new Set([
  EVENT_TYPES.OBSERVATION_CREATED,
  EVENT_TYPES.OBSERVATION_LINKED,
])

const PARTICIPANTE: ReadonlySet<string> = new Set([
  EVENT_TYPES.DECISION_CREATED,
  EVENT_TYPES.ESCALATION_CREATED,
  EVENT_TYPES.ESCALATION_ACKNOWLEDGED,
  EVENT_TYPES.INFORMATION_REQUESTED,
  EVENT_TYPES.INFORMATION_RESPONDED,
  EVENT_TYPES.COMMITMENT_CREATED,
  EVENT_TYPES.DEBRIEFING_SUBMITTED,
])

export function puedeRegistrar(
  sesion: SesionArseg | SesionParticipante,
  evento: EventoBitacora,
): { ok: true } | { ok: false; motivo: string } {
  if (sesion.tipo === 'arseg') {
    const permitidos = sesion.perfil === 'director' ? DIRECTOR : OBSERVADOR
    if (!permitidos.has(evento.type)) {
      return { ok: false, motivo: `El perfil ${sesion.perfil} no puede registrar ${evento.type}` }
    }
    return { ok: true }
  }

  // Participante: solo sus propios registros, en su propio ejercicio.
  if (!PARTICIPANTE.has(evento.type)) {
    return { ok: false, motivo: `Un participante no puede registrar ${evento.type}` }
  }
  if (evento.actor_tipo !== 'participante' || evento.actor_id !== sesion.participante_id) {
    return { ok: false, motivo: 'El actor del evento no coincide con la sesión' }
  }
  const p = evento.payload as unknown
  const propio = (id: string | null | undefined) => id === sesion.participante_id
  switch (evento.type) {
    case EVENT_TYPES.DECISION_CREATED:
      return propio((p as DecisionCreatedPayload).decision?.participante_id)
        ? { ok: true }
        : { ok: false, motivo: 'La decisión no pertenece a la sesión' }
    case EVENT_TYPES.ESCALATION_CREATED:
      return propio((p as EscalationCreatedPayload).escalamiento?.participante_origen_id)
        ? { ok: true }
        : { ok: false, motivo: 'El escalamiento no pertenece a la sesión' }
    case EVENT_TYPES.ESCALATION_ACKNOWLEDGED:
      return propio((p as EscalationAcknowledgedPayload).participante_id)
        ? { ok: true }
        : { ok: false, motivo: 'El reconocimiento no pertenece a la sesión' }
    case EVENT_TYPES.INFORMATION_REQUESTED:
      return propio((p as InformationRequestedPayload).solicitud?.solicitada_por_participante_id)
        ? { ok: true }
        : { ok: false, motivo: 'La solicitud no pertenece a la sesión' }
    case EVENT_TYPES.INFORMATION_RESPONDED:
      return (p as InformationRespondedPayload).fuente_respuesta === 'participante'
        ? { ok: true }
        : { ok: false, motivo: 'Un participante solo responde como participante' }
    case EVENT_TYPES.COMMITMENT_CREATED:
      return propio((p as CommitmentCreatedPayload).compromiso?.participante_responsable_id)
        ? { ok: true }
        : { ok: false, motivo: 'El compromiso no pertenece a la sesión' }
    case EVENT_TYPES.DEBRIEFING_SUBMITTED:
      return propio((p as DebriefingSubmittedPayload).debriefing?.participante_id)
        ? { ok: true }
        : { ok: false, motivo: 'El debriefing no pertenece a la sesión' }
    default:
      return { ok: false, motivo: 'Tipo de evento no permitido' }
  }
}
