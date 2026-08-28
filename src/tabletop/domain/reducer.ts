// Proyección: eventos → estado derivado. El estado nunca se almacena; se calcula
// siempre desde la cronología (event sourcing lógico — SPEC s.31).

import { clockStateAt, elapsedMsAt } from './clock'
import { EVENT_TYPES } from './events'
import type {
  CommitmentCreatedPayload,
  DecisionCreatedPayload,
  EscalationAcknowledgedPayload,
  EscalationCreatedPayload,
  InformationRequestedPayload,
  InformationRespondedPayload,
  InjectPayload,
  ObservationCreatedPayload,
  ObservationLinkedPayload,
  ParticipantConnectedPayload,
  PhaseChangedPayload,
} from './events'
import type {
  Compromiso,
  Decision,
  EjercicioConfig,
  EscalamientoDerivado,
  EstadoEjercicio,
  EstadoInyeccion,
  EventoBitacora,
  EvidenciaVinculo,
  Observacion,
  Participante,
  SolicitudDerivada,
} from './types'

export interface InyeccionEstado {
  estado: EstadoInyeccion
  disparada_en: number | null // epoch ms
  disparada_elapsed_ms: number | null // tiempo de ejercicio al disparo
  cerrada_en: number | null
}

export interface DerivedState {
  estado: EstadoEjercicio
  fase_actual_id: string
  participantes: Participante[]
  inyecciones: Record<string, InyeccionEstado>
  decisiones: Decision[]
  escalamientos: EscalamientoDerivado[]
  solicitudes: SolicitudDerivada[]
  compromisos: Compromiso[]
  observaciones: Observacion[]
  vinculos: EvidenciaVinculo[]
  iniciado_en: number | null
  cerrado_en: number | null
}

export function deriveState(config: EjercicioConfig, events: EventoBitacora[]): DerivedState {
  const inyecciones: Record<string, InyeccionEstado> = {}
  for (const iny of config.inyecciones) {
    inyecciones[iny.id] = {
      estado: 'pendiente',
      disparada_en: null,
      disparada_elapsed_ms: null,
      cerrada_en: null,
    }
  }

  const state: DerivedState = {
    estado: 'preparado',
    fase_actual_id: config.fases[0]?.id ?? '',
    participantes: [],
    inyecciones,
    decisiones: [],
    escalamientos: [],
    solicitudes: [],
    compromisos: [],
    observaciones: [],
    vinculos: [],
    iniciado_en: null,
    cerrado_en: null,
  }

  for (const e of events) {
    switch (e.type) {
      case EVENT_TYPES.EXERCISE_STARTED:
        state.estado = 'en_curso'
        state.iniciado_en = e.client_timestamp
        break
      case EVENT_TYPES.EXERCISE_PAUSED:
        if (state.estado === 'en_curso') state.estado = 'pausado'
        break
      case EVENT_TYPES.EXERCISE_RESUMED:
        if (state.estado === 'pausado') state.estado = 'en_curso'
        break
      case EVENT_TYPES.EXERCISE_CLOSED:
        state.estado = 'cerrado'
        state.cerrado_en = e.client_timestamp
        break
      case EVENT_TYPES.PHASE_CHANGED:
        state.fase_actual_id = (e.payload as PhaseChangedPayload).fase_id
        break
      case EVENT_TYPES.PARTICIPANT_CONNECTED: {
        const { participante } = e.payload as ParticipantConnectedPayload
        if (!state.participantes.some((p) => p.id === participante.id)) {
          state.participantes.push(participante)
        }
        break
      }
      case EVENT_TYPES.INJECT_PREPARED: {
        const iny = state.inyecciones[(e.payload as InjectPayload).inyeccion_id]
        if (iny && iny.estado === 'pendiente') iny.estado = 'preparada'
        break
      }
      case EVENT_TYPES.INJECT_DISPATCHED: {
        const iny = state.inyecciones[(e.payload as InjectPayload).inyeccion_id]
        if (iny && (iny.estado === 'pendiente' || iny.estado === 'preparada')) {
          iny.estado = 'activa'
          iny.disparada_en = e.client_timestamp
          iny.disparada_elapsed_ms = elapsedMsAt(events, e.client_timestamp)
        }
        break
      }
      case EVENT_TYPES.INJECT_CLOSED: {
        const iny = state.inyecciones[(e.payload as InjectPayload).inyeccion_id]
        if (iny && iny.estado === 'activa') {
          iny.estado = 'cerrada'
          iny.cerrada_en = e.client_timestamp
        }
        break
      }
      case EVENT_TYPES.INJECT_OMITTED: {
        const iny = state.inyecciones[(e.payload as InjectPayload).inyeccion_id]
        if (iny && iny.estado !== 'activa' && iny.estado !== 'cerrada') iny.estado = 'omitida'
        break
      }
      case EVENT_TYPES.DECISION_CREATED: {
        const { decision } = e.payload as DecisionCreatedPayload
        if (!state.decisiones.some((d) => d.id === decision.id)) state.decisiones.push(decision)
        break
      }
      case EVENT_TYPES.ESCALATION_CREATED: {
        const { escalamiento } = e.payload as EscalationCreatedPayload
        if (!state.escalamientos.some((x) => x.id === escalamiento.id)) {
          state.escalamientos.push({
            ...escalamiento,
            reconocido_en: null,
            reconocido_por_participante_id: null,
            decision_destino_id: null,
            accion_destino_en: null,
          })
        }
        break
      }
      case EVENT_TYPES.ESCALATION_ACKNOWLEDGED: {
        const p = e.payload as EscalationAcknowledgedPayload
        const esc = state.escalamientos.find((x) => x.id === p.escalamiento_id)
        if (esc && esc.reconocido_en == null) {
          esc.reconocido_en = e.client_timestamp
          esc.reconocido_por_participante_id = p.participante_id
        }
        break
      }
      case EVENT_TYPES.INFORMATION_REQUESTED: {
        const { solicitud } = e.payload as InformationRequestedPayload
        if (!state.solicitudes.some((x) => x.id === solicitud.id)) {
          state.solicitudes.push({
            ...solicitud,
            respuesta: null,
            respondida_en: null,
            fuente_respuesta: null,
          })
        }
        break
      }
      case EVENT_TYPES.INFORMATION_RESPONDED: {
        const p = e.payload as InformationRespondedPayload
        const sol = state.solicitudes.find((x) => x.id === p.solicitud_id)
        if (sol && sol.respondida_en == null) {
          sol.respuesta = p.respuesta
          sol.respondida_en = e.client_timestamp
          sol.fuente_respuesta = p.fuente_respuesta
        }
        break
      }
      case EVENT_TYPES.COMMITMENT_CREATED: {
        const { compromiso } = e.payload as CommitmentCreatedPayload
        if (!state.compromisos.some((x) => x.id === compromiso.id)) {
          state.compromisos.push(compromiso)
        }
        break
      }
      case EVENT_TYPES.OBSERVATION_CREATED: {
        const { observacion } = e.payload as ObservationCreatedPayload
        if (!state.observaciones.some((x) => x.id === observacion.id)) {
          state.observaciones.push(observacion)
        }
        break
      }
      case EVENT_TYPES.OBSERVATION_LINKED: {
        const { vinculo } = e.payload as ObservationLinkedPayload
        const dup = state.vinculos.some(
          (v) =>
            v.observacion_id === vinculo.observacion_id &&
            v.tipo_referencia === vinculo.tipo_referencia &&
            v.referencia_id === vinculo.referencia_id,
        )
        if (!dup) state.vinculos.push(vinculo)
        break
      }
    }
  }

  // CA-11: vincular cada escalamiento con la primera acción posterior del rol
  // destino sobre la misma inyección. Derivado, nunca juzgado.
  for (const esc of state.escalamientos) {
    const accion = state.decisiones
      .filter(
        (d) =>
          d.inyeccion_id === esc.inyeccion_id &&
          d.rol_id === esc.rol_destino_id &&
          d.registrada_en >= esc.escalado_en,
      )
      .sort((a, b) => a.registrada_en - b.registrada_en)[0]
    if (accion) {
      esc.decision_destino_id = accion.id
      esc.accion_destino_en = accion.registrada_en
    }
  }

  // El reloj manda sobre el estado en_curso/pausado (misma fuente de verdad).
  const clock = clockStateAt(events)
  if (state.estado !== 'cerrado' && clock.iniciado) {
    state.estado = clock.corriendo ? 'en_curso' : 'pausado'
  }
  return state
}
