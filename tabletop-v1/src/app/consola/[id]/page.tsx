'use client'
// Consola de un ejercicio: la sesión ARSEG viene del servidor (/api/me).

import { use, useEffect, useState } from 'react'
import { StoreProvider } from '@/store'
import { Console } from '@/screens/facilitator/Console'

export default function ConsolaEjercicio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      const data = (await res.json()) as {
        tipo: string
        perfil?: string
        nombre?: string
        usuario_id?: string
      }
      if (data.tipo !== 'arseg') {
        window.location.href = '/login'
        return
      }
      sessionStorage.setItem(
        'arseg-tabletop:facilitador',
        JSON.stringify({ perfil: data.perfil, nombre: data.nombre, usuario_id: data.usuario_id }),
      )
      setListo(true)
    })
  }, [])

  if (!listo) return <div className="tt-vacio"><h2>Cargando…</h2></div>
  return (
    <StoreProvider ejercicioId={id}>
      <Console />
    </StoreProvider>
  )
}
