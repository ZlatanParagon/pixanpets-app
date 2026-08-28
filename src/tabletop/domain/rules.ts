// Reglas críticas de negocio — viven en dominio, no en UI (SPEC regla 42.15).

import type { EventType } from './events'
import type { Decision, EjercicioConfig, Inyeccion } from './types'
import type { DerivedState, InyeccionEstado } from './reducer'

// ── Audiencia (SPEC s.9.2 y s.18: información asimétrica) ─────────────────────

/** ¿La inyección es visible para un rol dado? audiencia null = todos los roles. */
export function inyeccionVisibleParaRol(iny: Inyeccion, rolId: string): boolean {
  return iny.audiencia_rol_ids === null || iny.audiencia_rol_ids.includes(rolId)
}

/** ¿La inyección puede mostrarse en la pantalla de sala? (s.21) */
export function inyeccionVisibleEnSala(iny: Inyeccion): boolean {
  return iny.visible_en_sala
}

// ── No respuesta (SPEC s.13) ──────────────────────────────────────────────────

export type EstadoRespuestaRol =
  | 'respondio'
  | 'pendiente' // ventana abierta, sin acción aún
  | 'no_respuesta' // respuesta esperada + ventana expirada + sin acción
  | 'no_aplica' // recibió pero su rol no requería respuesta — nunca omisión

export function ventanaExpirada(
  iny: Inyeccion,
  est: InyeccionEstado,
  elapsedMsAhora: number,
): boolean {
  if (est.disparada_elapsed_ms == null) return false
  if (est.estado === 'cerrada') return true
  if (iny.ventana_decision_seg == null) return false
  return elapsedMsAhora - est.disparada_elapsed_ms >= iny.ventana_decision_seg * 1000
}

/**
 * Estado de respuesta de un rol frente a una inyección disparada.
 * La ausencia de respuesta solo puede considerarse evidencia cuando el rol estaba
 * en respuesta_esperada, la ventana expiró y no existe acción registrada.
 */
export function estadoRespuestaRol(
  iny: Inyeccion,
  est: InyeccionEstado,
  decisiones: Decision[],
  rolId: string,
  elapsedMsAhora: number,
): EstadoRespuestaRol {
  const respondio = decisiones.some((d) => d.inyeccion_id === iny.id && d.rol_id === rolId)
  if (respondio) return 'respondio'
  if (!iny.respuesta_esperada_rol_ids.includes(rolId)) return 'no_aplica'
  return ventanaExpirada(iny, est, elapsedMsAhora) ? 'no_respuesta' : 'pendiente'
}

// ── Ventana de decisión (SPEC s.16: expirar no bloquea; se acepta captura tardía)

export function esCapturaTardia(
  iny: Inyeccion,
  est: InyeccionEstado,
  elapsedMsAlRegistrar: number,
): boolean {
  if (est.disparada_elapsed_ms == null || iny.ventana_decision_seg == null) return false
  return elapsedMsAlRegistrar - est.disparada_elapsed_ms > iny.ventana_decision_seg * 1000
}

/** Latencia en segundos de tiempo de ejercicio, referida al disparo original. */
export function latenciaSeg(est: InyeccionEstado, elapsedMsAlRegistrar: number): number | null {
  if (est.disparada_elapsed_ms == null) return null
  return Math.max(0, Math.round((elapsedMsAlRegistrar - est.disparada_elapsed_ms) / 1000))
}

// ── Cierre del ejercicio (SPEC s.43: cerrado no acepta nuevos eventos) ────────

const PERMITIDOS_TRAS_CIERRE: ReadonlySet<string> = new Set<EventType>([
  // Exportación y auditoría no generan eventos de sesión en la Fase A;
  // ningún tipo de evento de sesión se acepta tras el cierre.
])

export function puedeRegistrarEvento(estado: DerivedState['estado'], type: string): boolean {
  if (estado !== 'cerrado') return true
  return PERMITIDOS_TRAS_CIERRE.has(type)
}

// ── Validaciones de MSEL ──────────────────────────────────────────────────────

/** CA-8: toda inyección debe estar asociada al menos a un objetivo. */
export function validarConfig(config: EjercicioConfig): string[] {
  const errores: string[] = []
  for (const iny of config.inyecciones) {
    if (iny.objetivo_ids.length === 0) {
      errores.push(`${iny.clave}: no tiene objetivo asociado`)
    }
    if (iny.audiencia_rol_ids !== null) {
      const fuera = iny.respuesta_esperada_rol_ids.filter(
        (r) => !iny.audiencia_rol_ids!.includes(r),
      )
      if (fuera.length > 0) {
        errores.push(`${iny.clave}: espera respuesta de roles fuera de su audiencia`)
      }
    }
  }
  return errores
}
