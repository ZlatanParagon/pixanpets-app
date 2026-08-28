// F1 — Consola del facilitador (SPEC s.20). Acceso autenticado (demo local en Fase A).

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Chip, Field, Reloj, BarraFases } from '../../components/ui'
import { elapsedMsAt, fmtHora, narrativeSecAt } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, sortEvents } from '../../domain/events'
import { describeEvento, tipoLabel } from '../../domain/export'
import { useStore } from '../../store'
import { Msel } from './Msel'
import { Decisiones } from './Decisiones'
import { Cierre } from './Cierre'

const AUTH_KEY = 'arseg-tabletop:facilitador'
// Passcode de demostración del prototipo. En producción: cuenta ARSEG (SPEC s.30).
const DEMO_PASSCODE = 'ARSEG'
export const FACILITADOR_ID = 'arseg-facilitador'

type Tab = 'tablero' | 'msel' | 'decisiones' | 'cierre'

export function Console() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'ok')
  const [tab, setTab] = useState<Tab>('tablero')

  if (!auth) return <Gate onOk={() => { sessionStorage.setItem(AUTH_KEY, 'ok'); setAuth(true) }} />

  return (
    <div className="tt-shell">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Consola del facilitador</span>
        </div>
        <EstadoChip />
      </header>

      <div className="tt-tabs" role="tablist">
        {(
          [
            ['tablero', 'Tablero'],
            ['msel', 'MSEL / Inyecciones'],
            ['decisiones', 'Sala de decisiones'],
            ['cierre', 'Cierre y exportación'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
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

      {tab === 'tablero' && <Tablero />}
      {tab === 'msel' && <Msel />}
      {tab === 'decisiones' && <Decisiones />}
      {tab === 'cierre' && <Cierre />}
    </div>
  )
}

function Gate({ onOk }: { onOk: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Consola</span>
        </div>
      </header>
      <div className="tt-card">
        <h2>Acceso de facilitador</h2>
        <p className="tt-small tt-suave">
          Prototipo: usa el passcode de demostración <span className="tt-mono">ARSEG</span>. En
          producción este acceso será con cuenta ARSEG autenticada.
        </p>
        <Field label="Passcode">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (code.trim().toUpperCase() === DEMO_PASSCODE ? onOk() : setError('Passcode incorrecto.'))}
          />
        </Field>
        {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
        <button
          className="tt-btn tt-btn--primario tt-btn--bloque"
          onClick={() => (code.trim().toUpperCase() === DEMO_PASSCODE ? onOk() : setError('Passcode incorrecto.'))}
        >
          Entrar a la consola
        </button>
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
                  {describeEvento(config, e) && <> — {describeEvento(config, e)}</>}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
