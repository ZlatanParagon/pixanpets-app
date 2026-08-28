// Ficha pública mínima de una sala por código: lo necesario para el check-in
// (P1) y para montar la pantalla de sala. Limitado por tasa contra enumeración.

import { NextResponse } from 'next/server'
import { getEjercicioPorCodigo } from '@/lib/ejercicios'
import { clientIp, rateLimit } from '@/lib/ratelimit'
import type { EjercicioConfig } from '@/domain/types'

export async function GET(req: Request, ctx: { params: Promise<{ codigo: string }> }) {
  if (!rateLimit(`sala:${clientIp(req)}`, 30, 60)) {
    return NextResponse.json({ error: 'Demasiadas peticiones.' }, { status: 429 })
  }
  const { codigo } = await ctx.params
  const ejercicio = await getEjercicioPorCodigo(codigo.toUpperCase())
  if (!ejercicio) {
    return NextResponse.json({ error: 'Código de sala incorrecto.' }, { status: 404 })
  }
  const config = ejercicio.config as unknown as EjercicioConfig
  return NextResponse.json({
    ejercicio_id: ejercicio.id,
    nombre: config.nombre,
    cliente: config.cliente,
    fecha: config.fecha,
    reglas_participante: config.reglas_participante,
    roles: config.roles.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      responsabilidades_declaradas: r.responsabilidades_declaradas,
      orden: r.orden,
    })),
  })
}
