// Exportaciones (s.36): cronología CSV, matriz objetivo→evidencia y paquete D5.
// Cada exportación queda en la bitácora de auditoría vía el registro de acceso.

import { NextResponse } from 'next/server'
import { getSesionArseg } from '@/lib/auth'
import { getEjercicio, getEventos } from '@/lib/ejercicios'
import { cronologiaCSV, matrizObjetivoEvidenciaCSV, paqueteEvidenciaJSON } from '@/domain/export'
import type { EjercicioConfig } from '@/domain/types'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const sesion = await getSesionArseg()
  if (!sesion) return NextResponse.json({ error: 'Sesión ARSEG requerida.' }, { status: 401 })
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })
  const config = ejercicio.config as unknown as EjercicioConfig
  const eventos = (await getEventos(id)).map((x) => x.evento)

  const fmt = new URL(req.url).searchParams.get('fmt') ?? 'json'
  const stamp = new Date().toISOString().slice(0, 10)
  if (fmt === 'csv') {
    return new NextResponse(cronologiaCSV(config, eventos), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cronologia-${id}-${stamp}.csv"`,
      },
    })
  }
  if (fmt === 'matriz') {
    return new NextResponse(matrizObjetivoEvidenciaCSV(config, eventos), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="matriz-objetivo-evidencia-${id}-${stamp}.csv"`,
      },
    })
  }
  return new NextResponse(paqueteEvidenciaJSON(config, eventos), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="evidencia-d5-${id}-${stamp}.json"`,
    },
  })
}
