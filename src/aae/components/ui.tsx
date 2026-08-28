import type { CSSProperties, ReactNode } from 'react'
import { C, levelColors } from '../theme'
import type { Level } from '../types'
import { Icon, type IconName } from './Icon'

/** Iniciales sobre un plato redondo — avatares de comunidad y perfil. */
export function Avatar({
  label,
  size = 40,
  bg = C.brandSoft,
  fg = C.brand,
}: {
  label: string
  size?: number
  bg?: string
  fg?: string
}) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.36) }}
    >
      {label}
    </span>
  )
}

/** Píldora de estado o categoría. */
export function Tag({
  children,
  bg,
  fg,
  wide = false,
}: {
  children: ReactNode
  bg: string
  fg: string
  wide?: boolean
}) {
  return (
    <span className={wide ? 'tag tag--wide' : 'tag'} style={{ background: bg, color: fg }}>
      {children}
    </span>
  )
}

/** "Nivel 2 · Avanzado" con el color del nivel. */
export function LevelPill({ level, short = false }: { level: Level; short?: boolean }) {
  const c = levelColors(level)
  return (
    <Tag bg={c.bg} fg={c.fg} wide>
      {short ? `N${level}` : `Nivel ${level} · ${c.name}`}
    </Tag>
  )
}

/** Barra de progreso con etiqueta accesible. */
export function Bar({
  value,
  color = C.brand,
  track = '#E7EDF6',
  height = 8,
  label,
}: {
  value: number
  color?: string
  track?: string
  height?: number
  label?: string
}) {
  return (
    <div
      className="bar"
      style={{ background: track, height, borderRadius: height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  )
}

/** Encabezado con botón de regreso. */
export function BackHeader({
  title,
  onBack,
  right,
  sub,
}: {
  title: string
  onBack: () => void
  right?: ReactNode
  sub?: string
}) {
  return (
    <header className="back-header">
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Volver">
        <Icon name="chevronLeft" size={18} color={C.brand} />
      </button>
      <div className="back-header__text">
        <h1 className="back-header__title">{title}</h1>
        {sub && <p className="back-header__sub">{sub}</p>}
      </div>
      {right}
    </header>
  )
}

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

/** Botón principal ancho — la acción única de cada pantalla. */
export function Primary({
  children,
  onClick,
  disabled = false,
  tone = 'brand',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  tone?: 'brand' | 'gold' | 'l2' | 'l3'
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      className={`primary primary--${tone}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function Ghost({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button type="button" className="ghost" onClick={onClick}>
      {children}
    </button>
  )
}

/** Cifra grande con etiqueta — se usa en rejilla de 2 o 3 columnas. */
export function Stat({
  value,
  label,
  color = C.ink,
}: {
  value: ReactNode
  label: string
  color?: string
}) {
  return (
    <div className="stat">
      <div className="stat__value" style={{ color }}>
        {value}
      </div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

/** Aviso con icono; `tone` cambia el color del recuadro. */
export function Note({
  children,
  icon = 'info',
  tone = 'info',
}: {
  children: ReactNode
  icon?: IconName
  tone?: 'info' | 'warn' | 'ok' | 'gold'
}) {
  const fg =
    tone === 'warn' ? C.l2 : tone === 'ok' ? C.ok : tone === 'gold' ? C.gold : C.brand
  return (
    <div className={`note note--${tone}`}>
      <Icon name={icon} size={17} color={fg} />
      <p>{children}</p>
    </div>
  )
}

/** Fila de una lista con chevron. */
export function Row({
  icon,
  title,
  sub,
  right,
  onClick,
  color = C.brand,
  bg = C.brandSoft,
}: {
  icon?: IconName
  title: string
  sub?: string
  right?: ReactNode
  onClick?: () => void
  color?: string
  bg?: string
}) {
  const inner = (
    <>
      {icon && (
        <span className="row__icon" style={{ background: bg }}>
          <Icon name={icon} size={18} color={color} />
        </span>
      )}
      <span className="row__text">
        <span className="row__title">{title}</span>
        {sub && <span className="row__sub">{sub}</span>}
      </span>
      {right ?? (onClick && <Icon name="chevronRight" size={16} color={C.idle} />)}
    </>
  )
  if (!onClick) return <div className="row">{inner}</div>
  return (
    <button type="button" className="row" onClick={onClick}>
      {inner}
    </button>
  )
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {action}
    </div>
  )
}

/** Candado sobre contenido de pago. */
export function LockedCard({
  title,
  body,
  cta,
  onClick,
}: {
  title: string
  body: string
  cta: string
  onClick: () => void
}) {
  return (
    <div className="locked">
      <span className="locked__icon">
        <Icon name="lock" size={18} color={C.l2} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      <Primary tone="l2" onClick={onClick}>
        {cta}
      </Primary>
    </div>
  )
}
