/** Fixture data for the account-settings screens added after the walkthrough. */

export interface Address {
  label: string
  line: string
}

export const ADDRESSES: Address[] = [
  {
    label: 'Casa',
    line: 'Av. Coyoacán 1234, Del Valle Centro, 03100 CDMX · Ana Robles · 55 4821 0093',
  },
  {
    label: 'Oficina',
    line: 'Insurgentes Sur 800, piso 4, Nápoles, 03810 CDMX · recepción hasta 18 h',
  },
]

export interface Card {
  name: string
  meta: string
  /** CSS background of the little card artwork. */
  art: string
}

export const CARDS: Card[] = [
  {
    name: 'Visa ···· 4821',
    meta: 'Vence 09/29 · Ana Robles',
    art: 'linear-gradient(120deg,#2A1FA0,#7A22C4)',
  },
  {
    name: 'Mastercard ···· 0917',
    meta: 'Vence 03/28 · Ana Robles',
    art: 'linear-gradient(120deg,#E9207F,#FF8A5B)',
  },
]

export type PrivKey = 'push' | 'mail' | 'share'

export interface PrivToggle {
  key: PrivKey
  label: string
  hint: string
}

export const PRIV_TOGGLES: PrivToggle[] = [
  { key: 'push', label: 'Notificaciones push', hint: 'Recordatorios de citas, vacunas y pedidos' },
  { key: 'mail', label: 'Promociones por correo', hint: 'Ofertas de tienda y campañas de temporada' },
  {
    key: 'share',
    label: 'Compartir datos para mejorar el servicio',
    hint: 'Uso anónimo de la app, sin datos clínicos',
  },
]

/** First-aid guidance shown on the urgencias screen. */
export const URGENCY_TIPS = [
  'No des medicamento humano: muchos analgésicos son tóxicos para perros y gatos.',
  'Si hay sangrado, presiona con una tela limpia sin retirarla durante el traslado.',
  'Transporta al gato en canil cerrado; al perro con bozal improvisado si hay dolor.',
  'Si sospechas intoxicación, trae el empaque o una foto de lo que ingirió.',
]

export const URGENCY_PHONE = '55 4000 8080'

export const GUARD_BRANCH = {
  name: 'PIXANPETS Del Valle',
  line: 'Av. Coyoacán 1234, Del Valle Centro, 03100 CDMX · a 2.4 km de ti',
  tags: ['MVZ EN SITIO', 'RAYOS X', 'HOSPITAL'],
}
