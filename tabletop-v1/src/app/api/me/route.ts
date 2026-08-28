import { NextResponse } from 'next/server'
import { getSesionArseg, getSesionParticipante } from '@/lib/auth'

export async function GET() {
  const arseg = await getSesionArseg()
  if (arseg) return NextResponse.json(arseg)
  const participante = await getSesionParticipante()
  if (participante) return NextResponse.json(participante)
  return NextResponse.json({ tipo: 'anonimo' })
}
