/**
 * PIXANPETS palette, taken from the logo: indigo/púrpura, turquesa, magenta.
 * Values that never change live in `styles/app.css` as custom properties;
 * these mirrors exist for the handful of colors chosen at runtime in TS.
 */
export const C = {
  ink: '#1B1560',
  indigo: '#2A1FA0',
  purple: '#7A22C4',
  teal: '#46DED5',
  tealDark: '#17B5AC',
  tealInk: '#0F8F88',
  tealBg: '#EAFBFA',
  pink: '#E9207F',
  pinkInk: '#C0186A',
  pinkBg: '#FFE6F1',
  muted: '#8E88BE',
  idle: '#A29CCB',
  label: '#6F6AA0',
  deep: '#14126B',
  surface: '#FFFFFF',
  bg: '#F5F3FF',
  wash: '#F9F7FF',
  washSelected: '#F7F2FF',
  border: '#E4DEFB',
  hairline: '#EFEBFD',
  amberFg: '#C05A12',
  amberBg: '#FFF0E6',
  disabledInk: '#B4AEDA',
  disabledBg: '#F1EDFD',
} as const

/** Selected / unselected styling for the pill filter chips. */
export function chipStyle(on: boolean) {
  return on
    ? { background: C.washSelected, borderColor: C.purple, color: C.indigo }
    : { background: C.surface, borderColor: C.border, color: C.label }
}
