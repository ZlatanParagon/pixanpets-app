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
    date: '28 ago',
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
    date: '31 ago',
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

/** The appointment surfaced on the home screen. */
export const NEXT_APPOINTMENT = {
  day: '28',
  month: 'AGO',
  type: 'MÉDICO',
  time: '11:30 h',
  title: 'Consulta general · Frida',
  provider: 'Dra. Marisol Cruz',
}
