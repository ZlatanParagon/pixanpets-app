'use client'
// Superficie del participante: check-in y ejecución sobre la misma URL de sala.

import { use, useEffect, useState } from 'react'
import { StoreProvider, useStore } from '@/store'
import { Checkin, getSesionParticipante, type SesionParticipante } from '@/screens/participant/Checkin'
import { Play } from '@/screens/participant/Play'

/**
 * Si el ejercicio fue reiniciado, el check-in previo ya no existe en la
 * cronología: se limpia la sesión local y se vuelve al check-in.
 */
function SesionVigente({ sesion, onInvalida }: { sesion: SesionParticipante; onInvalida: () => void }) {
  const { estado, sincronizado } = useStore()
  useEffect(() => {
    if (sincronizado && !estado.participantes.some((p) => p.id === sesion.participante_id)) {
      sessionStorage.removeItem('arseg-tabletop:participante')
      onInvalida()
    }
  }, [sincronizado, estado.participantes, sesion.participante_id, onInvalida])
  return <Play />
}

export default function ParticipantePage({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { codigo } = use(params)
  const { t } = use(searchParams)
  const [ejercicioId, setEjercicioId] = useState<string | null>(null)
  const [sesion, setSesion] = useState<SesionParticipante | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/salas/${encodeURIComponent(codigo)}`)
      .then(async (res) => {
        if (!res.ok) {
          setError('Código de sala incorrecto. Verifica con el facilitador.')
          return
        }
        const data = (await res.json()) as { ejercicio_id: string }
        setEjercicioId(data.ejercicio_id)
        setSesion(getSesionParticipante(data.ejercicio_id))
      })
      .catch(() => setError('Sin conexión. Intenta de nuevo.'))
  }, [codigo])

  if (error) {
    return (
      <div className="tt-vacio">
        <h2>{error}</h2>
        <p className="tt-small"><a href="/entrar">Volver a intentar</a></p>
      </div>
    )
  }
  if (!ejercicioId) return <div className="tt-vacio"><h2>Verificando la sala…</h2></div>
  if (!sesion) {
    return <Checkin codigo={codigo.toUpperCase()} token={t ?? null} onDone={setSesion} />
  }
  return (
    <StoreProvider ejercicioId={ejercicioId}>
      <SesionVigente sesion={sesion} onInvalida={() => setSesion(null)} />
    </StoreProvider>
  )
}
