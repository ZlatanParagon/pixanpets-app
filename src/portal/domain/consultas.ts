// Consultas autorizadas: TODA lectura de la interfaz pasa por aquí, de modo que
// el filtrado por cliente, alcance de proyecto y clasificación sea único y
// probable (INV-01, INV-16). La UI nunca filtra por su cuenta.

import type {
  Acuerdo,
  AcuerdoRevision,
  CompromisoCompartido,
  Entregable,
  EntregableRevision,
  EstadoPortal,
  EventoBitacora,
  Hito,
  Proyecto,
  PublicacionAvance,
} from './types'
import type { ContextoAcceso } from './authz'
import { alcanzaProyecto, perteneceACliente, puedeVerClasificacion } from './authz'
import { consultaHistoricaVigente } from './comandos'

/** Proyectos consultables por el contexto: pertenencia + alcance + consulta histórica vigente (PA-34). */
export function proyectosVisibles(estado: EstadoPortal, ctx: ContextoAcceso, ahora: string): Proyecto[] {
  if (ctx.membresia.rol === 'administracion') return [] // PA-06: sin acceso a contenido
  return estado.proyectos.filter(
    (p) =>
      p.cliente_id === ctx.membresia.cliente_id &&
      alcanzaProyecto(estado, ctx, p.cliente_id, p.id) &&
      consultaHistoricaVigente(p, ahora),
  )
}

export function proyectoVisible(estado: EstadoPortal, ctx: ContextoAcceso, proyectoId: string, ahora: string): Proyecto | undefined {
  return proyectosVisibles(estado, ctx, ahora).find((p) => p.id === proyectoId)
}

export function hitosDeProyecto(estado: EstadoPortal, ctx: ContextoAcceso, proyectoId: string, ahora: string): Hito[] {
  if (!proyectoVisible(estado, ctx, proyectoId, ahora)) return []
  return estado.hitos.filter((h) => h.proyecto_id === proyectoId)
}

export function avancesDeProyecto(estado: EstadoPortal, ctx: ContextoAcceso, proyectoId: string, ahora: string): PublicacionAvance[] {
  if (!proyectoVisible(estado, ctx, proyectoId, ahora)) return []
  return estado.publicacionesAvance
    .filter((a) => a.proyecto_id === proyectoId)
    .sort((a, b) => b.publicado_en.localeCompare(a.publicado_en))
}

export function compromisosDeProyecto(estado: EstadoPortal, ctx: ContextoAcceso, proyectoId: string, ahora: string): CompromisoCompartido[] {
  if (!proyectoVisible(estado, ctx, proyectoId, ahora)) return []
  return estado.compromisos.filter((c) => c.proyecto_id === proyectoId)
}

export function compromisosVisibles(estado: EstadoPortal, ctx: ContextoAcceso, ahora: string): CompromisoCompartido[] {
  return proyectosVisibles(estado, ctx, ahora).flatMap((p) => compromisosDeProyecto(estado, ctx, p.id, ahora))
}

export interface EntregableConRevisiones {
  entregable: Entregable
  revisiones: EntregableRevision[]
  vigente?: EntregableRevision
}

/**
 * Entregables visibles de un proyecto. Filtra por clasificación TAMBIÉN los
 * títulos y metadatos (H09, PA-05): un entregable cuyo contenido vigente está
 * restringido no aparece en la lista de quien no puede verlo.
 * Solo se listan revisiones publicadas o superadas: el borrador interno jamás
 * se expone (H10, RR-02).
 */
export function entregablesDeProyecto(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  proyectoId: string,
  ahora: string,
): EntregableConRevisiones[] {
  if (!proyectoVisible(estado, ctx, proyectoId, ahora)) return []
  const resultado: EntregableConRevisiones[] = []
  for (const e of estado.entregables.filter((x) => x.proyecto_id === proyectoId)) {
    const publicas = estado.entregableRevisiones.filter(
      (r) =>
        r.entregable_id === e.id &&
        (r.estado_editorial === 'publicado' || r.estado_editorial === 'superado') &&
        puedeVerClasificacion(estado, ctx, r.clasificacion, proyectoId),
    )
    if (publicas.length === 0) continue
    const orden = [...publicas].sort((a, b) => b.numero_revision - a.numero_revision)
    resultado.push({ entregable: e, revisiones: orden, vigente: orden.find((r) => r.estado_editorial === 'publicado') })
  }
  return resultado
}

export function acuerdosVisibles(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
): { acuerdo: Acuerdo; revisiones: AcuerdoRevision[] }[] {
  if (!perteneceACliente(ctx, ctx.membresia.cliente_id) || ctx.membresia.rol === 'administracion') return []
  const resultado: { acuerdo: Acuerdo; revisiones: AcuerdoRevision[] }[] = []
  for (const a of estado.acuerdos.filter((x) => x.cliente_id === ctx.membresia.cliente_id)) {
    const revisiones = estado.acuerdoRevisiones
      .filter((r) => r.acuerdo_id === a.id && puedeVerClasificacion(estado, ctx, r.clasificacion))
      .sort((x, y) => y.numero_revision - x.numero_revision)
    if (revisiones.length > 0) resultado.push({ acuerdo: a, revisiones })
  }
  return resultado
}

/** Bitácora consultable: filtrada por cliente, alcance y clasificación del evento (7.4, D6). */
export function bitacoraVisible(estado: EstadoPortal, ctx: ContextoAcceso, ahora: string, proyectoId?: string): EventoBitacora[] {
  if (ctx.membresia.rol === 'administracion') return []
  const proyectos = new Set(proyectosVisibles(estado, ctx, ahora).map((p) => p.id))
  return estado.bitacora.filter((ev) => {
    if (ev.cliente_id !== ctx.membresia.cliente_id) return false
    if (proyectoId && ev.proyecto_id !== proyectoId) return false
    if (ev.proyecto_id && !proyectos.has(ev.proyecto_id)) return false
    return puedeVerClasificacion(estado, ctx, ev.clasificacion_evento, ev.proyecto_id)
  })
}

/**
 * Estado temporal de una tarjeta de proyecto (5.1): «Sin actualización reciente»
 * es distinto de «En tiempo» (H21). `diasCadencia` es la cadencia pactada.
 */
export function situacionTemporal(
  p: Proyecto,
  hitos: Hito[],
  ahora: string,
  diasCadencia = 7,
): { actualizacion: 'al_corte' | 'pendiente'; hitosVencidos: number } {
  const corte = new Date(p.fecha_corte_publicada).getTime()
  const limite = new Date(ahora).getTime() - diasCadencia * 24 * 60 * 60 * 1000
  const vencidos = hitos.filter((h) => h.estado !== 'cumplido' && h.fecha_vigente < ahora).length
  return { actualizacion: corte >= limite ? 'al_corte' : 'pendiente', hitosVencidos: vencidos }
}
