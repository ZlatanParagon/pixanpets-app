// Config del ejercicio: lectura filtrada por superficie y edición (Etapa 0).

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSesionArseg, getSesionParticipante } from '@/lib/auth'
import { getEjercicio, getEventos } from '@/lib/ejercicios'
import { configParaViewer, type Viewer } from '@/lib/viewer'
import { validarConfig } from '@/domain/rules'
import type { EjercicioConfig } from '@/domain/types'

async function resolverViewer(ejercicioId: string, salaParam: string | null): Promise<Viewer | null> {
  const arseg = await getSesionArseg()
  if (arseg) return { tipo: 'arseg' }
  const participante = await getSesionParticipante(ejercicioId)
  if (participante) return { tipo: 'participante', rol_id: participante.rol_id }
  if (salaParam === '1') return { tipo: 'sala' } // vista pasiva: solo contenido público
  return null
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })
  const viewer = await resolverViewer(id, new URL(req.url).searchParams.get('sala'))
  if (!viewer) return NextResponse.json({ error: 'Acceso no autorizado.' }, { status: 401 })
  const config = ejercicio.config as unknown as EjercicioConfig
  return NextResponse.json({ config: configParaViewer(config, viewer), viewer: viewer.tipo })
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const sesion = await getSesionArseg()
  if (sesion?.perfil !== 'director') {
    return NextResponse.json({ error: 'Solo el director edita la configuración.' }, { status: 403 })
  }
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })

  // La configuración estructural solo se edita antes de iniciar (F2: tras el
  // disparo, los cambios en vivo van por eventos ad hoc / audiencia).
  const eventos = await getEventos(id)
  if (eventos.some((x) => x.evento.type === 'exercise.started')) {
    return NextResponse.json(
      { error: 'El ejercicio ya inició: usa inyecciones ad hoc y ajustes de audiencia.' },
      { status: 409 },
    )
  }

  const { config } = (await req.json().catch(() => ({}))) as { config?: EjercicioConfig }
  if (!config || config.id !== id) {
    return NextResponse.json({ error: 'Configuración inválida.' }, { status: 400 })
  }
  const errores = validarConfig(config)
  if (errores.length > 0) return NextResponse.json({ error: errores.join('; ') }, { status: 400 })

  await prisma.ejercicio.update({
    where: { id },
    data: { config: { ...config, codigo_sala: ejercicio.codigo_sala } as unknown as object },
  })
  return NextResponse.json({ ok: true })
}
