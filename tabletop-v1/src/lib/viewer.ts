// Filtros de visibilidad por superficie — la información asimétrica (SPEC s.18)
// se aplica en el SERVIDOR: cada superficie recibe solo lo que le corresponde.

import { EVENT_TYPES } from '@/domain/events'
import type { InjectAdhocCreatedPayload } from '@/domain/events'
import { inyeccionVisibleParaRol } from '@/domain/rules'
import type { EjercicioConfig, EventoBitacora, Inyeccion } from '@/domain/types'

export type Viewer =
  | { tipo: 'arseg' }
  | { tipo: 'participante'; rol_id: string }
  | { tipo: 'sala' }

function inyeccionVisible(iny: Inyeccion, viewer: Viewer): boolean {
  if (viewer.tipo === 'arseg') return true
  if (viewer.tipo === 'participante') return inyeccionVisibleParaRol(iny, viewer.rol_id)
  return iny.visible_en_sala
}

/** Config filtrada: el cuerpo de una inyección privada nunca viaja fuera de su audiencia. */
export function configParaViewer(config: EjercicioConfig, viewer: Viewer): EjercicioConfig {
  if (viewer.tipo === 'arseg') return config
  return {
    ...config,
    qr_token: '',
    inyecciones: config.inyecciones.filter((i) => inyeccionVisible(i, viewer)),
  }
}

const SALA_TYPES: ReadonlySet<string> = new Set([
  EVENT_TYPES.EXERCISE_STARTED,
  EVENT_TYPES.EXERCISE_PAUSED,
  EVENT_TYPES.EXERCISE_RESUMED,
  EVENT_TYPES.EXERCISE_CLOSED,
  EVENT_TYPES.PHASE_CHANGED,
  EVENT_TYPES.NARRATIVE_TIME_JUMP,
  EVENT_TYPES.INJECT_PREPARED,
  EVENT_TYPES.INJECT_DISPATCHED,
  EVENT_TYPES.INJECT_CLOSED,
  EVENT_TYPES.INJECT_OMITTED,
  EVENT_TYPES.INJECT_ADHOC_CREATED,
  EVENT_TYPES.INJECT_AUDIENCE_CHANGED,
  EVENT_TYPES.ROOM_DISPLAY_CHANGED,
])

// Los participantes no reciben observaciones ARSEG ni sus vínculos (s.2:
// separación evidencia vs. juicio; las observaciones son material ARSEG).
const OCULTOS_PARTICIPANTE: ReadonlySet<string> = new Set([
  EVENT_TYPES.OBSERVATION_CREATED,
  EVENT_TYPES.OBSERVATION_LINKED,
])

export function eventosParaViewer(
  events: EventoBitacora[],
  viewer: Viewer,
  config: EjercicioConfig,
): EventoBitacora[] {
  if (viewer.tipo === 'arseg') return events
  return events.filter((e) => {
    if (viewer.tipo === 'sala' && !SALA_TYPES.has(e.type)) return false
    if (viewer.tipo === 'participante' && OCULTOS_PARTICIPANTE.has(e.type)) return false
    // Una inyección ad hoc viaja con su contenido: se filtra por audiencia.
    if (e.type === EVENT_TYPES.INJECT_ADHOC_CREATED) {
      const iny = (e.payload as InjectAdhocCreatedPayload).inyeccion
      return inyeccionVisible(iny, viewer)
    }
    void config
    return true
  })
}
