// F4 — Observaciones ARSEG (SPEC s.20, s.7.2, s.11).
// Acción primaria de un toque: tipo → (rol) → descripción → guardar.
// El sistema autocompleta ejercicio, inyección activa, fase, hora y usuario.

import { useState } from 'react'
import { Chip, Field, Vacio } from '../../components/ui'
import { fmtHora } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, uuid } from '../../domain/events'
import { TIPO_OBSERVACION_LABEL } from '../../domain/export'
import type {
  Observacion,
  Severidad,
  TipoObservacion,
  TipoReferenciaEvidencia,
} from '../../domain/types'
import { useStore } from '../../store'
import { FACILITADOR_ID } from './Console'

const TIPOS: TipoObservacion[] = [
  'practica_efectiva',
  'brecha',
  'oportunidad_mejora',
  'decision_pendiente',
  'accion_prioritaria',
]

const TIPO_TONE: Record<TipoObservacion, 'ok' | 'err' | 'warn' | 'activa' | undefined> = {
  practica_efectiva: 'ok',
  brecha: 'err',
  oportunidad_mejora: 'warn',
  decision_pendiente: 'activa',
  accion_prioritaria: 'err',
}

export function Observaciones() {
  const { config, estado, append } = useStore()
  const [tipo, setTipo] = useState<TipoObservacion | null>(null)
  const [rolId, setRolId] = useState('')
  const [objetivoId, setObjetivoId] = useState('')
  const [severidad, setSeveridad] = useState<Severidad | ''>('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  // Autocompletado: la inyección activa más reciente (s.20 F4).
  const inyActiva = config.inyecciones
    .filter((i) => estado.inyecciones[i.id].estado === 'activa')
    .sort(
      (a, b) =>
        (estado.inyecciones[b.id].disparada_en ?? 0) - (estado.inyecciones[a.id].disparada_en ?? 0),
    )[0]

  const guardar = () => {
    if (!tipo) return setError('Selecciona el tipo de observación.')
    if (!descripcion.trim()) return setError('Escribe la descripción breve.')
    const t = Date.now()
    const observacion: Observacion = {
      id: uuid(),
      inyeccion_id: inyActiva?.id ?? null,
      objetivo_id: objetivoId || null,
      rol_id: rolId || null,
      fase_id: estado.fase_actual_id,
      tipo,
      descripcion: descripcion.trim(),
      severidad: severidad || null,
      marcada_en: t,
      creada_por_usuario_id: FACILITADOR_ID,
    }
    const ok = append(
      makeEvent(config.id, EVENT_TYPES.OBSERVATION_CREATED, { observacion }, 'facilitador', FACILITADOR_ID, t),
    )
    if (ok) {
      setTipo(null)
      setRolId('')
      setObjetivoId('')
      setSeveridad('')
      setDescripcion('')
      setError('')
    }
  }

  const observaciones = [...estado.observaciones].sort((a, b) => b.marcada_en - a.marcada_en)

  return (
    <div className="tt-grid tt-grid--2">
      <div className="tt-card">
        <h2>Nueva observación</h2>
        <p className="tt-small tt-suave">
          Hereda automáticamente: {inyActiva ? `inyección ${inyActiva.clave}` : 'sin inyección activa'} ·
          fase {config.fases.find((f) => f.id === estado.fase_actual_id)?.nombre} · hora y usuario ARSEG.
        </p>
        <div className="tt-fila" style={{ margin: '10px 0' }}>
          {TIPOS.map((tp) => (
            <button
              key={tp}
              className={'tt-btn' + (tipo === tp ? ' tt-btn--primario' : '')}
              onClick={() => setTipo(tp)}
            >
              {TIPO_OBSERVACION_LABEL[tp]}
            </button>
          ))}
        </div>
        <Field label="Rol (opcional)">
          <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
            <option value="">Sin rol específico</option>
            {config.roles.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label="Objetivo (opcional)">
          <select value={objetivoId} onChange={(e) => setObjetivoId(e.target.value)}>
            <option value="">Sin objetivo específico</option>
            {config.objetivos.map((o) => (
              <option key={o.id} value={o.id}>{o.clave} — {o.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label="Severidad (opcional)">
          <select value={severidad} onChange={(e) => setSeveridad(e.target.value as Severidad | '')}>
            <option value="">Sin registrar</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </Field>
        <Field label="Descripción breve">
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </Field>
        {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
        <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={guardar}>
          Guardar observación
        </button>
      </div>

      <div>
        {observaciones.length === 0 ? (
          <Vacio>
            <h2>Sin observaciones aún</h2>
            <p className="tt-small">Lo que registres aparecerá aquí para enriquecerse con evidencia.</p>
          </Vacio>
        ) : (
          observaciones.map((o) => <ObservacionCard key={o.id} o={o} />)
        )}
      </div>
    </div>
  )
}

function ObservacionCard({ o }: { o: Observacion }) {
  const { config, estado, append } = useStore()
  const [seleccion, setSeleccion] = useState('')

  const clave = (id: string | null) =>
    id ? (config.inyecciones.find((i) => i.id === id)?.clave ?? id) : null
  const rol = (id: string | null) =>
    id ? (config.roles.find((r) => r.id === id)?.nombre ?? id) : null
  const objetivo = (id: string | null) =>
    id ? (config.objetivos.find((x) => x.id === id)?.clave ?? id) : null

  const vinculos = estado.vinculos.filter((v) => v.observacion_id === o.id)

  // Evidencia disponible para vincular (s.10.12): decisiones, escalamientos,
  // solicitudes, compromisos e inyecciones disparadas.
  const opciones: { valor: string; etiqueta: string }[] = [
    ...estado.decisiones.map((d) => ({
      valor: `decision:${d.id}`,
      etiqueta: `Decisión · ${clave(d.inyeccion_id)} · ${rol(d.rol_id)} · ${fmtHora(d.registrada_en)}`,
    })),
    ...estado.escalamientos.map((x) => ({
      valor: `escalamiento:${x.id}`,
      etiqueta: `Escalamiento · ${clave(x.inyeccion_id)} · ${rol(x.rol_origen_id)} → ${rol(x.rol_destino_id)}`,
    })),
    ...estado.solicitudes.map((s) => ({
      valor: `solicitud_informacion:${s.id}`,
      etiqueta: `Solicitud · ${clave(s.inyeccion_id)} · ${rol(s.solicitada_por_rol_id)} · ${fmtHora(s.solicitada_en)}`,
    })),
    ...estado.compromisos.map((c) => ({
      valor: `compromiso:${c.id}`,
      etiqueta: `Compromiso · ${clave(c.inyeccion_id)} · ${rol(c.rol_responsable_id)}`,
    })),
    ...config.inyecciones
      .filter((i) => ['activa', 'cerrada'].includes(estado.inyecciones[i.id].estado))
      .map((i) => ({ valor: `inyeccion:${i.id}`, etiqueta: `Inyección · ${i.clave} — ${i.titulo}` })),
  ].filter((op) => !vinculos.some((v) => `${v.tipo_referencia}:${v.referencia_id}` === op.valor))

  const vincular = () => {
    if (!seleccion) return
    const [tipo_referencia, referencia_id] = seleccion.split(':') as [TipoReferenciaEvidencia, string]
    append(
      makeEvent(
        config.id,
        EVENT_TYPES.OBSERVATION_LINKED,
        { vinculo: { id: uuid(), observacion_id: o.id, tipo_referencia, referencia_id } },
        'facilitador',
        FACILITADOR_ID,
      ),
    )
    setSeleccion('')
  }

  const etiquetaVinculo = (tipo: TipoReferenciaEvidencia, refId: string) => {
    switch (tipo) {
      case 'decision': {
        const d = estado.decisiones.find((x) => x.id === refId)
        return d ? `Decisión · ${clave(d.inyeccion_id)} · ${rol(d.rol_id)}` : `Decisión ${refId}`
      }
      case 'escalamiento': {
        const x = estado.escalamientos.find((y) => y.id === refId)
        return x ? `Escalamiento · ${rol(x.rol_origen_id)} → ${rol(x.rol_destino_id)}` : `Escalamiento ${refId}`
      }
      case 'solicitud_informacion': {
        const s = estado.solicitudes.find((y) => y.id === refId)
        return s ? `Solicitud · «${s.pregunta.slice(0, 40)}…»` : `Solicitud ${refId}`
      }
      case 'compromiso': {
        const c = estado.compromisos.find((y) => y.id === refId)
        return c ? `Compromiso · «${c.descripcion.slice(0, 40)}…»` : `Compromiso ${refId}`
      }
      case 'inyeccion':
        return `Inyección · ${clave(refId)}`
      default:
        return `${tipo} ${refId}`
    }
  }

  return (
    <div className="tt-card">
      <div className="tt-fila">
        <Chip tone={TIPO_TONE[o.tipo]}>{TIPO_OBSERVACION_LABEL[o.tipo]}</Chip>
        {clave(o.inyeccion_id) && <span className="tt-mono tt-small tt-suave">{clave(o.inyeccion_id)}</span>}
        {objetivo(o.objetivo_id) && <span className="tt-mono tt-small tt-suave">{objetivo(o.objetivo_id)}</span>}
        {rol(o.rol_id) && <span className="tt-small tt-suave">{rol(o.rol_id)}</span>}
        <span className="tt-mono tt-small tt-suave">{fmtHora(o.marcada_en)}</span>
      </div>
      <p style={{ margin: '8px 0' }}>{o.descripcion}</p>
      {vinculos.length > 0 && (
        <div className="tt-fila" style={{ marginBottom: 8 }}>
          {vinculos.map((v) => (
            <Chip key={v.id}>{etiquetaVinculo(v.tipo_referencia, v.referencia_id)}</Chip>
          ))}
        </div>
      )}
      <div className="tt-fila">
        <select
          value={seleccion}
          onChange={(e) => setSeleccion(e.target.value)}
          style={{ flex: 1, minHeight: 44, borderRadius: 8, border: '1px solid var(--borde)', padding: '0 8px' }}
        >
          <option value="">Vincular evidencia…</option>
          {opciones.map((op) => (
            <option key={op.valor} value={op.valor}>{op.etiqueta}</option>
          ))}
        </select>
        <button className="tt-btn" disabled={!seleccion} onClick={vincular}>
          Vincular
        </button>
      </div>
    </div>
  )
}
