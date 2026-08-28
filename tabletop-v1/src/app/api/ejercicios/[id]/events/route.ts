// Cronología: lectura incremental (polling) y append con RBAC y guarda de cierre.

import { NextResponse } from 'next/server'
import { getSesionArseg, getSesionParticipante } from '@/lib/auth'
import {
  appendEvento,
  estadoDerivado,
  getEjercicio,
  getEventos,
  getPresencias,
  getPrimeraSeq,
  tocarPresencia,
} from '@/lib/ejercicios'
import { puedeRegistrar } from '@/lib/rbac'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import { eventosParaViewer, type Viewer } from '@/lib/viewer'
import type { EjercicioConfig, EventoBitacora } from '@/domain/types'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })
  const config = ejercicio.config as unknown as EjercicioConfig

  const url = new URL(req.url)
  const after = Number(url.searchParams.get('after') ?? 0) || 0

  const arseg = await getSesionArseg()
  const participante = arseg ? null : await getSesionParticipante(id)
  let viewer: Viewer
  if (arseg) viewer = { tipo: 'arseg' }
  else if (participante) viewer = { tipo: 'participante', rol_id: participante.rol_id }
  else if (url.searchParams.get('sala') === '1') viewer = { tipo: 'sala' }
  else return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 })

  // El polling del participante mantiene su presencia (conectado/desconectado).
  if (participante) await tocarPresencia(id, participante.participante_id)

  const filas = await getEventos(id, after)
  const eventos = eventosParaViewer(filas.map((f) => f.evento), viewer, config)
  const maxSeq = filas.length > 0 ? filas[filas.length - 1].seq : after
  const presencias = viewer.tipo === 'arseg' ? await getPresencias(id) : undefined
  // `base` cambia únicamente si la cronología fue purgada (reinicio del ejercicio).
  const base = await getPrimeraSeq(id)
  return NextResponse.json({ eventos, seq: maxSeq, presencias, base })
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!rateLimit(`events:${clientIp(req)}`, 120, 60)) {
    return NextResponse.json({ error: 'Demasiadas peticiones.' }, { status: 429 })
  }
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })
  const config = ejercicio.config as unknown as EjercicioConfig

  const arseg = await getSesionArseg()
  const participante = arseg ? null : await getSesionParticipante(id)
  const sesion = arseg ?? participante
  if (!sesion) return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 })

  const { evento } = (await req.json().catch(() => ({}))) as { evento?: EventoBitacora }
  if (!evento?.id || !evento.type || evento.ejercicio_id !== id) {
    return NextResponse.json({ error: 'Evento inválido.' }, { status: 400 })
  }

  const permiso = puedeRegistrar(sesion, evento)
  if (!permiso.ok) return NextResponse.json({ error: permiso.motivo }, { status: 403 })

  // Una sesión de participante anterior a un reinicio del ejercicio ya no
  // corresponde a ningún check-in registrado: debe volver a hacer check-in.
  if (participante) {
    const estado = await estadoDerivado(config, id)
    if (!estado.participantes.some((p) => p.id === participante.participante_id)) {
      return NextResponse.json(
        { error: 'Tu sesión ya no corresponde a este ejercicio. Vuelve a hacer check-in.' },
        { status: 403 },
      )
    }
  }

  const resultado = await appendEvento(config, evento)
  if (!resultado.ok) return NextResponse.json({ error: resultado.motivo }, { status: 409 })
  return NextResponse.json({ ok: true })
}
