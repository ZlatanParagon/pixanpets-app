'use client'
// Capa de transporte v1: API REST + polling incremental (SPEC s.26: WebSocket
// no es sostenible en serverless de Vercel; SSE/polling es la degradación
// prevista). Mismo contrato que el prototipo: config, events, estado, append.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { mergeEvents, sortEvents } from '@/domain/events'
import { deriveState, type DerivedState } from '@/domain/reducer'
import { puedeRegistrarEvento } from '@/domain/rules'
import type { EjercicioConfig, EventoBitacora } from '@/domain/types'

const POLL_MS = 1500

export interface Presencia {
  participante_id: string
  last_seen: number
}

interface StoreValue {
  config: EjercicioConfig
  events: EventoBitacora[]
  estado: DerivedState
  now: number
  /** Añade un evento (optimista) y lo envía al servidor; false si el cierre lo impide. */
  append: (event: EventoBitacora) => boolean
  /** Última respuesta de rechazo del servidor, para mostrarla en la UI. */
  ultimoError: string | null
  /** Presencia de participantes (solo llega a sesiones ARSEG). */
  presencias: Presencia[]
  /** Fuerza una recarga de la configuración (tras editarla). */
  recargarConfig: () => Promise<void>
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({
  ejercicioId,
  sala = false,
  children,
  cargando = null,
}: {
  ejercicioId: string
  /** true para la pantalla de sala (acceso pasivo sin sesión). */
  sala?: boolean
  children: ReactNode
  cargando?: ReactNode
}) {
  const [config, setConfig] = useState<EjercicioConfig | null>(null)
  const [serverEvents, setServerEvents] = useState<EventoBitacora[]>([])
  const [pending, setPending] = useState<EventoBitacora[]>([])
  const [presencias, setPresencias] = useState<Presencia[]>([])
  const [ultimoError, setUltimoError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const seqRef = useRef(0)
  const salaQS = sala ? '&sala=1' : ''

  const recargarConfig = useCallback(async () => {
    const res = await fetch(`/api/ejercicios/${ejercicioId}?x=1${salaQS}`)
    if (res.ok) setConfig((await res.json()).config as EjercicioConfig)
  }, [ejercicioId, salaQS])

  useEffect(() => {
    void recargarConfig()
  }, [recargarConfig])

  useEffect(() => {
    let vivo = true
    const poll = async () => {
      try {
        const res = await fetch(`/api/ejercicios/${ejercicioId}/events?after=${seqRef.current}${salaQS}`)
        if (!res.ok || !vivo) return
        const data = (await res.json()) as {
          eventos: EventoBitacora[]
          seq: number
          presencias?: Presencia[]
        }
        seqRef.current = Math.max(seqRef.current, data.seq)
        if (data.eventos.length > 0) {
          setServerEvents((prev) => mergeEvents(prev, data.eventos))
          const llegaron = new Set(data.eventos.map((e) => e.id))
          setPending((prev) => prev.filter((e) => !llegaron.has(e.id)))
        }
        if (data.presencias) setPresencias(data.presencias)
      } catch {
        // Sin red: el estado local sigue visible; se reintenta en el siguiente tick.
      }
    }
    void poll()
    const t = setInterval(poll, POLL_MS)
    const reloj = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      vivo = false
      clearInterval(t)
      clearInterval(reloj)
    }
  }, [ejercicioId, salaQS])

  const events = useMemo(() => mergeEvents(serverEvents, pending), [serverEvents, pending])
  const estado = useMemo(
    () => (config ? deriveState(config, events) : null),
    [config, events],
  )

  const append = useCallback(
    (evento: EventoBitacora): boolean => {
      if (!estado || !puedeRegistrarEvento(estado.estado, evento.type)) return false
      setPending((prev) => sortEvents([...prev, evento]))
      void fetch(`/api/ejercicios/${ejercicioId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento }),
      }).then(async (res) => {
        if (!res.ok) {
          setPending((prev) => prev.filter((e) => e.id !== evento.id))
          const data = (await res.json().catch(() => null)) as { error?: string } | null
          setUltimoError(data?.error ?? 'El servidor rechazó el registro.')
        }
      })
      return true
    },
    [ejercicioId, estado],
  )

  const value = useMemo<StoreValue | null>(
    () =>
      config && estado
        ? { config, events, estado, now, append, ultimoError, presencias, recargarConfig }
        : null,
    [config, events, estado, now, append, ultimoError, presencias, recargarConfig],
  )

  if (!value) {
    return <>{cargando ?? <div className="tt-vacio"><h2>Cargando…</h2></div>}</>
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const v = useContext(StoreContext)
  if (!v) throw new Error('useStore requiere StoreProvider')
  return v
}
