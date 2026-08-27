import type { Appointment } from '../types'

export const APPTS_UPCOMING: Appointment[] = [
  {
    type: 'MÉDICO',
    tagBg: '#EAFBFA',
    tagFg: '#0F8F88',
    accent: '#46DED5',
    status: 'CONFIRMADA',
    service: 'Consulta general',
    pet: 'Frida',
    provider: 'Dra. Marisol Cruz',
    date: '2 sep',
    time: '11:30 h',
    actionable: true,
  },
  {
    type: 'ESTÉTICA',
    tagBg: '#FFE6F1',
    tagFg: '#C0186A',
    accent: '#E9207F',
    status: 'SOLICITADA',
    service: 'Baño y secado',
    pet: 'Nube',
    provider: 'Sofía Mena',
    date: '5 sep',
    time: '16:00 h',
    actionable: true,
  },
]

const PAST_TAG = { tagBg: '#F1EDFD', tagFg: '#6F6AA0', accent: '#DDD5FA' }

export const APPTS_PAST: Appointment[] = [
  {
    type: 'MÉDICO',
    status: 'COMPLETADA',
    service: 'Consulta general',
    pet: 'Frida',
    provider: 'Dra. Marisol Cruz',
    date: '12 jun',
    time: '10:00 h',
    actionable: false,
    ...PAST_TAG,
  },
  {
    type: 'ESTÉTICA',
    status: 'COMPLETADA',
    service: 'Baño + corte',
    pet: 'Frida',
    provider: 'Beto Lara',
    date: '3 may',
    time: '12:30 h',
    actionable: false,
    ...PAST_TAG,
  },
  {
    type: 'MÉDICO',
    status: 'NO-SHOW',
    service: 'Vacunación',
    pet: 'Nube',
    provider: 'MVZ Iván Peña',
    date: '20 abr',
    time: '17:00 h',
    actionable: false,
    ...PAST_TAG,
  },
]

/**
 * Sort key for "d mes" dates so the soonest upcoming appointment comes first.
 * The prototype only ever schedules within ago–oct.
 */
export function monthRank(date: string): number {
  const months: Record<string, number> = { ago: 8, sep: 9, oct: 10 }
  const [day, month] = String(date).split(' ')
  return (months[month] ?? 9) * 100 + parseInt(day, 10)
}
