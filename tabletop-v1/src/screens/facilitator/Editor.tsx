// Etapa 0 — Preparación (SPEC s.8): el director configura ficha, objetivos,
// fases, roles, MSEL y reglas. Solo editable antes de iniciar el ejercicio;
// después, los cambios en vivo van por inyecciones ad hoc y ajustes de audiencia.

import { useState } from 'react'
import { Chip, Field } from '../../components/ui'
import { uuid } from '../../domain/events'
import { validarConfig } from '../../domain/rules'
import type {
  Consecuencia,
  EjercicioConfig,
  Fase,
  Inyeccion,
  Objetivo,
  Rol,
  Severidad,
  TipoInyeccion,
} from '../../domain/types'
import { useStore } from '../../store'

type Seccion = 'ficha' | 'objetivos' | 'fases' | 'roles' | 'inyecciones'

export function Editor() {
  const { config, recargarConfig } = useStore()
  const [draft, setDraft] = useState<EjercicioConfig>(() => structuredClone(config))
  const [seccion, setSeccion] = useState<Seccion>('ficha')
  const [mensaje, setMensaje] = useState<{ tono: 'ok' | 'err'; texto: string } | null>(null)
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    const errores = validarConfig(draft)
    if (errores.length > 0) {
      setMensaje({ tono: 'err', texto: errores.join(' · ') })
      return
    }
    setGuardando(true)
    const res = await fetch(`/api/ejercicios/${config.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: draft }),
    })
    setGuardando(false)
    if (res.ok) {
      setMensaje({ tono: 'ok', texto: 'Configuración guardada.' })
      void recargarConfig()
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      setMensaje({ tono: 'err', texto: data?.error ?? 'No fue posible guardar.' })
    }
  }

  const secciones: [Seccion, string][] = [
    ['ficha', 'Ficha'],
    ['objetivos', `Objetivos (${draft.objetivos.length})`],
    ['fases', `Fases (${draft.fases.length})`],
    ['roles', `Roles (${draft.roles.length})`],
    ['inyecciones', `MSEL (${draft.inyecciones.length})`],
  ]

  return (
    <>
      <div className="tt-card">
        <div className="tt-fila" style={{ justifyContent: 'space-between' }}>
          <div className="tt-fila">
            {secciones.map(([id, label]) => (
              <button
                key={id}
                className={'tt-btn' + (seccion === id ? ' tt-btn--primario' : '')}
                onClick={() => setSeccion(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="tt-btn tt-btn--primario" disabled={guardando} onClick={guardar}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
        {mensaje && (
          <p className="tt-small" style={{ color: mensaje.tono === 'err' ? 'var(--critico)' : 'var(--estable)', marginBottom: 0 }}>
            {mensaje.texto}
          </p>
        )}
        <p className="tt-small tt-suave" style={{ marginBottom: 0 }}>
          Editable solo antes de iniciar el ejercicio. Código de sala:{' '}
          <span className="tt-mono">{config.codigo_sala}</span>
        </p>
      </div>

      {seccion === 'ficha' && <EditorFicha draft={draft} setDraft={setDraft} />}
      {seccion === 'objetivos' && <EditorObjetivos draft={draft} setDraft={setDraft} />}
      {seccion === 'fases' && <EditorFases draft={draft} setDraft={setDraft} />}
      {seccion === 'roles' && <EditorRoles draft={draft} setDraft={setDraft} />}
      {seccion === 'inyecciones' && <EditorInyecciones draft={draft} setDraft={setDraft} />}
    </>
  )
}

interface Props {
  draft: EjercicioConfig
  setDraft: React.Dispatch<React.SetStateAction<EjercicioConfig>>
}

function EditorFicha({ draft, setDraft }: Props) {
  const set = (patch: Partial<EjercicioConfig>) => setDraft((d) => ({ ...d, ...patch }))
  return (
    <div className="tt-card">
      <div className="tt-grid tt-grid--2">
        <Field label="Nombre del ejercicio">
          <input value={draft.nombre} onChange={(e) => set({ nombre: e.target.value })} />
        </Field>
        <Field label="Cliente">
          <input value={draft.cliente} onChange={(e) => set({ cliente: e.target.value })} />
        </Field>
        <Field label="Fecha">
          <input type="date" value={draft.fecha} onChange={(e) => set({ fecha: e.target.value })} />
        </Field>
        <Field label="Duración estimada (horas)">
          <input
            inputMode="numeric"
            value={String(draft.duracion_estimada_seg / 3600)}
            onChange={(e) => set({ duracion_estimada_seg: (Number(e.target.value) || 0) * 3600 })}
          />
        </Field>
      </div>
      <Field label="Escenario (contexto inicial)">
        <textarea rows={4} value={draft.escenario} onChange={(e) => set({ escenario: e.target.value })} />
      </Field>
      <Field label="Reglas para el participante (una por línea)">
        <textarea
          rows={4}
          value={draft.reglas_participante.join('\n')}
          onChange={(e) => set({ reglas_participante: e.target.value.split('\n').filter((x) => x.trim()) })}
        />
      </Field>
    </div>
  )
}

function EditorObjetivos({ draft, setDraft }: Props) {
  const actualizar = (id: string, patch: Partial<Objetivo>) =>
    setDraft((d) => ({
      ...d,
      objetivos: d.objetivos.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }))
  const agregar = () =>
    setDraft((d) => ({
      ...d,
      objetivos: [
        ...d.objetivos,
        { id: 'obj-' + uuid(), clave: `TT-${String(d.objetivos.length + 1).padStart(2, '0')}`, nombre: '', descripcion: '', activo: true },
      ],
    }))
  const quitar = (id: string) =>
    setDraft((d) => ({ ...d, objetivos: d.objetivos.filter((o) => o.id !== id) }))
  return (
    <div className="tt-card">
      {draft.objetivos.map((o) => (
        <div key={o.id} className="tt-fila" style={{ borderTop: '1px solid var(--borde)', padding: '8px 0' }}>
          <input className="tt-mono" style={{ width: 90 }} value={o.clave} onChange={(e) => actualizar(o.id, { clave: e.target.value })} aria-label="Clave" />
          <input style={{ flex: 1, minWidth: 160 }} value={o.nombre} placeholder="Nombre" onChange={(e) => actualizar(o.id, { nombre: e.target.value })} aria-label="Nombre" />
          <input style={{ flex: 2, minWidth: 200 }} value={o.descripcion} placeholder="Evidencia esperada" onChange={(e) => actualizar(o.id, { descripcion: e.target.value })} aria-label="Descripción" />
          <label className="tt-fila tt-small" style={{ gap: 4 }}>
            <input type="checkbox" checked={o.activo} onChange={(e) => actualizar(o.id, { activo: e.target.checked })} />
            Activo
          </label>
          <button className="tt-btn tt-btn--fantasma" onClick={() => quitar(o.id)}>Quitar</button>
        </div>
      ))}
      <button className="tt-btn" style={{ marginTop: 10 }} onClick={agregar}>Agregar objetivo</button>
    </div>
  )
}

function EditorFases({ draft, setDraft }: Props) {
  const actualizar = (id: string, patch: Partial<Fase>) =>
    setDraft((d) => ({ ...d, fases: d.fases.map((f) => (f.id === id ? { ...f, ...patch } : f)) }))
  const agregar = () =>
    setDraft((d) => ({
      ...d,
      fases: [...d.fases, { id: 'fase-' + uuid(), orden: d.fases.length + 1, nombre: '', descripcion: '' }],
    }))
  const quitar = (id: string) =>
    setDraft((d) => ({ ...d, fases: d.fases.filter((f) => f.id !== id) }))
  return (
    <div className="tt-card">
      {draft.fases
        .sort((a, b) => a.orden - b.orden)
        .map((f) => (
          <div key={f.id} className="tt-fila" style={{ borderTop: '1px solid var(--borde)', padding: '8px 0' }}>
            <input className="tt-mono" style={{ width: 60 }} inputMode="numeric" value={String(f.orden)} onChange={(e) => actualizar(f.id, { orden: Number(e.target.value) || 0 })} aria-label="Orden" />
            <input style={{ flex: 1, minWidth: 140 }} value={f.nombre} placeholder="Nombre" onChange={(e) => actualizar(f.id, { nombre: e.target.value })} aria-label="Nombre" />
            <input style={{ flex: 2, minWidth: 200 }} value={f.descripcion} placeholder="Descripción" onChange={(e) => actualizar(f.id, { descripcion: e.target.value })} aria-label="Descripción" />
            <button className="tt-btn tt-btn--fantasma" onClick={() => quitar(f.id)}>Quitar</button>
          </div>
        ))}
      <button className="tt-btn" style={{ marginTop: 10 }} onClick={agregar}>Agregar fase</button>
    </div>
  )
}

function EditorRoles({ draft, setDraft }: Props) {
  const actualizar = (id: string, patch: Partial<Rol>) =>
    setDraft((d) => ({ ...d, roles: d.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  const agregar = () =>
    setDraft((d) => ({
      ...d,
      roles: [...d.roles, { id: 'rol-' + uuid(), orden: d.roles.length + 1, nombre: '', responsabilidades_declaradas: '' }],
    }))
  const quitar = (id: string) =>
    setDraft((d) => ({ ...d, roles: d.roles.filter((r) => r.id !== id) }))
  return (
    <div className="tt-card">
      <p className="tt-small tt-suave">Hasta 15 participantes ejecutivos (alcance PH, s.3).</p>
      {draft.roles
        .sort((a, b) => a.orden - b.orden)
        .map((r) => (
          <div key={r.id} className="tt-fila" style={{ borderTop: '1px solid var(--borde)', padding: '8px 0' }}>
            <input style={{ flex: 1, minWidth: 160 }} value={r.nombre} placeholder="Nombre del rol" onChange={(e) => actualizar(r.id, { nombre: e.target.value })} aria-label="Rol" />
            <input style={{ flex: 2, minWidth: 220 }} value={r.responsabilidades_declaradas} placeholder="Responsabilidades declaradas" onChange={(e) => actualizar(r.id, { responsabilidades_declaradas: e.target.value })} aria-label="Responsabilidades" />
            <button className="tt-btn tt-btn--fantasma" onClick={() => quitar(r.id)}>Quitar</button>
          </div>
        ))}
      <button className="tt-btn" style={{ marginTop: 10 }} onClick={agregar}>Agregar rol</button>
    </div>
  )
}

const TIPOS: TipoInyeccion[] = [
  'principal',
  'dirigida',
  'consecuencia',
  'informacion_tecnica',
  'presion_externa',
  'presion_operativa',
  'presion_legal',
  'presion_reputacional',
  'salto_temporal',
]

function EditorInyecciones({ draft, setDraft }: Props) {
  const [abiertaId, setAbiertaId] = useState<string | null>(null)

  const agregar = () => {
    const nueva: Inyeccion = {
      id: 'iny-' + uuid(),
      fase_id: draft.fases[0]?.id ?? '',
      orden: Math.max(0, ...draft.inyecciones.map((i) => i.orden)) + 1,
      clave: `INY-${String(draft.inyecciones.length + 1).padStart(2, '0')}`,
      tipo: 'principal',
      titulo: '',
      cuerpo: '',
      fuente: 'hipotetica_aprobada',
      evidencia_origen_ref: null,
      severidad_disenada: 'media',
      ventana_decision_seg: 420,
      objetivo_ids: [],
      audiencia_rol_ids: null,
      visible_en_sala: true,
      respuesta_esperada_rol_ids: [],
      alternativas: [],
      consecuencias: [],
      salto_narrativo_seg: null,
    }
    setDraft((d) => ({ ...d, inyecciones: [...d.inyecciones, nueva] }))
    setAbiertaId(nueva.id)
  }

  const quitar = (id: string) =>
    setDraft((d) => ({
      ...d,
      inyecciones: d.inyecciones
        .filter((i) => i.id !== id)
        .map((i) => ({
          ...i,
          consecuencias: i.consecuencias.map((c) => ({
            ...c,
            activa_inyeccion_ids: c.activa_inyeccion_ids.filter((x) => x !== id),
          })),
        })),
    }))

  return (
    <div className="tt-card">
      {draft.inyecciones
        .sort((a, b) => a.orden - b.orden)
        .map((iny) =>
          abiertaId === iny.id ? (
            <FormInyeccion
              key={iny.id}
              draft={draft}
              iny={iny}
              onChange={(patch) =>
                setDraft((d) => ({
                  ...d,
                  inyecciones: d.inyecciones.map((i) => (i.id === iny.id ? { ...i, ...patch } : i)),
                }))
              }
              onClose={() => setAbiertaId(null)}
            />
          ) : (
            <div key={iny.id} className="tt-fila" style={{ borderTop: '1px solid var(--borde)', padding: '8px 0' }}>
              <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
              <strong style={{ flex: 1 }}>{iny.titulo || '(sin título)'}</strong>
              <span className="tt-small tt-suave">{draft.fases.find((f) => f.id === iny.fase_id)?.nombre}</span>
              {iny.audiencia_rol_ids !== null && <Chip>Privada</Chip>}
              {iny.consecuencias.length > 0 && <Chip tone="activa">{iny.consecuencias.length} ramas</Chip>}
              <button className="tt-btn" onClick={() => setAbiertaId(iny.id)}>Editar</button>
              <button className="tt-btn tt-btn--fantasma" onClick={() => quitar(iny.id)}>Quitar</button>
            </div>
          ),
        )}
      <button className="tt-btn" style={{ marginTop: 10 }} onClick={agregar}>Agregar inyección</button>
    </div>
  )
}

function FormInyeccion({
  draft,
  iny,
  onChange,
  onClose,
}: {
  draft: EjercicioConfig
  iny: Inyeccion
  onChange: (patch: Partial<Inyeccion>) => void
  onClose: () => void
}) {
  const marcar = (lista: string[], id: string, on: boolean) =>
    on ? [...lista, id] : lista.filter((x) => x !== id)

  return (
    <div style={{ borderTop: '2px solid var(--acento)', padding: '12px 0' }}>
      <div className="tt-grid tt-grid--3">
        <Field label="Clave">
          <input className="tt-mono" value={iny.clave} onChange={(e) => onChange({ clave: e.target.value })} />
        </Field>
        <Field label="Fase">
          <select value={iny.fase_id} onChange={(e) => onChange({ fase_id: e.target.value })}>
            {draft.fases.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label="Tipo">
          <select value={iny.tipo} onChange={(e) => onChange({ tipo: e.target.value as TipoInyeccion })}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Título">
        <input value={iny.titulo} onChange={(e) => onChange({ titulo: e.target.value })} />
      </Field>
      <Field label="Narrativa">
        <textarea rows={3} value={iny.cuerpo} onChange={(e) => onChange({ cuerpo: e.target.value })} />
      </Field>
      <div className="tt-grid tt-grid--3">
        <Field label="Severidad diseñada">
          <select value={iny.severidad_disenada} onChange={(e) => onChange({ severidad_disenada: e.target.value as Severidad })}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </Field>
        <Field label="Ventana (min, vacío = sin ventana)">
          <input
            inputMode="numeric"
            value={iny.ventana_decision_seg != null ? String(iny.ventana_decision_seg / 60) : ''}
            onChange={(e) =>
              onChange({ ventana_decision_seg: e.target.value.trim() ? Math.round(Number(e.target.value) * 60) : null })
            }
          />
        </Field>
        <Field label="Evidencia de origen (ref)">
          <input value={iny.evidencia_origen_ref ?? ''} onChange={(e) => onChange({ evidencia_origen_ref: e.target.value.trim() || null })} />
        </Field>
      </div>
      {iny.tipo === 'salto_temporal' && (
        <Field label="Salto narrativo (horas)">
          <input
            inputMode="numeric"
            value={iny.salto_narrativo_seg != null ? String(iny.salto_narrativo_seg / 3600) : ''}
            onChange={(e) =>
              onChange({ salto_narrativo_seg: e.target.value.trim() ? Math.round(Number(e.target.value) * 3600) : null })
            }
          />
        </Field>
      )}
      <Field label="Objetivos evaluados (al menos uno — CA-8)">
        <span className="tt-fila">
          {draft.objetivos.map((o) => (
            <label key={o.id} className="tt-fila" style={{ gap: 4 }}>
              <input
                type="checkbox"
                checked={iny.objetivo_ids.includes(o.id)}
                onChange={(e) => onChange({ objetivo_ids: marcar(iny.objetivo_ids, o.id, e.target.checked) })}
              />
              <span className="tt-small tt-mono">{o.clave}</span>
            </label>
          ))}
        </span>
      </Field>
      <Field label="Audiencia">
        <span>
          <label className="tt-fila" style={{ marginBottom: 4 }}>
            <input
              type="checkbox"
              checked={iny.audiencia_rol_ids === null}
              onChange={(e) => onChange({ audiencia_rol_ids: e.target.checked ? null : [] })}
            />
            <span>Todos los roles</span>
          </label>
          {iny.audiencia_rol_ids !== null && (
            <span className="tt-fila">
              {draft.roles.map((r) => (
                <label key={r.id} className="tt-fila" style={{ gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={iny.audiencia_rol_ids!.includes(r.id)}
                    onChange={(e) => onChange({ audiencia_rol_ids: marcar(iny.audiencia_rol_ids!, r.id, e.target.checked) })}
                  />
                  <span className="tt-small">{r.nombre}</span>
                </label>
              ))}
            </span>
          )}
        </span>
      </Field>
      <Field label="Roles con respuesta esperada">
        <span className="tt-fila">
          {draft.roles
            .filter((r) => iny.audiencia_rol_ids === null || iny.audiencia_rol_ids.includes(r.id))
            .map((r) => (
              <label key={r.id} className="tt-fila" style={{ gap: 4 }}>
                <input
                  type="checkbox"
                  checked={iny.respuesta_esperada_rol_ids.includes(r.id)}
                  onChange={(e) => onChange({ respuesta_esperada_rol_ids: marcar(iny.respuesta_esperada_rol_ids, r.id, e.target.checked) })}
                />
                <span className="tt-small">{r.nombre}</span>
              </label>
            ))}
        </span>
      </Field>
      <label className="tt-fila" style={{ marginBottom: 10 }}>
        <input type="checkbox" checked={iny.visible_en_sala} onChange={(e) => onChange({ visible_en_sala: e.target.checked })} />
        <span className="tt-small">Visible en pantalla de sala</span>
      </label>
      <Field label="Alternativas de decisión (una por línea, opcional)">
        <textarea
          rows={3}
          value={iny.alternativas.join('\n')}
          onChange={(e) => onChange({ alternativas: e.target.value.split('\n').filter((x) => x.trim()) })}
        />
      </Field>

      <EditorConsecuencias draft={draft} iny={iny} onChange={onChange} />

      <button className="tt-btn tt-btn--primario" onClick={onClose}>Listo</button>
    </div>
  )
}

function EditorConsecuencias({
  draft,
  iny,
  onChange,
}: {
  draft: EjercicioConfig
  iny: Inyeccion
  onChange: (patch: Partial<Inyeccion>) => void
}) {
  const actualizar = (id: string, patch: Partial<Consecuencia>) =>
    onChange({ consecuencias: iny.consecuencias.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  const otras = draft.inyecciones.filter((i) => i.id !== iny.id)
  return (
    <div className="tt-aviso" style={{ marginBottom: 12 }}>
      <p className="tt-small" style={{ marginTop: 0 }}>
        <strong>Consecuencias / ramas (s.17)</strong> — el facilitador elegirá una manualmente; las
        inyecciones marcadas quedan preparadas al seleccionarla.
      </p>
      {iny.consecuencias.map((c) => (
        <div key={c.id} style={{ borderTop: '1px solid var(--borde)', padding: '8px 0' }}>
          <div className="tt-fila">
            <input
              style={{ flex: 1, minWidth: 200 }}
              value={c.etiqueta}
              placeholder="Etiqueta de la rama (p. ej. A · Se autoriza contención)"
              onChange={(e) => actualizar(c.id, { etiqueta: e.target.value })}
              aria-label="Etiqueta de rama"
            />
            <button
              className="tt-btn tt-btn--fantasma"
              onClick={() => onChange({ consecuencias: iny.consecuencias.filter((x) => x.id !== c.id) })}
            >
              Quitar rama
            </button>
          </div>
          <div className="tt-fila" style={{ marginTop: 4 }}>
            {otras.map((o) => (
              <label key={o.id} className="tt-fila" style={{ gap: 4 }}>
                <input
                  type="checkbox"
                  checked={c.activa_inyeccion_ids.includes(o.id)}
                  onChange={(e) =>
                    actualizar(c.id, {
                      activa_inyeccion_ids: e.target.checked
                        ? [...c.activa_inyeccion_ids, o.id]
                        : c.activa_inyeccion_ids.filter((x) => x !== o.id),
                    })
                  }
                />
                <span className="tt-small tt-mono">{o.clave}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        className="tt-btn"
        style={{ marginTop: 6 }}
        onClick={() =>
          onChange({
            consecuencias: [...iny.consecuencias, { id: 'rama-' + uuid(), etiqueta: '', activa_inyeccion_ids: [] }],
          })
        }
      >
        Agregar rama
      </button>
    </div>
  )
}
