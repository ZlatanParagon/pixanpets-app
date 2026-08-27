import type { Vaccine } from '../types'

const APPLIED = { dot: '#17B5AC', halo: 'rgba(23,181,172,.16)', dateFg: '#1B1560' }
const SUGGESTED = { dot: '#E9207F', halo: 'rgba(233,32,127,.14)', dateFg: '#E9207F' }

export const VACCINES: Vaccine[] = [
  {
    name: 'Rabia',
    note: 'Lote R-2841 · Dra. Marisol Cruz',
    date: '18 sep 2025',
    status: 'Aplicada',
    ...APPLIED,
  },
  {
    name: 'Múltiple (DHPPi)',
    note: 'Refuerzo anual',
    date: '18 sep 2025',
    status: 'Aplicada',
    ...APPLIED,
  },
  {
    name: 'Desparasitación interna',
    note: 'Praziquantel · 8.4 kg',
    date: '2 jun 2026',
    status: 'Aplicada',
    ...APPLIED,
  },
  {
    name: 'Rabia (refuerzo)',
    note: 'Recordatorio push activado',
    date: '18 sep 2026',
    status: 'Sugerida',
    ...SUGGESTED,
  },
]

export interface Consultation {
  title: string
  date: string
  detail: string
}

export const CONSULTATIONS: Consultation[] = [
  {
    title: 'Consulta general',
    date: '12 jun 2026',
    detail: 'Dra. Marisol Cruz · Otitis leve oído izquierdo. Tratamiento 7 días.',
  },
  {
    title: 'Estética · baño y corte',
    date: '3 may 2026',
    detail: 'Estilista Beto Lara · Corte verano, uñas y limpieza de oídos.',
  },
]
