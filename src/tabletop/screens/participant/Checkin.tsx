// P1 — Check-in del participante (SPEC s.8 etapa 1, s.19).
// Acceso por QR o código, sin cuenta ni contraseña.

import { useState } from 'react'
import { navigate } from '../../App'
import { Field } from '../../components/ui'
import { EVENT_TYPES, makeEvent, uuid } from '../../domain/events'
import { useStore } from '../../store'

export interface SesionParticipante {
  participante_id: string
  rol_id: string
  nombre_visible: string
}

const SESSION_KEY = 'arseg-tabletop:participante'

export function getSesionParticipante(): SesionParticipante | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SesionParticipante) : null
  } catch {
    return null
  }
}

export function Checkin() {
  const { config, append } = useStore()
  const [codigo, setCodigo] = useState(
    () => new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('codigo') ?? '',
  )
  const [nombre, setNombre] = useState('')
  const [rolId, setRolId] = useState('')
  const [error, setError] = useState('')
  const [validado, setValidado] = useState(false)

  const rol = config.roles.find((r) => r.id === rolId)

  if (getSesionParticipante()) {
    navigate('/participante')
    return null
  }

  const validar = () => {
    if (codigo.trim().toUpperCase() !== config.codigo_sala.toUpperCase()) {
      setError('Código de sala incorrecto. Verifica con el facilitador.')
      return
    }
    if (!nombre.trim()) {
      setError('Escribe tu nombre visible.')
      return
    }
    if (!rol) {
      setError('Selecciona tu rol.')
      return
    }
    setError('')
    setValidado(true)
  }

  const entrar = () => {
    const participante = {
      id: uuid(),
      rol_id: rolId,
      nombre_visible: nombre.trim(),
      conectado_en: Date.now(),
    }
    const ok = append(
      makeEvent(
        config.id,
        EVENT_TYPES.PARTICIPANT_CONNECTED,
        { participante },
        'participante',
        participante.id,
      ),
    )
    if (!ok) {
      setError('El ejercicio está cerrado: ya no admite nuevos registros.')
      return
    }
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        participante_id: participante.id,
        rol_id: rolId,
        nombre_visible: participante.nombre_visible,
      } satisfies SesionParticipante),
    )
    navigate('/participante')
  }

  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Check-in</span>
        </div>
      </header>

      <div className="tt-card">
        <h1>{config.nombre}</h1>
        <p className="tt-suave">{config.cliente}</p>
      </div>

      {!validado ? (
        <div className="tt-card">
          <Field label="Código de sala">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="p. ej. PH-CRISIS"
              autoCapitalize="characters"
            />
          </Field>
          <Field label="Tu nombre visible">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
          </Field>
          <Field label="Tu rol en el ejercicio">
            <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
              <option value="">Selecciona…</option>
              {config.roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </Field>
          {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
          <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={validar}>
            Continuar
          </button>
        </div>
      ) : (
        <div className="tt-card">
          <h2>{rol!.nombre}</h2>
          <p className="tt-small tt-suave">Responsabilidades declaradas</p>
          <p>{rol!.responsabilidades_declaradas}</p>
          <hr className="tt-sep" />
          <p className="tt-small tt-suave">Reglas del ejercicio</p>
          <ul className="tt-small">
            {config.reglas_participante.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
          <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={entrar}>
            Entrar al ejercicio
          </button>
          <button className="tt-btn tt-btn--fantasma tt-btn--bloque" onClick={() => setValidado(false)}>
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
