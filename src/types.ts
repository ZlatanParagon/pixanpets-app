export type Screen =
  | 'onboard'
  | 'auth'
  | 'petnew'
  | 'home'
  | 'citas'
  | 'book'
  | 'bookdone'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'orderdone'
  | 'orders'
  | 'tips'
  | 'article'
  | 'profile'
  | 'record'
  | 'notifs'

export type ServiceType = 'Médico' | 'Estética'

export interface Pet {
  name: string
  /** "Perro · Criolla · 5 años" */
  meta: string
  initial: string
  /** Avatar background. */
  tint: string
  /** Avatar letter color. */
  ink: string
  badge: string
  badgeBg: string
  badgeFg: string
  weight: string
  /** Object URL of a photo picked in "alta de mascota"; falls back to `initial`. */
  photo?: string
}

export interface Service {
  name: string
  dur: string
  price: string
}

export interface Provider {
  name: string
  role: string
  initials: string
  tint: string
  ink: string
  /** Next free date, shown on the right of the row. */
  next: string
}

export interface Product {
  id: number
  /** Stand-in for the product photo: a single letter on a tinted plate. */
  mono: string
  brand: string
  name: string
  size: string
  sizeAlt: string
  price: number
  tint: string
  ink: string
  stock: number
  cat: string
  desc: string
}

export interface CartItem {
  id: number
  qty: number
}

export interface CartLine extends Product {
  qty: number
  /** price × qty */
  sub: number
}

export interface Faq {
  q: string
  a: string
}

export interface Vaccine {
  name: string
  note: string
  date: string
  status: string
  dot: string
  halo: string
  dateFg: string
}

export interface Order {
  id: string
  status: string
  tagBg: string
  tagFg: string
  meta: string
  total: string
}

export interface Appointment {
  type: string
  tagBg: string
  tagFg: string
  accent: string
  status: string
  service: string
  pet: string
  provider: string
  date: string
  time: string
  /** Upcoming appointments can be rescheduled or cancelled; past ones cannot. */
  actionable: boolean
}

export interface AppNotification {
  mono: string
  tint: string
  ink: string
  title: string
  body: string
  when: string
  unread: boolean
  to: Screen
}

export interface OnboardSlide {
  title: string
  body: string
}
