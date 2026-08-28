// Reloj compartido — SPEC sección 15.
// Una sola fuente de tiempo: los eventos del ejercicio. Todas las superficies derivan
// el reloj de la misma cronología, por lo que la pausa congela reloj, temporizadores,
// sala y móviles a la vez. Los saltos narrativos NO modifican el reloj técnico.

import { EVENT_TYPES } from './events'
import type { EventoBitacora } from './types'

export interface ClockState {
  iniciado: boolean
  corriendo: boolean
  /** ms transcurridos acumulados hasta el último evento de reloj. */
  acumulado_ms: number
  /** epoch ms del último arranque/reanudación si está corriendo. */
  ultimo_arranque: number | null
  /** Desfase narrativo acumulado en segundos (s.15: coexiste con el reloj técnico). */
  narrativo_offset_seg: number
}

const INITIAL: ClockState = {
  iniciado: false,
  corriendo: false,
  acumulado_ms: 0,
  ultimo_arranque: null,
  narrativo_offset_seg: 0,
}

/** Estado del reloj considerando solo eventos con client_timestamp <= hasta. */
export function clockStateAt(events: EventoBitacora[], hasta = Infinity): ClockState {
  let s = { ...INITIAL }
  for (const e of events) {
    if (e.client_timestamp > hasta) continue
    switch (e.type) {
      case EVENT_TYPES.EXERCISE_STARTED:
        s = { ...s, iniciado: true, corriendo: true, ultimo_arranque: e.client_timestamp }
        break
      case EVENT_TYPES.EXERCISE_PAUSED:
      case EVENT_TYPES.EXERCISE_CLOSED:
        if (s.corriendo && s.ultimo_arranque != null) {
          s = {
            ...s,
            corriendo: false,
            acumulado_ms: s.acumulado_ms + (e.client_timestamp - s.ultimo_arranque),
            ultimo_arranque: null,
          }
        }
        break
      case EVENT_TYPES.EXERCISE_RESUMED:
        if (s.iniciado && !s.corriendo) {
          s = { ...s, corriendo: true, ultimo_arranque: e.client_timestamp }
        }
        break
      case EVENT_TYPES.NARRATIVE_TIME_JUMP: {
        const salto = (e.payload as { salto_seg?: number })?.salto_seg ?? 0
        s = { ...s, narrativo_offset_seg: s.narrativo_offset_seg + salto }
        break
      }
    }
  }
  return s
}

/** Tiempo de ejercicio transcurrido (ms) en el instante `en` — excluye pausas. */
export function elapsedMsAt(events: EventoBitacora[], en: number): number {
  const s = clockStateAt(events, en)
  return s.acumulado_ms + (s.corriendo && s.ultimo_arranque != null ? en - s.ultimo_arranque : 0)
}

/** Tiempo narrativo (seg) en el instante `en`: transcurrido + saltos acumulados. */
export function narrativeSecAt(events: EventoBitacora[], en: number): number {
  const s = clockStateAt(events, en)
  const elapsed = s.acumulado_ms + (s.corriendo && s.ultimo_arranque != null ? en - s.ultimo_arranque : 0)
  return Math.floor(elapsed / 1000) + s.narrativo_offset_seg
}

export function fmtHMS(totalSeg: number): string {
  const s = Math.max(0, Math.floor(totalSeg))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(ss)}`
}

export function fmtNarrativo(totalSeg: number): string {
  const s = Math.max(0, Math.floor(totalSeg))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `T+${h}:${String(m).padStart(2, '0')} h`
}

export function fmtHora(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString('es-MX', { hour12: false })
}
