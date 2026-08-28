import type { Plan } from '../types'

/**
 * AAE arranca con UN nicho, como pide el plan de lanzamiento: auditoría
 * interna ISO 9001:2015. Todo el contenido, el banco de preguntas y el
 * voucher del Nivel 3 cuelgan de esta ruta.
 */
export const TRACK = {
  id: 'iso9001',
  name: 'Auditor Interno ISO 9001:2015',
  short: 'ISO 9001',
  /** Entidad con la que se canjea el voucher del Nivel 3. */
  registrar: 'Registrador acreditado IAF',
  /** Preguntas del examen certificador proctoreado. */
  finalQuestions: 30,
  /** Minutos del examen certificador. */
  finalMinutes: 45,
  /** Aciertos mínimos para aprobar, en porcentaje. */
  passMark: 70,
  /** Simuladores completos exigidos antes de agendar el Nivel 3. */
  requiredSims: 3,
} as const

export const PLANS: Plan[] = [
  {
    id: 'level2',
    name: 'Nivel 2 — Avanzado',
    price: 79,
    period: 'pago único',
    tagline: 'Todo lo que necesitas para llegar listo al examen.',
    includes: [
      '8 módulos avanzados (12 h de contenido)',
      'Simulador adaptativo con banco de preguntas por tema',
      'Casos de estudio reales anonimizados',
      'AAE Coach ilimitado',
      'Dashboard de desempeño por tema',
    ],
  },
  {
    id: 'level3',
    name: 'Nivel 3 — Certificación',
    price: 349,
    period: 'pago único',
    tagline: 'Examen proctoreado, credencial verificable y voucher.',
    includes: [
      'Examen certificador supervisado',
      'Certificado digital con QR verificable',
      'Voucher canjeable con entidad acreditada',
      'Insignia para LinkedIn',
      'Comunidad de graduados y mentorías grupales',
    ],
  },
  {
    id: 'premium',
    name: 'Premium anual',
    price: 249,
    period: 'al año',
    tagline: 'Todos los niveles y cada curso nuevo, un año completo.',
    includes: [
      'Niveles 1, 2 y 3 de todas las rutas',
      'Cursos nuevos incluidos durante 12 meses',
      'Actualizaciones anuales de contenido',
      '1 mentoría 1:1 al trimestre',
    ],
  },
]

/** Preguntas del cuestionario de diagnóstico posterior al registro. */
export const DIAGNOSTIC: { id: string; q: string; options: string[] }[] = [
  {
    id: 'exp',
    q: '¿Cuánta experiencia tienes auditando sistemas de gestión?',
    options: ['Ninguna, empiezo de cero', 'He participado como auditado', 'He auditado 1–5 veces', 'Audito con regularidad'],
  },
  {
    id: 'goal',
    q: '¿Cuál es tu meta con AAE?',
    options: ['Certificarme como auditor interno', 'Entender la norma para mi área', 'Preparar una auditoría de certificación', 'Crecer profesionalmente / cambiar de rol'],
  },
  {
    id: 'time',
    q: '¿Cuánto tiempo puedes estudiar por semana?',
    options: ['Menos de 2 h', '2–4 h', '5–8 h', 'Más de 8 h'],
  },
  {
    id: 'when',
    q: '¿Para cuándo quieres estar listo?',
    options: ['En 1 mes', 'En 3 meses', 'En 6 meses', 'Sin fecha, a mi ritmo'],
  },
]

/** Semanas estimadas de preparación según la respuesta de tiempo semanal. */
export const WEEKS_BY_TIME = [12, 9, 6, 4]
