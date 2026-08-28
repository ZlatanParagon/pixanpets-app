'use client'

import { useState } from 'react'
import { Field } from '@/components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async () => {
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'No fue posible iniciar sesión.')
        setEnviando(false)
        return
      }
      window.location.href = '/consola'
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
          <span>Consola</span>
        </div>
      </header>
      <div className="tt-card">
        <h2>Acceso ARSEG</h2>
        <Field label="Correo">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
          />
        </Field>
        {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
        <button className="tt-btn tt-btn--primario tt-btn--bloque" disabled={enviando} onClick={entrar}>
          {enviando ? 'Entrando…' : 'Entrar a la consola'}
        </button>
      </div>
    </div>
  )
}
