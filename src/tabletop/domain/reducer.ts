// Proyección: eventos → estado derivado. El estado nunca se almacena; se calcula
// siempre desde la cronología (event sourcing lógico — SPEC s.31).

import { clockStateAt, elapsedMsAt } from './clock'
import { EVENT_TYPES } from './events'
import type {
  DecisionCreatedPayload,
  InjectPayload,
  ParticipantConnectedPayload,
  PhaseChangedPayload,
} from './events'
import type {
  Decision,
  EjercicioConfig,
  EstadoEjercicio,
  EstadoInyeccion,
  EventoBitacora,
  Participante,
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
    }
  }

  // El reloj manda sobre el estado en_curso/pausado (misma fuente de verdad).
  const clock = clockStateAt(events)
  if (state.estado !== 'cerrado' && clock.iniciado) {
    state.estado = clock.corriendo ? 'en_curso' : 'pausado'
  }
  return state
}
