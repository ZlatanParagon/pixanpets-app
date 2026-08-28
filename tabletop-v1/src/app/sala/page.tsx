'use client'

import { useState } from 'react'
import { Field } from '@/components/ui'

export default function SalaIndexPage() {
  const [codigo, setCodigo] = useState('')
  const ir = () => {
    if (codigo.trim()) window.location.href = `/sala/${encodeURIComponent(codigo.trim().toUpperCase())}`
  }
  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Pantalla de sala</span>
        </div>
      </header>
      <div className="tt-card">
        <h2>Proyectar sala</h2>
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
          Proyectar
        </button>
      </div>
    </div>
  )
}
