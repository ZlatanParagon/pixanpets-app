import { C } from '../theme'
import { useApp } from '../store'
import type { Screen } from '../types'
import { Icon, type IconName } from './Icon'

const TABS: { screen: Screen; label: string; icon: IconName }[] = [
  { screen: 'home', label: 'Inicio', icon: 'home' },
  { screen: 'citas', label: 'Citas', icon: 'calendar' },
  { screen: 'shop', label: 'Tienda', icon: 'bag' },
  { screen: 'tips', label: 'Consejos', icon: 'bulb' },
  { screen: 'profile', label: 'Perfil', icon: 'user' },
]

/** The screens that show the tab bar. */
export const TAB_SCREENS: Screen[] = TABS.map((t) => t.screen)

export function TabBar() {
  const { state, go, cartCount } = useApp()

  return (
    <nav className="tabbar" aria-label="Navegación principal">
      {TABS.map((t) => {
        const on = state.screen === t.screen
        const color = on ? C.indigo : C.idle
        return (
          <button
            key={t.screen}
            type="button"
            className="tabbar__item"
            onClick={() => go(t.screen)}
            aria-current={on ? 'page' : undefined}
          >
            <Icon name={t.icon} size={24} color={color} />
            <span className="tabbar__label" style={{ color }}>
              {t.label}
            </span>
            {t.screen === 'shop' && cartCount > 0 && (
              <span className="tabbar__badge">{cartCount}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
