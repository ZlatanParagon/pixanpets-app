// Exportación — Fase A: cronología completa (CA-20) en CSV y paquete JSON.
// El paquete NO es un "informe final": es evidencia; ARSEG emite el dictamen (SPEC s.36).

import { elapsedMsAt, fmtHMS, fmtHora } from './clock'
import { sortEvents } from './events'
import { COBERTURA_LABEL, coberturaObjetivos } from './coverage'
import { deriveState } from './reducer'
import type { EjercicioConfig, EventoBitacora, Inyeccion } from './types'
import type {
  BranchSelectedPayload,
  CommitmentCreatedPayload,
  DebriefingSubmittedPayload,
  InjectAdhocCreatedPayload,
  InjectAudienceChangedPayload,
  InjectReorderedPayload,
  RoomDisplayChangedPayload,
  DecisionCreatedPayload,
  EscalationAcknowledgedPayload,
  EscalationCreatedPayload,
  InformationRequestedPayload,
  InformationRespondedPayload,
  InjectPayload,
  ObservationCreatedPayload,
  ObservationLinkedPayload,
  ParticipantConnectedPayload,
  PhaseChangedPayload,
  TimeJumpPayload,
} from './events'

const TIPO_LABEL: Record<string, string> = {
  'exercise.started': 'Inicio del ejercicio',
  'exercise.paused': 'Pausa',
  'exercise.resumed': 'Reanudación',
  'exercise.closed': 'Cierre del ejercicio',
  'phase.changed': 'Cambio de fase',
  'narrative.time_jump': 'Salto temporal narrativo',
  'inject.prepared': 'Inyección preparada',
  'inject.dispatched': 'Inyección disparada',
  'inject.closed': 'Inyección cerrada',
  'inject.omitted': 'Inyección omitida',
  'participant.connected': 'Participante conectado',
  'decision.created': 'Decisión registrada',
  'escalation.created': 'Escalamiento',
  'escalation.acknowledged': 'Escalamiento reconocido',
  'information.requested': 'Solicitud de información',
  'information.responded': 'Información respondida',
  'commitment.created': 'Compromiso declarado',
  'observation.created': 'Observación ARSEG',
  'observation.linked': 'Evidencia vinculada a observación',
  'branch.selected': 'Rama seleccionada',
  'inject.adhoc_created': 'Inyección ad hoc creada',
  'inject.reordered': 'Inyección reordenada',
  'inject.audience_changed': 'Audiencia de inyección ajustada',
  'debriefing.submitted': 'Debriefing registrado',
  'room.display_changed': 'Pantalla de sala ajustada',
}

export const TIPO_OBSERVACION_LABEL: Record<string, string> = {
  practica_efectiva: 'Práctica efectiva',
  brecha: 'Brecha',
  oportunidad_mejora: 'Oportunidad de mejora',
  decision_pendiente: 'Decisión pendiente',
  accion_prioritaria: 'Acción prioritaria',
}

export function describeEvento(
  config: EjercicioConfig,
  e: EventoBitacora,
  msel?: Inyeccion[],
): string {
  const catalogo = msel ?? config.inyecciones
  const iny = (id: string) => {
    const x = catalogo.find((i) => i.id === id)
    return x ? `${x.clave} — ${x.titulo}` : id
  }
  const rol = (id: string) => config.roles.find((r) => r.id === id)?.nombre ?? id
  switch (e.type) {
    case 'phase.changed': {
      const p = e.payload as PhaseChangedPayload
      return config.fases.find((f) => f.id === p.fase_id)?.nombre ?? p.fase_id
    }
    case 'narrative.time_jump': {
      const p = e.payload as TimeJumpPayload
      return p.etiqueta
    }
    case 'inject.prepared':
    case 'inject.dispatched':
    case 'inject.closed':
    case 'inject.omitted':
      return iny((e.payload as InjectPayload).inyeccion_id)
    case 'participant.connected': {
      const p = (e.payload as ParticipantConnectedPayload).participante
      return `${p.nombre_visible} (${rol(p.rol_id)})`
    }
    case 'decision.created': {
      const d = (e.payload as DecisionCreatedPayload).decision
      const que =
        d.tipo === 'no_actuar'
          ? 'No actuar por ahora'
          : d.tipo === 'posponer'
            ? 'Posponer'
            : (d.accion_elegida ?? d.accion_libre ?? 'Decisión')
      const lat = d.latencia_seg != null ? ` · latencia ${d.latencia_seg}s` : ''
      return `${rol(d.rol_id)} · ${que} — «${d.justificacion}»${lat}`
    }
    case 'escalation.created': {
      const x = (e.payload as EscalationCreatedPayload).escalamiento
      return `${rol(x.rol_origen_id)} escala a ${rol(x.rol_destino_id)} — «${x.motivo}»`
    }
    case 'escalation.acknowledged': {
      const p = e.payload as EscalationAcknowledgedPayload
      return `escalamiento ${p.escalamiento_id}`
    }
    case 'information.requested': {
      const s = (e.payload as InformationRequestedPayload).solicitud
      const destino = s.dirigida_a_rol_id ? rol(s.dirigida_a_rol_id) : 'facilitador'
      return `${rol(s.solicitada_por_rol_id)} pregunta a ${destino}: «${s.pregunta}»`
    }
    case 'information.responded': {
      const p = e.payload as InformationRespondedPayload
      return `«${p.respuesta}» (${p.fuente_respuesta})`
    }
    case 'commitment.created': {
      const c = (e.payload as CommitmentCreatedPayload).compromiso
      return `${rol(c.rol_responsable_id)}: «${c.descripcion}»${c.plazo_simulado ? ` · plazo ${c.plazo_simulado}` : ''}`
    }
    case 'observation.created': {
      const o = (e.payload as ObservationCreatedPayload).observacion
      const partes = [TIPO_OBSERVACION_LABEL[o.tipo] ?? o.tipo]
      if (o.rol_id) partes.push(rol(o.rol_id))
      return `${partes.join(' · ')} — «${o.descripcion}»`
    }
    case 'observation.linked': {
      const v = (e.payload as ObservationLinkedPayload).vinculo
      return `${v.tipo_referencia} ${v.referencia_id} → observación ${v.observacion_id}`
    }
    case 'branch.selected': {
      const p = e.payload as BranchSelectedPayload
      const x = catalogo.find((i) => i.id === p.inyeccion_id)
      const rama = x?.consecuencias.find((c) => c.id === p.consecuencia_id)
      return `${x?.clave ?? p.inyeccion_id}: ${rama?.etiqueta ?? p.consecuencia_id}`
    }
    case 'inject.adhoc_created': {
      const x = (e.payload as InjectAdhocCreatedPayload).inyeccion
      return `${x.clave} — ${x.titulo}`
    }
    case 'inject.reordered': {
      const p = e.payload as InjectReorderedPayload
      return iny(p.inyeccion_id)
    }
    case 'inject.audience_changed': {
      const p = e.payload as InjectAudienceChangedPayload
      const aud =
        p.audiencia_rol_ids === null
          ? 'todos los roles'
          : p.audiencia_rol_ids.map((r) => rol(r)).join(', ')
      return `${iny(p.inyeccion_id)} → audiencia: ${aud}${p.visible_en_sala ? ' · visible en sala' : ' · no visible en sala'}`
    }
    case 'debriefing.submitted': {
      const d = (e.payload as DebriefingSubmittedPayload).debriefing
      return `${rol(d.rol_id)} — acción a 30 días: «${d.accion_30_dias}»`
    }
    case 'room.display_changed': {
      const p = e.payload as RoomDisplayChangedPayload
      return p.mostrar_inyeccion ? 'proyecta la inyección activa' : 'solo escenario'
    }
    default:
      return ''
  }
}

export function tipoLabel(type: string): string {
  return TIPO_LABEL[type] ?? type
}

function csvCell(v: string | number | null): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Cronología completa en CSV (CA-20). */
export function cronologiaCSV(config: EjercicioConfig, events: EventoBitacora[]): string {
  const ordered = sortEvents(events)
  const estadoCsv = deriveState(config, ordered)
  const participantes = estadoCsv.participantes
  const rows = [
    ['secuencia', 'hora_real', 'tiempo_ejercicio', 'tipo', 'actor_tipo', 'actor', 'detalle', 'evento_id'],
    ...ordered.map((e) => {
      const actor =
        e.actor_tipo === 'participante'
          ? (participantes.find((p) => p.id === e.actor_id)?.nombre_visible ?? (e.actor_id || ''))
          : (e.actor_id ?? '')
      return [
        String(e.sequence ?? ''),
        fmtHora(e.client_timestamp),
        fmtHMS(elapsedMsAt(ordered, e.client_timestamp) / 1000),
        tipoLabel(e.type),
        e.actor_tipo,
        actor,
        describeEvento(config, e, estadoCsv.msel),
        e.id,
      ]
    }),
  ]
  return rows.map((r) => r.map(csvCell).join(',')).join('\n')
}

/** Paquete de evidencia D5 (SPEC s.36/s.37). No es informe final ni dictamen. */
export function paqueteEvidenciaJSON(config: EjercicioConfig, events: EventoBitacora[]): string {
  const ordered = sortEvents(events)
  const estado = deriveState(config, ordered)
  const cobertura = coberturaObjetivos(config, estado)
  return JSON.stringify(
    {
      generado_en: new Date().toISOString(),
      nota: 'Paquete de evidencia del ejercicio (D5). No constituye informe final ni dictamen; ARSEG interpreta la evidencia (D6).',
      ficha: {
        id: config.id,
        nombre: config.nombre,
        cliente: config.cliente,
        fecha: config.fecha,
        escenario: config.escenario,
        estado: estado.estado,
        iniciado_en: estado.iniciado_en,
        cerrado_en: estado.cerrado_en,
      },
      objetivos: config.objetivos,
      fases: config.fases,
      roles: config.roles,
      participantes: estado.participantes,
      msel: estado.msel.map((i) => ({ ...i, ...estado.inyecciones[i.id], rama_seleccionada: estado.ramas[i.id] ?? null })),
      decisiones: estado.decisiones,
      escalamientos: estado.escalamientos,
      solicitudes_informacion: estado.solicitudes,
      compromisos: estado.compromisos,
      observaciones: estado.observaciones.map((o) => ({
        ...o,
        evidencia_vinculada: estado.vinculos.filter((v) => v.observacion_id === o.id),
      })),
      debriefings: estado.debriefings,
      cobertura_objetivos: cobertura.map((c) => ({
        ...c,
        clave: config.objetivos.find((o) => o.id === c.objetivo_id)?.clave,
        estado_texto: COBERTURA_LABEL[c.estado],
      })),
      cronologia: ordered,
    },
    null,
    2,
  )
}

/** Matriz objetivo → evidencia (CA-21): una fila por pieza de evidencia. */
export function matrizObjetivoEvidenciaCSV(
  config: EjercicioConfig,
  events: EventoBitacora[],
): string {
  const ordered = sortEvents(events)
  const estado = deriveState(config, ordered)
  const cobertura = coberturaObjetivos(config, estado)
  const rol = (id: string | null) =>
    id ? (config.roles.find((r) => r.id === id)?.nombre ?? id) : ''

  const rows: (string | number | null)[][] = [
    ['objetivo', 'nombre_objetivo', 'estado_cobertura', 'tipo_evidencia', 'referencia_id', 'inyeccion', 'rol', 'hora', 'detalle'],
  ]
  for (const obj of config.objetivos.filter((o) => o.activo)) {
    const cob = cobertura.find((c) => c.objetivo_id === obj.id)!
    const inys = estado.msel.filter((i) => i.objetivo_ids.includes(obj.id))
    const inyIds = new Set(inys.map((i) => i.id))
    const clave = (id: string) => estado.msel.find((i) => i.id === id)?.clave ?? id
    const base = [obj.clave, obj.nombre, COBERTURA_LABEL[cob.estado]]

    const piezas: (string | number | null)[][] = []
    for (const d of estado.decisiones.filter((d) => inyIds.has(d.inyeccion_id))) {
      piezas.push(['decision', d.id, clave(d.inyeccion_id), rol(d.rol_id), fmtHora(d.registrada_en), d.justificacion])
    }
    for (const x of estado.escalamientos.filter((x) => inyIds.has(x.inyeccion_id))) {
      piezas.push(['escalamiento', x.id, clave(x.inyeccion_id), `${rol(x.rol_origen_id)} → ${rol(x.rol_destino_id)}`, fmtHora(x.escalado_en), x.motivo])
    }
    for (const x of estado.solicitudes.filter((x) => inyIds.has(x.inyeccion_id))) {
      piezas.push(['solicitud_informacion', x.id, clave(x.inyeccion_id), rol(x.solicitada_por_rol_id), fmtHora(x.solicitada_en), x.pregunta])
    }
    for (const x of estado.compromisos.filter((x) => inyIds.has(x.inyeccion_id))) {
      piezas.push(['compromiso', x.id, clave(x.inyeccion_id), rol(x.rol_responsable_id), fmtHora(x.declarado_en), x.descripcion])
    }
    for (const o of estado.observaciones.filter(
      (o) => o.objetivo_id === obj.id || (o.inyeccion_id != null && inyIds.has(o.inyeccion_id)),
    )) {
      piezas.push(['observacion', o.id, o.inyeccion_id ? clave(o.inyeccion_id) : '', rol(o.rol_id), fmtHora(o.marcada_en), `${TIPO_OBSERVACION_LABEL[o.tipo]}: ${o.descripcion}`])
    }

    if (piezas.length === 0) rows.push([...base, 'sin evidencia', '', '', '', '', ''])
    else for (const p of piezas) rows.push([...base, ...p])
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\n')
}
