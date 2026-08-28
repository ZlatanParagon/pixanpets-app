// Lista y creación de ejercicios (Etapa 0). Solo usuarios ARSEG; crear es de director.

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSesionArseg } from '@/lib/auth'
import { generarCodigoSala, getEventos } from '@/lib/ejercicios'
import { EJERCICIO_PH } from '@/data/ph'
import { validarConfig } from '@/domain/rules'
import type { EjercicioConfig } from '@/domain/types'
import { uuid } from '@/domain/events'

export async function GET() {
  const sesion = await getSesionArseg()
  if (!sesion) return NextResponse.json({ error: 'Sesión ARSEG requerida.' }, { status: 401 })
  const ejercicios = await prisma.ejercicio.findMany({ orderBy: { creado_en: 'desc' } })
  const lista = await Promise.all(
    ejercicios.map(async (e) => {
      const config = e.config as unknown as EjercicioConfig
      const eventos = await getEventos(e.id)
      const iniciado = eventos.some((x) => x.evento.type === 'exercise.started')
      const cerrado = eventos.some((x) => x.evento.type === 'exercise.closed')
      return {
        id: e.id,
        nombre: config.nombre,
        cliente: config.cliente,
        fecha: config.fecha,
        codigo_sala: e.codigo_sala,
        estado: cerrado ? 'cerrado' : iniciado ? 'en_curso' : 'preparado',
        eventos: eventos.length,
      }
    }),
  )
  return NextResponse.json({ ejercicios: lista })
}

export async function POST(req: Request) {
  const sesion = await getSesionArseg()
  if (sesion?.perfil !== 'director') {
    return NextResponse.json({ error: 'Solo el director de ejercicio crea ejercicios.' }, { status: 403 })
  }
  const body = (await req.json().catch(() => ({}))) as {
    nombre?: string
    cliente?: string
    fecha?: string
    plantilla?: 'ph' | 'vacio'
  }
  if (!body.nombre?.trim() || !body.cliente?.trim()) {
    return NextResponse.json({ error: 'Nombre y cliente son necesarios.' }, { status: 400 })
  }

  const id = 'ej-' + uuid()
  const codigo_sala = generarCodigoSala(body.cliente)
  const base: EjercicioConfig =
    body.plantilla === 'vacio'
      ? {
          ...EJERCICIO_PH,
          objetivos: EJERCICIO_PH.objetivos, // los TT-01..10 son la base de referencia (s.4)
          roles: [],
          inyecciones: [],
          escenario: '',
        }
      : EJERCICIO_PH

  const config: EjercicioConfig = {
    ...base,
    id,
    nombre: body.nombre.trim(),
    cliente: body.cliente.trim(),
    fecha: body.fecha || new Date().toISOString().slice(0, 10),
    codigo_sala,
    qr_token: uuid(),
  }
  const errores = validarConfig(config)
  if (errores.length > 0) return NextResponse.json({ error: errores.join('; ') }, { status: 400 })

  await prisma.ejercicio.create({
    data: { id, codigo_sala, config: config as unknown as object, creado_por: sesion.usuario_id },
  })
  return NextResponse.json({ id, codigo_sala })
}
