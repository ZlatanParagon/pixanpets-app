// Comandos de gestión ARSEG: el flujo de origen de la relación (SPEC v0.3, 2.4
// y 5.2) y la operación del líder de proyecto. En producción esto vive en la
// «herramienta ARSEG de publicación acotada» (8.1), que pasa por las MISMAS
// reglas de dominio que la interfaz — por eso los comandos están aquí y no en
// la UI.
//
// Flujo que estos comandos materializan:
//   1. Se firma con un nuevo cliente FUERA del portal.
//   2. El socio responsable da de alta la cuenta con evidencia (altaCliente).
//   3. Se asigna al PM y a los contactos (asignarMembresia).
//   4. Se registra el acuerdo de alcance (registrarAcuerdoInicial) y su
//      formalización externa — comandos.registrarFormalizacionInicial crea
//      el proyecto (INV-03).
//   5. El PM mapea los hitos publicables y los compromisos recíprocos
//      (crearHito, crearCompromiso) y les da seguimiento (actualizarHito).
//   6. Con al menos un servicio formalizado, la cuenta pasa a activa
//      (activarCuenta).
//
// Nota de alcance: los hitos y compromisos del portal son los PUBLICADOS al
// cliente. Las tareas internas del equipo ARSEG siguen excluidas (1.3).

import type {
  AsignacionProyecto,
  Cliente,
  CompromisoCompartido,
  Contacto,
  EstadoPortal,
  EventoBitacora,
  Hito,
  Membresia,
  Rol,
  Usuario,
} from './types'
import { PARTE_POR_ROL } from './types'
import type { ContextoAcceso } from './authz'
import { alcanzaProyecto, motivoDenegacion, perteneceACliente } from './authz'
import type { GenId, Resultado, Transaccion } from './comandos'

const err = (error: string): { ok: false; error: string } => ({ ok: false, error })
const ok = <T>(valor: T): { ok: true; valor: T } => ({ ok: true, valor })

function eventoDe(
  genId: GenId,
  ahora: string,
  actorId: string,
  campos: Pick<EventoBitacora, 'cliente_id' | 'proyecto_id' | 'tipo_evento' | 'tipo_objeto' | 'objeto_id' | 'detalle_minimo' | 'clasificacion_evento'>,
): EventoBitacora {
  return { id: genId(), actor_tipo: 'persona', actor_id: actorId, ocurrido_en_servidor: ahora, ...campos }
}

/** ¿La persona actúa como socio responsable de ARSEG en alguna cuenta? (guardia del prototipo). */
function esSocioArseg(estado: EstadoPortal, usuarioId: string): boolean {
  return estado.membresias.some((m) => m.usuario_id === usuarioId && m.activa && m.rol === 'socio_responsable')
}

// ---------- 1) Alta de cuenta de cliente (2.4) ----------

/**
 * El socio responsable documenta la relación comercial formalizada y autoriza
 * el alta. La cuenta nace en `incorporacion`; pasa a `activa` con
 * `activarCuenta` cuando existe al menos un servicio formalizado. Un NDA
 * aislado con un prospecto no habilita el portal como CRM (2.4): la evidencia
 * de relación es obligatoria.
 */
export function altaCliente(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { razon_social: string; nombre_visible: string; sector: string; evidencia_relacion_ref: string },
): Resultado<Transaccion> {
  if (ctx.membresia.rol !== 'socio_responsable' || !esSocioArseg(estado, ctx.usuario_id)) return err(motivoDenegacion())
  if (!params.razon_social.trim() || !params.nombre_visible.trim()) return err('Razón social y nombre visible son obligatorios.')
  if (!params.evidencia_relacion_ref.trim())
    return err('El alta exige evidencia de una relación comercial formalizada (2.4); un prospecto o un NDA aislado no habilitan el portal.')
  if (estado.clientes.some((c) => c.razon_social.trim().toLowerCase() === params.razon_social.trim().toLowerCase()))
    return err('Ya existe una cuenta con esa razón social.')

  const clienteId = genId()
  const membresiaSocio: Membresia = {
    id: genId(),
    cliente_id: clienteId,
    usuario_id: ctx.usuario_id,
    rol: 'socio_responsable',
    activa: true,
    alcance: 'cuenta',
    vigente_desde: ahora,
  }
  const cliente: Cliente = {
    id: clienteId,
    razon_social: params.razon_social.trim(),
    nombre_visible: params.nombre_visible.trim(),
    sector: params.sector.trim(),
    estado_cuenta: 'incorporacion',
    acceso_suspendido: false,
    zona_horaria: 'America/Mexico_City',
    socio_responsable_id: membresiaSocio.id,
    evidencia_relacion_ref: params.evidencia_relacion_ref.trim(),
    creado_en: ahora,
  }
  return ok({
    estado: { ...estado, clientes: [...estado.clientes, cliente], membresias: [...estado.membresias, membresiaSocio] },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: clienteId,
        tipo_evento: 'cuenta_creada',
        tipo_objeto: 'cliente',
        objeto_id: clienteId,
        detalle_minimo: `Alta autorizada por el socio responsable con evidencia ${params.evidencia_relacion_ref.trim()}.`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

/** La cuenta pasa a activa solo cuando existe al menos un servicio formalizado (2.4). */
export function activarCuenta(estado: EstadoPortal, ctx: ContextoAcceso, genId: GenId, ahora: string): Resultado<Transaccion> {
  if (ctx.membresia.rol !== 'socio_responsable' || !perteneceACliente(ctx, ctx.membresia.cliente_id)) return err(motivoDenegacion())
  const cliente = estado.clientes.find((c) => c.id === ctx.membresia.cliente_id)
  if (!cliente) return err(motivoDenegacion())
  if (cliente.estado_cuenta !== 'incorporacion') return err('La cuenta no está en incorporación.')
  if (!estado.proyectos.some((p) => p.cliente_id === cliente.id))
    return err('La cuenta se activa cuando existe al menos un servicio formalizado con su proyecto (2.4).')
  const clientes = estado.clientes.map((c): Cliente => (c.id === cliente.id ? { ...c, estado_cuenta: 'activa' } : c))
  return ok({
    estado: { ...estado, clientes },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: cliente.id,
        tipo_evento: 'cuenta_activada',
        tipo_objeto: 'cliente',
        objeto_id: cliente.id,
        detalle_minimo: 'Incorporación completada; la cuenta pasa a activa.',
        clasificacion_evento: 'general',
      }),
    ],
  })
}

// ---------- 2) Equipo y usuarios (3.4) ----------

/**
 * Crea (o reutiliza por correo) un usuario y le asigna una membresía en la
 * cuenta activa. En producción esto es una invitación nominativa, de un solo
 * uso y con caducidad, más MFA en el proveedor de identidad (3.4); el
 * prototipo la da por aceptada al instante.
 * El socio asigna; Administración ejecuta altas aprobadas (3.4).
 */
export function asignarMembresia(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { nombre: string; correo: string; rol: Rol; alcance: 'cuenta' | 'proyectos_asignados'; proyecto_id?: string; cargo?: string },
): Resultado<Transaccion> {
  if (ctx.membresia.rol !== 'socio_responsable' && ctx.membresia.rol !== 'administracion') return err(motivoDenegacion())
  if (!perteneceACliente(ctx, ctx.membresia.cliente_id)) return err(motivoDenegacion())
  const correo = params.correo.trim().toLowerCase()
  if (!params.nombre.trim() || !correo.includes('@')) return err('Nombre y correo válidos son obligatorios: la invitación es nominativa (3.4).')
  if (params.alcance === 'proyectos_asignados' && !params.proyecto_id)
    return err('El alcance por proyectos requiere elegir al menos un proyecto.')
  if (params.proyecto_id && !estado.proyectos.some((p) => p.id === params.proyecto_id && p.cliente_id === ctx.membresia.cliente_id))
    return err(motivoDenegacion())

  const existente = estado.usuarios.find((u) => u.correo.toLowerCase() === correo)
  const usuario: Usuario = existente ?? { id: genId(), nombre: params.nombre.trim(), correo, activo: true }
  if (estado.membresias.some((m) => m.usuario_id === usuario.id && m.cliente_id === ctx.membresia.cliente_id && m.activa))
    return err('Esa persona ya tiene una membresía activa en esta cuenta.')

  const membresia: Membresia = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    usuario_id: usuario.id,
    rol: params.rol,
    activa: true,
    alcance: params.alcance,
    vigente_desde: ahora,
  }
  const asignaciones: AsignacionProyecto[] =
    params.alcance === 'proyectos_asignados' && params.proyecto_id
      ? [{ id: genId(), cliente_id: ctx.membresia.cliente_id, membresia_id: membresia.id, proyecto_id: params.proyecto_id }]
      : []
  // Toda persona que puede ser responsable de un compromiso (de cualquiera de
  // las dos partes) existe también como contacto de la relación; Administración no.
  const contactos: Contacto[] =
    params.rol !== 'administracion'
      ? [{ id: genId(), cliente_id: ctx.membresia.cliente_id, nombre: usuario.nombre, correo: usuario.correo, cargo: params.cargo?.trim() || (PARTE_POR_ROL[params.rol] === 'arseg' ? 'Responsable ARSEG' : 'Contacto designado'), activo: true, usuario_id: usuario.id }]
      : []

  return ok({
    estado: {
      ...estado,
      usuarios: existente ? estado.usuarios : [...estado.usuarios, usuario],
      membresias: [...estado.membresias, membresia],
      asignaciones: [...estado.asignaciones, ...asignaciones],
      contactos: [...estado.contactos, ...contactos],
    },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: ctx.membresia.cliente_id,
        tipo_evento: 'membresia_asignada',
        tipo_objeto: 'membresia',
        objeto_id: membresia.id,
        detalle_minimo: `Rol ${params.rol} asignado a ${usuario.nombre} (invitación nominativa).`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

// ---------- 3) Acuerdo de alcance (5.2) ----------

/**
 * Registra un acuerdo con su primera revisión publicada. En el prototipo el
 * archivo es una referencia con hash generado; en producción el documento pasa
 * por cuarentena y su hash real se calcula al publicar (8.5).
 */
export function registrarAcuerdoInicial(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { clave: string; titulo: string; tipo: 'alcance_inicial' | 'confidencialidad'; resumen: string },
): Resultado<Transaccion> {
  if (ctx.membresia.rol !== 'socio_responsable' || !perteneceACliente(ctx, ctx.membresia.cliente_id)) return err(motivoDenegacion())
  if (!params.clave.trim() || !params.titulo.trim()) return err('Clave y título son obligatorios.')
  if (estado.acuerdos.some((a) => a.cliente_id === ctx.membresia.cliente_id && a.clave === params.clave.trim()))
    return err('Ya existe un acuerdo con esa clave en esta cuenta.')

  const clienteId = ctx.membresia.cliente_id
  const clasificacion = params.tipo === 'alcance_inicial' ? ('comercial_restringida' as const) : ('general' as const)
  const acuerdoId = genId()
  const archivoId = genId()
  const hash = `sim-${archivoId.slice(0, 8)}`
  const revisionId = genId()
  return ok({
    estado: {
      ...estado,
      acuerdos: [...estado.acuerdos, { id: acuerdoId, cliente_id: clienteId, clave: params.clave.trim(), tipo: params.tipo }],
      archivos: [
        ...estado.archivos,
        { id: archivoId, cliente_id: clienteId, nombre_visible: `${params.clave.trim()}-r1.pdf`, mime_validado: 'application/pdf', bytes: 0, hash_sha256: hash, estado_seguridad: 'permitido', clasificacion, creado_por: ctx.membresia.id, creado_en: ahora },
      ],
      acuerdoRevisiones: [
        ...estado.acuerdoRevisiones,
        { id: revisionId, cliente_id: clienteId, acuerdo_id: acuerdoId, numero_revision: 1, titulo: params.titulo.trim(), estado_editorial: 'publicada', archivo_id: archivoId, hash_documento: hash, publicado_en: ahora, publicado_por: ctx.membresia.id, resumen_cambios: params.resumen.trim() || 'Versión inicial.', clasificacion },
      ],
    },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: clienteId,
        tipo_evento: 'acuerdo_publicado',
        tipo_objeto: 'acuerdo_revision',
        objeto_id: revisionId,
        detalle_minimo: `${params.clave.trim()} rev. 1 publicada.`,
        clasificacion_evento: clasificacion,
      }),
    ],
  })
}

// ---------- 4) Hitos y compromisos del PM (5.4) ----------

function proyectoGestionable(estado: EstadoPortal, ctx: ContextoAcceso, proyectoId: string): Resultado<true> {
  if (ctx.membresia.rol !== 'lider_proyecto' && ctx.membresia.rol !== 'socio_responsable') return err(motivoDenegacion())
  if (!alcanzaProyecto(estado, ctx, ctx.membresia.cliente_id, proyectoId)) return err(motivoDenegacion())
  const p = estado.proyectos.find((x) => x.id === proyectoId)
  if (!p) return err(motivoDenegacion())
  if (p.fase === 'cerrado') return err('El proyecto está cerrado: su expediente es de solo consulta.')
  return ok(true)
}

export function crearHito(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { proyecto_id: string; clave: string; nombre: string; fecha: string; criterio_terminacion: string },
): Resultado<Transaccion> {
  const g = proyectoGestionable(estado, ctx, params.proyecto_id)
  if (!g.ok) return g
  if (!params.clave.trim() || !params.nombre.trim() || !params.fecha) return err('Clave, nombre y fecha comprometida son obligatorios.')
  if (!params.criterio_terminacion.trim()) return err('Cada hito publica su criterio de terminación (5.4).')
  if (estado.hitos.some((h) => h.proyecto_id === params.proyecto_id && h.clave === params.clave.trim()))
    return err('Ya existe un hito con esa clave en el proyecto.')
  const hito: Hito = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    proyecto_id: params.proyecto_id,
    clave: params.clave.trim(),
    nombre: params.nombre.trim(),
    fecha_original: params.fecha,
    fecha_vigente: params.fecha,
    estado: 'pendiente',
    criterio_terminacion: params.criterio_terminacion.trim(),
    cambios_fecha: [],
  }
  return ok({
    estado: { ...estado, hitos: [...estado.hitos, hito] },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: hito.cliente_id,
        proyecto_id: hito.proyecto_id,
        tipo_evento: 'hito_creado',
        tipo_objeto: 'hito',
        objeto_id: hito.id,
        detalle_minimo: `${hito.clave} — ${hito.nombre}, comprometido para ${hito.fecha_original}.`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

/** Avanza el estado de un hito. Cumplir exige evidencia identificable (RR-04). */
export function actualizarHito(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { hito_id: string; estado: 'en_curso' | 'cumplido'; evidencia_ref?: string },
): Resultado<Transaccion> {
  const h = estado.hitos.find((x) => x.id === params.hito_id)
  if (!h || h.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  const g = proyectoGestionable(estado, ctx, h.proyecto_id)
  if (!g.ok) return g
  if (h.estado === 'cumplido') return err('El hito ya está cumplido; la historia no se reescribe (RR-06).')
  if (params.estado === 'cumplido' && !params.evidencia_ref?.trim())
    return err('Cumplir un hito exige evidencia de cumplimiento (RR-04): referencia de minuta, entregable o constancia.')
  const hitos = estado.hitos.map((x): Hito =>
    x.id === h.id ? { ...x, estado: params.estado, evidencia_ref: params.evidencia_ref?.trim() || x.evidencia_ref } : x,
  )
  return ok({
    estado: { ...estado, hitos },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: h.cliente_id,
        proyecto_id: h.proyecto_id,
        tipo_evento: params.estado === 'cumplido' ? 'hito_cumplido' : 'hito_en_curso',
        tipo_objeto: 'hito',
        objeto_id: h.id,
        detalle_minimo: params.estado === 'cumplido' ? `${h.clave} cumplido; evidencia ${params.evidencia_ref?.trim()}.` : `${h.clave} en curso.`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

/** Crea un compromiso compartido; cualquiera de las partes puede solicitar (RR-03). */
export function crearCompromiso(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: {
    proyecto_id: string
    tipo: CompromisoCompartido['tipo']
    descripcion: string
    parte_responsable: 'cliente' | 'arseg'
    contacto_responsable_id: string
    fecha: string
    criterio_resolucion: string
    impacto_previsto: string
    hito_afectado_id?: string
  },
): Resultado<Transaccion> {
  if (ctx.membresia.rol === 'consulta' || ctx.membresia.rol === 'administracion') return err(motivoDenegacion())
  if (!alcanzaProyecto(estado, ctx, ctx.membresia.cliente_id, params.proyecto_id)) return err(motivoDenegacion())
  const p = estado.proyectos.find((x) => x.id === params.proyecto_id)
  if (!p || p.fase === 'cerrado') return err('El proyecto no admite nuevos compromisos.')
  if (!params.descripcion.trim() || !params.fecha || !params.criterio_resolucion.trim())
    return err('Descripción inequívoca, fecha de respuesta y criterio de resolución son obligatorios (5.4).')
  const contacto = estado.contactos.find((c) => c.id === params.contacto_responsable_id && c.cliente_id === ctx.membresia.cliente_id)
  if (!contacto) return err('El compromiso requiere una persona responsable designada.')

  const compromiso: CompromisoCompartido = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    proyecto_id: params.proyecto_id,
    tipo: params.tipo,
    descripcion: params.descripcion.trim(),
    parte_responsable: params.parte_responsable,
    contacto_responsable_id: contacto.id,
    solicitante_membresia_id: ctx.membresia.id,
    solicitada_en: ahora,
    fecha_original: params.fecha,
    fecha_vigente: params.fecha,
    cambios_fecha: [],
    criterio_resolucion: params.criterio_resolucion.trim(),
    hito_afectado_id: params.hito_afectado_id,
    impacto_previsto: params.impacto_previsto.trim(),
    estado: 'abierto',
  }
  return ok({
    estado: { ...estado, compromisos: [...estado.compromisos, compromiso] },
    eventos: [
      eventoDe(genId, ahora, ctx.usuario_id, {
        cliente_id: compromiso.cliente_id,
        proyecto_id: compromiso.proyecto_id,
        tipo_evento: 'compromiso_creado',
        tipo_objeto: 'compromiso',
        objeto_id: compromiso.id,
        detalle_minimo: `Solicitud a ${params.parte_responsable === 'cliente' ? 'cliente' : 'ARSEG'}: ${compromiso.descripcion.slice(0, 80)}`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}
