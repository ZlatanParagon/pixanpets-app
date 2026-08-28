// Capa de transporte del prototipo: localStorage + BroadcastChannel.
// Es el único módulo a sustituir por WebSocket + API en producción (ARCHITECTURE.md §6).

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { EJERCICIO_PH } from './data/ph'
import { mergeEvents, sortEvents } from './domain/events'
import { deriveState, type DerivedState } from './domain/reducer'
import { puedeRegistrarEvento } from './domain/rules'
import type { EjercicioConfig, EventoBitacora } from './domain/types'

const STORAGE_KEY = 'arseg-tabletop:events:'
const CHANNEL = 'arseg-tabletop'

interface StoreValue {
  config: EjercicioConfig
  events: EventoBitacora[]
  estado: DerivedState
  /** Reloj de pared compartido para re-render (1 Hz). */
  now: number
  /** Añade un evento respetando la guarda de cierre; devuelve false si fue rechazado. */
  append: (event: EventoBitacora) => boolean
  /** Reinicia la sesión de demostración (borra la cronología local). */
  reset: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function loadEvents(exerciseId: string): EventoBitacora[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + exerciseId)
    return raw ? sortEvents(JSON.parse(raw) as EventoBitacora[]) : []
  } catch {
    return []
  }
}

function saveEvents(exerciseId: string, events: EventoBitacora[]) {
  try {
    localStorage.setItem(STORAGE_KEY + exerciseId, JSON.stringify(events))
  } catch {
    // Sin persistencia disponible: la sesión sigue en memoria (modo degradado).
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const config = EJERCICIO_PH
  const [events, setEvents] = useState<EventoBitacora[]>(() => loadEvents(config.id))
  const [now, setNow] = useState(() => Date.now())
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL)
    channelRef.current = ch
    ch.onmessage = (msg: MessageEvent) => {
      if (msg.data?.kind === 'events') {
        setEvents((prev) => mergeEvents(prev, msg.data.events as EventoBitacora[]))
      } else if (msg.data?.kind === 'reset') {
        setEvents([])
      }
    }
    // Respaldo: si otra pestaña escribió localStorage sin canal activo.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY + config.id && e.newValue) {
        setEvents((prev) => mergeEvents(prev, JSON.parse(e.newValue!) as EventoBitacora[]))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      ch.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [config.id])

  useEffect(() => {
    saveEvents(config.id, events)
  }, [config.id, events])

  const estado = useMemo(() => deriveState(config, events), [config, events])

  const value = useMemo<StoreValue>(
    () => ({
      config,
      events,
      estado,
      now,
      append: (event) => {
        // Regla s.43: un ejercicio cerrado no acepta nuevos eventos.
        if (!puedeRegistrarEvento(estado.estado, event.type)) return false
        setEvents((prev) => mergeEvents(prev, [event]))
        channelRef.current?.postMessage({ kind: 'events', events: [event] })
        return true
      },
      reset: () => {
        setEvents([])
        localStorage.removeItem(STORAGE_KEY + config.id)
        channelRef.current?.postMessage({ kind: 'reset' })
      },
    }),
    [config, events, estado, now],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const v = useContext(StoreContext)
  if (!v) throw new Error('useStore requiere StoreProvider')
  return v
}
