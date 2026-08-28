'use client'
// Pantalla de sala (SPEC s.21): vista pasiva, solo contenido público.

import { use, useEffect, useState } from 'react'
import { StoreProvider } from '@/store'
import { Room } from '@/screens/room/Room'

export default function SalaPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params)
  const [ejercicioId, setEjercicioId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/salas/${encodeURIComponent(codigo)}`)
      .then(async (res) => {
        if (!res.ok) setError('Código de sala incorrecto.')
        else setEjercicioId(((await res.json()) as { ejercicio_id: string }).ejercicio_id)
      })
      .catch(() => setError('Sin conexión.'))
  }, [codigo])

  if (error) return <div className="tt-vacio"><h2>{error}</h2></div>
  if (!ejercicioId) return <div className="tt-vacio"><h2>Cargando…</h2></div>
  return (
    <StoreProvider ejercicioId={ejercicioId} sala>
      <Room />
    </StoreProvider>
  )
}
