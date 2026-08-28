// F2 — MSEL / Inyecciones (SPEC s.20). Disparar, preparar, omitir, cerrar,
// reordenar antes del disparo, ajustar audiencia antes del disparo, insertar
// ad hoc y seleccionar consecuencias (s.17). No se modifica una inyección ya
// disparada: la cronología es intocable.

import { useState } from 'react'
import { Chip, Field, SeveridadChip } from '../../components/ui'
import { fmtHora } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, uuid } from '../../domain/events'
import type { EstadoInyeccion, Inyeccion, Severidad, TipoInyeccion } from '../../domain/types'
import { useStore } from '../../store'
import { FACILITADOR_ID } from './Console'

const ESTADO_TONE: Record<EstadoInyeccion, { label: string; tone?: 'activa' | 'ok' | 'warn' | 'err' }> = {
  pendiente: { label: 'Pendiente' },
  preparada: { label: 'Preparada', tone: 'warn' },
  activa: { label: 'Activa', tone: 'activa' },
  cerrada: { label: 'Cerrada', tone: 'ok' },
  omitida: { label: 'Omitida', tone: 'err' },
}

export function Msel() {
  const { config, estado, append } = useStore()
  const [muestraAdhoc, setMuestraAdhoc] = useState(false)
  const iniciado = estado.iniciado_en != null
  const cerrado = estado.estado === 'cerrado'

  const emit = (type: (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES], payload: unknown) =>
    append(makeEvent(config.id, type, payload, 'facilitador', FACILITADOR_ID))

  const disparar = (iny: Inyeccion) => {
    emit(EVENT_TYPES.INJECT_DISPATCHED, { inyeccion_id: iny.id })
    // Un salto temporal aplica su desfase narrativo al dispararse (s.15).
    if (iny.tipo === 'salto_temporal' && iny.salto_narrativo_seg != null) {
      emit(EVENT_TYPES.NARRATIVE_TIME_JUMP, {
        salto_seg: iny.salto_narrativo_seg,
        etiqueta: iny.titulo,
      })
    }
  }

  const reordenar = (iny: Inyeccion, direccion: -1 | 1) => {
    const hermanas = estado.msel
      .filter((i) => i.fase_id === iny.fase_id)
      .filter((i) => ['pendiente', 'preparada'].includes(estado.inyecciones[i.id].estado))
    const idx = hermanas.findIndex((i) => i.id === iny.id)
    const vecina = hermanas[idx + direccion]
    if (!vecina) return
    emit(EVENT_TYPES.INJECT_REORDERED, { inyeccion_id: iny.id, nuevo_orden: vecina.orden })
    emit(EVENT_TYPES.INJECT_REORDERED, { inyeccion_id: vecina.id, nuevo_orden: iny.orden })
  }

  return (
    <>
      {!iniciado && (
        <p className="tt-aviso">El ejercicio aún no inicia: inicia el reloj desde el Tablero antes de disparar.</p>
      )}

      <div className="tt-card">
        <div className="tt-fila" style={{ justifyContent: 'space-between' }}>
          <h2>Inyección ad hoc</h2>
          <button className="tt-btn" disabled={cerrado} onClick={() => setMuestraAdhoc((v) => !v)}>
            {muestraAdhoc ? 'Cancelar' : 'Insertar inyección ad hoc'}
          </button>
        </div>
        {muestraAdhoc && <FormAdhoc onDone={() => setMuestraAdhoc(false)} />}
      </div>

      {config.fases.map((fase) => {
        const inys = estado.msel
          .filter((i) => i.fase_id === fase.id)
          .sort((a, b) => a.orden - b.orden)
        if (inys.length === 0) return null
        return (
          <div key={fase.id} className="tt-card">
            <h2>
              {fase.orden}. {fase.nombre}
            </h2>
            {inys.map((iny) => (
              <FilaInyeccion
                key={iny.id}
                iny={iny}
                puedeOperar={iniciado && !cerrado}
                onDisparar={() => disparar(iny)}
                onPreparar={() => emit(EVENT_TYPES.INJECT_PREPARED, { inyeccion_id: iny.id })}
                onCerrar={() => emit(EVENT_TYPES.INJECT_CLOSED, { inyeccion_id: iny.id })}
                onOmitir={() => emit(EVENT_TYPES.INJECT_OMITTED, { inyeccion_id: iny.id })}
                onReordenar={(d) => reordenar(iny, d)}
                onRama={(consecuencia_id) =>
                  emit(EVENT_TYPES.BRANCH_SELECTED, { inyeccion_id: iny.id, consecuencia_id })
                }
                onAudiencia={(audiencia_rol_ids, visible_en_sala) =>
                  emit(EVENT_TYPES.INJECT_AUDIENCE_CHANGED, {
                    inyeccion_id: iny.id,
                    audiencia_rol_ids,
                    visible_en_sala,
                  })
                }
              />
            ))}
          </div>
        )
      })}
    </>
  )
}

function FilaInyeccion({
  iny,
  puedeOperar,
  onDisparar,
  onPreparar,
  onCerrar,
  onOmitir,
  onReordenar,
  onRama,
  onAudiencia,
}: {
  iny: Inyeccion
  puedeOperar: boolean
  onDisparar: () => void
  onPreparar: () => void
  onCerrar: () => void
  onOmitir: () => void
  onReordenar: (direccion: -1 | 1) => void
  onRama: (consecuencia_id: string) => void
  onAudiencia: (audiencia_rol_ids: string[] | null, visible_en_sala: boolean) => void
}) {
  const { config, estado } = useStore()
  const est = estado.inyecciones[iny.id]
  const { label, tone } = ESTADO_TONE[est.estado]
  const ramaSeleccionada = estado.ramas[iny.id]
  const previaAlDisparo = est.estado === 'pendiente' || est.estado === 'preparada'

  const objetivos = iny.objetivo_ids
    .map((id) => config.objetivos.find((o) => o.id === id)?.clave ?? id)
    .join(', ')
  const audiencia =
    iny.audiencia_rol_ids === null
      ? 'Todos los roles'
      : iny.audiencia_rol_ids.map((r) => config.roles.find((x) => x.id === r)?.nombre ?? r).join(', ')
  const esperados = iny.respuesta_esperada_rol_ids
    .map((r) => config.roles.find((x) => x.id === r)?.nombre ?? r)
    .join(', ')

  return (
    <details style={{ borderTop: '1px solid var(--borde)', padding: '10px 0' }}>
      <summary className="tt-fila" style={{ cursor: 'pointer', listStyle: 'none' }}>
        <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
        <strong style={{ flex: 1 }}>{iny.titulo}</strong>
        {iny.audiencia_rol_ids !== null && <Chip>Privada</Chip>}
        {!iny.visible_en_sala && <Chip>No visible en sala</Chip>}
        {ramaSeleccionada && <Chip tone="activa">Rama elegida</Chip>}
        <Chip tone={tone}>{label}</Chip>
      </summary>
      <div style={{ padding: '10px 0 4px' }}>
        <p className="tt-small">{iny.cuerpo}</p>
        <div className="tt-fila tt-small tt-suave">
          <SeveridadChip severidad={iny.severidad_disenada} />
          <span>Tipo: {iny.tipo.replace(/_/g, ' ')}</span>
          <span>Objetivos: {objetivos}</span>
          <span>Audiencia: {audiencia}</span>
          {esperados && <span>Respuesta esperada: {esperados}</span>}
          {iny.ventana_decision_seg != null && <span>Ventana: {Math.round(iny.ventana_decision_seg / 60)} min</span>}
          {iny.evidencia_origen_ref && <span className="tt-mono">Origen: {iny.evidencia_origen_ref}</span>}
        </div>
        {est.disparada_en && (
          <p className="tt-small tt-mono tt-suave">
            Disparada {fmtHora(est.disparada_en)}
            {est.cerrada_en && <> · cerrada {fmtHora(est.cerrada_en)}</>}
          </p>
        )}

        <div className="tt-fila" style={{ marginTop: 8 }}>
          {est.estado === 'pendiente' && (
            <button className="tt-btn" disabled={!puedeOperar} onClick={onPreparar}>
              Preparar
            </button>
          )}
          {previaAlDisparo && (
            <>
              <button className="tt-btn tt-btn--primario" disabled={!puedeOperar} onClick={onDisparar}>
                Disparar inyección
              </button>
              <button className="tt-btn tt-btn--fantasma" disabled={!puedeOperar} onClick={onOmitir}>
                Omitir
              </button>
              <button className="tt-btn tt-btn--fantasma" disabled={!puedeOperar} onClick={() => onReordenar(-1)} aria-label="Subir en el orden">
                ↑ Subir
              </button>
              <button className="tt-btn tt-btn--fantasma" disabled={!puedeOperar} onClick={() => onReordenar(1)} aria-label="Bajar en el orden">
                ↓ Bajar
              </button>
            </>
          )}
          {est.estado === 'activa' && (
            <button className="tt-btn" disabled={!puedeOperar} onClick={onCerrar}>
              Cerrar inyección
            </button>
          )}
        </div>

        {previaAlDisparo && (
          <EditorAudiencia iny={iny} disabled={!puedeOperar} onGuardar={onAudiencia} />
        )}

        {/* Consecuencias (s.17): selección manual del facilitador, una sola vez. */}
        {iny.consecuencias.length > 0 && (est.estado === 'activa' || est.estado === 'cerrada') && (
          <div style={{ marginTop: 10 }}>
            <p className="tt-small tt-suave" style={{ marginBottom: 6 }}>
              Consecuencias — la selección activa las inyecciones dependientes:
            </p>
            {ramaSeleccionada ? (
              <Chip tone="activa">
                {iny.consecuencias.find((c) => c.id === ramaSeleccionada)?.etiqueta ?? ramaSeleccionada}
              </Chip>
            ) : (
              <div className="tt-fila">
                {iny.consecuencias.map((c) => (
                  <button key={c.id} className="tt-btn" disabled={!puedeOperar} onClick={() => onRama(c.id)}>
                    {c.etiqueta}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  )
}

/** Hacer privada/pública una inyección antes del disparo (F2). */
function EditorAudiencia({
  iny,
  disabled,
  onGuardar,
}: {
  iny: Inyeccion
  disabled: boolean
  onGuardar: (audiencia_rol_ids: string[] | null, visible_en_sala: boolean) => void
}) {
  const { config } = useStore()
  const [abierto, setAbierto] = useState(false)
  const [todos, setTodos] = useState(iny.audiencia_rol_ids === null)
  const [roles, setRoles] = useState<string[]>(iny.audiencia_rol_ids ?? [])
  const [visible, setVisible] = useState(iny.visible_en_sala)

  if (!abierto) {
    return (
      <button className="tt-btn tt-btn--fantasma" style={{ marginTop: 8 }} disabled={disabled} onClick={() => setAbierto(true)}>
        Editar audiencia (privada/pública)
      </button>
    )
  }

  return (
    <div className="tt-aviso" style={{ marginTop: 10 }}>
      <label className="tt-fila" style={{ marginBottom: 6 }}>
        <input type="checkbox" checked={todos} onChange={(e) => setTodos(e.target.checked)} />
        <span>Enviar a todos los roles</span>
      </label>
      {!todos && (
        <div className="tt-fila" style={{ marginBottom: 6 }}>
          {config.roles.map((r) => (
            <label key={r.id} className="tt-fila" style={{ gap: 4 }}>
              <input
                type="checkbox"
                checked={roles.includes(r.id)}
                onChange={(e) =>
                  setRoles((prev) => (e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id)))
                }
              />
              <span className="tt-small">{r.nombre}</span>
            </label>
          ))}
        </div>
      )}
      <label className="tt-fila" style={{ marginBottom: 8 }}>
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
        <span>Visible en pantalla de sala</span>
      </label>
      <div className="tt-fila">
        <button
          className="tt-btn"
          disabled={!todos && roles.length === 0}
          onClick={() => {
            onGuardar(todos ? null : roles, visible)
            setAbierto(false)
          }}
        >
          Guardar audiencia
        </button>
        <button className="tt-btn tt-btn--fantasma" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

const TIPOS_ADHOC: TipoInyeccion[] = [
  'principal',
  'dirigida',
  'consecuencia',
  'informacion_tecnica',
  'presion_externa',
  'presion_operativa',
  'presion_legal',
  'presion_reputacional',
]

/** Inserción de inyección ad hoc durante la sesión (F2). */
function FormAdhoc({ onDone }: { onDone: () => void }) {
  const { config, estado, append } = useStore()
  const [faseId, setFaseId] = useState(estado.fase_actual_id)
  const [tipo, setTipo] = useState<TipoInyeccion>('dirigida')
  const [titulo, setTitulo] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [severidad, setSeveridad] = useState<Severidad>('media')
  const [ventanaMin, setVentanaMin] = useState('7')
  const [objetivos, setObjetivos] = useState<string[]>([])
  const [todos, setTodos] = useState(true)
  const [roles, setRoles] = useState<string[]>([])
  const [esperados, setEsperados] = useState<string[]>([])
  const [visible, setVisible] = useState(true)
  const [error, setError] = useState('')

  const guardar = () => {
    if (!titulo.trim() || !cuerpo.trim()) return setError('Título y narrativa son necesarios.')
    // CA-8: toda inyección está asociada al menos a un objetivo.
    if (objetivos.length === 0) return setError('Asocia al menos un objetivo (CA-8).')
    if (!todos && roles.length === 0) return setError('Selecciona la audiencia.')
    const n = estado.msel.filter((i) => i.clave.startsWith('ADHOC')).length + 1
    const maxOrden = Math.max(...estado.msel.map((i) => i.orden))
    const inyeccion: Inyeccion = {
      id: uuid(),
      fase_id: faseId,
      orden: maxOrden + 1,
      clave: `ADHOC-${String(n).padStart(2, '0')}`,
      tipo,
      titulo: titulo.trim(),
      cuerpo: cuerpo.trim(),
      fuente: 'facilitador',
      evidencia_origen_ref: null,
      severidad_disenada: severidad,
      ventana_decision_seg: ventanaMin.trim() ? Math.round(Number(ventanaMin) * 60) : null,
      objetivo_ids: objetivos,
      audiencia_rol_ids: todos ? null : roles,
      visible_en_sala: todos ? visible : false,
      respuesta_esperada_rol_ids: esperados.filter((r) => todos || roles.includes(r)),
      alternativas: [],
      consecuencias: [],
      salto_narrativo_seg: null,
    }
    const ok = append(
      makeEvent(config.id, EVENT_TYPES.INJECT_ADHOC_CREATED, { inyeccion }, 'facilitador', FACILITADOR_ID),
    )
    if (ok) onDone()
  }

  const marcador = (lista: string[], setLista: (v: string[]) => void) => (id: string, on: boolean) =>
    setLista(on ? [...lista, id] : lista.filter((x) => x !== id))

  return (
    <div style={{ marginTop: 10 }}>
      <div className="tt-grid tt-grid--2">
        <Field label="Fase">
          <select value={faseId} onChange={(e) => setFaseId(e.target.value)}>
            {config.fases.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label="Tipo">
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoInyeccion)}>
            {TIPOS_ADHOC.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Título">
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </Field>
      <Field label="Narrativa">
        <textarea value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} />
      </Field>
      <div className="tt-grid tt-grid--2">
        <Field label="Severidad diseñada">
          <select value={severidad} onChange={(e) => setSeveridad(e.target.value as Severidad)}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </Field>
        <Field label="Ventana de decisión (minutos, vacío = sin ventana)">
          <input value={ventanaMin} onChange={(e) => setVentanaMin(e.target.value)} inputMode="numeric" />
        </Field>
      </div>
      <Field label="Objetivos evaluados">
        <span className="tt-fila">
          {config.objetivos.map((o) => (
            <label key={o.id} className="tt-fila" style={{ gap: 4 }}>
              <input
                type="checkbox"
                checked={objetivos.includes(o.id)}
                onChange={(e) => marcador(objetivos, setObjetivos)(o.id, e.target.checked)}
              />
              <span className="tt-small tt-mono">{o.clave}</span>
            </label>
          ))}
        </span>
      </Field>
      <Field label="Audiencia">
        <span>
          <label className="tt-fila" style={{ marginBottom: 4 }}>
            <input type="checkbox" checked={todos} onChange={(e) => setTodos(e.target.checked)} />
            <span>Todos los roles</span>
          </label>
          {!todos && (
            <span className="tt-fila">
              {config.roles.map((r) => (
                <label key={r.id} className="tt-fila" style={{ gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={roles.includes(r.id)}
                    onChange={(e) => marcador(roles, setRoles)(r.id, e.target.checked)}
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
          {config.roles
            .filter((r) => todos || roles.includes(r.id))
            .map((r) => (
              <label key={r.id} className="tt-fila" style={{ gap: 4 }}>
                <input
                  type="checkbox"
                  checked={esperados.includes(r.id)}
                  onChange={(e) => marcador(esperados, setEsperados)(r.id, e.target.checked)}
                />
                <span className="tt-small">{r.nombre}</span>
              </label>
            ))}
        </span>
      </Field>
      {todos && (
        <label className="tt-fila" style={{ marginBottom: 10 }}>
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          <span className="tt-small">Visible en pantalla de sala</span>
        </label>
      )}
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <button className="tt-btn tt-btn--primario" onClick={guardar}>
        Insertar en el MSEL
      </button>
    </div>
  )
}
