/**
 * AAE — Arseg Academy Express. The identity is deliberately institutional
 * (azul acero + acentos por nivel) so it reads as professional certification
 * rather than consumer edtech. The fixed values live in `styles/aae.css`;
 * these mirrors exist for the colors chosen at runtime in TS.
 */
export const C = {
  ink: '#0F1D33',
  navy: '#12263F',
  brand: '#1B4FA0',
  brandDeep: '#123A78',
  brandSoft: '#EAF1FB',
  /** Nivel 1 — verde. */
  l1: '#0E9F6E',
  l1Bg: '#E6F7F1',
  /** Nivel 2 — ámbar. */
  l2: '#C77A0A',
  l2Bg: '#FDF3E2',
  /** Nivel 3 — carmín. */
  l3: '#C0344B',
  l3Bg: '#FCEAEE',
  gold: '#9A7420',
  goldBg: '#FBF3DF',
  muted: '#6B7A90',
  idle: '#9AA7B8',
  label: '#55657A',
  border: '#DCE3EC',
  surface: '#FFFFFF',
  bg: '#F4F7FB',
  wash: '#F8FAFD',
  ok: '#0E9F6E',
  okBg: '#E6F7F1',
  bad: '#C0344B',
  badBg: '#FCEAEE',
} as const

/** Accent trio for a level: text color, background, label. */
export function levelColors(level: 1 | 2 | 3) {
  if (level === 1) return { fg: C.l1, bg: C.l1Bg, name: 'Fundamentos' }
  if (level === 2) return { fg: C.l2, bg: C.l2Bg, name: 'Avanzado' }
  return { fg: C.l3, bg: C.l3Bg, name: 'Certificación' }
}
