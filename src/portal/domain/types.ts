// ARSEG Cyber — Portal de Cliente
// Modelo conceptual de datos (SPEC v0.3, sección II.6), subconjunto MVP.
// Convención obligatoria (6.1): toda entidad de contenido lleva `cliente_id`.
// Este módulo es TypeScript puro: sin React, sin I/O.

// ---------- Roles, permisos y clasificación ----------

export type Rol =
  | 'patrocinador'
  | 'responsable_operativo'
  | 'consulta'
  | 'socio_responsable'
  | 'lider_proyecto'
  | 'administracion'

/** Parte de la relación a la que sirve cada rol (II.3.2). */
export const PARTE_POR_ROL: Record<Rol, 'cliente' | 'arseg'> = {
  patrocinador: 'cliente',
  responsable_operativo: 'cliente',
  consulta: 'cliente',
  socio_responsable: 'arseg',
  lider_proyecto: 'arseg',
  administracion: 'arseg',
}

/** Permisos separados del rol (II.3.3). */
export type CodigoPermiso =
  | 'comercial:ver'
  | 'tecnico_restringido:ver'
  | 'entregable:dar_conformidad'
  | 'riesgo:aceptar'
  | 'comercial:formalizar'

/** Clasificación mínima de información (II.4.1). */
export type Clasificacion =
  | 'general'
  | 'comercial_restringida'
  | 'tecnica_restringida'
  | 'interna_arseg'

// ---------- Identidad y autorización (6.2) ----------

export type EstadoCuenta = 'incorporacion' | 'activa' | 'historica' | 'acceso_cerrado'

export interface Cliente {
  id: string
  razon_social: string
  nombre_visible: string
  sector: string
  estado_cuenta: EstadoCuenta
  /** `suspendida` es condición de acceso independiente y temporal (II.2.2). */
  acceso_suspendido: boolean
  motivo_suspension?: string
  zona_horaria: string
  socio_responsable_id: string
  /** Evidencia de la relación comercial formalizada que habilita el alta (2.4). */
  evidencia_relacion_ref?: string
  creado_en: string
}

export interface Usuario {
  id: string
  nombre: string
  correo: string
  /** La autenticación y MFA viven en el proveedor de identidad (8.3); aquí solo se modela. */
  activo: boolean
}

export interface Contacto {
  id: string
  cliente_id: string
  nombre: string
  correo: string
  cargo: string
  activo: boolean
  usuario_id?: string
}

export interface Membresia {
  id: string
  cliente_id: string
  usuario_id: string
  rol: Rol
  activa: boolean
  /** 'cuenta' = todos los proyectos del cliente; 'proyectos_asignados' exige AsignacionProyecto. */
  alcance: 'cuenta' | 'proyectos_asignados'
  vigente_desde: string
  vigente_hasta?: string
}

export interface AsignacionProyecto {
  id: string
  cliente_id: string
  membresia_id: string
  proyecto_id: string
}

export interface PermisoAdicional {
  id: string
  cliente_id: string
  membresia_id: string
  codigo_permiso: CodigoPermiso
  proyecto_id?: string
  aprobado_por: string
  vigente_desde: string
  vigente_hasta?: string
  revocado_en?: string
}

/** La autoridad comercial es distinta del rol (H08, II.3.1). */
export interface AutoridadComercial {
  id: string
  cliente_id: string
  membresia_id: string
  tipos_acto: string[]
  limite_monto?: number
  moneda?: string
  evidencia_facultades_ref: string
  vigente_desde: string
  vigente_hasta?: string
  validada_por: string
  revocada_en?: string
}

// ---------- Relación contractual y servicio (6.3) ----------

export type TipoAcuerdo = 'confidencialidad' | 'marco' | 'alcance_inicial' | 'modificacion'

export interface Acuerdo {
  id: string
  cliente_id: string
  clave: string
  tipo: TipoAcuerdo
  proyecto_destino_id?: string
  acuerdo_base_id?: string
}

export type EstadoEditorialRevision = 'publicada' | 'superada' | 'retirada'

export interface AcuerdoRevision {
  id: string
  cliente_id: string
  acuerdo_id: string
  numero_revision: number
  titulo: string
  estado_editorial: EstadoEditorialRevision
  archivo_id: string
  hash_documento: string
  publicado_en: string
  publicado_por: string
  resumen_cambios: string
  revision_anterior_id?: string
  clasificacion: Clasificacion
}

export interface SeccionAcuerdo {
  id: string
  cliente_id: string
  acuerdo_revision_id: string
  clave_seccion: string
  titulo: string
  orden: number
}

export interface ComentarioAcuerdo {
  id: string
  cliente_id: string
  acuerdo_revision_id: string
  seccion_id: string
  autor_membresia_id: string
  texto: string
  creado_en: string
  estado: 'abierto' | 'atendido' | 'trasladado'
}

/** Registro de formalización; en MVP siempre `externa` documentada (5.2). */
export interface Formalizacion {
  id: string
  cliente_id: string
  tipo_instrumento: TipoAcuerdo
  revision_instrumento_id: string
  metodo: 'externa'
  /** Identidad del firmante según el instrumento; puede no ser usuario del portal. */
  firmante_segun_instrumento: string
  fecha_acto: string
  registrado_en: string
  registrado_por: string
  validado_por: string
  evidencia_ref: string
  hash_documento_objeto: string
}

export type FaseProyecto = 'preparacion' | 'ejecucion' | 'operacion_recurrente' | 'cierre' | 'cerrado'

export interface Proyecto {
  id: string
  cliente_id: string
  clave: string
  nombre: string
  modalidad: 'puntual' | 'recurrente'
  acuerdo_inicial_revision_id: string
  formalizacion_inicial_id: string
  fase: FaseProyecto
  lider_membresia_id: string
  inicio_comprometido: string
  fin_original: string
  fin_vigente: string
  fin_real?: string
  /** Fecha de corte de la información publicada (H21, 5.1). */
  fecha_corte_publicada: string
  actualizado_por: string
  consulta_historica_hasta?: string
}

export type EstadoHito = 'pendiente' | 'en_curso' | 'cumplido'

export interface CambioFecha {
  fecha_anterior: string
  fecha_nueva: string
  motivo: string
  autorizado_por: string
  registrado_en: string
}

export interface Hito {
  id: string
  cliente_id: string
  proyecto_id: string
  clave: string
  nombre: string
  fecha_original: string
  fecha_vigente: string
  estado: EstadoHito
  criterio_terminacion: string
  cambios_fecha: CambioFecha[]
  evidencia_ref?: string
}

export interface PublicacionAvance {
  id: string
  cliente_id: string
  proyecto_id: string
  fecha_corte: string
  texto_publicado: string
  autor_membresia_id: string
  publicado_en: string
  sistema_origen: string
  id_origen: string
}

// ---------- Compromisos (6.4) ----------

export type TipoCompromiso = 'solicitud_insumo' | 'decision' | 'acceso_coordinado' | 'validacion'
export type EstadoCompromiso = 'abierto' | 'respondido' | 'requiere_aclaracion' | 'resuelto' | 'cancelado'

export interface CompromisoCompartido {
  id: string
  cliente_id: string
  proyecto_id: string
  tipo: TipoCompromiso
  descripcion: string
  /** RR-03: las mismas reglas aplican a cliente y ARSEG. */
  parte_responsable: 'cliente' | 'arseg'
  contacto_responsable_id: string
  solicitante_membresia_id: string
  solicitada_en: string
  fecha_original: string
  fecha_vigente: string
  cambios_fecha: CambioFecha[]
  criterio_resolucion: string
  hito_afectado_id?: string
  impacto_previsto: string
  estado: EstadoCompromiso
}

export interface RespuestaCompromiso {
  id: string
  cliente_id: string
  compromiso_id: string
  autor_membresia_id: string
  texto: string
  registrada_en: string
  origen: 'portal' | 'comunicacion_externa'
  referencia_origen?: string
}

export interface ResolucionCompromiso {
  id: string
  cliente_id: string
  compromiso_id: string
  resultado: 'resuelto' | 'cancelado'
  motivo: string
  validada_por: string
  validada_en: string
}

// ---------- Entregables y archivos (6.4) ----------

export type EstadoEditorialEntregable =
  | 'borrador_interno'
  | 'en_revision_interna'
  | 'publicado'
  | 'superado'
  | 'retirado'

export interface Entregable {
  id: string
  cliente_id: string
  proyecto_id: string
  tipo: string
  titulo: string
  criterio_conformidad?: string
}

export interface EntregableRevision {
  id: string
  cliente_id: string
  entregable_id: string
  numero_revision: number
  estado_editorial: EstadoEditorialEntregable
  proposito: 'informativo' | 'para_revision'
  clasificacion: Clasificacion
  archivo_id: string
  hash_archivo: string
  mime: string
  bytes: number
  autor_id: string
  publicado_por?: string
  publicado_en?: string
  revision_anterior_id?: string
}

export interface ArchivoMeta {
  id: string
  cliente_id: string
  proyecto_id?: string
  nombre_visible: string
  mime_validado: string
  bytes: number
  hash_sha256: string
  estado_seguridad: 'cuarentena' | 'permitido' | 'bloqueado'
  clasificacion: Clasificacion
  creado_por: string
  creado_en: string
}

/** Publicación, acuse y conformidad son actos distintos (H22, 5.5). */
export interface AcuseEntregable {
  id: string
  cliente_id: string
  entregable_revision_id: string
  tipo: 'recepcion' | 'conformidad'
  actor_membresia_id: string
  resultado: 'conforme' | 'con_observaciones' | 'recibido'
  observaciones?: string
  registrado_en: string
}

// ---------- Cierre y expediente (6.5) ----------

export interface CierreProyecto {
  id: string
  cliente_id: string
  proyecto_id: string
  fecha_cierre: string
  evidencia_conformidad_ref: string
  pendientes_transferidos_ref: string
  consulta_historica_hasta: string
}

// ---------- Bitácora (6.6) ----------

export interface EventoBitacora {
  id: string
  cliente_id: string
  proyecto_id?: string
  tipo_evento: string
  tipo_objeto: string
  objeto_id: string
  actor_tipo: 'persona' | 'servicio' | 'sistema'
  actor_id: string
  ocurrido_en_servidor: string
  detalle_minimo: string
  clasificacion_evento: Clasificacion
}

// ---------- Estado agregado del dominio ----------

/**
 * Estado completo del prototipo. En producción esto vive en PostgreSQL con RLS;
 * aquí es una estructura inmutable que solo se transforma con `aplicar()` (transaccion.ts),
 * que escribe estado + evento de bitácora de forma atómica (INV-12, 7.2).
 */
export interface EstadoPortal {
  clientes: Cliente[]
  usuarios: Usuario[]
  contactos: Contacto[]
  membresias: Membresia[]
  asignaciones: AsignacionProyecto[]
  permisos: PermisoAdicional[]
  autoridades: AutoridadComercial[]
  acuerdos: Acuerdo[]
  acuerdoRevisiones: AcuerdoRevision[]
  seccionesAcuerdo: SeccionAcuerdo[]
  comentariosAcuerdo: ComentarioAcuerdo[]
  formalizaciones: Formalizacion[]
  proyectos: Proyecto[]
  hitos: Hito[]
  publicacionesAvance: PublicacionAvance[]
  compromisos: CompromisoCompartido[]
  respuestasCompromiso: RespuestaCompromiso[]
  resolucionesCompromiso: ResolucionCompromiso[]
  entregables: Entregable[]
  entregableRevisiones: EntregableRevision[]
  archivos: ArchivoMeta[]
  acuses: AcuseEntregable[]
  cierres: CierreProyecto[]
  bitacora: EventoBitacora[]
}
