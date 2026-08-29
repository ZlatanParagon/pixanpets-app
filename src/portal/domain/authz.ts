// Autorización por capas (SPEC v0.3, RR-05 y 8.2): sesión, membresía activa,
// alcance de proyecto, permiso de contenido y facultad de acción se verifican
// por separado. El `cliente_id` recibido en una solicitud nunca es prueba de
// autorización (INV-01, PA-01/PA-02).

import type {
  AutoridadComercial,
  Clasificacion,
  CodigoPermiso,
  EstadoPortal,
  Membresia,
  Rol,
} from './types'
import { PARTE_POR_ROL } from './types'

/** Contexto de acceso resuelto en "servidor" a partir de la sesión, nunca del cliente HTTP. */
export interface ContextoAcceso {
  usuario_id: string
  membresia: Membresia
  ahora: string
}

export function vigente(desde: string, hasta: string | undefined, revocado: string | undefined, ahora: string): boolean {
  if (revocado) return false
  if (desde > ahora) return false
  if (hasta && hasta < ahora) return false
  return true
}

/** Capa 1 — pertenencia: la membresía activa debe ser del cliente del objeto. */
export function perteneceACliente(ctx: ContextoAcceso, clienteId: string): boolean {
  return (
    ctx.membresia.activa &&
    ctx.membresia.usuario_id === ctx.usuario_id &&
    ctx.membresia.cliente_id === clienteId &&
    vigente(ctx.membresia.vigente_desde, ctx.membresia.vigente_hasta, undefined, ctx.ahora)
  )
}

/** Capa 2 — alcance de proyecto (AsignacionProyecto cuando el alcance no es de cuenta). */
export function alcanzaProyecto(estado: EstadoPortal, ctx: ContextoAcceso, clienteId: string, proyectoId: string): boolean {
  if (!perteneceACliente(ctx, clienteId)) return false
  const proyecto = estado.proyectos.find((p) => p.id === proyectoId)
  if (!proyecto || proyecto.cliente_id !== clienteId) return false
  if (ctx.membresia.alcance === 'cuenta') return true
  return estado.asignaciones.some(
    (a) => a.membresia_id === ctx.membresia.id && a.proyecto_id === proyectoId && a.cliente_id === clienteId,
  )
}

export function permisoVigente(estado: EstadoPortal, ctx: ContextoAcceso, codigo: CodigoPermiso, proyectoId?: string): boolean {
  return estado.permisos.some(
    (p) =>
      p.membresia_id === ctx.membresia.id &&
      p.cliente_id === ctx.membresia.cliente_id &&
      p.codigo_permiso === codigo &&
      (!p.proyecto_id || p.proyecto_id === proyectoId) &&
      vigente(p.vigente_desde, p.vigente_hasta, p.revocado_en, ctx.ahora),
  )
}

export function autoridadComercialVigente(estado: EstadoPortal, ctx: ContextoAcceso): AutoridadComercial | undefined {
  return estado.autoridades.find(
    (a) =>
      a.membresia_id === ctx.membresia.id &&
      a.cliente_id === ctx.membresia.cliente_id &&
      vigente(a.vigente_desde, a.vigente_hasta, a.revocada_en, ctx.ahora),
  )
}

/**
 * Capa 3 — permiso de contenido por clasificación (II.4.1).
 * - `interna_arseg` jamás se publica al cliente; solo la ven roles ARSEG de servicio.
 * - Administración NO obtiene acceso a contenido por su rol (H19, PA-06).
 * - La clasificación aplica también a títulos, metadatos y exportaciones (H09, INV-16):
 *   quien llama debe usar esta misma función antes de listar o exportar.
 */
export function puedeVerClasificacion(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  clasificacion: Clasificacion,
  proyectoId?: string,
): boolean {
  const rol: Rol = ctx.membresia.rol
  if (rol === 'administracion') return false
  if (proyectoId && !alcanzaProyecto(estado, ctx, ctx.membresia.cliente_id, proyectoId)) return false
  if (!proyectoId && !perteneceACliente(ctx, ctx.membresia.cliente_id)) return false
  switch (clasificacion) {
    case 'general':
      return true
    case 'comercial_restringida':
      if (rol === 'socio_responsable') return true
      return permisoVigente(estado, ctx, 'comercial:ver', proyectoId)
    case 'tecnica_restringida':
      if (rol === 'consulta') return false // sin permiso posible: límite de rol (II.3.2)
      if (rol === 'lider_proyecto') return true
      return permisoVigente(estado, ctx, 'tecnico_restringido:ver', proyectoId)
    case 'interna_arseg':
      // Administración ya quedó excluida arriba; resta exigir un rol ARSEG de servicio.
      return PARTE_POR_ROL[rol] === 'arseg'
  }
}

/** Facultades de acción (capa 4). Cada acto además exige acceso al objeto (II.3.3). */
export type Accion =
  | 'responder_compromiso'
  | 'resolver_compromiso'
  | 'acusar_recepcion'
  | 'dar_conformidad'
  | 'publicar_entregable'
  | 'publicar_avance'
  | 'registrar_formalizacion_externa'
  | 'cambiar_fecha_hito'
  | 'comentar_acuerdo'
  | 'administrar_cuenta'
  | 'exportar_expediente'
  | 'formalizar_en_portal'

export function puedeActuar(estado: EstadoPortal, ctx: ContextoAcceso, accion: Accion, proyectoId?: string): boolean {
  const rol = ctx.membresia.rol
  if (!perteneceACliente(ctx, ctx.membresia.cliente_id)) return false
  const cliente = estado.clientes.find((c) => c.id === ctx.membresia.cliente_id)
  if (!cliente) return false
  // Suspensión: condición de acceso independiente (II.2.2) — bloquea toda acción.
  if (cliente.acceso_suspendido) return false
  if (proyectoId && !alcanzaProyecto(estado, ctx, ctx.membresia.cliente_id, proyectoId)) return false

  switch (accion) {
    case 'responder_compromiso':
      return rol === 'patrocinador' || rol === 'responsable_operativo' || rol === 'lider_proyecto'
    case 'resolver_compromiso':
      // Quien valida la resolución es la parte solicitante (5.4); se afina en rules.ts.
      return rol !== 'consulta' && rol !== 'administracion'
    case 'acusar_recepcion':
      return rol === 'patrocinador' || rol === 'responsable_operativo'
    case 'dar_conformidad':
      return (
        (rol === 'patrocinador' || rol === 'responsable_operativo') &&
        permisoVigente(estado, ctx, 'entregable:dar_conformidad', proyectoId)
      )
    case 'publicar_entregable':
    case 'publicar_avance':
      return rol === 'lider_proyecto' || rol === 'socio_responsable'
    case 'registrar_formalizacion_externa':
      return rol === 'socio_responsable'
    case 'cambiar_fecha_hito':
      return rol === 'lider_proyecto' || rol === 'socio_responsable'
    case 'comentar_acuerdo':
      return rol !== 'consulta' && rol !== 'administracion'
    case 'administrar_cuenta':
      return rol === 'administracion'
    case 'exportar_expediente':
      return rol !== 'administracion'
    case 'formalizar_en_portal':
      // INV-05 y DP-02: exige rol Patrocinador + autoridad comercial vigente + permiso.
      // En MVP el mecanismo NO está habilitado (formalización externa): siempre false.
      return false
  }
}

/** Razón legible de denegación sin revelar contenido ni existencia de objetos de otros clientes (PA-01). */
export function motivoDenegacion(): string {
  return 'No tienes acceso a este recurso.'
}
