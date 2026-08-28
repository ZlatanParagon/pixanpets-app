// Sesiones y tokens — SPEC s.27/s.30.
// Facilitadores/observadores: cuenta ARSEG con cookie de sesión firmada.
// Participantes: sin cuenta; cookie efímera emitida en el check-in.
// Sala: token firmado con expiración embebido en el QR.

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = () => {
  const s = process.env.AUTH_SECRET
  if (!s || s.length < 16) throw new Error('AUTH_SECRET no configurado')
  return new TextEncoder().encode(s)
}

export interface SesionArseg {
  tipo: 'arseg'
  usuario_id: string
  email: string
  nombre: string
  perfil: 'director' | 'observador'
}

export interface SesionParticipante {
  tipo: 'participante'
  ejercicio_id: string
  participante_id: string
  rol_id: string
  nombre_visible: string
}

const ARSEG_COOKIE = 'tt_arseg'
const PARTICIPANTE_COOKIE = 'tt_participante'

async function sign(payload: Record<string, unknown>, horas: number): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${horas}h`)
    .sign(secret())
}

async function verify<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as T
  } catch {
    return null
  }
}

export async function crearSesionArseg(s: Omit<SesionArseg, 'tipo'>) {
  const jar = await cookies()
  jar.set(ARSEG_COOKIE, await sign({ tipo: 'arseg', ...s }, 12), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 3600,
  })
}

export async function cerrarSesionArseg() {
  const jar = await cookies()
  jar.delete(ARSEG_COOKIE)
}

export async function getSesionArseg(): Promise<SesionArseg | null> {
  const jar = await cookies()
  const token = jar.get(ARSEG_COOKIE)?.value
  if (!token) return null
  const s = await verify<SesionArseg>(token)
  return s?.tipo === 'arseg' ? s : null
}

export async function crearSesionParticipante(s: Omit<SesionParticipante, 'tipo'>) {
  const jar = await cookies()
  jar.set(PARTICIPANTE_COOKIE, await sign({ tipo: 'participante', ...s }, 12), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 3600,
  })
}

export async function getSesionParticipante(
  ejercicioId?: string,
): Promise<SesionParticipante | null> {
  const jar = await cookies()
  const token = jar.get(PARTICIPANTE_COOKIE)?.value
  if (!token) return null
  const s = await verify<SesionParticipante>(token)
  if (s?.tipo !== 'participante') return null
  if (ejercicioId && s.ejercicio_id !== ejercicioId) return null // aislamiento por ejercicio (CA-26)
  return s
}

// ── Token de sala (QR) — con expiración, no enumerable (CA-27) ────────────────

export async function firmarTokenSala(codigo_sala: string, horas = 12): Promise<string> {
  return sign({ tipo: 'sala', codigo_sala }, horas)
}

export async function verificarTokenSala(token: string, codigo_sala: string): Promise<boolean> {
  const p = await verify<{ tipo: string; codigo_sala: string }>(token)
  return p?.tipo === 'sala' && p.codigo_sala === codigo_sala
}
