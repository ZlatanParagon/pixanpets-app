// Reinicio de un ejercicio: purga la cronología y la presencia conservando la
// configuración (código de sala incluido), para repetir un recorrido de prueba.
// Solo el director. La purga de datos es una operación prevista por el SPEC
// (retención, s.28); aquí es explícita y con confirmación en la UI.

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSesionArseg } from '@/lib/auth'
import { getEjercicio } from '@/lib/ejercicios'

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const sesion = await getSesionArseg()
  if (sesion?.perfil !== 'director') {
    return NextResponse.json({ error: 'Solo el director puede reiniciar un ejercicio.' }, { status: 403 })
  }
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })

  const [eventos] = await prisma.$transaction([
    prisma.evento.deleteMany({ where: { ejercicio_id: id } }),
    prisma.presencia.deleteMany({ where: { ejercicio_id: id } }),
  ])
  return NextResponse.json({ ok: true, eventos_borrados: eventos.count })
}
