'use client'

import { useState } from 'react'
import { Field } from '@/components/ui'

export default function EntrarPage() {
  const [codigo, setCodigo] = useState('')
  const ir = () => {
    if (codigo.trim()) window.location.href = `/e/${encodeURIComponent(codigo.trim().toUpperCase())}`
  }
  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Participante</span>
        </div>
      </header>
      <div className="tt-card">
        <h2>Entrar a la sala</h2>
        <p className="tt-small tt-suave">Escanea el QR del facilitador o escribe el código de sala.</p>
        <Field label="Código de sala">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="p. ej. PH-CRISIS"
            autoCapitalize="characters"
            onKeyDown={(e) => e.key === 'Enter' && ir()}
          />
        </Field>
        <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={ir}>
          Continuar
        </button>
      </div>
    </div>
  )
}
