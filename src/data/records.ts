import type { Vaccine } from '../types'

const APPLIED = { dot: '#17B5AC', halo: 'rgba(23,181,172,.16)', dateFg: '#1B1560' }
const SUGGESTED = { dot: '#E9207F', halo: 'rgba(233,32,127,.14)', dateFg: '#E9207F' }

/** Vaccination and deworming history, per pet. */
export const VACCINES: Record<string, Vaccine[]> = {
  Frida: [
    {
      name: 'Rabia',
      note: 'Lote R-2841 · Dra. Marisol Cruz',
      date: '18 sep 2025',
      status: 'Aplicada',
      ...APPLIED,
    },
    {
      name: 'Múltiple (DHPPi)',
      note: 'Refuerzo anual canino',
      date: '18 sep 2025',
      status: 'Aplicada',
      ...APPLIED,
    },
    {
      name: 'Bordetella',
      note: 'Vía intranasal',
      date: '2 feb 2026',
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
  ],
  Nube: [
    {
      name: 'Triple felina',
      note: 'Panleucopenia, calicivirus, rinotraqueítis',
      date: '12 oct 2025',
      status: 'Aplicada',
      ...APPLIED,
    },
    {
      name: 'Leucemia felina',
      note: 'Esquema inicial completo',
      date: '12 oct 2025',
      status: 'Aplicada',
      ...APPLIED,
    },
    {
      name: 'Desparasitación interna',
      note: 'Praziquantel · 4.1 kg',
      date: '20 may 2026',
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
  ],
}

export interface Consultation {
  title: string
  date: string
  detail: string
}

/** Visit history, per pet. */
export const CONSULTATIONS: Record<string, Consultation[]> = {
  Frida: [
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
  ],
  Nube: [
    {
      title: 'Consulta general',
      date: '20 may 2026',
      detail: 'MVZ Iván Peña · Control de peso. Dieta de mantenimiento indicada.',
    },
    {
      title: 'Estética felina',
      date: '14 mar 2026',
      detail: 'Sofía Mena · Cepillado profundo y corte de uñas sin sedación.',
    },
  ],
}

export interface RecordDue {
  /** Whether the "agendar refuerzo" card should show for this pet. */
  has: boolean
  title: string
  sub: string
}

/** Upcoming-booster banner on the cartilla, per pet. */
export const RECORD_DUE: Record<string, RecordDue> = {
  Frida: { has: false, title: 'Esquema completo', sub: 'Próximo control sugerido en marzo 2027' },
  Nube: { has: true, title: 'Próximo refuerzo en 3 semanas', sub: 'Rabia anual · sugerido 18 sep 2026' },
}

/** Fallbacks for pets added in-session, which have no history yet. */
export const EMPTY_DUE: RecordDue = {
  has: true,
  title: 'Agenda su primera consulta',
  sub: 'Armamos su esquema de vacunación en la primera visita',
}
