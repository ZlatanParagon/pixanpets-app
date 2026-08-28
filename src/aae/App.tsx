import { useEffect, useRef } from 'react'
import { TAB_SCREENS, TabBar } from './components/TabBar'
import { Icon } from './components/Icon'
import { Achievements } from './screens/Achievements'
import { Auth } from './screens/Auth'
import { Case } from './screens/Case'
import { Cert } from './screens/Cert'
import { Certificate } from './screens/Certificate'
import { Checkout } from './screens/Checkout'
import { Coach } from './screens/Coach'
import { Community } from './screens/Community'
import { Diagnostic } from './screens/Diagnostic'
import { Exam } from './screens/Exam'
import { ExamResult } from './screens/ExamResult'
import { Home } from './screens/Home'
import { Lesson } from './screens/Lesson'
import { Module } from './screens/Module'
import { Notifications } from './screens/Notifications'
import { Onboarding } from './screens/Onboarding'
import { Path } from './screens/Path'
import { Paywall } from './screens/Paywall'
import { Practice } from './screens/Practice'
import { Profile } from './screens/Profile'
import { Progress } from './screens/Progress'
import { Quiz } from './screens/Quiz'
import { Thread } from './screens/Thread'
import { AppProvider, useApp } from './store'
import type { Screen } from './types'

const SCREENS: Record<Screen, () => React.JSX.Element | null> = {
  onboard: Onboarding,
  auth: Auth,
  diagnostic: Diagnostic,
  home: Home,
  path: Path,
  module: Module,
  lesson: Lesson,
  quiz: Quiz,
  paywall: Paywall,
  checkout: Checkout,
  practice: Practice,
  exam: Exam,
  examresult: ExamResult,
  case: Case,
  coach: Coach,
  progress: Progress,
  community: Community,
  thread: Thread,
  cert: Cert,
  certificate: Certificate,
  profile: Profile,
  achievements: Achievements,
  notifs: Notifications,
}

function Shell() {
  const { state, open } = useApp()
  const Current = SCREENS[state.screen]
  const frame = useRef<HTMLDivElement>(null)

  // Cada pantalla es una página: arranca arriba, como haría una app real.
  useEffect(() => {
    frame.current?.querySelector('.scroll')?.scrollTo({ top: 0 })
  }, [state.screen, state.lessonId, state.moduleId])

  const tabbed = TAB_SCREENS.includes(state.screen)

  return (
    <div className="app" ref={frame}>
      <Current />
      {/* El acceso flotante al Coach vive sólo en las pestañas: en las vistas
          de detalle taparía el botón principal, que va al final del scroll. */}
      {tabbed && (
        <button
          type="button"
          className="fab"
          onClick={() => open('coach')}
          aria-label="Abrir AAE Coach"
        >
          <Icon name="sparkle" size={20} color="#fff" />
        </button>
      )}
      {tabbed && <TabBar />}
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
