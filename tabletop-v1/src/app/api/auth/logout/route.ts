import { NextResponse } from 'next/server'
import { cerrarSesionArseg } from '@/lib/auth'

export async function POST() {
  await cerrarSesionArseg()
  return NextResponse.json({ ok: true })
}
