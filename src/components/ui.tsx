import type { CSSProperties, ReactNode } from 'react'
import type { Pet } from '../types'
import { Icon } from './Icon'

/** Rounded plate showing a pet's initial or a product's letter stand-in. */
export function Avatar({
  label,
  tint,
  ink,
  size,
  radius,
  font,
  circle = false,
}: {
  label: string
  tint: string
  ink: string
  size: number
  radius?: number
  /** Font size of the letter; defaults to a proportional value. */
  font?: number
  circle?: boolean
}) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: tint,
        color: ink,
        borderRadius: circle ? '50%' : (radius ?? Math.round(size * 0.3)),
        fontSize: font ?? Math.round(size * 0.42),
      }}
    >
      {label}
    </span>
  )
}

/** A pet's avatar: their photo when one was uploaded, otherwise their initial. */
export function PetAvatar({
  pet,
  size,
  radius,
  font,
}: {
  pet: Pet
  size: number
  radius?: number
  font?: number
}) {
  const r = radius ?? Math.round(size * 0.3)
  if (pet.photo) {
    return (
      <img
        className="avatar avatar--photo"
        src={pet.photo}
        alt={pet.name}
        style={{ width: size, height: size, borderRadius: r }}
      />
    )
  }
  return (
    <Avatar label={pet.initial} tint={pet.tint} ink={pet.ink} size={size} radius={r} font={font} />
  )
}

/** Small uppercase status pill. */
export function Tag({
  children,
  bg,
  fg,
  wide = false,
}: {
  children: ReactNode
  bg: string
  fg: string
  /** Adds the extra letter-spacing used on category tags. */
  wide?: boolean
}) {
  return (
    <span className={wide ? 'tag tag--wide' : 'tag'} style={{ background: bg, color: fg }}>
      {children}
    </span>
  )
}

/** Header with a back button and a title — used by the secondary screens. */
export function BackHeader({
  title,
  onBack,
  right,
  className = '',
}: {
  title: string
  onBack: () => void
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={`back-header ${className}`.trim()}>
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Volver">
        <Icon name="chevronLeft" size={18} color="#2A1FA0" />
      </button>
      <h1 className="back-header__title">{title}</h1>
      {right}
    </div>
  )
}

/** Pill filter chip, as used by the shop and tips category rows. */
export function Chip({
  label,
  on,
  onClick,
}: {
  label: string
  on: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={on ? 'chip chip--on' : 'chip'}
      onClick={onClick}
      aria-pressed={on}
    >
      {label}
    </button>
  )
}

/** Rounded search box. */
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="search">
      <Icon name="search" size={17} color="#A29CCB" />
      <input
        type="search"
        className="search__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  )
}

/** Labelled form field. */
export function Field({
  label,
  children,
  style,
}: {
  label: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <label className="field" style={style}>
      <span className="field__label">{label}</span>
      {children}
    </label>
  )
}

/**
 * Callout box. `decision` is the yellow variant the design used to flag the
 * open questions a developer still has to close (shipping rules, gateway, CFDI, CMS).
 */
export function Note({
  children,
  decision = false,
}: {
  children: ReactNode
  decision?: boolean
}) {
  return <p className={decision ? 'note note--decision' : 'note'}>{children}</p>
}

/** Checkbox-style tick on a teal square. */
export function TickBox({ children }: { children: ReactNode }) {
  return (
    <div className="tickbox">
      <span className="tickbox__box">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2.5 6.3 4.8 8.6 9.5 3.6"
            fill="none"
            stroke="#14126B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="tickbox__text">{children}</span>
    </div>
  )
}
