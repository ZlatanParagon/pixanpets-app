// URL de acceso con token de sala firmado y con expiración (CA-27), para el QR.

import { NextResponse } from 'next/server'
import { firmarTokenSala, getSesionArseg } from '@/lib/auth'
import { getEjercicio } from '@/lib/ejercicios'

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const sesion = await getSesionArseg()
  if (!sesion) return NextResponse.json({ error: 'Sesión ARSEG requerida.' }, { status: 401 })
  const ejercicio = await getEjercicio(id)
  if (!ejercicio) return NextResponse.json({ error: 'Ejercicio no encontrado.' }, { status: 404 })
  const token = await firmarTokenSala(ejercicio.codigo_sala, 12)
  const origin = new URL(req.url).origin
  return NextResponse.json({
    url: `${origin}/e/${encodeURIComponent(ejercicio.codigo_sala)}?t=${encodeURIComponent(token)}`,
    codigo_sala: ejercicio.codigo_sala,
  })
}
