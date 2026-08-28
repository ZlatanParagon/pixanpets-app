'use client'
// Lista de ejercicios y creación (Etapa 0).

import { useEffect, useState } from 'react'
import { Chip, Field } from '@/components/ui'

interface FilaEjercicio {
  id: string
  nombre: string
  cliente: string
  fecha: string
  codigo_sala: string
  estado: string
  eventos: number
}

interface Me {
  tipo: string
  perfil?: 'director' | 'observador'
  nombre?: string
  usuario_id?: string
}

export default function ConsolaIndex() {
  const [me, setMe] = useState<Me | null>(null)
  const [ejercicios, setEjercicios] = useState<FilaEjercicio[] | null>(null)
  const [muestraNuevo, setMuestraNuevo] = useState(false)
  const [nombre, setNombre] = useState('')
  const [cliente, setCliente] = useState('')
  const [plantilla, setPlantilla] = useState<'ph' | 'vacio'>('ph')
  const [error, setError] = useState('')

  const cargar = () =>
    fetch('/api/ejercicios').then(async (res) => {
      if (res.ok) setEjercicios(((await res.json()) as { ejercicios: FilaEjercicio[] }).ejercicios)
    })

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      const data = (await res.json()) as Me
      if (data.tipo !== 'arseg') {
        window.location.href = '/login'
        return
      }
      // Las pantallas de consola leen la sesión de sessionStorage.
      sessionStorage.setItem(
        'arseg-tabletop:facilitador',
        JSON.stringify({ perfil: data.perfil, nombre: data.nombre, usuario_id: data.usuario_id }),
      )
      setMe(data)
      void cargar()
    })
  }, [])

  const crear = async () => {
    setError('')
    const res = await fetch('/api/ejercicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, cliente, plantilla }),
    })
    const data = (await res.json()) as { id?: string; error?: string }
    if (!res.ok || !data.id) {
      setError(data.error ?? 'No fue posible crear el ejercicio.')
      return
    }
    window.location.href = `/consola/${data.id}`
  }

  if (!me) return <div className="tt-vacio"><h2>Cargando…</h2></div>

  const ESTADOS: Record<string, { label: string; tone?: 'ok' | 'warn' | 'err' }> = {
    preparado: { label: 'Preparado' },
    en_curso: { label: 'En curso', tone: 'ok' },
    cerrado: { label: 'Cerrado', tone: 'err' },
  }

  return (
    <div className="tt-shell">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Ejercicios</span>
        </div>
        <div className="tt-fila">
          <span className="tt-small tt-suave">{me.nombre}</span>
          <button
            className="tt-btn tt-btn--fantasma"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              sessionStorage.removeItem('arseg-tabletop:facilitador')
              window.location.href = '/login'
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {me.perfil === 'director' && (
        <div className="tt-card">
          <div className="tt-fila" style={{ justifyContent: 'space-between' }}>
            <h2>Nuevo ejercicio</h2>
            <button className="tt-btn" onClick={() => setMuestraNuevo((v) => !v)}>
              {muestraNuevo ? 'Cancelar' : 'Crear ejercicio'}
            </button>
          </div>
          {muestraNuevo && (
            <div style={{ marginTop: 10 }}>
              <div className="tt-grid tt-grid--3">
                <Field label="Nombre">
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Field>
                <Field label="Cliente">
                  <input value={cliente} onChange={(e) => setCliente(e.target.value)} />
                </Field>
                <Field label="Plantilla">
                  <select value={plantilla} onChange={(e) => setPlantilla(e.target.value as 'ph' | 'vacio')}>
                    <option value="ph">Referencia PH (objetivos, roles y MSEL)</option>
                    <option value="vacio">Solo objetivos base TT-01..TT-10</option>
                  </select>
                </Field>
              </div>
              {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
              <button className="tt-btn tt-btn--primario" onClick={crear}>
                Crear y configurar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="tt-card">
        <h2>Ejercicios</h2>
        {!ejercicios ? (
          <p className="tt-small tt-suave">Cargando…</p>
        ) : ejercicios.length === 0 ? (
          <p className="tt-small tt-suave">Aún no hay ejercicios.</p>
        ) : (
          <div className="tt-tabla-wrap">
            <table className="tt-tabla">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Código de sala</th>
                  <th>Estado</th>
                  <th>Eventos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ejercicios.map((e) => {
                  const est = ESTADOS[e.estado] ?? { label: e.estado }
                  return (
                    <tr key={e.id}>
                      <td><strong>{e.nombre}</strong></td>
                      <td>{e.cliente}</td>
                      <td className="tt-mono">{e.fecha}</td>
                      <td className="tt-mono">{e.codigo_sala}</td>
                      <td><Chip tone={est.tone}>{est.label}</Chip></td>
                      <td className="tt-mono">{e.eventos}</td>
                      <td>
                        <span className="tt-fila" style={{ flexWrap: 'nowrap' }}>
                          <a className="tt-btn" href={`/consola/${e.id}`}>Abrir</a>
                          {me.perfil === 'director' && (
                            <button
                              className="tt-btn tt-btn--fantasma"
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    `¿Eliminar «${e.nombre}» y sus ${e.eventos} eventos? Esta acción es permanente.`,
                                  )
                                )
                                  return
                                const res = await fetch(`/api/ejercicios/${e.id}`, { method: 'DELETE' })
                                if (res.ok) void cargar()
                              }}
                            >
                              Eliminar
                            </button>
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
