// Acceso a ejercicios y eventos sobre Prisma. El servidor es autoritativo:
// asigna server_ts y la secuencia definitiva; nunca sobrescribe eventos (s.32).

import { prisma } from './db'
import { deriveState } from '@/domain/reducer'
import { puedeRegistrarEvento } from '@/domain/rules'
import { sortEvents } from '@/domain/events'
import type { EjercicioConfig, EventoBitacora } from '@/domain/types'

export async function getEjercicio(id: string) {
  return prisma.ejercicio.findUnique({ where: { id } })
}

export async function getEjercicioPorCodigo(codigo_sala: string) {
  return prisma.ejercicio.findUnique({ where: { codigo_sala } })
}

export async function getEventos(ejercicio_id: string, afterSeq = 0) {
  const rows = await prisma.evento.findMany({
    where: { ejercicio_id, seq: { gt: afterSeq } },
    orderBy: { seq: 'asc' },
  })
  return rows.map((r) => ({
    evento: {
      id: r.id,
      ejercicio_id: r.ejercicio_id,
      type: r.type,
      actor_tipo: r.actor_tipo as EventoBitacora['actor_tipo'],
      actor_id: r.actor_id,
      client_timestamp: r.client_ts,
      payload: r.payload as unknown,
    } satisfies EventoBitacora,
    seq: r.seq,
  }))
}

export async function estadoDerivado(config: EjercicioConfig, ejercicio_id: string) {
  const eventos = (await getEventos(ejercicio_id)).map((x) => x.evento)
  return deriveState(config, sortEvents(eventos))
}

/**
 * Append idempotente con guarda de cierre (s.43). Devuelve false si el
 * ejercicio ya no acepta eventos.
 */
export async function appendEvento(
  config: EjercicioConfig,
  evento: EventoBitacora,
): Promise<{ ok: true } | { ok: false; motivo: string }> {
  const estado = await estadoDerivado(config, config.id)
  if (!puedeRegistrarEvento(estado.estado, evento.type)) {
    return { ok: false, motivo: 'El ejercicio está cerrado: ya no acepta nuevos registros.' }
  }
  await prisma.evento.createMany({
    data: [
      {
        id: evento.id,
        ejercicio_id: config.id,
        type: evento.type,
        actor_tipo: evento.actor_tipo,
        actor_id: evento.actor_id,
        client_ts: evento.client_timestamp,
        payload: evento.payload as object,
      },
    ],
    skipDuplicates: true, // sincronización idempotente por UUID de cliente (s.25)
  })
  return { ok: true }
}

export async function tocarPresencia(ejercicio_id: string, participante_id: string) {
  await prisma.presencia.upsert({
    where: { ejercicio_id_participante_id: { ejercicio_id, participante_id } },
    create: { ejercicio_id, participante_id, last_seen: new Date() },
    update: { last_seen: new Date() },
  })
}

export async function getPresencias(ejercicio_id: string) {
  const rows = await prisma.presencia.findMany({ where: { ejercicio_id } })
  return rows.map((r) => ({ participante_id: r.participante_id, last_seen: r.last_seen.getTime() }))
}

/** Código de sala aleatorio, legible y no predecible (CA-27). */
export function generarCodigoSala(prefijo: string): string {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let sufijo = ''
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  for (const b of bytes) sufijo += abc[b % abc.length]
  return `${prefijo.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'TT'}-${sufijo}`
}
