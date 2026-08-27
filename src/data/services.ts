import type { Provider, Service, ServiceType } from '../types'

/**
 * Service catalog per appointment type. The veterinary practice maintains this
 * from the web panel — see the yellow note on step 2 of the booking wizard.
 */
export const CATALOG: Record<ServiceType, Service[]> = {
  Médico: [
    { name: 'Consulta general', dur: '30 min', price: '$450' },
    { name: 'Vacunación', dur: '20 min', price: '$380' },
    { name: 'Desparasitación', dur: '15 min', price: '$260' },
    { name: 'Análisis clínicos', dur: '40 min', price: '$690' },
  ],
  Estética: [
    { name: 'Baño y secado', dur: '60 min', price: '$390' },
    { name: 'Baño + corte de raza', dur: '90 min', price: '$620' },
    { name: 'Corte de uñas y oídos', dur: '20 min', price: '$180' },
  ],
}

export const PROVIDERS: Record<ServiceType, Provider[]> = {
  Médico: [
    {
      name: 'Sin preferencia',
      role: 'La primera disponibilidad',
      initials: '??',
      tint: '#F1EDFD',
      ink: '#7A22C4',
      next: 'Hoy',
    },
    {
      name: 'Dra. Marisol Cruz',
      role: 'Medicina general · 12 años',
      initials: 'MC',
      tint: '#DFF9F7',
      ink: '#0F8F88',
      next: '28 ago',
    },
    {
      name: 'MVZ Iván Peña',
      role: 'Medicina interna',
      initials: 'IP',
      tint: '#F0E6FF',
      ink: '#7A22C4',
      next: '29 ago',
    },
  ],
  Estética: [
    {
      name: 'Sin preferencia',
      role: 'La primera disponibilidad',
      initials: '??',
      tint: '#F1EDFD',
      ink: '#7A22C4',
      next: 'Hoy',
    },
    {
      name: 'Beto Lara',
      role: 'Estilista canino',
      initials: 'BL',
      tint: '#FFE6F1',
      ink: '#E9207F',
      next: '28 ago',
    },
    {
      name: 'Sofía Mena',
      role: 'Estética felina',
      initials: 'SM',
      tint: '#DFF9F7',
      ink: '#0F8F88',
      next: '31 ago',
    },
  ],
}

/** Days with free slots in August 2026. Sundays are closed (L–S). */
export const AVAILABLE_DAYS = [26, 27, 28, 29, 31, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]

/** [hour, isFree] — the crossed-out ones are already taken. */
export const SLOTS: [string, boolean][] = [
  ['09:00', true],
  ['09:40', true],
  ['10:20', false],
  ['11:00', true],
  ['11:40', true],
  ['12:20', false],
  ['13:00', true],
  ['16:00', true],
  ['16:40', true],
  ['17:20', true],
]
