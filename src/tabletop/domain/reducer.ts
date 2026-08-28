// Proyección: eventos → estado derivado. El estado nunca se almacena; se calcula
// siempre desde la cronología (event sourcing lógico — SPEC s.31).

import { clockStateAt, elapsedMsAt } from './clock'
import { EVENT_TYPES } from './events'
import type {
  BranchSelectedPayload,
  CommitmentCreatedPayload,
  DebriefingSubmittedPayload,
  DecisionCreatedPayload,
  EscalationAcknowledgedPayload,
  EscalationCreatedPayload,
  InformationRequestedPayload,
  InformationRespondedPayload,
  InjectAdhocCreatedPayload,
  InjectAudienceChangedPayload,
  InjectPayload,
  InjectReorderedPayload,
  ObservationCreatedPayload,
  ObservationLinkedPayload,
  ParticipantConnectedPayload,
  PhaseChangedPayload,
  RoomDisplayChangedPayload,
} from './events'
import type {
  Compromiso,
  Debriefing,
  Decision,
  EjercicioConfig,
  EscalamientoDerivado,
  EstadoEjercicio,
  EstadoInyeccion,
  EventoBitacora,
  EvidenciaVinculo,
  Inyeccion,
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
  /**
   * MSEL efectivo: inyecciones de configuración + ad hoc, con los ajustes
   * previos al disparo aplicados (orden, audiencia, visibilidad en sala).
   * Las superficies deben leer de aquí, no de config.inyecciones.
   */
  msel: Inyeccion[]
  /** Rama seleccionada por inyección (s.17): solo una vez, nunca se reescribe. */
  ramas: Record<string, string>
  decisiones: Decision[]
  escalamientos: EscalamientoDerivado[]
  solicitudes: SolicitudDerivada[]
  compromisos: Compromiso[]
  observaciones: Observacion[]
  vinculos: EvidenciaVinculo[]
  debriefings: Debriefing[]
  /** Control de pantalla de sala (s.7.1): si proyecta la inyección activa. */
  sala_muestra_inyeccion: boolean
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
    msel: [],
    ramas: {},
    decisiones: [],
    escalamientos: [],
    solicitudes: [],
    compromisos: [],
    observaciones: [],
    vinculos: [],
    debriefings: [],
    sala_muestra_inyeccion: true,
    iniciado_en: null,
    cerrado_en: null,
  }

  const adhoc: Inyeccion[] = []
  const ordenOverride = new Map<string, number>()
  const audienciaOverride = new Map<string, { audiencia_rol_ids: string[] | null; visible_en_sala: boolean }>()
  const puedeAjustarse = (id: string) =>
    ['pendiente', 'preparada'].includes(state.inyecciones[id]?.estado ?? '')

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
      case EVENT_TYPES.BRANCH_SELECTED: {
        const p = e.payload as BranchSelectedPayload
        // s.43: una rama solo puede seleccionarse una vez; nunca se reescribe.
        if (state.ramas[p.inyeccion_id] != null) break
        const iny = [...config.inyecciones, ...adhoc].find((i) => i.id === p.inyeccion_id)
        const rama = iny?.consecuencias.find((c) => c.id === p.consecuencia_id)
        if (!iny || !rama) break
        state.ramas[p.inyeccion_id] = p.consecuencia_id
        // Activa (prepara) las inyecciones dependientes de la rama elegida.
        for (const depId of rama.activa_inyeccion_ids) {
          const dep = state.inyecciones[depId]
          if (dep && dep.estado === 'pendiente') dep.estado = 'preparada'
        }
        break
      }
      case EVENT_TYPES.INJECT_ADHOC_CREATED: {
        const { inyeccion } = e.payload as InjectAdhocCreatedPayload
        if (
          !adhoc.some((i) => i.id === inyeccion.id) &&
          !config.inyecciones.some((i) => i.id === inyeccion.id)
        ) {
          adhoc.push(inyeccion)
          state.inyecciones[inyeccion.id] = {
            estado: 'pendiente',
            disparada_en: null,
            disparada_elapsed_ms: null,
            cerrada_en: null,
          }
        }
        break
      }
      case EVENT_TYPES.INJECT_REORDERED: {
        const p = e.payload as InjectReorderedPayload
        // Solo puede reordenarse antes del disparo (F2).
        if (puedeAjustarse(p.inyeccion_id)) ordenOverride.set(p.inyeccion_id, p.nuevo_orden)
        break
      }
      case EVENT_TYPES.INJECT_AUDIENCE_CHANGED: {
        const p = e.payload as InjectAudienceChangedPayload
        // Solo puede hacerse privada/pública antes del disparo (F2).
        if (puedeAjustarse(p.inyeccion_id)) {
          audienciaOverride.set(p.inyeccion_id, {
            audiencia_rol_ids: p.audiencia_rol_ids,
            visible_en_sala: p.visible_en_sala,
          })
        }
        break
      }
      case EVENT_TYPES.DEBRIEFING_SUBMITTED: {
        const { debriefing } = e.payload as DebriefingSubmittedPayload
        if (!state.debriefings.some((d) => d.participante_id === debriefing.participante_id)) {
          state.debriefings.push(debriefing)
        }
        break
      }
      case EVENT_TYPES.ROOM_DISPLAY_CHANGED: {
        state.sala_muestra_inyeccion = (e.payload as RoomDisplayChangedPayload).mostrar_inyeccion
        break
      }
    }
  }

  // MSEL efectivo con ajustes previos al disparo aplicados.
  state.msel = [...config.inyecciones, ...adhoc]
    .map((i) => ({
      ...i,
      orden: ordenOverride.get(i.id) ?? i.orden,
      ...(audienciaOverride.get(i.id) ?? {}),
    }))
    .sort((a, b) => a.orden - b.orden)

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
