import type { Notification } from '../types'

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    icon: 'flame',
    kind: 'racha',
    title: 'Tu racha sigue viva',
    body: 'Llevas 3 días seguidos. Una lección de 6 minutos la mantiene.',
    when: 'hace 20 min',
  },
  {
    id: 'n2',
    icon: 'chart',
    kind: 'examen',
    title: 'Tu punto débil: redacción de hallazgos',
    body: 'Fallaste 3 de 5 preguntas del tema. El módulo A5 lo cubre completo.',
    when: 'hace 3 h',
  },
  {
    id: 'n3',
    icon: 'sparkle',
    kind: 'oferta',
    title: 'Terminaste Fundamentos',
    body: 'El Nivel 2 está disponible con simulador adaptativo y casos reales.',
    when: 'ayer',
  },
  {
    id: 'n4',
    icon: 'users',
    kind: 'comunidad',
    title: 'Julián respondió tu hilo',
    body: '"Cambio en el SGC: ¿6.3 o 8.5.6?" tiene una respuesta del instructor.',
    when: 'ayer',
  },
  {
    id: 'n5',
    icon: 'book',
    kind: 'contenido',
    title: 'Nuevo caso de estudio',
    body: '"Acción correctiva que no corrigió nada" ya está en tu biblioteca.',
    when: 'hace 2 días',
  },
]
