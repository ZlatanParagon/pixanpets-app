// Cobertura de objetivos — SPEC sección 12.
// Solo tres estados permitidos; nunca aprobado/reprobado/cumple/maduro.
// La cobertura describe si YA EXISTE evidencia, no si la conducta fue correcta.

import type { EjercicioConfig } from './types'
import type { DerivedState } from './reducer'

export type EstadoCobertura = 'no_ejercitado' | 'evidencia_parcial' | 'evidencia_obtenida'

export const COBERTURA_LABEL: Record<EstadoCobertura, string> = {
  no_ejercitado: 'Aún no ejercitado',
  evidencia_parcial: 'Evidencia parcial',
  evidencia_obtenida: 'Evidencia obtenida',
}

export interface CoberturaObjetivo {
  objetivo_id: string
  estado: EstadoCobertura
  inyecciones_disparadas: number
  evidencias: number
}

/**
 * Regla de dominio:
 * - "no_ejercitado": ninguna inyección del objetivo se ha disparado y no hay
 *   observación vinculada al objetivo.
 * - "evidencia_obtenida": hay al menos una evidencia y cada inyección disparada
 *   del objetivo tiene al menos una acción registrada de un rol con respuesta
 *   esperada (o no espera respuesta de nadie).
 * - "evidencia_parcial": todo lo demás (ya se ejercitó pero la evidencia aún
 *   no cubre lo disparado).
 * Cuentan como evidencia: decisiones, escalamientos, solicitudes y compromisos
 * sobre inyecciones del objetivo, y observaciones ARSEG ligadas al objetivo o a
 * esas inyecciones.
 */
export function coberturaObjetivos(
  config: EjercicioConfig,
  state: DerivedState,
): CoberturaObjetivo[] {
  return config.objetivos
    .filter((o) => o.activo)
    .map((obj) => {
      const inys = config.inyecciones.filter((i) => i.objetivo_ids.includes(obj.id))
      const inyIds = new Set(inys.map((i) => i.id))
      const disparadas = inys.filter((i) =>
        ['activa', 'cerrada'].includes(state.inyecciones[i.id].estado),
      )

      const evidencias =
        state.decisiones.filter((d) => inyIds.has(d.inyeccion_id)).length +
        state.escalamientos.filter((x) => inyIds.has(x.inyeccion_id)).length +
        state.solicitudes.filter((x) => inyIds.has(x.inyeccion_id)).length +
        state.compromisos.filter((x) => inyIds.has(x.inyeccion_id)).length +
        state.observaciones.filter(
          (o) => o.objetivo_id === obj.id || (o.inyeccion_id != null && inyIds.has(o.inyeccion_id)),
        ).length

      let estado: EstadoCobertura
      if (disparadas.length === 0 && evidencias === 0) {
        estado = 'no_ejercitado'
      } else {
        const cubiertas = disparadas.every(
          (i) =>
            i.respuesta_esperada_rol_ids.length === 0 ||
            state.decisiones.some(
              (d) => d.inyeccion_id === i.id && i.respuesta_esperada_rol_ids.includes(d.rol_id),
            ),
        )
        estado =
          evidencias > 0 && disparadas.length > 0 && cubiertas
            ? 'evidencia_obtenida'
            : 'evidencia_parcial'
      }

      return {
        objetivo_id: obj.id,
        estado,
        inyecciones_disparadas: disparadas.length,
        evidencias,
      }
    })
}
