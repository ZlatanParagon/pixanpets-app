import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PETS } from './data/pets'
import { FREE_SHIPPING_FROM, PRODUCTS, SHIPPING_FEE } from './data/products'
import type { CartItem, CartLine, Pet, Screen, ServiceType } from './types'

/** The order number the confirmation screen shows. A real backend assigns this. */
const NEXT_ORDER_ID = '#PX-2857'

export interface BookingDraft {
  /** Index into PETS. */
  pet: number
  type: ServiceType
  /** Index into CATALOG[type], or null while unpicked. */
  service: number | null
  /** Index into PROVIDERS[type], or null while unpicked. */
  provider: number | null
  /** Day of August 2026. */
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
  /** Index into PETS — whose record the cartilla screen shows. */
  recPet: number
  /** Snapshot taken when an order is paid, so the confirmation survives the cart being emptied. */
  lastOrder: PlacedOrder | null
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
  lastOrder: null,
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
  /** Append a pet from the "alta de mascota" form. */
  addPet: (pet: Pet) => void
  /** Pay: snapshot the order, empty the cart and show the confirmation. */
  placeOrder: () => void
  addToCart: (id: number, qty: number) => void
  /** Nudge a line's quantity; a line that reaches 0 is removed. */
  bump: (id: number, delta: number) => void
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
    set({ screen: 'book', bookStep: 1, bk: EMPTY_BOOKING })
  }, [set])

  const addPet = useCallback((pet: Pet) => {
    setState((s) => ({ ...s, pets: [...s.pets, pet], screen: 'home' }))
  }, [])

  const placeOrder = useCallback(() => {
    setState((s) => {
      const sub = s.cart.reduce((a, c) => {
        const p = PRODUCTS.find((x) => x.id === c.id)
        return p ? a + p.price * c.qty : a
      }, 0)
      const ship = s.delivery === 'pickup' || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
      return {
        ...s,
        screen: 'orderdone',
        cart: [],
        coStep: 1,
        lastOrder: { id: NEXT_ORDER_ID, total: sub + ship, delivery: s.delivery },
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
    addPet,
    placeOrder,
    addToCart,
    bump,
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
