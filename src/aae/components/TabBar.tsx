import { useApp } from '../store'
import { C } from '../theme'
import type { Screen } from '../types'
import { Icon, type IconName } from './Icon'

const TABS: { screen: Screen; label: string; icon: IconName }[] = [
  { screen: 'home', label: 'Inicio', icon: 'home' },
  { screen: 'path', label: 'Ruta', icon: 'path' },
  { screen: 'practice', label: 'Práctica', icon: 'target' },
  { screen: 'community', label: 'Comunidad', icon: 'users' },
  { screen: 'profile', label: 'Perfil', icon: 'user' },
]

/** Pantallas que muestran la barra inferior. */
export const TAB_SCREENS: Screen[] = TABS.map((t) => t.screen)

export function TabBar() {
  const { state, go } = useApp()

  return (
    <nav className="tabbar" aria-label="Navegación principal">
      {TABS.map((t) => {
        const on = state.screen === t.screen
        const color = on ? C.brand : C.idle
        return (
          <button
            key={t.screen}
            type="button"
            className="tabbar__item"
            onClick={() => go(t.screen)}
            aria-current={on ? 'page' : undefined}
          >
            <Icon name={t.icon} size={23} color={color} />
            <span className="tabbar__label" style={{ color }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
