import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { crearSesionArseg } from '@/lib/auth'
import { clientIp, rateLimit } from '@/lib/ratelimit'

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10, 60)) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 })
  }
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string
    password?: string
  }
  if (!email || !password) {
    return NextResponse.json({ error: 'Correo y contraseña son necesarios.' }, { status: 400 })
  }
  const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } })
  const hash = usuario?.hash ?? '$2a$10$invalidoinvalidoinvalidoinvalidoinvalidoinvalidoinvalid'
  const valido = await bcrypt.compare(password, hash)
  if (!usuario || !valido) {
    return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 })
  }
  await crearSesionArseg({
    usuario_id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    perfil: usuario.perfil as 'director' | 'observador',
  })
  return NextResponse.json({ nombre: usuario.nombre, perfil: usuario.perfil })
}
