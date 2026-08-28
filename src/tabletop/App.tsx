import { useEffect, useState } from 'react'
import { StoreProvider } from './store'
import { Join } from './screens/Join'
import { Checkin } from './screens/participant/Checkin'
import { Play } from './screens/participant/Play'
import { Console } from './screens/facilitator/Console'
import { Room } from './screens/room/Room'

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export function navigate(to: string) {
  window.location.hash = to
}

export default function App() {
  const hash = useHashRoute()
  const route = hash.replace(/^#\/?/, '')

  let screen
  if (route.startsWith('checkin')) screen = <Checkin />
  else if (route.startsWith('participante')) screen = <Play />
  else if (route.startsWith('facilitador')) screen = <Console />
  else if (route.startsWith('sala')) screen = <Room />
  else screen = <Join />

  return <StoreProvider>{screen}</StoreProvider>
}
