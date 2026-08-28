// F1 — Consola del facilitador (SPEC s.20). Acceso autenticado (demo local en Fase A).

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Chip, Field, Reloj, BarraFases } from '../../components/ui'
import { elapsedMsAt, fmtHora, narrativeSecAt } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, sortEvents } from '../../domain/events'
import { describeEvento, tipoLabel } from '../../domain/export'
import { COBERTURA_LABEL, coberturaObjetivos, type EstadoCobertura } from '../../domain/coverage'
import { useStore } from '../../store'
import { Msel } from './Msel'
import { Decisiones } from './Decisiones'
import { Observaciones } from './Observaciones'
import { Cierre } from './Cierre'

const AUTH_KEY = 'arseg-tabletop:facilitador'
// Passcode de demostración del prototipo. En producción: cuenta ARSEG (SPEC s.30).
const DEMO_PASSCODE = 'ARSEG'
export const FACILITADOR_ID = 'arseg-director'

/** Sesión ARSEG de esta pestaña (s.7): director de ejercicio u observador. */
export interface SesionArseg {
  perfil: 'director' | 'observador'
  nombre: string
  usuario_id: string
}

export function getSesionArseg(): SesionArseg | null {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    return raw ? (JSON.parse(raw) as SesionArseg) : null
  } catch {
    return null
  }
}

type Tab = 'tablero' | 'msel' | 'decisiones' | 'observaciones' | 'cierre'

const TABS_DIRECTOR: [Tab, string][] = [
  ['tablero', 'Tablero'],
  ['msel', 'MSEL / Inyecciones'],
  ['decisiones', 'Sala de decisiones'],
  ['observaciones', 'Observaciones'],
  ['cierre', 'Cierre y exportación'],
]
// El observador ARSEG (s.7.2) registra observaciones y consulta respuestas;
// no controla reloj, MSEL ni cierre.
const TABS_OBSERVADOR: [Tab, string][] = [
  ['observaciones', 'Observaciones'],
  ['decisiones', 'Sala de decisiones'],
]

export function Console() {
  const [sesion, setSesion] = useState<SesionArseg | null>(() => getSesionArseg())
  const tabs = sesion?.perfil === 'observador' ? TABS_OBSERVADOR : TABS_DIRECTOR
  const [tab, setTab] = useState<Tab>('tablero')

  if (!sesion) {
    return (
      <Gate
        onOk={(s) => {
          sessionStorage.setItem(AUTH_KEY, JSON.stringify(s))
          setSesion(s)
          setTab(s.perfil === 'observador' ? 'observaciones' : 'tablero')
        }}
      />
    )
  }

  return (
    <div className="tt-shell">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>{sesion.perfil === 'observador' ? 'Observador ARSEG' : 'Consola del facilitador'}</span>
        </div>
        <div className="tt-fila">
          <span className="tt-small tt-suave">{sesion.nombre}</span>
          <EstadoChip />
        </div>
      </header>

      <div className="tt-tabs" role="tablist">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={'tt-tab' + (tab === id ? ' tt-tab--activa' : '')}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tablero' && sesion.perfil === 'director' && <Tablero />}
      {tab === 'msel' && sesion.perfil === 'director' && <Msel />}
      {tab === 'decisiones' && <Decisiones />}
      {tab === 'observaciones' && <Observaciones />}
      {tab === 'cierre' && sesion.perfil === 'director' && <Cierre />}
    </div>
  )
}

function Gate({ onOk }: { onOk: (s: SesionArseg) => void }) {
  const [code, setCode] = useState('')
  const [perfil, setPerfil] = useState<'director' | 'observador'>('director')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  const entrar = () => {
    if (code.trim().toUpperCase() !== DEMO_PASSCODE) return setError('Passcode incorrecto.')
    if (perfil === 'observador' && !nombre.trim()) {
      return setError('Escribe tu nombre: cada observación queda firmada por su autor.')
    }
    onOk(
      perfil === 'director'
        ? { perfil, nombre: nombre.trim() || 'Director de ejercicio', usuario_id: FACILITADOR_ID }
        : { perfil, nombre: nombre.trim(), usuario_id: 'arseg-obs-' + nombre.trim().toLowerCase().replace(/\s+/g, '-') },
    )
  }

  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Consola</span>
        </div>
      </header>
      <div className="tt-card">
        <h2>Acceso ARSEG</h2>
        <p className="tt-small tt-suave">
          Prototipo: usa el passcode de demostración <span className="tt-mono">ARSEG</span>. En
          producción este acceso será con cuenta ARSEG autenticada.
        </p>
        <Field label="Perfil">
          <select value={perfil} onChange={(e) => setPerfil(e.target.value as 'director' | 'observador')}>
            <option value="director">Director de ejercicio</option>
            <option value="observador">Observador ARSEG</option>
          </select>
        </Field>
        <Field label={perfil === 'observador' ? 'Tu nombre' : 'Tu nombre (opcional)'}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del usuario ARSEG" />
        </Field>
        <Field label="Passcode">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
          />
        </Field>
        {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
        <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={entrar}>
          Entrar a la consola
        </button>
        <p className="tt-aviso" style={{ marginTop: 10 }}>
          Varios usuarios ARSEG pueden trabajar en paralelo: abre una pestaña por persona.
        </p>
      </div>
    </div>
  )
}

function EstadoChip() {
  const { estado } = useStore()
  const map = {
    borrador: ['Borrador', undefined],
    preparado: ['Preparado', undefined],
    en_curso: ['En curso', 'ok'],
    pausado: ['En pausa', 'warn'],
    cerrado: ['Cerrado', 'err'],
  } as const
  const [label, tone] = map[estado.estado]
  return <Chip tone={tone as never}>{label}</Chip>
}

/** Cobertura de objetivos (s.12, CA-17): evidencia disponible, nunca calificación. */
function Cobertura() {
  const { config, estado } = useStore()
  const cobertura = coberturaObjetivos(config, estado)
  const tone: Record<EstadoCobertura, 'ok' | 'warn' | undefined> = {
    evidencia_obtenida: 'ok',
    evidencia_parcial: 'warn',
    no_ejercitado: undefined,
  }
  return (
    <div className="tt-card">
      <h2>Cobertura de objetivos</h2>
      <p className="tt-small tt-suave">
        Muestra qué objetivos ya cuentan con evidencia; no califica conductas.
      </p>
      <div className="tt-tabla-wrap">
        <table className="tt-tabla">
          <tbody>
            {cobertura.map((c) => {
              const obj = config.objetivos.find((o) => o.id === c.objetivo_id)!
              return (
                <tr key={c.objetivo_id}>
                  <td className="tt-mono">{obj.clave}</td>
                  <td>{obj.nombre}</td>
                  <td className="tt-mono" style={{ textAlign: 'right' }}>
                    {c.evidencias > 0 ? `${c.evidencias} ev.` : ''}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Chip tone={tone[c.estado]}>{COBERTURA_LABEL[c.estado]}</Chip>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Tablero() {
  const { config, events, estado, now, append } = useStore()
  const elapsed = elapsedMsAt(events, now) / 1000
  const narrativo = narrativeSecAt(events, now)
  const qrRef = useRef<HTMLCanvasElement>(null)

  const joinUrl = `${window.location.origin}${window.location.pathname}#/checkin?codigo=${encodeURIComponent(config.codigo_sala)}`

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, joinUrl, { width: 180, margin: 1 }).catch(() => {})
    }
  }, [joinUrl])

  const emit = (type: (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES], payload: unknown = {}) =>
    append(makeEvent(config.id, type, payload, 'facilitador', FACILITADOR_ID))

  const cerrado = estado.estado === 'cerrado'
  const recientes = sortEvents(events).slice(-10).reverse()

  return (
    <div className="tt-grid tt-grid--2">
      <div>
        <div className="tt-card">
          <h2>Reloj del ejercicio</h2>
          <div style={{ margin: '10px 0' }}>
            <Reloj elapsedSeg={elapsed} narrativoSeg={narrativo} pausado={estado.estado === 'pausado'} />
          </div>
          <div className="tt-fila">
            {estado.estado === 'preparado' && (
              <button className="tt-btn tt-btn--primario" onClick={() => emit(EVENT_TYPES.EXERCISE_STARTED)}>
                Iniciar ejercicio
              </button>
            )}
            {estado.estado === 'en_curso' && (
              <button className="tt-btn" onClick={() => emit(EVENT_TYPES.EXERCISE_PAUSED)}>
                Pausar
              </button>
            )}
            {estado.estado === 'pausado' && (
              <button className="tt-btn tt-btn--primario" onClick={() => emit(EVENT_TYPES.EXERCISE_RESUMED)}>
                Reanudar
              </button>
            )}
            {!cerrado && estado.iniciado_en != null && (
              <>
                <button
                  className="tt-btn"
                  onClick={() =>
                    emit(EVENT_TYPES.NARRATIVE_TIME_JUMP, { salto_seg: 3600, etiqueta: 'Salto narrativo +1 hora' })
                  }
                >
                  Salto narrativo +1 h
                </button>
                <button
                  className="tt-btn"
                  onClick={() =>
                    emit(EVENT_TYPES.NARRATIVE_TIME_JUMP, { salto_seg: 12 * 3600, etiqueta: 'Salto narrativo +12 horas' })
                  }
                >
                  +12 h
                </button>
              </>
            )}
          </div>
          <p className="tt-small tt-suave">
            El salto narrativo no modifica el reloj técnico: ambos tiempos coexisten.
          </p>
        </div>

        <div className="tt-card">
          <h2>Fase</h2>
          <div style={{ margin: '10px 0' }}>
            <BarraFases fases={config.fases} actualId={estado.fase_actual_id} />
          </div>
          <div className="tt-fila">
            {config.fases.map((f) => (
              <button
                key={f.id}
                className="tt-btn"
                disabled={cerrado || f.id === estado.fase_actual_id}
                onClick={() => emit(EVENT_TYPES.PHASE_CHANGED, { fase_id: f.id })}
              >
                {f.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <h2>Pantalla de sala</h2>
          <p className="tt-small tt-suave">
            {estado.sala_muestra_inyeccion
              ? 'La sala proyecta la inyección pública activa.'
              : 'La sala muestra solo el contexto del escenario.'}
          </p>
          <button
            className="tt-btn"
            disabled={cerrado}
            onClick={() =>
              emit(EVENT_TYPES.ROOM_DISPLAY_CHANGED, {
                mostrar_inyeccion: !estado.sala_muestra_inyeccion,
              })
            }
          >
            {estado.sala_muestra_inyeccion ? 'Ocultar inyección en sala' : 'Proyectar inyección en sala'}
          </button>
        </div>

        <div className="tt-card">
          <h2>Participantes conectados ({estado.participantes.length})</h2>
          {estado.participantes.length === 0 ? (
            <p className="tt-small tt-suave">Nadie ha hecho check-in todavía.</p>
          ) : (
            <div className="tt-tabla-wrap">
              <table className="tt-tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {estado.participantes.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre_visible}</td>
                      <td>{config.roles.find((r) => r.id === p.rol_id)?.nombre}</td>
                      <td className="tt-mono">{fmtHora(p.conectado_en)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="tt-card">
          <h2>Acceso de participantes</h2>
          <div className="tt-fila" style={{ alignItems: 'flex-start' }}>
            <canvas ref={qrRef} aria-label="Código QR de acceso a la sala" />
            <div>
              <p className="tt-small tt-suave">Código de sala</p>
              <p className="tt-mono" style={{ fontSize: 22, fontWeight: 700 }}>{config.codigo_sala}</p>
              <p className="tt-small tt-suave" style={{ wordBreak: 'break-all' }}>{joinUrl}</p>
            </div>
          </div>
        </div>

        <Cobertura />

        <div className="tt-card">
          <h2>Actividad reciente</h2>
          {recientes.length === 0 ? (
            <p className="tt-small tt-suave">Sin eventos aún.</p>
          ) : (
            recientes.map((e) => (
              <div key={e.id} className="tt-evento">
                <time>{fmtHora(e.client_timestamp)}</time>
                <span>
                  <strong>{tipoLabel(e.type)}</strong>
                  {describeEvento(config, e, estado.msel) && <> — {describeEvento(config, e, estado.msel)}</>}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
