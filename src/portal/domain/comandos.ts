// Comandos de dominio del Portal (SPEC v0.3, II.7).
// Cada comando valida autorización, estado, vigencia y versión, y devuelve el
// nuevo estado CON su evento de bitácora en la misma "transacción" (INV-12, 7.2):
// o se aplica todo, o no se aplica nada. Las funciones son puras; el store las
// persiste de forma atómica.

import type {
  AcuseEntregable,
  CierreProyecto,
  ComentarioAcuerdo,
  CompromisoCompartido,
  EntregableRevision,
  EstadoPortal,
  EventoBitacora,
  Formalizacion,
  Hito,
  Proyecto,
  PublicacionAvance,
  RespuestaCompromiso,
  ResolucionCompromiso,
  Clasificacion,
} from './types'
import { PARTE_POR_ROL } from './types'
import type { ContextoAcceso } from './authz'
import { motivoDenegacion, puedeActuar, puedeVerClasificacion } from './authz'

export type Resultado<T> = { ok: true; valor: T } | { ok: false; error: string }

export interface Transaccion {
  estado: EstadoPortal
  eventos: EventoBitacora[]
}

const err = (error: string): { ok: false; error: string } => ({ ok: false, error })
const ok = <T>(valor: T): { ok: true; valor: T } => ({ ok: true, valor })

/** Generador de identificadores; en la app es crypto.randomUUID, en tests es determinista. */
export type GenId = () => string

function evento(
  genId: GenId,
  ahora: string,
  ctx: ContextoAcceso,
  campos: Pick<EventoBitacora, 'cliente_id' | 'proyecto_id' | 'tipo_evento' | 'tipo_objeto' | 'objeto_id' | 'detalle_minimo' | 'clasificacion_evento'>,
): EventoBitacora {
  return {
    id: genId(),
    actor_tipo: 'persona',
    actor_id: ctx.membresia.id,
    ocurrido_en_servidor: ahora,
    ...campos,
  }
}

/**
 * Confirma una transacción: agrega los eventos a la bitácora (solo adición, 7.4).
 * `escribir` permite simular el fallo de escritura de bitácora: si lanza, el
 * comando entero falla y el estado previo queda intacto (PA-30).
 */
export function confirmar(
  tx: Transaccion,
  escribir: (eventos: EventoBitacora[]) => void = () => {},
): Resultado<EstadoPortal> {
  try {
    escribir(tx.eventos)
  } catch {
    return err('No fue posible registrar la operación. No se aplicó ningún cambio.')
  }
  return ok({ ...tx.estado, bitacora: [...tx.estado.bitacora, ...tx.eventos] })
}

/** Guardia común: el proyecto en modo histórico no admite cambios de contenido (INV-13, PA-35). */
function proyectoEditable(estado: EstadoPortal, proyectoId: string): Resultado<Proyecto> {
  const p = estado.proyectos.find((x) => x.id === proyectoId)
  if (!p) return err(motivoDenegacion())
  if (p.fase === 'cerrado') return err('El proyecto está cerrado: su expediente es de solo consulta.')
  return ok(p)
}

// ---------- Formalización externa e inicio de proyecto ----------

/**
 * Registra la formalización externa de un instrumento de alcance inicial y crea
 * el proyecto. Operación idempotente (INV-03, PA-12): si ya existe un proyecto
 * vinculado a la misma revisión de instrumento, devuelve ese proyecto sin duplicar.
 */
export function registrarFormalizacionInicial(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: {
    revision_instrumento_id: string
    firmante_segun_instrumento: string
    fecha_acto: string
    evidencia_ref: string
    validado_por: string
    proyecto: Pick<Proyecto, 'clave' | 'nombre' | 'modalidad' | 'lider_membresia_id' | 'inicio_comprometido' | 'fin_original'>
  },
): Resultado<Transaccion> {
  if (!puedeActuar(estado, ctx, 'registrar_formalizacion_externa')) return err(motivoDenegacion())
  const revision = estado.acuerdoRevisiones.find((r) => r.id === params.revision_instrumento_id)
  if (!revision || revision.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  const acuerdo = estado.acuerdos.find((a) => a.id === revision.acuerdo_id)
  if (!acuerdo || acuerdo.tipo !== 'alcance_inicial')
    return err('Solo un instrumento de alcance inicial habilita la creación de un proyecto (5.2).')
  if (revision.estado_editorial !== 'publicada')
    return err('No se formaliza una revisión retirada o superada (5.2).')

  // Idempotencia: mismo instrumento → mismo proyecto, sin efecto duplicado.
  const existente = estado.proyectos.find((p) => p.acuerdo_inicial_revision_id === revision.id)
  if (existente) return ok({ estado, eventos: [] })

  const formalizacion: Formalizacion = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    tipo_instrumento: 'alcance_inicial',
    revision_instrumento_id: revision.id,
    metodo: 'externa',
    firmante_segun_instrumento: params.firmante_segun_instrumento,
    fecha_acto: params.fecha_acto,
    registrado_en: ahora,
    registrado_por: ctx.membresia.id,
    validado_por: params.validado_por,
    evidencia_ref: params.evidencia_ref,
    hash_documento_objeto: revision.hash_documento,
  }
  const proyecto: Proyecto = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    acuerdo_inicial_revision_id: revision.id,
    formalizacion_inicial_id: formalizacion.id,
    fase: 'preparacion',
    fin_vigente: params.proyecto.fin_original,
    fecha_corte_publicada: ahora,
    actualizado_por: ctx.membresia.id,
    ...params.proyecto,
  }
  const nuevo: EstadoPortal = {
    ...estado,
    formalizaciones: [...estado.formalizaciones, formalizacion],
    proyectos: [...estado.proyectos, proyecto],
  }
  return ok({
    estado: nuevo,
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: ctx.membresia.cliente_id,
        proyecto_id: proyecto.id,
        tipo_evento: 'formalizacion_externa_registrada',
        tipo_objeto: 'formalizacion',
        objeto_id: formalizacion.id,
        detalle_minimo: `Instrumento ${acuerdo.clave} rev. ${revision.numero_revision}; firmante según instrumento distinto del registrador (PA-13).`,
        clasificacion_evento: 'comercial_restringida',
      }),
    ],
  })
}

// ---------- Compromisos compartidos (5.4) ----------

export function responderCompromiso(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { compromiso_id: string; texto: string; origen?: 'portal' | 'comunicacion_externa'; referencia_origen?: string },
): Resultado<Transaccion> {
  const c = estado.compromisos.find((x) => x.id === params.compromiso_id)
  if (!c || c.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'responder_compromiso', c.proyecto_id)) return err(motivoDenegacion())
  const editable = proyectoEditable(estado, c.proyecto_id)
  if (!editable.ok) return editable
  // Responde la parte responsable (RR-03): un rol ARSEG responde compromisos ARSEG y viceversa.
  if (PARTE_POR_ROL[ctx.membresia.rol] !== c.parte_responsable)
    return err('Este compromiso corresponde a la otra parte de la relación.')
  if (c.estado === 'resuelto' || c.estado === 'cancelado') return err('El compromiso ya no admite respuestas.')
  if (!params.texto.trim()) return err('La respuesta no puede estar vacía.')

  const respuesta: RespuestaCompromiso = {
    id: genId(),
    cliente_id: c.cliente_id,
    compromiso_id: c.id,
    autor_membresia_id: ctx.membresia.id,
    texto: params.texto,
    registrada_en: ahora,
    origen: params.origen ?? 'portal',
    referencia_origen: params.referencia_origen,
  }
  // Responder NO equivale a resolver (H15, PA-20): pasa a `respondido`.
  const compromisos = estado.compromisos.map((x) =>
    x.id === c.id ? { ...x, estado: 'respondido' as const } : x,
  )
  return ok({
    estado: { ...estado, compromisos, respuestasCompromiso: [...estado.respuestasCompromiso, respuesta] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: c.cliente_id,
        proyecto_id: c.proyecto_id,
        tipo_evento: 'compromiso_respondido',
        tipo_objeto: 'compromiso',
        objeto_id: c.id,
        detalle_minimo: 'Respuesta registrada; pendiente de validación de la parte solicitante.',
        clasificacion_evento: 'general',
      }),
    ],
  })
}

export function solicitarAclaracion(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { compromiso_id: string; motivo: string },
): Resultado<Transaccion> {
  const c = estado.compromisos.find((x) => x.id === params.compromiso_id)
  if (!c || c.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'resolver_compromiso', c.proyecto_id)) return err(motivoDenegacion())
  if (c.estado !== 'respondido') return err('Solo un compromiso respondido puede requerir aclaración.')
  if (c.solicitante_membresia_id !== ctx.membresia.id)
    return err('Solo la parte solicitante valida la respuesta (5.4).')
  const compromisos = estado.compromisos.map((x) =>
    x.id === c.id ? { ...x, estado: 'requiere_aclaracion' as const } : x,
  )
  return ok({
    estado: { ...estado, compromisos },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: c.cliente_id,
        proyecto_id: c.proyecto_id,
        tipo_evento: 'compromiso_requiere_aclaracion',
        tipo_objeto: 'compromiso',
        objeto_id: c.id,
        detalle_minimo: params.motivo,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

export function resolverCompromiso(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { compromiso_id: string; motivo: string },
): Resultado<Transaccion> {
  const c = estado.compromisos.find((x) => x.id === params.compromiso_id)
  if (!c || c.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'resolver_compromiso', c.proyecto_id)) return err(motivoDenegacion())
  if (c.estado !== 'respondido') return err('Un compromiso se resuelve después de ser respondido (5.4).')
  // Quien valida la resolución es la parte solicitante a través de su contacto designado (5.4).
  if (c.solicitante_membresia_id !== ctx.membresia.id)
    return err('Solo la parte solicitante valida la resolución del compromiso (5.4).')

  const resolucion: ResolucionCompromiso = {
    id: genId(),
    cliente_id: c.cliente_id,
    compromiso_id: c.id,
    resultado: 'resuelto',
    motivo: params.motivo,
    validada_por: ctx.membresia.id,
    validada_en: ahora,
  }
  const compromisos = estado.compromisos.map((x) => (x.id === c.id ? { ...x, estado: 'resuelto' as const } : x))
  return ok({
    estado: { ...estado, compromisos, resolucionesCompromiso: [...estado.resolucionesCompromiso, resolucion] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: c.cliente_id,
        proyecto_id: c.proyecto_id,
        tipo_evento: 'compromiso_resuelto',
        tipo_objeto: 'compromiso',
        objeto_id: c.id,
        detalle_minimo: params.motivo,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

/** «Vencido» es una condición calculada frente a la fecha vigente, no un estado (5.4). */
export function compromisoVencido(c: CompromisoCompartido, ahora: string): boolean {
  return (c.estado === 'abierto' || c.estado === 'requiere_aclaracion') && c.fecha_vigente < ahora
}

// ---------- Fechas comprometidas (PA-21) ----------

export function cambiarFechaHito(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { hito_id: string; fecha_nueva: string; motivo: string },
): Resultado<Transaccion> {
  const h = estado.hitos.find((x) => x.id === params.hito_id)
  if (!h || h.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'cambiar_fecha_hito', h.proyecto_id)) return err(motivoDenegacion())
  const editable = proyectoEditable(estado, h.proyecto_id)
  if (!editable.ok) return editable
  if (!params.motivo.trim()) return err('El cambio de una fecha comprometida requiere motivo (H06).')

  // La fecha original nunca se sobrescribe (RR-06, INV-11): se agrega el cambio.
  const cambio = {
    fecha_anterior: h.fecha_vigente,
    fecha_nueva: params.fecha_nueva,
    motivo: params.motivo,
    autorizado_por: ctx.membresia.id,
    registrado_en: ahora,
  }
  const hitos = estado.hitos.map((x): Hito =>
    x.id === h.id ? { ...x, fecha_vigente: params.fecha_nueva, cambios_fecha: [...x.cambios_fecha, cambio] } : x,
  )
  return ok({
    estado: { ...estado, hitos },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: h.cliente_id,
        proyecto_id: h.proyecto_id,
        tipo_evento: 'fecha_hito_modificada',
        tipo_objeto: 'hito',
        objeto_id: h.id,
        detalle_minimo: `De ${cambio.fecha_anterior} a ${cambio.fecha_nueva}: ${params.motivo}`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

// ---------- Entregables: publicación, acuse y conformidad (5.5) ----------

/**
 * Publica una nueva revisión de un entregable. La revisión anterior pasa a
 * `superada` conservando bytes, hash y acuses (INV-02, PA-10/PA-11). No existe
 * comando para reemplazar el archivo de una revisión publicada.
 */
export function publicarRevisionEntregable(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: {
    entregable_id: string
    archivo_id: string
    proposito: 'informativo' | 'para_revision'
    clasificacion: Clasificacion
  },
): Resultado<Transaccion> {
  const e = estado.entregables.find((x) => x.id === params.entregable_id)
  if (!e || e.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'publicar_entregable', e.proyecto_id)) return err(motivoDenegacion())
  const editable = proyectoEditable(estado, e.proyecto_id)
  if (!editable.ok) return editable
  const archivo = estado.archivos.find((a) => a.id === params.archivo_id)
  if (!archivo || archivo.cliente_id !== e.cliente_id) return err(motivoDenegacion())
  // PA-09: sin clasificación no hay publicación; archivo en cuarentena no se publica.
  if (archivo.estado_seguridad !== 'permitido')
    return err('El archivo no ha superado la revisión de seguridad (cuarentena, 8.5).')
  if (params.clasificacion === 'interna_arseg')
    return err('La información interna ARSEG no se publica al cliente (II.4.1).')

  const previas = estado.entregableRevisiones.filter((r) => r.entregable_id === e.id)
  const vigenteAnterior = previas.find((r) => r.estado_editorial === 'publicado')
  const numero = previas.length === 0 ? 1 : Math.max(...previas.map((r) => r.numero_revision)) + 1

  const nueva: EntregableRevision = {
    id: genId(),
    cliente_id: e.cliente_id,
    entregable_id: e.id,
    numero_revision: numero,
    estado_editorial: 'publicado',
    proposito: params.proposito,
    clasificacion: params.clasificacion,
    archivo_id: archivo.id,
    hash_archivo: archivo.hash_sha256,
    mime: archivo.mime_validado,
    bytes: archivo.bytes,
    autor_id: ctx.membresia.id,
    publicado_por: ctx.membresia.id,
    publicado_en: ahora,
    revision_anterior_id: vigenteAnterior?.id,
  }
  const revisiones = estado.entregableRevisiones
    .map((r): EntregableRevision => (r.id === vigenteAnterior?.id ? { ...r, estado_editorial: 'superado' } : r))
    .concat(nueva)
  return ok({
    estado: { ...estado, entregableRevisiones: revisiones },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: e.cliente_id,
        proyecto_id: e.proyecto_id,
        tipo_evento: 'entregable_publicado',
        tipo_objeto: 'entregable_revision',
        objeto_id: nueva.id,
        detalle_minimo: `Revisión ${numero} publicada; la anterior queda histórica.`,
        clasificacion_evento: params.clasificacion,
      }),
    ],
  })
}

/**
 * Acuse de recepción o conformidad: actos distintos con requisitos distintos
 * (H22, PA-19). Idempotente: repetir el mismo acto por el mismo actor no duplica.
 */
export function registrarAcuse(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { entregable_revision_id: string; tipo: 'recepcion' | 'conformidad'; observaciones?: string },
): Resultado<Transaccion> {
  const rev = estado.entregableRevisiones.find((r) => r.id === params.entregable_revision_id)
  if (!rev || rev.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  const entregable = estado.entregables.find((x) => x.id === rev.entregable_id)
  if (!entregable) return err(motivoDenegacion())
  const accion = params.tipo === 'conformidad' ? 'dar_conformidad' : 'acusar_recepcion'
  if (!puedeActuar(estado, ctx, accion, entregable.proyecto_id)) return err(motivoDenegacion())
  const editable = proyectoEditable(estado, entregable.proyecto_id)
  if (!editable.ok) return editable
  if (!puedeVerClasificacion(estado, ctx, rev.clasificacion, entregable.proyecto_id))
    return err(motivoDenegacion()) // II.3.3: no se actúa sobre lo que no se puede consultar
  if (rev.estado_editorial !== 'publicado' && rev.estado_editorial !== 'superado')
    return err('La revisión no está disponible para este acto.')
  if (params.tipo === 'conformidad' && !entregable.criterio_conformidad)
    return err('Este entregable no tiene criterio de conformidad acordado (5.5).')

  const existente = estado.acuses.find(
    (a) => a.entregable_revision_id === rev.id && a.actor_membresia_id === ctx.membresia.id && a.tipo === params.tipo,
  )
  if (existente) return ok({ estado, eventos: [] })

  const acuse: AcuseEntregable = {
    id: genId(),
    cliente_id: rev.cliente_id,
    entregable_revision_id: rev.id,
    tipo: params.tipo,
    actor_membresia_id: ctx.membresia.id,
    resultado: params.tipo === 'recepcion' ? 'recibido' : params.observaciones ? 'con_observaciones' : 'conforme',
    observaciones: params.observaciones,
    registrado_en: ahora,
  }
  return ok({
    estado: { ...estado, acuses: [...estado.acuses, acuse] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: rev.cliente_id,
        proyecto_id: entregable.proyecto_id,
        tipo_evento: params.tipo === 'recepcion' ? 'acuse_recepcion' : 'conformidad_registrada',
        tipo_objeto: 'entregable_revision',
        objeto_id: rev.id,
        detalle_minimo:
          params.tipo === 'recepcion'
            ? 'Acuse de recepción; no implica conformidad ni aceptación (INV-08).'
            : 'Conformidad contra el criterio acordado.',
        clasificacion_evento: rev.clasificacion,
      }),
    ],
  })
}

// ---------- Avances, comentarios y cierre ----------

export function publicarAvance(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { proyecto_id: string; texto: string; fecha_corte: string; sistema_origen?: string; id_origen?: string },
): Resultado<Transaccion> {
  if (!puedeActuar(estado, ctx, 'publicar_avance', params.proyecto_id)) return err(motivoDenegacion())
  const editable = proyectoEditable(estado, params.proyecto_id)
  if (!editable.ok) return editable
  const pub: PublicacionAvance = {
    id: genId(),
    cliente_id: ctx.membresia.cliente_id,
    proyecto_id: params.proyecto_id,
    fecha_corte: params.fecha_corte,
    texto_publicado: params.texto,
    autor_membresia_id: ctx.membresia.id,
    publicado_en: ahora,
    sistema_origen: params.sistema_origen ?? 'portal',
    id_origen: params.id_origen ?? '',
  }
  const proyectos = estado.proyectos.map((p) =>
    p.id === params.proyecto_id ? { ...p, fecha_corte_publicada: params.fecha_corte, actualizado_por: ctx.membresia.id } : p,
  )
  return ok({
    estado: { ...estado, proyectos, publicacionesAvance: [...estado.publicacionesAvance, pub] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: pub.cliente_id,
        proyecto_id: pub.proyecto_id,
        tipo_evento: 'avance_publicado',
        tipo_objeto: 'publicacion_avance',
        objeto_id: pub.id,
        detalle_minimo: `Corte al ${params.fecha_corte}.`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

export function comentarAcuerdo(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { acuerdo_revision_id: string; seccion_id: string; texto: string },
): Resultado<Transaccion> {
  const rev = estado.acuerdoRevisiones.find((r) => r.id === params.acuerdo_revision_id)
  if (!rev || rev.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  if (!puedeActuar(estado, ctx, 'comentar_acuerdo')) return err(motivoDenegacion())
  if (!puedeVerClasificacion(estado, ctx, rev.clasificacion)) return err(motivoDenegacion())
  const seccion = estado.seccionesAcuerdo.find((s) => s.id === params.seccion_id && s.acuerdo_revision_id === rev.id)
  if (!seccion) return err('El comentario debe anclarse a una sección del índice de esta revisión (5.2).')
  if (!params.texto.trim()) return err('El comentario no puede estar vacío.')
  const comentario: ComentarioAcuerdo = {
    id: genId(),
    cliente_id: rev.cliente_id,
    acuerdo_revision_id: rev.id,
    seccion_id: seccion.id,
    autor_membresia_id: ctx.membresia.id,
    texto: params.texto,
    creado_en: ahora,
    estado: 'abierto',
  }
  return ok({
    estado: { ...estado, comentariosAcuerdo: [...estado.comentariosAcuerdo, comentario] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: rev.cliente_id,
        tipo_evento: 'comentario_acuerdo',
        tipo_objeto: 'acuerdo_revision',
        objeto_id: rev.id,
        detalle_minimo: `Comentario en sección «${seccion.titulo}» de la revisión ${rev.numero_revision}.`,
        clasificacion_evento: rev.clasificacion,
      }),
    ],
  })
}

/**
 * Cierra un proyecto (5.7): exige que no queden compromisos sin resolver o sin
 * tratamiento documentado. El cierre de un proyecto no vuelve históricos los
 * demás del cliente (PA-33) ni cambia el estado de cuenta.
 */
export function cerrarProyecto(
  estado: EstadoPortal,
  ctx: ContextoAcceso,
  genId: GenId,
  ahora: string,
  params: { proyecto_id: string; consulta_historica_hasta: string; evidencia_conformidad_ref: string; pendientes_transferidos_ref: string },
): Resultado<Transaccion> {
  if (ctx.membresia.rol !== 'socio_responsable') return err(motivoDenegacion())
  const editable = proyectoEditable(estado, params.proyecto_id)
  if (!editable.ok) return editable
  const p = editable.valor
  if (p.cliente_id !== ctx.membresia.cliente_id) return err(motivoDenegacion())
  const abiertos = estado.compromisos.filter(
    (c) => c.proyecto_id === p.id && c.estado !== 'resuelto' && c.estado !== 'cancelado',
  )
  if (abiertos.length > 0)
    return err(`Hay ${abiertos.length} compromiso(s) sin resolver: se resuelven o se documenta su tratamiento antes del cierre (5.7).`)

  const cierre: CierreProyecto = {
    id: genId(),
    cliente_id: p.cliente_id,
    proyecto_id: p.id,
    fecha_cierre: ahora,
    evidencia_conformidad_ref: params.evidencia_conformidad_ref,
    pendientes_transferidos_ref: params.pendientes_transferidos_ref,
    consulta_historica_hasta: params.consulta_historica_hasta,
  }
  const proyectos = estado.proyectos.map((x): Proyecto =>
    x.id === p.id
      ? { ...x, fase: 'cerrado', fin_real: ahora, consulta_historica_hasta: params.consulta_historica_hasta }
      : x,
  )
  return ok({
    estado: { ...estado, proyectos, cierres: [...estado.cierres, cierre] },
    eventos: [
      evento(genId, ahora, ctx, {
        cliente_id: p.cliente_id,
        proyecto_id: p.id,
        tipo_evento: 'proyecto_cerrado',
        tipo_objeto: 'proyecto',
        objeto_id: p.id,
        detalle_minimo: `Consulta histórica hasta ${params.consulta_historica_hasta}.`,
        clasificacion_evento: 'general',
      }),
    ],
  })
}

/** Consulta histórica vigente de un proyecto cerrado (PA-34). */
export function consultaHistoricaVigente(p: Proyecto, ahora: string): boolean {
  if (p.fase !== 'cerrado') return true
  return !!p.consulta_historica_hasta && p.consulta_historica_hasta >= ahora
}
