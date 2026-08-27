import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { APPTS_PAST, APPTS_UPCOMING, monthRank } from './data/appointments'
import { ORDERS, STATUS_TAGS } from './data/orders'
import { PETS } from './data/pets'
import { FREE_SHIPPING_FROM, PRODUCTS, SHIPPING_FEE } from './data/products'
import { CATALOG, MONTH, PROVIDERS } from './data/services'
import type { PrivKey } from './data/settings'
import type {
  Appointment,
  CartItem,
  CartLine,
  Order,
  Pet,
  Screen,
  ServiceType,
} from './types'

export interface BookingDraft {
  /** Index into the pets array. */
  pet: number
  type: ServiceType
  /** Index into CATALOG[type], or null while unpicked. */
  service: number | null
  /** Index into PROVIDERS[type], or null while unpicked. */
  provider: number | null
  /** Day of MONTH (September 2026). */
  day: number | null
  time: string | null
}

const EMPTY_BOOKING: BookingDraft = {
  pet: 0,
  type: 'Médico',
  service: null,
  provider: null,
  day: null,
  time: null,
}

export interface AppState {
  screen: Screen
  /** Seeded from the fixture; "alta de mascota" appends to it. */
  pets: Pet[]
  /** Onboarding slide index, 0–2. */
  ob: number
  authMode: 'login' | 'register'
  apptTab: 'up' | 'past'
  /** Booking wizard step, 1–5. */
  bookStep: number
  bk: BookingDraft
  /** Index into `upcoming` of the appointment being rescheduled, or null. */
  reschedId: number | null
  /** Index into `upcoming` of the appointment pending cancel confirmation, or null. */
  cancelId: number | null
  /** Live appointment lists — booking, rescheduling and cancelling mutate them. */
  upcoming: Appointment[]
  past: Appointment[]
  shopCat: string
  tipCat: string
  /** Index of the expanded FAQ, or null. */
  faqOpen: number | null
  productId: number
  /** Quantity stepper on the product detail screen. */
  pdQty: number
  cart: CartItem[]
  /** Checkout step, 1–3. */
  coStep: number
  delivery: 'home' | 'pickup'
  cfdi: boolean
  /** Index into pets — whose record the cartilla screen shows. */
  recPet: number
  /** Live order list; paying prepends a new order. */
  orders: Order[]
  /** Next order folio: "#PX-{orderSeq}". */
  orderSeq: number
  /** Snapshot taken when an order is paid, so the confirmation survives the cart being emptied. */
  lastOrder: PlacedOrder | null
  /**
   * Where the settings-style screens (direcciones, pagos, privacidad) and the
   * pet form were opened from, so their back button returns there.
   */
  settingFrom: Screen
  /** Whether the password-recovery screen already "sent" the reset link. */
  forgotSent: boolean
  /** Selected address / card on the settings screens. */
  addr: number
  card: number
  priv: Record<PrivKey, boolean>
}

export interface PlacedOrder {
  id: string
  total: number
  delivery: 'home' | 'pickup'
}

const INITIAL: AppState = {
  screen: 'onboard',
  pets: PETS,
  ob: 0,
  authMode: 'login',
  apptTab: 'up',
  bookStep: 1,
  bk: EMPTY_BOOKING,
  reschedId: null,
  cancelId: null,
  upcoming: APPTS_UPCOMING,
  past: APPTS_PAST,
  shopCat: 'Todo',
  tipCat: 'Todos',
  faqOpen: null,
  productId: 1,
  pdQty: 1,
  cart: [
    { id: 1, qty: 1 },
    { id: 3, qty: 2 },
  ],
  coStep: 1,
  delivery: 'home',
  cfdi: false,
  recPet: 0,
  orders: ORDERS,
  orderSeq: 2842,
  lastOrder: null,
  settingFrom: 'profile',
  forgotSent: false,
  addr: 0,
  card: 0,
  priv: { push: true, mail: false, share: false },
}

interface AppApi {
  state: AppState
  /** Merge a partial into state. */
  set: (patch: Partial<AppState>) => void
  go: (screen: Screen) => void
  /** Merge a partial into the booking draft. */
  setBooking: (patch: Partial<BookingDraft>) => void
  /** Reset the wizard and open it at step 1. */
  startBooking: () => void
  /** Open the wizard at step 4 pre-filled from an existing appointment. */
  startReschedule: (appt: Appointment) => void
  /** Commit the wizard: add the appointment (replacing the original when rescheduling). */
  confirmBooking: () => void
  /** Ask for confirmation before cancelling an upcoming appointment. */
  askCancel: (appt: Appointment) => void
  dismissCancel: () => void
  /** Move the pending appointment to the history as CANCELADA. */
  confirmCancel: () => void
  /**
   * Open a settings-style screen remembering where it was opened from, so its
   * back button can return there.
   */
  openSetting: (screen: Screen) => void
  backFromSetting: () => void
  /** Append a pet from the "alta de mascota" form; returns to the booking wizard when it came from there. */
  addPet: (pet: Pet) => void
  /** Where closing the pet form (save or skip) should land. */
  petFormExit: Screen
  /** Pay: create the order, snapshot it, empty the cart and show the confirmation. */
  placeOrder: () => void
  addToCart: (id: number, qty: number) => void
  /** Nudge a line's quantity; a line that reaches 0 is removed. */
  bump: (id: number, delta: number) => void
  /** `upcoming`, soonest first — what the citas list and the home card show. */
  upcomingSorted: Appointment[]
  lines: CartLine[]
  subtotal: number
  shipping: number
  total: number
  cartCount: number
}

const Ctx = createContext<AppApi | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL)

  const set = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }))
  }, [])

  const go = useCallback((screen: Screen) => set({ screen }), [set])

  const setBooking = useCallback((patch: Partial<BookingDraft>) => {
    setState((s) => ({ ...s, bk: { ...s.bk, ...patch } }))
  }, [])

  const startBooking = useCallback(() => {
    set({ screen: 'book', bookStep: 1, reschedId: null, bk: EMPTY_BOOKING })
  }, [set])

  const startReschedule = useCallback((appt: Appointment) => {
    setState((s) => {
      const type: ServiceType = appt.type === 'MÉDICO' ? 'Médico' : 'Estética'
      const service = CATALOG[type].findIndex((x) => x.name === appt.service)
      return {
        ...s,
        screen: 'book',
        bookStep: 4,
        reschedId: s.upcoming.indexOf(appt),
        bk: {
          pet: Math.max(
            0,
            s.pets.findIndex((p) => p.name === appt.pet),
          ),
          type,
          service: service >= 0 ? service : 0,
          provider: 0,
          day: null,
          time: null,
        },
      }
    })
  }, [])

  const confirmBooking = useCallback(() => {
    setState((s) => {
      const { bk } = s
      const isMed = bk.type === 'Médico'
      const service = bk.service != null ? CATALOG[bk.type][bk.service] : null
      const provider = bk.provider != null ? PROVIDERS[bk.type][bk.provider] : null
      const pet = s.pets[bk.pet] ?? s.pets[0]
      const entry: Appointment = {
        type: bk.type.toUpperCase(),
        tagBg: isMed ? '#EAFBFA' : '#FFE6F1',
        tagFg: isMed ? '#0F8F88' : '#C0186A',
        accent: isMed ? '#46DED5' : '#E9207F',
        status: 'CONFIRMADA',
        service: service ? service.name : 'Consulta general',
        pet: pet.name,
        provider: provider ? provider.name : 'Sin preferencia',
        date: `${bk.day} ${MONTH.short}`,
        time: `${bk.time} h`,
        actionable: true,
      }
      const upcoming = s.upcoming.filter((_, i) => i !== s.reschedId).concat([entry])
      return { ...s, upcoming, reschedId: null, screen: 'bookdone' }
    })
  }, [])

  const askCancel = useCallback((appt: Appointment) => {
    setState((s) => ({ ...s, cancelId: s.upcoming.indexOf(appt) }))
  }, [])

  const dismissCancel = useCallback(() => set({ cancelId: null }), [set])

  const confirmCancel = useCallback(() => {
    setState((s) => {
      const a = s.cancelId != null ? s.upcoming[s.cancelId] : null
      if (!a) return { ...s, cancelId: null }
      const dead: Appointment = {
        ...a,
        status: 'CANCELADA',
        actionable: false,
        accent: '#DDD5FA',
        tagBg: '#F1EDFD',
        tagFg: '#6F6AA0',
      }
      return {
        ...s,
        upcoming: s.upcoming.filter((_, i) => i !== s.cancelId),
        past: [dead, ...s.past],
        cancelId: null,
        apptTab: 'past',
      }
    })
  }, [])

  const openSetting = useCallback((screen: Screen) => {
    setState((s) => ({
      ...s,
      screen,
      settingFrom: ['checkout', 'auth', 'forgot'].includes(s.screen) ? s.screen : 'profile',
    }))
  }, [])

  const backFromSetting = useCallback(() => {
    setState((s) => ({ ...s, screen: s.settingFrom }))
  }, [])

  const addPet = useCallback((pet: Pet) => {
    setState((s) => ({
      ...s,
      pets: [...s.pets, pet],
      screen: s.settingFrom === 'book' ? 'book' : 'home',
    }))
  }, [])

  const placeOrder = useCallback(() => {
    setState((s) => {
      const sub = s.cart.reduce((a, c) => {
        const p = PRODUCTS.find((x) => x.id === c.id)
        return p ? a + p.price * c.qty : a
      }, 0)
      const ship = s.delivery === 'pickup' || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
      const count = s.cart.reduce((a, c) => a + c.qty, 0)
      const total = sub + ship
      const folio = `#PX-${s.orderSeq}`
      const delLabel = s.delivery === 'home' ? 'Envío a domicilio' : 'Recolección en tienda'
      const order: Order = {
        id: folio,
        status: 'PAGADO',
        ...STATUS_TAGS.PAGADO,
        meta: `${count} ${count === 1 ? 'producto' : 'productos'} · ${delLabel} · 27 ago`,
        total:
          '$' +
          total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      }
      return {
        ...s,
        screen: 'orderdone',
        cart: [],
        coStep: 1,
        orders: [order, ...s.orders],
        orderSeq: s.orderSeq + 1,
        lastOrder: { id: folio, total, delivery: s.delivery },
      }
    })
  }, [])

  const addToCart = useCallback((id: number, qty: number) => {
    setState((s) => {
      const cart = s.cart.slice()
      const i = cart.findIndex((c) => c.id === id)
      if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty }
      else cart.push({ id, qty })
      return { ...s, cart }
    })
  }, [])

  const bump = useCallback((id: number, delta: number) => {
    setState((s) => ({
      ...s,
      cart: s.cart
        .map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0),
    }))
  }, [])

  const upcomingSorted = useMemo(
    () => state.upcoming.slice().sort((a, b) => monthRank(a.date) - monthRank(b.date)),
    [state.upcoming],
  )

  const lines = useMemo<CartLine[]>(
    () =>
      state.cart.flatMap((c) => {
        const p = PRODUCTS.find((x) => x.id === c.id)
        return p ? [{ ...p, qty: c.qty, sub: p.price * c.qty }] : []
      }),
    [state.cart],
  )

  const subtotal = useMemo(() => lines.reduce((a, l) => a + l.sub, 0), [lines])

  const shipping =
    state.delivery === 'pickup' || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE

  const value: AppApi = {
    state,
    set,
    go,
    setBooking,
    startBooking,
    startReschedule,
    confirmBooking,
    askCancel,
    dismissCancel,
    confirmCancel,
    openSetting,
    backFromSetting,
    addPet,
    petFormExit: state.settingFrom === 'book' ? 'book' : 'home',
    placeOrder,
    addToCart,
    bump,
    upcomingSorted,
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    cartCount: lines.reduce((a, l) => a + l.qty, 0),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppApi {
  const api = useContext(Ctx)
  if (!api) throw new Error('useApp must be used inside <AppProvider>')
  return api
}
