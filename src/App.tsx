import { useEffect, useRef } from 'react'
import { TAB_SCREENS, TabBar } from './components/TabBar'
import { Article } from './screens/Article'
import { Auth } from './screens/Auth'
import { Book } from './screens/Book'
import { BookDone } from './screens/BookDone'
import { Cart } from './screens/Cart'
import { Checkout } from './screens/Checkout'
import { Citas } from './screens/Citas'
import { Home } from './screens/Home'
import { Notifications } from './screens/Notifications'
import { Onboarding } from './screens/Onboarding'
import { OrderDone } from './screens/OrderDone'
import { Orders } from './screens/Orders'
import { PetNew } from './screens/PetNew'
import { Product } from './screens/Product'
import { Profile } from './screens/Profile'
import { Record } from './screens/Record'
import { Shop } from './screens/Shop'
import { Tips } from './screens/Tips'
import { AppProvider, useApp } from './store'
import type { Screen } from './types'

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  onboard: Onboarding,
  auth: Auth,
  petnew: PetNew,
  home: Home,
  citas: Citas,
  book: Book,
  bookdone: BookDone,
  shop: Shop,
  product: Product,
  cart: Cart,
  checkout: Checkout,
  orderdone: OrderDone,
  orders: Orders,
  tips: Tips,
  article: Article,
  profile: Profile,
  record: Record,
  notifs: Notifications,
}

function Shell() {
  const { state } = useApp()
  const Screen = SCREENS[state.screen]
  const frame = useRef<HTMLDivElement>(null)

  // Each screen is its own page: start it at the top the way a real app would.
  useEffect(() => {
    frame.current?.querySelector('.scroll')?.scrollTo({ top: 0 })
  }, [state.screen])

  return (
    <div className="app" ref={frame}>
      <Screen />
      {TAB_SCREENS.includes(state.screen) && <TabBar />}
    </div>
  )
}

export function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
