// Semilla: usuarios ARSEG iniciales y el ejercicio de referencia PH.
// Credenciales vía variables SEED_* (ver .env.example).

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { EJERCICIO_PH } from '../src/data/ph'

const prisma = new PrismaClient()

async function main() {
  const usuarios = [
    {
      email: process.env.SEED_DIRECTOR_EMAIL ?? 'director@arseg.mx',
      nombre: 'Director de ejercicio',
      perfil: 'director',
      password: process.env.SEED_DIRECTOR_PASSWORD ?? 'arseg-demo',
    },
    {
      email: process.env.SEED_OBSERVADOR_EMAIL ?? 'observador@arseg.mx',
      nombre: 'Observador ARSEG',
      perfil: 'observador',
      password: process.env.SEED_OBSERVADOR_PASSWORD ?? 'arseg-demo',
    },
  ]
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email.toLowerCase() },
      create: {
        email: u.email.toLowerCase(),
        nombre: u.nombre,
        perfil: u.perfil,
        hash: await bcrypt.hash(u.password, 10),
      },
      update: {},
    })
  }

  await prisma.ejercicio.upsert({
    where: { id: EJERCICIO_PH.id },
    create: {
      id: EJERCICIO_PH.id,
      codigo_sala: EJERCICIO_PH.codigo_sala,
      config: EJERCICIO_PH as unknown as object,
      creado_por: 'seed',
    },
    update: {},
  })

  console.log('Semilla aplicada:', usuarios.map((u) => u.email).join(', '), '+', EJERCICIO_PH.id)
}

main().finally(() => prisma.$disconnect())
