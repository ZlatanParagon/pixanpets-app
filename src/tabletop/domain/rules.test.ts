// Tests mínimos obligatorios de dominio — SPEC sección 43.

import { describe, expect, it } from 'vitest'
import { EJERCICIO_PH, ROLES } from '../data/ph'
import { elapsedMsAt, narrativeSecAt } from './clock'
import { EVENT_TYPES, makeEvent, mergeEvents, sortEvents } from './events'
import { deriveState } from './reducer'
import {
  esCapturaTardia,
  estadoRespuestaRol,
  inyeccionVisibleEnSala,
  inyeccionVisibleParaRol,
  latenciaSeg,
  puedeRegistrarEvento,
  validarConfig,
} from './rules'
import type { Decision, EventoBitacora } from './types'

const cfg = EJERCICIO_PH
const EID = cfg.id
const T0 = 1_000_000_000_000

const started = (t = T0) =>
  makeEvent(EID, EVENT_TYPES.EXERCISE_STARTED, {}, 'facilitador', 'arseg', t)
const dispatched = (inyeccion_id: string, t: number) =>
  makeEvent(EID, EVENT_TYPES.INJECT_DISPATCHED, { inyeccion_id }, 'facilitador', 'arseg', t)

const mkDecision = (over: Partial<Decision>): Decision => ({
  id: 'dec-' + Math.random().toString(36).slice(2),
  inyeccion_id: 'iny-01',
  participante_id: 'p1',
  rol_id: ROLES.CISO,
  tipo: 'decision',
  accion_elegida: null,
  accion_libre: 'Contener',
  justificacion: 'Evidencia suficiente',
  severidad_percibida: 'alta',
  registrada_en: T0,
  latencia_seg: null,
  ...over,
})

describe('no respuesta (s.13)', () => {
  const iny01 = cfg.inyecciones.find((i) => i.clave === 'INY-01')! // espera CISO y TI, ventana 420s
  const events = sortEvents([started(), dispatched(iny01.id, T0 + 10_000)])
  const estado = deriveState(cfg, events)
  const est = estado.inyecciones[iny01.id]

  it('solo existe si el rol tenía respuesta esperada y la ventana expiró sin acción', () => {
    const expirado = elapsedMsAt(events, T0 + 10_000 + 421_000)
    expect(estadoRespuestaRol(iny01, est, [], ROLES.CISO, expirado)).toBe('no_respuesta')
  })

  it('antes de expirar la ventana es pendiente, no omisión', () => {
    const abierto = elapsedMsAt(events, T0 + 10_000 + 60_000)
    expect(estadoRespuestaRol(iny01, est, [], ROLES.CISO, abierto)).toBe('pendiente')
  })

  it('quien recibió sin respuesta esperada queda no_aplica, nunca omisión', () => {
    const expirado = elapsedMsAt(events, T0 + 10_000 + 421_000)
    expect(estadoRespuestaRol(iny01, est, [], ROLES.LEGAL, expirado)).toBe('no_aplica')
  })

  it('una decisión registrada cuenta como respuesta', () => {
    const d = mkDecision({ inyeccion_id: iny01.id, rol_id: ROLES.CISO })
    const expirado = elapsedMsAt(events, T0 + 10_000 + 421_000)
    expect(estadoRespuestaRol(iny01, est, [d], ROLES.CISO, expirado)).toBe('respondio')
  })
})

describe('audiencia e inyecciones privadas (s.18, s.21)', () => {
  const privada = cfg.inyecciones.find((i) => i.clave === 'INY-05')! // Legal, DG, CISO
  const publica = cfg.inyecciones.find((i) => i.clave === 'INY-02')!

  it('una inyección dirigida no es visible fuera de su audiencia', () => {
    expect(inyeccionVisibleParaRol(privada, ROLES.LEGAL)).toBe(true)
    expect(inyeccionVisibleParaRol(privada, ROLES.OPS)).toBe(false)
  })

  it('la sala solo ve inyecciones marcadas visibles', () => {
    expect(inyeccionVisibleEnSala(privada)).toBe(false)
    expect(inyeccionVisibleEnSala(publica)).toBe(true)
  })

  it('audiencia null significa todos los roles', () => {
    expect(inyeccionVisibleParaRol(publica, ROLES.RH)).toBe(true)
  })
})

describe('eventos y cronología (s.31, s.32, s.43)', () => {
  it('toda decisión vive como evento y aparece en el estado derivado', () => {
    const d = mkDecision({})
    const events = sortEvents([
      started(),
      makeEvent(EID, EVENT_TYPES.DECISION_CREATED, { decision: d }, 'participante', 'p1', T0 + 5000),
    ])
    expect(deriveState(cfg, events).decisiones).toHaveLength(1)
  })

  it('la fusión de eventos es idempotente y no destruye eventos previos', () => {
    const a = started()
    const b = dispatched('iny-01', T0 + 1000)
    const merged = mergeEvents([a, b], [b, a])
    expect(merged).toHaveLength(2)
    expect(merged.map((e) => e.sequence)).toEqual([1, 2])
  })

  it('un ejercicio cerrado no acepta nuevos eventos', () => {
    const events = sortEvents([
      started(),
      makeEvent(EID, EVENT_TYPES.EXERCISE_CLOSED, {}, 'facilitador', 'arseg', T0 + 1000),
    ])
    const estado = deriveState(cfg, events)
    expect(estado.estado).toBe('cerrado')
    expect(puedeRegistrarEvento(estado.estado, EVENT_TYPES.DECISION_CREATED)).toBe(false)
    expect(puedeRegistrarEvento('en_curso', EVENT_TYPES.DECISION_CREATED)).toBe(true)
  })
})

describe('reloj compartido (s.15)', () => {
  const events: EventoBitacora[] = sortEvents([
    started(),
    makeEvent(EID, EVENT_TYPES.EXERCISE_PAUSED, {}, 'facilitador', 'arseg', T0 + 60_000),
    makeEvent(EID, EVENT_TYPES.EXERCISE_RESUMED, {}, 'facilitador', 'arseg', T0 + 120_000),
    makeEvent(
      EID,
      EVENT_TYPES.NARRATIVE_TIME_JUMP,
      { salto_seg: 12 * 3600, etiqueta: '+12 horas' },
      'facilitador',
      'arseg',
      T0 + 130_000,
    ),
  ])

  it('la pausa congela el tiempo de ejercicio', () => {
    expect(elapsedMsAt(events, T0 + 90_000)).toBe(60_000)
    expect(elapsedMsAt(events, T0 + 150_000)).toBe(90_000)
  })

  it('el salto narrativo no modifica el reloj técnico', () => {
    expect(elapsedMsAt(events, T0 + 150_000)).toBe(90_000)
    expect(narrativeSecAt(events, T0 + 150_000)).toBe(90 + 12 * 3600)
  })

  it('la latencia se calcula en tiempo de ejercicio y conserva referencia al disparo', () => {
    const all = sortEvents([...events, dispatched('iny-01', T0 + 150_000)])
    const est = deriveState(cfg, all).inyecciones['iny-01']
    expect(est.disparada_elapsed_ms).toBe(90_000)
    expect(latenciaSeg(est, elapsedMsAt(all, T0 + 200_000))).toBe(50)
  })

  it('la captura tardía se acepta y se marca (s.16)', () => {
    const iny01 = cfg.inyecciones.find((i) => i.clave === 'INY-01')!
    const all = sortEvents([...events, dispatched(iny01.id, T0 + 150_000)])
    const est = deriveState(cfg, all).inyecciones[iny01.id]
    expect(esCapturaTardia(iny01, est, elapsedMsAt(all, T0 + 150_000 + 100_000))).toBe(false)
    expect(esCapturaTardia(iny01, est, elapsedMsAt(all, T0 + 150_000 + 500_000))).toBe(true)
  })
})

describe('escalamiento (s.14, CA-10, CA-11)', () => {
  const iny02 = cfg.inyecciones.find((i) => i.clave === 'INY-02')!
  const esc = {
    id: 'esc-1',
    inyeccion_id: iny02.id,
    participante_origen_id: 'p1',
    rol_origen_id: ROLES.CISO,
    rol_destino_id: ROLES.DG,
    motivo: 'Requiere decisión ejecutiva',
    urgencia: 'alta' as const,
    escalado_en: T0 + 20_000,
  }

  it('registra origen, destino y hora, y el reconocimiento conserva la hora', () => {
    const events = sortEvents([
      started(),
      dispatched(iny02.id, T0 + 10_000),
      makeEvent(EID, EVENT_TYPES.ESCALATION_CREATED, { escalamiento: esc }, 'participante', 'p1', T0 + 20_000),
      makeEvent(
        EID,
        EVENT_TYPES.ESCALATION_ACKNOWLEDGED,
        { escalamiento_id: 'esc-1', participante_id: 'p2' },
        'participante',
        'p2',
        T0 + 30_000,
      ),
    ])
    const derivado = deriveState(cfg, events).escalamientos[0]
    expect(derivado.rol_origen_id).toBe(ROLES.CISO)
    expect(derivado.rol_destino_id).toBe(ROLES.DG)
    expect(derivado.escalado_en).toBe(T0 + 20_000)
    expect(derivado.reconocido_en).toBe(T0 + 30_000)
  })

  it('se vincula con la primera acción posterior del rol destino (CA-11)', () => {
    const dDG = mkDecision({
      id: 'dec-dg',
      inyeccion_id: iny02.id,
      rol_id: ROLES.DG,
      participante_id: 'p2',
      registrada_en: T0 + 45_000,
    })
    const events = sortEvents([
      started(),
      dispatched(iny02.id, T0 + 10_000),
      makeEvent(EID, EVENT_TYPES.ESCALATION_CREATED, { escalamiento: esc }, 'participante', 'p1', T0 + 20_000),
      makeEvent(EID, EVENT_TYPES.DECISION_CREATED, { decision: dDG }, 'participante', 'p2', T0 + 45_000),
    ])
    const derivado = deriveState(cfg, events).escalamientos[0]
    expect(derivado.decision_destino_id).toBe('dec-dg')
    expect(derivado.accion_destino_en).toBe(T0 + 45_000)
  })
})

describe('solicitudes y compromisos (CA-12, CA-13)', () => {
  const iny01 = cfg.inyecciones.find((i) => i.clave === 'INY-01')!

  it('una solicitud registra pregunta y tiempos de solicitud y respuesta', () => {
    const sol = {
      id: 'sol-1',
      inyeccion_id: iny01.id,
      solicitada_por_participante_id: 'p1',
      solicitada_por_rol_id: ROLES.DG,
      dirigida_a_rol_id: ROLES.CISO,
      pregunta: '¿Cuál es el alcance confirmado?',
      solicitada_en: T0 + 15_000,
    }
    const events = sortEvents([
      started(),
      dispatched(iny01.id, T0 + 10_000),
      makeEvent(EID, EVENT_TYPES.INFORMATION_REQUESTED, { solicitud: sol }, 'participante', 'p1', T0 + 15_000),
      makeEvent(
        EID,
        EVENT_TYPES.INFORMATION_RESPONDED,
        { solicitud_id: 'sol-1', respuesta: 'Dos sistemas confirmados', fuente_respuesta: 'participante' },
        'participante',
        'p2',
        T0 + 90_000,
      ),
    ])
    const s = deriveState(cfg, events).solicitudes[0]
    expect(s.pregunta).toContain('alcance')
    expect(s.solicitada_en).toBe(T0 + 15_000)
    expect(s.respondida_en).toBe(T0 + 90_000)
    expect(s.respuesta).toBe('Dos sistemas confirmados')
  })

  it('un compromiso registra responsable y momento', () => {
    const com = {
      id: 'com-1',
      inyeccion_id: iny01.id,
      descripcion: 'Entregar evaluación de alcance',
      participante_responsable_id: 'p1',
      rol_responsable_id: ROLES.CISO,
      rol_solicitante_id: ROLES.DG,
      plazo_simulado: '2 horas',
      criterio_cumplimiento: 'Reporte entregado al comité',
      declarado_en: T0 + 20_000,
    }
    const events = sortEvents([
      started(),
      dispatched(iny01.id, T0 + 10_000),
      makeEvent(EID, EVENT_TYPES.COMMITMENT_CREATED, { compromiso: com }, 'participante', 'p1', T0 + 20_000),
    ])
    const c = deriveState(cfg, events).compromisos[0]
    expect(c.rol_responsable_id).toBe(ROLES.CISO)
    expect(c.declarado_en).toBe(T0 + 20_000)
  })
})

describe('observaciones y evidencia vinculada (s.11)', () => {
  const obs = {
    id: 'obs-1',
    inyeccion_id: 'iny-02',
    objetivo_id: 'tt-02',
    rol_id: ROLES.LEGAL,
    fase_id: 'fase-activacion',
    tipo: 'oportunidad_mejora' as const,
    descripcion: 'El escalamiento tardó en ser reconocido',
    severidad: null,
    marcada_en: T0 + 50_000,
    creada_por_usuario_id: 'arseg-obs-1',
  }

  it('la observación vive como evento y el vínculo de evidencia es idempotente', () => {
    const vinculo = {
      id: 'vin-1',
      observacion_id: 'obs-1',
      tipo_referencia: 'decision' as const,
      referencia_id: 'dec-038',
    }
    const events = sortEvents([
      started(),
      makeEvent(EID, EVENT_TYPES.OBSERVATION_CREATED, { observacion: obs }, 'facilitador', 'arseg', T0 + 50_000),
      makeEvent(EID, EVENT_TYPES.OBSERVATION_LINKED, { vinculo }, 'facilitador', 'arseg', T0 + 51_000),
      makeEvent(EID, EVENT_TYPES.OBSERVATION_LINKED, { vinculo: { ...vinculo, id: 'vin-2' } }, 'facilitador', 'arseg', T0 + 52_000),
    ])
    const st = deriveState(cfg, events)
    expect(st.observaciones).toHaveLength(1)
    expect(st.vinculos).toHaveLength(1) // misma referencia, no se duplica
  })
})

describe('cobertura de objetivos (s.12, CA-17)', () => {
  it('usa solo los tres estados permitidos, sin lenguaje de calificación', async () => {
    const { COBERTURA_LABEL, coberturaObjetivos } = await import('./coverage')
    for (const label of Object.values(COBERTURA_LABEL)) {
      expect(label.toLowerCase()).not.toMatch(/aproba|reproba|cumple|madur|score/)
    }
    const iny01 = cfg.inyecciones.find((i) => i.clave === 'INY-01')!

    // Sin eventos: todo "aún no ejercitado".
    const vacio = coberturaObjetivos(cfg, deriveState(cfg, sortEvents([started()])))
    expect(vacio.every((c) => c.estado === 'no_ejercitado')).toBe(true)

    // INY-01 disparada sin respuestas: TT-01 pasa a evidencia parcial.
    const disparado = sortEvents([started(), dispatched(iny01.id, T0 + 10_000)])
    const parcial = coberturaObjetivos(cfg, deriveState(cfg, disparado))
    expect(parcial.find((c) => c.objetivo_id === 'tt-01')!.estado).toBe('evidencia_parcial')

    // Con decisión de un rol esperado (CISO): evidencia obtenida.
    const d = mkDecision({ inyeccion_id: iny01.id, rol_id: ROLES.CISO, registrada_en: T0 + 60_000 })
    const conEvidencia = sortEvents([
      ...disparado,
      makeEvent(EID, EVENT_TYPES.DECISION_CREATED, { decision: d }, 'participante', 'p1', T0 + 60_000),
    ])
    const obtenida = coberturaObjetivos(cfg, deriveState(cfg, conEvidencia))
    expect(obtenida.find((c) => c.objetivo_id === 'tt-01')!.estado).toBe('evidencia_obtenida')
  })
})

describe('validación del MSEL (CA-8)', () => {
  it('el ejercicio de referencia es válido: toda inyección tiene objetivo', () => {
    expect(validarConfig(cfg)).toEqual([])
  })

  it('detecta inyecciones sin objetivo', () => {
    const malo = {
      ...cfg,
      inyecciones: [{ ...cfg.inyecciones[0], objetivo_ids: [] }],
    }
    expect(validarConfig(malo)).toHaveLength(1)
  })
})
