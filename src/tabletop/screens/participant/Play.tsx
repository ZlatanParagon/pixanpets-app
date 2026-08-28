// P2/P3/P4 — Superficie del participante (SPEC s.19).

import { useState } from 'react'
import { navigate } from '../../App'
import { BarraFases, Field, Reloj, SeveridadChip, Vacio, Chip } from '../../components/ui'
import { elapsedMsAt, fmtHMS, fmtHora, narrativeSecAt } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, uuid } from '../../domain/events'
import {
  esCapturaTardia,
  inyeccionVisibleParaRol,
  latenciaSeg,
  ventanaExpirada,
} from '../../domain/rules'
import type {
  Compromiso,
  Decision,
  Escalamiento,
  Inyeccion,
  Severidad,
  SolicitudInformacion,
  TipoDecision,
  Urgencia,
} from '../../domain/types'
import { useStore } from '../../store'
import { getSesionParticipante } from './Checkin'

type Accion = TipoDecision | 'solicitud' | 'escalar' | 'compromiso'

export function Play() {
  const { config, events, estado, now } = useStore()
  const sesion = getSesionParticipante()
  const [tab, setTab] = useState<'inyecciones' | 'bitacora' | 'debriefing'>('inyecciones')

  if (!sesion) {
    navigate('/checkin')
    return null
  }

  const rol = config.roles.find((r) => r.id === sesion.rol_id)!
  const elapsedMs = elapsedMsAt(events, now)
  const narrativo = narrativeSecAt(events, now)
  const fase = config.fases.find((f) => f.id === estado.fase_actual_id)

  const visibles = estado.msel
    .filter((i) => inyeccionVisibleParaRol(i, sesion.rol_id))
    .filter((i) => estado.inyecciones[i.id].estado === 'activa')
    .sort(
      (a, b) =>
        (estado.inyecciones[b.id].disparada_en ?? 0) - (estado.inyecciones[a.id].disparada_en ?? 0),
    )

  const misDecisiones = estado.decisiones
    .filter((d) => d.participante_id === sesion.participante_id)
    .sort((a, b) => b.registrada_en - a.registrada_en)

  const misRegistros =
    misDecisiones.length +
    estado.solicitudes.filter((s) => s.solicitada_por_participante_id === sesion.participante_id).length +
    estado.escalamientos.filter((x) => x.participante_origen_id === sesion.participante_id).length +
    estado.compromisos.filter((c) => c.participante_responsable_id === sesion.participante_id).length

  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>{rol.nombre}</span>
        </div>
        <span className="tt-small tt-suave">{sesion.nombre_visible}</span>
      </header>

      <div className="tt-card">
        <Reloj
          elapsedSeg={elapsedMs / 1000}
          narrativoSeg={narrativo}
          pausado={estado.estado === 'pausado'}
        />
        <hr className="tt-sep" />
        <BarraFases fases={config.fases} actualId={estado.fase_actual_id} />
        {fase && <p className="tt-small tt-suave" style={{ marginBottom: 0 }}>{fase.descripcion}</p>}
      </div>

      <div className="tt-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'inyecciones'}
          className={'tt-tab' + (tab === 'inyecciones' ? ' tt-tab--activa' : '')}
          onClick={() => setTab('inyecciones')}
        >
          Inyecciones
        </button>
        <button
          role="tab"
          aria-selected={tab === 'bitacora'}
          className={'tt-tab' + (tab === 'bitacora' ? ' tt-tab--activa' : '')}
          onClick={() => setTab('bitacora')}
        >
          Mi bitácora ({misRegistros})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'debriefing'}
          className={'tt-tab' + (tab === 'debriefing' ? ' tt-tab--activa' : '')}
          onClick={() => setTab('debriefing')}
        >
          Debriefing
        </button>
      </div>

      {tab === 'inyecciones' && (
        <>
          <ParaTuRol sesion={sesion} />
          {visibles.length === 0 ? (
            <Vacio>
              <h2>Esperando la siguiente inyección</h2>
              <p className="tt-small">El reloj sigue corriendo. Mantente atento.</p>
            </Vacio>
          ) : (
            visibles.map((iny) => (
              <InyeccionCard key={iny.id} iny={iny} sesion={sesion} elapsedMs={elapsedMs} />
            ))
          )}
        </>
      )}

      {tab === 'bitacora' && <Bitacora sesion={sesion} decisiones={misDecisiones} />}

      {tab === 'debriefing' && <DebriefingForm sesion={sesion} />}
    </div>
  )
}

function InyeccionCard({
  iny,
  sesion,
  elapsedMs,
}: {
  iny: Inyeccion
  sesion: { participante_id: string; rol_id: string }
  elapsedMs: number
}) {
  const { config, estado, append, events, now } = useStore()
  const est = estado.inyecciones[iny.id]
  const [accion, setAccion] = useState<Accion | null>(null)
  const [registrada, setRegistrada] = useState(false)

  const seEsperaDeMi = iny.respuesta_esperada_rol_ids.includes(sesion.rol_id)
  const yaRespondi = estado.decisiones.some(
    (d) => d.inyeccion_id === iny.id && d.participante_id === sesion.participante_id,
  )

  const restanteSeg =
    iny.ventana_decision_seg != null && est.disparada_elapsed_ms != null
      ? iny.ventana_decision_seg - (elapsedMs - est.disparada_elapsed_ms) / 1000
      : null
  const expirada = ventanaExpirada(iny, est, elapsedMs)

  const registrar = (payload: {
    tipo: TipoDecision
    accion_elegida: string | null
    accion_libre: string | null
    justificacion: string
    dependencias: string | null
    severidad_percibida: Severidad | null
  }) => {
    const t = Date.now()
    const elapsedAlRegistrar = elapsedMsAt(events, t)
    const decision: Decision = {
      id: uuid(),
      inyeccion_id: iny.id,
      participante_id: sesion.participante_id,
      rol_id: sesion.rol_id,
      registrada_en: t,
      latencia_seg: latenciaSeg(est, elapsedAlRegistrar),
      ...payload,
    }
    const ok = append(
      makeEvent(
        config.id,
        EVENT_TYPES.DECISION_CREATED,
        { decision },
        'participante',
        sesion.participante_id,
        t,
      ),
    )
    if (ok) {
      setAccion(null)
      setRegistrada(true)
    }
  }

  return (
    <div className={`tt-card tt-card--${iny.severidad_disenada}`}>
      <div className="tt-fila">
        <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
        <SeveridadChip severidad={iny.severidad_disenada} />
        {iny.audiencia_rol_ids !== null && <Chip tone="activa">Dirigida a tu rol</Chip>}
      </div>
      <h2 style={{ margin: '8px 0' }}>{iny.titulo}</h2>
      <p>{iny.cuerpo}</p>

      {restanteSeg != null && !expirada && (
        <p className="tt-small tt-mono" style={{ color: 'var(--atencion)' }}>
          Ventana de decisión: {fmtHMS(restanteSeg)}
        </p>
      )}
      {expirada && (
        <p className="tt-small" style={{ color: 'var(--critico)' }}>
          La ventana de decisión expiró. Aún puedes registrar: quedará como captura tardía referida
          al disparo original.
        </p>
      )}
      {!seEsperaDeMi && (
        <p className="tt-aviso">
          Recibes esta información para tu contexto. No se espera necesariamente una respuesta de tu
          rol; puedes actuar si lo consideras necesario.
        </p>
      )}
      {(yaRespondi || registrada) && <Chip tone="ok">Registrado en tu bitácora</Chip>}

      {accion === null ? (
        <div className="tt-cta-lista">
          <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={() => setAccion('decision')}>
            Registrar mi decisión
          </button>
          <div className="tt-fila">
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('solicitud')}>
              Solicitar información
            </button>
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('escalar')}>
              Escalar
            </button>
          </div>
          <div className="tt-fila">
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('compromiso')}>
              Registrar compromiso
            </button>
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('no_actuar')}>
              No actuar por ahora
            </button>
          </div>
          <button className="tt-btn tt-btn--fantasma tt-btn--bloque" onClick={() => setAccion('posponer')}>
            Posponer
          </button>
        </div>
      ) : accion === 'solicitud' ? (
        <FormSolicitud iny={iny} sesion={sesion} onDone={() => { setAccion(null); setRegistrada(true) }} onCancel={() => setAccion(null)} />
      ) : accion === 'escalar' ? (
        <FormEscalar iny={iny} sesion={sesion} onDone={() => { setAccion(null); setRegistrada(true) }} onCancel={() => setAccion(null)} />
      ) : accion === 'compromiso' ? (
        <FormCompromiso iny={iny} sesion={sesion} onDone={() => { setAccion(null); setRegistrada(true) }} onCancel={() => setAccion(null)} />
      ) : (
        <FormDecision
          iny={iny}
          tipo={accion}
          tardia={esCapturaTardia(iny, est, elapsedMsAt(events, now))}
          onCancel={() => setAccion(null)}
          onSubmit={registrar}
        />
      )}
    </div>
  )
}

interface FormProps {
  iny: Inyeccion
  sesion: { participante_id: string; rol_id: string }
  onDone: () => void
  onCancel: () => void
}

function FormSolicitud({ iny, sesion, onDone, onCancel }: FormProps) {
  const { config, append } = useStore()
  const [pregunta, setPregunta] = useState('')
  const [destino, setDestino] = useState('')
  const [error, setError] = useState('')
  const enviar = () => {
    if (!pregunta.trim()) return setError('Escribe la pregunta.')
    const t = Date.now()
    const solicitud: SolicitudInformacion = {
      id: uuid(),
      inyeccion_id: iny.id,
      solicitada_por_participante_id: sesion.participante_id,
      solicitada_por_rol_id: sesion.rol_id,
      dirigida_a_rol_id: destino || null,
      pregunta: pregunta.trim(),
      solicitada_en: t,
    }
    if (append(makeEvent(config.id, EVENT_TYPES.INFORMATION_REQUESTED, { solicitud }, 'participante', sesion.participante_id, t))) onDone()
  }
  return (
    <div style={{ marginTop: 14 }}>
      <h3>Solicitar información</h3>
      <Field label="¿Qué necesitas saber?">
        <textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
      </Field>
      <Field label="Dirigida a">
        <select value={destino} onChange={(e) => setDestino(e.target.value)}>
          <option value="">Al facilitador</option>
          {config.roles
            .filter((r) => r.id !== sesion.rol_id)
            .map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
        </select>
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <div className="tt-fila">
        <button className="tt-btn tt-btn--primario" style={{ flex: 1 }} onClick={enviar}>Enviar solicitud</button>
        <button className="tt-btn tt-btn--fantasma" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

function FormEscalar({ iny, sesion, onDone, onCancel }: FormProps) {
  const { config, append } = useStore()
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [urgencia, setUrgencia] = useState<Urgencia | ''>('')
  const [error, setError] = useState('')
  const enviar = () => {
    if (!destino) return setError('Selecciona el rol al que escalas.')
    if (!motivo.trim()) return setError('Describe el motivo del escalamiento.')
    const t = Date.now()
    const escalamiento: Escalamiento = {
      id: uuid(),
      inyeccion_id: iny.id,
      participante_origen_id: sesion.participante_id,
      rol_origen_id: sesion.rol_id,
      rol_destino_id: destino,
      motivo: motivo.trim(),
      urgencia: urgencia || null,
      escalado_en: t,
    }
    if (append(makeEvent(config.id, EVENT_TYPES.ESCALATION_CREATED, { escalamiento }, 'participante', sesion.participante_id, t))) onDone()
  }
  return (
    <div style={{ marginTop: 14 }}>
      <h3>Escalar</h3>
      <Field label="Escalar a">
        <select value={destino} onChange={(e) => setDestino(e.target.value)}>
          <option value="">Selecciona rol…</option>
          {config.roles
            .filter((r) => r.id !== sesion.rol_id)
            .map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
        </select>
      </Field>
      <Field label="Motivo">
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </Field>
      <Field label="Urgencia (opcional)">
        <select value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia | '')}>
          <option value="">Sin registrar</option>
          <option value="normal">Normal</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <div className="tt-fila">
        <button className="tt-btn tt-btn--primario" style={{ flex: 1 }} onClick={enviar}>Escalar ahora</button>
        <button className="tt-btn tt-btn--fantasma" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

function FormCompromiso({ iny, sesion, onDone, onCancel }: FormProps) {
  const { config, append } = useStore()
  const [descripcion, setDescripcion] = useState('')
  const [plazo, setPlazo] = useState('')
  const [criterio, setCriterio] = useState('')
  const [error, setError] = useState('')
  const enviar = () => {
    if (!descripcion.trim()) return setError('Describe el compromiso.')
    const t = Date.now()
    const compromiso: Compromiso = {
      id: uuid(),
      inyeccion_id: iny.id,
      descripcion: descripcion.trim(),
      participante_responsable_id: sesion.participante_id,
      rol_responsable_id: sesion.rol_id,
      rol_solicitante_id: null,
      plazo_simulado: plazo.trim() || null,
      criterio_cumplimiento: criterio.trim() || null,
      declarado_en: t,
    }
    if (append(makeEvent(config.id, EVENT_TYPES.COMMITMENT_CREATED, { compromiso }, 'participante', sesion.participante_id, t))) onDone()
  }
  return (
    <div style={{ marginTop: 14 }}>
      <h3>Registrar compromiso</h3>
      <Field label="¿Qué te comprometes a hacer?">
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </Field>
      <Field label="Plazo narrativo (opcional)">
        <input value={plazo} onChange={(e) => setPlazo(e.target.value)} placeholder="p. ej. 2 horas / antes de abrir tiendas" />
      </Field>
      <Field label="Criterio de cumplimiento (opcional)">
        <input value={criterio} onChange={(e) => setCriterio(e.target.value)} />
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <div className="tt-fila">
        <button className="tt-btn tt-btn--primario" style={{ flex: 1 }} onClick={enviar}>Guardar compromiso</button>
        <button className="tt-btn tt-btn--fantasma" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

/** Escalamientos y solicitudes dirigidos al rol del participante. */
function ParaTuRol({ sesion }: { sesion: { participante_id: string; rol_id: string } }) {
  const { config, estado, append } = useStore()
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})

  const escalamientos = estado.escalamientos.filter((x) => x.rol_destino_id === sesion.rol_id)
  const solicitudes = estado.solicitudes.filter((s) => s.dirigida_a_rol_id === sesion.rol_id)
  if (escalamientos.length === 0 && solicitudes.length === 0) return null

  const rol = (id: string) => config.roles.find((r) => r.id === id)?.nombre ?? id
  const clave = (id: string) => estado.msel.find((i) => i.id === id)?.clave ?? id

  return (
    <div className="tt-card" style={{ borderLeft: '4px solid var(--acento-2)' }}>
      <h2>Para tu rol</h2>
      {escalamientos.map((x) => (
        <div key={x.id} style={{ borderTop: '1px solid var(--borde)', padding: '10px 0' }}>
          <div className="tt-fila">
            <Chip tone="activa">Escalamiento</Chip>
            <span className="tt-small tt-suave">
              de {rol(x.rol_origen_id)} · {clave(x.inyeccion_id)} · <span className="tt-mono">{fmtHora(x.escalado_en)}</span>
            </span>
            {x.urgencia && <Chip tone={x.urgencia === 'critica' ? 'err' : x.urgencia === 'alta' ? 'warn' : undefined}>Urgencia {x.urgencia}</Chip>}
          </div>
          <p style={{ margin: '6px 0' }}>«{x.motivo}»</p>
          {x.reconocido_en == null ? (
            <button
              className="tt-btn"
              onClick={() =>
                append(
                  makeEvent(
                    config.id,
                    EVENT_TYPES.ESCALATION_ACKNOWLEDGED,
                    { escalamiento_id: x.id, participante_id: sesion.participante_id },
                    'participante',
                    sesion.participante_id,
                  ),
                )
              }
            >
              Reconocer recepción
            </button>
          ) : (
            <Chip tone="ok">Reconocido {fmtHora(x.reconocido_en)}</Chip>
          )}
        </div>
      ))}
      {solicitudes.map((s) => (
        <div key={s.id} style={{ borderTop: '1px solid var(--borde)', padding: '10px 0' }}>
          <div className="tt-fila">
            <Chip>Solicitud de información</Chip>
            <span className="tt-small tt-suave">
              de {rol(s.solicitada_por_rol_id)} · {clave(s.inyeccion_id)} · <span className="tt-mono">{fmtHora(s.solicitada_en)}</span>
            </span>
          </div>
          <p style={{ margin: '6px 0' }}>«{s.pregunta}»</p>
          {s.respondida_en == null ? (
            <>
              <Field label="Tu respuesta">
                <textarea
                  value={respuestas[s.id] ?? ''}
                  onChange={(e) => setRespuestas((r) => ({ ...r, [s.id]: e.target.value }))}
                />
              </Field>
              <button
                className="tt-btn tt-btn--primario"
                disabled={!(respuestas[s.id] ?? '').trim()}
                onClick={() =>
                  append(
                    makeEvent(
                      config.id,
                      EVENT_TYPES.INFORMATION_RESPONDED,
                      { solicitud_id: s.id, respuesta: respuestas[s.id].trim(), fuente_respuesta: 'participante' },
                      'participante',
                      sesion.participante_id,
                    ),
                  )
                }
              >
                Responder
              </button>
            </>
          ) : (
            <p className="tt-small tt-suave">
              Respondida <span className="tt-mono">{fmtHora(s.respondida_en)}</span>: «{s.respuesta}»
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function FormDecision({
  iny,
  tipo,
  tardia,
  onCancel,
  onSubmit,
}: {
  iny: Inyeccion
  tipo: TipoDecision
  tardia: boolean
  onCancel: () => void
  onSubmit: (p: {
    tipo: TipoDecision
    accion_elegida: string | null
    accion_libre: string | null
    justificacion: string
    dependencias: string | null
    severidad_percibida: Severidad | null
  }) => void
}) {
  const [elegida, setElegida] = useState('')
  const [libre, setLibre] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [dependencias, setDependencias] = useState('')
  const [severidad, setSeveridad] = useState<Severidad | ''>('')
  const [error, setError] = useState('')

  const titulo =
    tipo === 'decision' ? 'Registrar mi decisión' : tipo === 'posponer' ? 'Posponer' : 'No actuar por ahora'

  const enviar = () => {
    if (tipo === 'decision' && !elegida && !libre.trim()) {
      setError('Elige una alternativa o describe tu acción.')
      return
    }
    if (!justificacion.trim()) {
      setError('La justificación es necesaria: es parte de la evidencia.')
      return
    }
    onSubmit({
      tipo,
      accion_elegida: elegida || null,
      accion_libre: libre.trim() || null,
      justificacion: justificacion.trim(),
      dependencias: dependencias.trim() || null,
      severidad_percibida: severidad || null,
    })
  }

  return (
    <div style={{ marginTop: 14 }}>
      <h3>{titulo}</h3>
      {tardia && (
        <p className="tt-small" style={{ color: 'var(--atencion)' }}>
          Se registrará como captura tardía.
        </p>
      )}
      {tipo === 'decision' && iny.alternativas.length > 0 && (
        <Field label="Alternativa">
          <select value={elegida} onChange={(e) => setElegida(e.target.value)}>
            <option value="">— Acción propia (descríbela abajo) —</option>
            {iny.alternativas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
      )}
      {tipo === 'decision' && (
        <Field label="Descripción de la acción (campo libre)">
          <textarea value={libre} onChange={(e) => setLibre(e.target.value)} />
        </Field>
      )}
      <Field label="Justificación">
        <textarea
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          placeholder="Por qué tomas esta postura, con la información disponible"
        />
      </Field>
      {tipo === 'decision' && (
        <Field label="Dependencias (opcional)">
          <input
            value={dependencias}
            onChange={(e) => setDependencias(e.target.value)}
            placeholder="Qué necesitas de otros roles para que esto funcione"
          />
        </Field>
      )}
      <Field label="Severidad percibida (opcional)">
        <select value={severidad} onChange={(e) => setSeveridad(e.target.value as Severidad | '')}>
          <option value="">Sin registrar</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <div className="tt-fila">
        <button className="tt-btn tt-btn--primario" style={{ flex: 1 }} onClick={enviar}>
          Guardar registro
        </button>
        <button className="tt-btn tt-btn--fantasma" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

interface EntradaBitacora {
  id: string
  hora: number
  inyeccion_id: string
  etiqueta: string
  titulo: string
  detalle: string | null
  extra: string | null
}

function Bitacora({
  sesion,
  decisiones,
}: {
  sesion: { participante_id: string; rol_id: string }
  decisiones: Decision[]
}) {
  const { config, estado } = useStore()
  const rol = (id: string | null) => (id ? (config.roles.find((r) => r.id === id)?.nombre ?? id) : '')

  const entradas: EntradaBitacora[] = [
    ...decisiones.map((d) => ({
      id: d.id,
      hora: d.registrada_en,
      inyeccion_id: d.inyeccion_id,
      etiqueta: d.tipo === 'no_actuar' ? 'No actuar' : d.tipo === 'posponer' ? 'Posponer' : 'Decisión',
      titulo:
        d.tipo === 'no_actuar'
          ? 'No actuar por ahora'
          : d.tipo === 'posponer'
            ? 'Posponer'
            : (d.accion_elegida ?? d.accion_libre ?? 'Decisión'),
      detalle: `«${d.justificacion}»`,
      extra: d.latencia_seg != null ? `latencia ${d.latencia_seg}s` : null,
    })),
    ...estado.solicitudes
      .filter((s) => s.solicitada_por_participante_id === sesion.participante_id)
      .map((s) => ({
        id: s.id,
        hora: s.solicitada_en,
        inyeccion_id: s.inyeccion_id,
        etiqueta: 'Solicitud',
        titulo: s.pregunta,
        detalle:
          s.respondida_en != null
            ? `Respondida ${fmtHora(s.respondida_en)}: «${s.respuesta}»`
            : 'Sin respuesta todavía',
        extra: s.dirigida_a_rol_id ? `a ${rol(s.dirigida_a_rol_id)}` : 'al facilitador',
      })),
    ...estado.escalamientos
      .filter((x) => x.participante_origen_id === sesion.participante_id)
      .map((x) => ({
        id: x.id,
        hora: x.escalado_en,
        inyeccion_id: x.inyeccion_id,
        etiqueta: 'Escalamiento',
        titulo: `A ${rol(x.rol_destino_id)}`,
        detalle: `«${x.motivo}»${x.reconocido_en != null ? ` · reconocido ${fmtHora(x.reconocido_en)}` : ''}`,
        extra: x.urgencia ? `urgencia ${x.urgencia}` : null,
      })),
    ...estado.compromisos
      .filter((c) => c.participante_responsable_id === sesion.participante_id)
      .map((c) => ({
        id: c.id,
        hora: c.declarado_en,
        inyeccion_id: c.inyeccion_id,
        etiqueta: 'Compromiso',
        titulo: c.descripcion,
        detalle: c.criterio_cumplimiento ? `Criterio: ${c.criterio_cumplimiento}` : null,
        extra: c.plazo_simulado ? `plazo ${c.plazo_simulado}` : null,
      })),
  ].sort((a, b) => b.hora - a.hora)

  if (entradas.length === 0) {
    return (
      <Vacio>
        <h2>Tu bitácora está vacía</h2>
        <p className="tt-small">Tus decisiones y registros aparecerán aquí con su hora.</p>
      </Vacio>
    )
  }
  return (
    <>
      {entradas.map((e) => {
        const iny = estado.msel.find((i) => i.id === e.inyeccion_id)
        return (
          <div key={e.id} className="tt-card">
            <div className="tt-fila">
              <Chip>{e.etiqueta}</Chip>
              <span className="tt-mono tt-small tt-suave">{iny?.clave}</span>
              <span className="tt-mono tt-small tt-suave">{fmtHora(e.hora)}</span>
              {e.extra && <span className="tt-mono tt-small tt-suave">{e.extra}</span>}
              <Chip tone="ok">Sincronizada</Chip>
            </div>
            <h3 style={{ margin: '6px 0' }}>{e.titulo}</h3>
            {e.detalle && <p className="tt-small tt-suave">{e.detalle}</p>}
          </div>
        )
      })}
    </>
  )
}

/** Etapa 4 — Debriefing (s.8, s.19 P4): se responde una vez, al cierre del ejercicio. */
function DebriefingForm({ sesion }: { sesion: { participante_id: string; rol_id: string } }) {
  const { config, estado, append } = useStore()
  const [informacion, setInformacion] = useState('')
  const [rolFaltante, setRolFaltante] = useState('')
  const [dificil, setDificil] = useState('')
  const [accion30, setAccion30] = useState('')
  const [error, setError] = useState('')

  const enviado = estado.debriefings.find((d) => d.participante_id === sesion.participante_id)
  if (enviado) {
    return (
      <div className="tt-card">
        <div className="tt-fila">
          <h2>Debriefing registrado</h2>
          <Chip tone="ok">Enviado {fmtHora(enviado.registrado_en)}</Chip>
        </div>
        <p className="tt-small tt-suave">Qué información faltó</p>
        <p>{enviado.informacion_faltante}</p>
        <p className="tt-small tt-suave">Qué rol faltó</p>
        <p>{enviado.rol_faltante}</p>
        <p className="tt-small tt-suave">Decisión más difícil</p>
        <p>{enviado.decision_mas_dificil}</p>
        <p className="tt-small tt-suave">Acción concreta a 30 días</p>
        <p>{enviado.accion_30_dias}</p>
      </div>
    )
  }

  const enviar = () => {
    if (!informacion.trim() || !rolFaltante.trim() || !dificil.trim() || !accion30.trim()) {
      return setError('Responde las cuatro preguntas: son parte de la evidencia del ejercicio.')
    }
    const t = Date.now()
    const debriefing = {
      id: uuid(),
      participante_id: sesion.participante_id,
      rol_id: sesion.rol_id,
      informacion_faltante: informacion.trim(),
      rol_faltante: rolFaltante.trim(),
      decision_mas_dificil: dificil.trim(),
      accion_30_dias: accion30.trim(),
      registrado_en: t,
    }
    const ok = append(
      makeEvent(config.id, EVENT_TYPES.DEBRIEFING_SUBMITTED, { debriefing }, 'participante', sesion.participante_id, t),
    )
    if (!ok) setError('El ejercicio está cerrado: coordina con el facilitador.')
  }

  return (
    <div className="tt-card">
      <h2>Debriefing</h2>
      <p className="tt-small tt-suave">
        Responde al final del ejercicio. Tus respuestas forman parte de la evidencia.
      </p>
      <Field label="¿Qué información te faltó durante el ejercicio?">
        <textarea value={informacion} onChange={(e) => setInformacion(e.target.value)} />
      </Field>
      <Field label="¿Qué rol o área hizo falta?">
        <textarea value={rolFaltante} onChange={(e) => setRolFaltante(e.target.value)} />
      </Field>
      <Field label="¿Cuál fue la decisión más difícil?">
        <textarea value={dificil} onChange={(e) => setDificil(e.target.value)} />
      </Field>
      <Field label="Una acción concreta a 30 días">
        <textarea value={accion30} onChange={(e) => setAccion30(e.target.value)} />
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={enviar}>
        Enviar debriefing
      </button>
    </div>
  )
}
