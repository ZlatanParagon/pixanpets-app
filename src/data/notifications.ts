import type { AppNotification } from '../types'

export const NOTIFICATIONS: AppNotification[] = [
  {
    mono: 'C',
    tint: '#EAFBFA',
    ink: '#0F8F88',
    title: 'Tu cita es mañana a las 11:30',
    body: 'Consulta general con la Dra. Marisol Cruz. Llega 10 min antes.',
    when: 'Hace 2 h',
    unread: true,
    to: 'citas',
  },
  {
    mono: 'P',
    tint: '#FFF0E6',
    ink: '#C05A12',
    title: 'Tu pedido #PX-2841 va en camino',
    body: 'Llega hoy entre 4 y 7 pm. Puedes seguirlo desde Mis pedidos.',
    when: 'Hace 5 h',
    unread: true,
    to: 'orders',
  },
  {
    mono: 'V',
    tint: '#FFE6F1',
    ink: '#E9207F',
    title: 'A Nube le toca refuerzo de rabia',
    body: 'Sugerido el 18 de septiembre. Agenda desde su cartilla digital.',
    when: 'Ayer',
    unread: false,
    to: 'record',
  },
  {
    mono: 'T',
    tint: '#F0E6FF',
    ink: '#7A22C4',
    title: 'Nuevo consejo: calendario de vacunas',
    body: 'Guía por edad para cachorros, gatitos y adultos.',
    when: 'Hace 3 días',
    unread: false,
    to: 'article',
  },
]
