// P1 — Check-in del participante (SPEC s.8 etapa 1, s.19).
// Acceso por QR o código, sin cuenta. El servidor valida y emite la sesión.

import { useEffect, useState } from 'react'
import { Field } from '../../components/ui'

export interface SesionParticipante {
  ejercicio_id: string
  participante_id: string
  rol_id: string
  nombre_visible: string
}

const SESSION_KEY = 'arseg-tabletop:participante'

export function getSesionParticipante(ejercicioId?: string): SesionParticipante | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const s = raw ? (JSON.parse(raw) as SesionParticipante) : null
    if (s && ejercicioId && s.ejercicio_id !== ejercicioId) return null
    return s
  } catch {
    return null
  }
}

interface FichaSala {
  ejercicio_id: string
  nombre: string
  cliente: string
  reglas_participante: string[]
  roles: { id: string; nombre: string; responsabilidades_declaradas: string }[]
}

export function Checkin({
  codigo,
  token,
  onDone,
}: {
  codigo: string
  token: string | null
  onDone: (s: SesionParticipante) => void
}) {
  const [ficha, setFicha] = useState<FichaSala | null>(null)
  const [nombre, setNombre] = useState('')
  const [rolId, setRolId] = useState('')
  const [error, setError] = useState('')
  const [validado, setValidado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    fetch(`/api/salas/${encodeURIComponent(codigo)}`)
      .then(async (res) => {
        if (res.ok) setFicha((await res.json()) as FichaSala)
        else setError('Código de sala incorrecto. Verifica con el facilitador.')
      })
      .catch(() => setError('Sin conexión. Intenta de nuevo.'))
  }, [codigo])

  const rol = ficha?.roles.find((r) => r.id === rolId)

  const validar = () => {
    if (!nombre.trim()) return setError('Escribe tu nombre visible.')
    if (!rol) return setError('Selecciona tu rol.')
    setError('')
    setValidado(true)
  }

  const entrar = async () => {
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, token, nombre: nombre.trim(), rol_id: rolId }),
      })
      const data = (await res.json()) as SesionParticipante & { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'No fue posible entrar al ejercicio.')
        setEnviando(false)
        return
      }
      const sesion: SesionParticipante = {
        ejercicio_id: data.ejercicio_id,
        participante_id: data.participante_id,
        rol_id: data.rol_id,
        nombre_visible: data.nombre_visible,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion))
      onDone(sesion)
    } catch {
      setError('Sin conexión. Intenta de nuevo.')
      setEnviando(false)
    }
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
        <h1>{ficha?.nombre ?? 'Ejercicio'}</h1>
        <p className="tt-suave">{ficha?.cliente ?? ''}</p>
      </div>

      {!ficha ? (
        <div className="tt-card">
          <p className="tt-small tt-suave">Verificando la sala…</p>
          {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
        </div>
      ) : !validado ? (
        <div className="tt-card">
          <Field label="Tu nombre visible">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
          </Field>
          <Field label="Tu rol en el ejercicio">
            <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
              <option value="">Selecciona…</option>
              {ficha.roles.map((r) => (
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
            {ficha.reglas_participante.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
          <button className="tt-btn tt-btn--primario tt-btn--bloque" disabled={enviando} onClick={entrar}>
            {enviando ? 'Entrando…' : 'Entrar al ejercicio'}
          </button>
          <button className="tt-btn tt-btn--fantasma tt-btn--bloque" onClick={() => setValidado(false)}>
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
