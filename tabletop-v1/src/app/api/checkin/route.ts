// Check-in del participante (Etapa 1): código de sala o token QR, sin cuenta.

import { NextResponse } from 'next/server'
import { crearSesionParticipante, verificarTokenSala } from '@/lib/auth'
import { appendEvento, getEjercicioPorCodigo } from '@/lib/ejercicios'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { EVENT_TYPES, makeEvent, uuid } from '@/domain/events'
import type { EjercicioConfig } from '@/domain/types'

export async function POST(req: Request) {
  // Protección contra enumeración de salas (s.27).
  if (!rateLimit(`checkin:${clientIp(req)}`, 12, 60)) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 })
  }
  const body = (await req.json().catch(() => ({}))) as {
    codigo?: string
    token?: string
    nombre?: string
    rol_id?: string
  }
  const codigo = body.codigo?.trim().toUpperCase() ?? ''
  const ejercicio = codigo ? await getEjercicioPorCodigo(codigo) : null
  const tokenValido = body.token ? await verificarTokenSala(body.token, codigo) : false
  if (!ejercicio || (body.token && !tokenValido)) {
    return NextResponse.json({ error: 'Código de sala incorrecto. Verifica con el facilitador.' }, { status: 404 })
  }
  const config = ejercicio.config as unknown as EjercicioConfig
  const rol = config.roles.find((r) => r.id === body.rol_id)
  if (!body.nombre?.trim() || !rol) {
    return NextResponse.json({ error: 'Nombre visible y rol son necesarios.' }, { status: 400 })
  }

  const participante = {
    id: uuid(),
    rol_id: rol.id,
    nombre_visible: body.nombre.trim(),
    conectado_en: Date.now(),
  }
  const resultado = await appendEvento(
    config,
    makeEvent(config.id, EVENT_TYPES.PARTICIPANT_CONNECTED, { participante }, 'participante', participante.id),
  )
  if (!resultado.ok) return NextResponse.json({ error: resultado.motivo }, { status: 409 })

  await crearSesionParticipante({
    ejercicio_id: config.id,
    participante_id: participante.id,
    rol_id: rol.id,
    nombre_visible: participante.nombre_visible,
  })
  return NextResponse.json({
    ejercicio_id: config.id,
    participante_id: participante.id,
    rol_id: rol.id,
    nombre_visible: participante.nombre_visible,
  })
}
