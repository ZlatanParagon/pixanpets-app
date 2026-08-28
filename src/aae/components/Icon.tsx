import type { ReactNode } from 'react'

interface Spec {
  body: ReactNode
  /** Default stroke width; overridable per usage. */
  sw: number
}

/**
 * Line icons for AAE. All share a 24×24 box and are drawn as strokes, so a
 * single `color` prop tints them.
 */
const ICONS = {
  home: { sw: 1.9, body: <path d="M4 10.5 12 4l8 6.5V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19v-8.5ZM9.6 20.6v-6h4.8v6" /> },
  path: {
    sw: 1.9,
    body: (
      <>
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="18" cy="18" r="2.4" />
        <path d="M8.4 6H14a3.4 3.4 0 0 1 0 6.8h-4a3.4 3.4 0 0 0 0 6.8h5.6" />
      </>
    ),
  },
  target: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3.4" />
      </>
    ),
  },
  users: {
    sw: 1.9,
    body: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.6 20a5.6 5.6 0 0 1 10.8 0M16 5.2a3.2 3.2 0 0 1 0 5.9M17 14.6a5.6 5.6 0 0 1 3.4 5.4" />
      </>
    ),
  },
  user: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
  },
  bell: { sw: 1.8, body: <path d="M18 8.5a6 6 0 1 0-12 0c0 5.5-2 6.5-2 6.5h16s-2-1-2-6.5M13.6 19a1.9 1.9 0 0 1-3.2 0" /> },
  chevronRight: { sw: 2.3, body: <path d="M9.5 5.5 16 12l-6.5 6.5" /> },
  chevronLeft: { sw: 2.3, body: <path d="M14.5 5.5 8 12l6.5 6.5" /> },
  chevronDown: { sw: 2.4, body: <path d="M6 9.5 12 15.5 18 9.5" /> },
  play: { sw: 1.9, body: <path d="M8 5.6 18.5 12 8 18.4V5.6Z" /> },
  check: { sw: 2.4, body: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" /> },
  checkCircle: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="12" r="8.4" />
        <path d="M8.2 12.3 10.9 15 15.9 9.4" />
      </>
    ),
  },
  close: { sw: 2.2, body: <path d="M6 6l12 12M18 6 6 18" /> },
  lock: {
    sw: 1.9,
    body: (
      <>
        <rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.4" />
        <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
      </>
    ),
  },
  clock: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="12" r="8.4" />
        <path d="M12 7.4V12l3.2 2" />
      </>
    ),
  },
  chart: { sw: 2, body: <path d="M4 20V4M4 20h16M8 17V11M12.6 17V7.5M17.2 17v-4.2" /> },
  trophy: {
    sw: 1.9,
    body: (
      <>
        <path d="M7.5 4h9v4.6a4.5 4.5 0 0 1-9 0V4Z" />
        <path d="M7.5 5.6H5a2.4 2.4 0 0 0 2.5 4M16.5 5.6H19a2.4 2.4 0 0 1-2.5 4M12 13.2V17M8.6 20h6.8" />
      </>
    ),
  },
  award: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="9" r="5.2" />
        <path d="M8.6 13.4 7.4 21l4.6-2.4 4.6 2.4-1.2-7.6" />
      </>
    ),
  },
  shield: { sw: 1.9, body: <path d="M12 3.4 19 6v5.6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-2.6Z" /> },
  flame: { sw: 1.9, body: <path d="M12 3.5s5 4 5 8.5a5 5 0 0 1-10 0c0-1.8.8-3.2 1.6-4.2.3 1.3 1.1 2.1 2 2.1 1.3 0 1.4-2.6 1.4-6.4Z" /> },
  sparkle: { sw: 1.8, body: <path d="M12 3.5 13.8 9 19.5 10.8 13.8 12.6 12 18.2 10.2 12.6 4.5 10.8 10.2 9 12 3.5ZM18.4 16.2l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" /> },
  book: {
    sw: 1.9,
    body: (
      <>
        <path d="M4.5 5.2A2 2 0 0 1 6.5 3.4H19v14.4H6.5a2 2 0 0 0-2 2V5.2Z" />
        <path d="M4.5 19.8a2 2 0 0 1 2-2H19v2.8H6.5a2 2 0 0 1-2-.8Z" />
      </>
    ),
  },
  folder: { sw: 1.9, body: <path d="M3.6 6.6A1.8 1.8 0 0 1 5.4 4.8h3.9l2 2.4h7.3a1.8 1.8 0 0 1 1.8 1.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.4a1.8 1.8 0 0 1-1.8-1.8V6.6Z" /> },
  search: {
    sw: 2.1,
    body: (
      <>
        <circle cx="11" cy="11" r="6.8" />
        <path d="M16.2 16.2 21 21" />
      </>
    ),
  },
  card: {
    sw: 1.9,
    body: (
      <>
        <rect x="3" y="5.6" width="18" height="12.8" rx="2.6" />
        <path d="M3 10h18" />
      </>
    ),
  },
  camera: {
    sw: 1.9,
    body: (
      <>
        <path d="M3.6 8.6A1.8 1.8 0 0 1 5.4 6.8h2.4l1.4-2.2h5.6l1.4 2.2h2.4a1.8 1.8 0 0 1 1.8 1.8v8.8a1.8 1.8 0 0 1-1.8 1.8H5.4a1.8 1.8 0 0 1-1.8-1.8V8.6Z" />
        <circle cx="12" cy="12.6" r="3.4" />
      </>
    ),
  },
  qr: {
    sw: 1.8,
    body: (
      <>
        <rect x="3.6" y="3.6" width="6.4" height="6.4" rx="1.4" />
        <rect x="14" y="3.6" width="6.4" height="6.4" rx="1.4" />
        <rect x="3.6" y="14" width="6.4" height="6.4" rx="1.4" />
        <path d="M14 14h3v3h-3zM20.4 14v3M17.4 20.4h3M14 20.4h.1" />
      </>
    ),
  },
  share: {
    sw: 1.9,
    body: (
      <>
        <circle cx="17.6" cy="5.8" r="2.6" />
        <circle cx="6.4" cy="12" r="2.6" />
        <circle cx="17.6" cy="18.2" r="2.6" />
        <path d="M8.7 10.8 15.3 7.1M8.7 13.2l6.6 3.7" />
      </>
    ),
  },
  download: { sw: 1.9, body: <path d="M12 4v10.4M7.6 10.6 12 15l4.4-4.4M4.6 19.4h14.8" /> },
  bookmark: { sw: 1.9, body: <path d="M6.4 4.6h11.2v15.8L12 16.6l-5.6 3.8V4.6Z" /> },
  flag: { sw: 1.9, body: <path d="M6 20.4V4.2h11.4l-2 3.8 2 3.8H6" /> },
  info: {
    sw: 1.9,
    body: (
      <>
        <circle cx="12" cy="12" r="8.4" />
        <path d="M12 11v5.4M12 7.9h.01" />
      </>
    ),
  },
  alert: { sw: 1.9, body: <path d="M12 4.4 21 19.6H3L12 4.4ZM12 10v4.2M12 17.2h.01" /> },
  plus: { sw: 2.1, body: <path d="M12 6v12M6 12h12" /> },
  send: { sw: 1.9, body: <path d="M20.4 3.6 3.6 10.2l6.6 2.6 2.6 6.6 7.6-15.8ZM10.2 12.8 14.6 8.4" /> },
  mail: {
    sw: 1.9,
    body: (
      <>
        <rect x="3" y="5.4" width="18" height="13.2" rx="2.4" />
        <path d="m3.8 7 8.2 6 8.2-6" />
      </>
    ),
  },
  star: { sw: 1.9, body: <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3L4.2 9.7l5.4-.8L12 4Z" /> },
  logout: { sw: 1.9, body: <path d="M14.4 4.6H6.6A1.8 1.8 0 0 0 4.8 6.4v11.2a1.8 1.8 0 0 0 1.8 1.8h7.8M15.4 8.4 19 12l-3.6 3.6M19 12H9.6" /> },
} as const

export type IconName = keyof typeof ICONS

export function Icon({
  name,
  size = 22,
  color = 'currentColor',
  strokeWidth,
}: {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
}) {
  const spec: Spec = ICONS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth ?? spec.sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {spec.body}
    </svg>
  )
}
