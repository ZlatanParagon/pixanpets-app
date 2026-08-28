// Modelo de datos — SPEC sección 10. Nombres en español, como el documento rector.
// Este módulo es TypeScript puro: sin React, sin I/O (regla 42.15).

export type EstadoEjercicio = 'borrador' | 'preparado' | 'en_curso' | 'pausado' | 'cerrado'

export interface Objetivo {
  id: string
  clave: string // p. ej. "TT-01"
  nombre: string
  descripcion: string
  activo: boolean
}

export interface Fase {
  id: string
  orden: number
  nombre: string
  descripcion: string
}

export interface Rol {
  id: string
  nombre: string
  responsabilidades_declaradas: string
  orden: number
}

export type TipoInyeccion =
  | 'principal'
  | 'dirigida'
  | 'consecuencia'
  | 'informacion_tecnica'
  | 'presion_externa'
  | 'presion_operativa'
  | 'presion_legal'
  | 'presion_reputacional'
  | 'salto_temporal'

export type FuenteInyeccion =
  | 'emulacion'
  | 'hipotetica_aprobada'
  | 'respuesta_participante'
  | 'facilitador'

export type EstadoInyeccion = 'pendiente' | 'preparada' | 'activa' | 'cerrada' | 'omitida'

export type Severidad = 'baja' | 'media' | 'alta' | 'critica'

export interface Inyeccion {
  id: string
  fase_id: string
  orden: number
  clave: string // p. ej. "INY-04"
  tipo: TipoInyeccion
  titulo: string
  cuerpo: string
  fuente: FuenteInyeccion
  evidencia_origen_ref: string | null
  severidad_disenada: Severidad
  ventana_decision_seg: number | null
  /** Objetivos evaluados (CA-8: toda inyección tiene al menos uno). */
  objetivo_ids: string[]
  /** Audiencia: null = todos los roles. */
  audiencia_rol_ids: string[] | null
  visible_en_sala: boolean
  /** Roles de los que se espera respuesta (SPEC s.9: recibir no obliga a responder). */
  respuesta_esperada_rol_ids: string[]
  /** Alternativas sugeridas para la puerta de decisión (opcional). */
  alternativas: string[]
}

export type TipoDecision = 'decision' | 'no_actuar' | 'posponer'

export interface Decision {
  id: string
  inyeccion_id: string
  participante_id: string
  rol_id: string
  tipo: TipoDecision
  accion_elegida: string | null
  accion_libre: string | null
  justificacion: string
  severidad_percibida: Severidad | null
  registrada_en: number // epoch ms (client_timestamp)
  latencia_seg: number | null // en tiempo de ejercicio (excluye pausas)
}

export interface Participante {
  id: string
  rol_id: string
  nombre_visible: string
  conectado_en: number
}

/** Configuración estática del ejercicio (Etapa 0 — Preparación). */
export interface EjercicioConfig {
  id: string
  nombre: string
  cliente: string
  escenario: string
  fecha: string
  duracion_estimada_seg: number
  codigo_sala: string
  qr_token: string
  objetivos: Objetivo[]
  fases: Fase[]
  roles: Rol[]
  inyecciones: Inyeccion[]
  reglas_participante: string[]
}

// ── EventoBitacora — fuente de verdad de la cronología (s.10.13, s.31, s.32) ──

export type ActorTipo = 'facilitador' | 'participante' | 'sistema'

export interface EventoBitacora<P = unknown> {
  id: string // UUID generado en cliente
  ejercicio_id: string
  type: string
  actor_tipo: ActorTipo
  actor_id: string | null
  client_timestamp: number // epoch ms
  /** Asignada al ordenar la cronología; el servidor será autoritativo en producción. */
  sequence?: number
  payload: P
}
