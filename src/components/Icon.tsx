import type { ReactNode } from 'react'

interface Spec {
  body: ReactNode
  /** Default stroke width; overridable per usage. */
  sw: number
  round?: boolean
}

/**
 * Every line icon in the app. All share a 24×24 box and are drawn as strokes,
 * so a single `color` prop tints them.
 */
const ICONS = {
  bell: {
    sw: 1.9,
    body: <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7M13.7 20a2 2 0 0 1-3.4 0" />,
  },
  calendar: {
    sw: 2,
    body: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="4" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </>
    ),
  },
  bag: {
    sw: 2,
    body: (
      <>
        <path d="M4 8h16l-1.4 11a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
  },
  chevronRight: { sw: 2.4, body: <path d="M9 6l6 6-6 6" /> },
  chevronLeft: { sw: 2.4, body: <path d="M15 6l-6 6 6 6" /> },
  chevronDown: { sw: 2.8, body: <path d="M6 9l6 6 6-6" /> },
  plus: { sw: 2, body: <path d="M12 6v12M6 12h12" /> },
  phone: {
    sw: 2,
    body: (
      <path d="M6.6 3h3l1.4 4-2 1.4a12 12 0 0 0 6.6 6.6l1.4-2 4 1.4v3A2.4 2.4 0 0 1 18.6 20 15.6 15.6 0 0 1 4 5.4 2.4 2.4 0 0 1 6.6 3Z" />
    ),
  },
  search: {
    sw: 2.2,
    body: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M16.5 16.5 21 21" />
      </>
    ),
  },
  truck: {
    sw: 2,
    body: (
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM6.5 20a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6M17.5 20a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6" />
    ),
  },
  truckWheels: {
    sw: 2,
    body: (
      <>
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
        <circle cx="6.5" cy="18.5" r="1.8" />
        <circle cx="17.5" cy="18.5" r="1.8" />
      </>
    ),
  },
  store: { sw: 2, body: <path d="M4 9h16v11H4zM4 9l2-4h12l2 4M9 13h6" /> },
  repeat: { sw: 2, body: <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4" /> },
  card: {
    sw: 2,
    body: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
        <path d="M2.5 10h19M12 6v12" />
      </>
    ),
  },
  circlePlus: {
    sw: 2,
    body: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12h6M12 9v6" />
      </>
    ),
  },
  clock: {
    sw: 2,
    body: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
  home: {
    sw: 2,
    round: true,
    body: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  },
  bulb: {
    sw: 2,
    round: true,
    body: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 3.5 10.9V15h-7v-1.1A6 6 0 0 1 12 3Z" />,
  },
  user: {
    sw: 2,
    body: (
      <>
        <circle cx="12" cy="8.5" r="3.8" />
        <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
  cross: { sw: 2, body: <path d="M12 4v16M4 12h16" /> },
  scissors: {
    sw: 2,
    body: (
      <>
        <path d="M6 4l12 12M6 20 18 8" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
      </>
    ),
  },
  check: { sw: 2.6, round: true, body: <path d="M5 13l4.5 4.5L19 7" /> },
} satisfies Record<string, Spec>

export type IconName = keyof typeof ICONS

interface IconProps {
  name: IconName
  size?: number
  color?: string
  /** Overrides the icon's default stroke width. */
  stroke?: number
}

export function Icon({ name, size = 24, color = 'currentColor', stroke }: IconProps) {
  const spec: Spec = ICONS[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke ?? spec.sw}
      strokeLinecap="round"
      strokeLinejoin={spec.round ? 'round' : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {spec.body}
    </svg>
  )
}

/** The small tick used inside checkboxes and selection dots. */
export function CheckMark({ size = 12, color = '#14126B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M2.5 6.3 4.8 8.6 9.5 3.6"
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.4 0 4.5-.8 6-2.3l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path d="M3.9 10.6a5.4 5.4 0 0 1 0-3.5V4.8H.9a9 9 0 0 0 0 8.1l3-2.3z" fill="#FBBC05" />
      <path
        d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 4.8l3 2.3C4.6 5 6.6 3.6 9 3.6z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function AppleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size / 16) * 19}
      viewBox="0 0 16 19"
      fill="#fff"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.2 10c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.3-.1-2.5.7-3.2.7-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.1 2.7 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.6zM11 3.6c.6-.7 1-1.7.9-2.6-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 2-.5 2.5-1.2z" />
    </svg>
  )
}
