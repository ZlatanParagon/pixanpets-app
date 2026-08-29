// Exportación del expediente portable (SPEC v0.3, 5.7 y RR-08).
// El paquete se arma con los MISMOS permisos del solicitante (INV-16, PA-32):
// nunca se genera un paquete global confiando en que el receptor no abrirá
// ciertos archivos. La política vuelve a comprobar permisos al entregar (II.6.6).

import type { EstadoPortal } from './types'
import type { ContextoAcceso } from './authz'
import { puedeActuar, puedeVerClasificacion } from './authz'
import {
  acuerdosVisibles,
  bitacoraVisible,
  compromisosDeProyecto,
  entregablesDeProyecto,
  hitosDeProyecto,
  proyectoVisible,
} from './consultas'

export interface ManifiestoArchivo {
  id: string
  nombre: string
  numero_revision: number
  hash_sha256: string
  bytes: number
  clasificacion: string
}

export interface PaqueteExpediente {
  generado_en: string
  proyecto: { id: string; clave: string; nombre: string }
  solicitante: { membresia_id: string; rol: string }
  /** Snapshot de permisos con el que se armó el paquete (II.6.6 Exportacion). */
  permisos_snapshot: string[]
  manifiesto_archivos: ManifiestoArchivo[]
  registros: {
    hitos_csv: string
    compromisos_csv: string
    bitacora_csv: string
  }
  acuerdos_incluidos: { clave: string; revision: number; hash: string }[]
  advertencia: string
}

function csv(encabezados: string[], filas: string[][]): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  return [encabezados, ...filas].map((f) => f.map(esc).join(',')).join('\n')
}

export function generarPaqueteExpediente(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  proyectoId: string,
  ahora: string,
): PaqueteExpediente | { error: string } {
  if (!puedeActuar(estado, ctx, 'exportar_expediente', proyectoId)) return { error: 'No tienes acceso a este recurso.' }
  const proyecto = proyectoVisible(estado, ctx, proyectoId, ahora)
  if (!proyecto) return { error: 'No tienes acceso a este recurso.' }

  // El contenido se filtra con las mismas consultas autorizadas de la interfaz.
  const entregables = entregablesDeProyecto(estado, ctx, proyectoId, ahora)
  const hitos = hitosDeProyecto(estado, ctx, proyectoId, ahora)
  const compromisos = compromisosDeProyecto(estado, ctx, proyectoId, ahora)
  const bitacora = bitacoraVisible(estado, ctx, ahora, proyectoId)
  const acuerdos = acuerdosVisibles(estado, ctx).filter(
    ({ acuerdo }) => !acuerdo.proyecto_destino_id || acuerdo.proyecto_destino_id === proyectoId,
  )

  const manifiesto: ManifiestoArchivo[] = entregables.flatMap(({ entregable, revisiones }) =>
    revisiones
      .filter((r) => puedeVerClasificacion(estado, ctx, r.clasificacion, proyectoId))
      .map((r) => ({
        id: r.archivo_id,
        nombre: entregable.titulo,
        numero_revision: r.numero_revision,
        hash_sha256: r.hash_archivo,
        bytes: r.bytes,
        clasificacion: r.clasificacion,
      })),
  )

  const permisos = estado.permisos
    .filter((p) => p.membresia_id === ctx.membresia.id && !p.revocado_en)
    .map((p) => p.codigo_permiso)

  return {
    generado_en: ahora,
    proyecto: { id: proyecto.id, clave: proyecto.clave, nombre: proyecto.nombre },
    solicitante: { membresia_id: ctx.membresia.id, rol: ctx.membresia.rol },
    permisos_snapshot: permisos,
    manifiesto_archivos: manifiesto,
    registros: {
      hitos_csv: csv(
        ['clave', 'nombre', 'fecha_original', 'fecha_vigente', 'estado', 'criterio_terminacion'],
        hitos.map((h) => [h.clave, h.nombre, h.fecha_original, h.fecha_vigente, h.estado, h.criterio_terminacion]),
      ),
      compromisos_csv: csv(
        ['tipo', 'descripcion', 'parte_responsable', 'fecha_original', 'fecha_vigente', 'estado'],
        compromisos.map((c) => [c.tipo, c.descripcion, c.parte_responsable, c.fecha_original, c.fecha_vigente, c.estado]),
      ),
      bitacora_csv: csv(
        ['ocurrido_en', 'tipo_evento', 'tipo_objeto', 'objeto_id', 'actor_id', 'detalle'],
        bitacora.map((e) => [e.ocurrido_en_servidor, e.tipo_evento, e.tipo_objeto, e.objeto_id, e.actor_id, e.detalle_minimo]),
      ),
    },
    acuerdos_incluidos: acuerdos.flatMap(({ acuerdo, revisiones }) =>
      revisiones.map((r) => ({ clave: acuerdo.clave, revision: r.numero_revision, hash: r.hash_documento })),
    ),
    advertencia:
      'Paquete generado con los permisos del solicitante. «Archivo servido» no acredita lectura ni conformidad (7.5).',
  }
}
