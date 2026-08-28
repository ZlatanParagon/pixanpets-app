// P2/P3/P4 — Superficie del participante (SPEC s.19).

import { useState } from 'react'
import { navigate } from '../../App'
import { BarraFases, Field, Reloj, SeveridadChip, Vacio, Chip } from '../../components/ui'
import { elapsedMsAt, fmtHMS, fmtHora, narrativeSecAt } from '../../domain/clock'
import { EVENT_TYPES, makeEvent, uuid } from '../../domain/events'
import {
  esCapturaTardia,
  inyeccionVisibleParaRol,
  latenciaSeg,
  ventanaExpirada,
} from '../../domain/rules'
import type { Decision, Inyeccion, Severidad, TipoDecision } from '../../domain/types'
import { useStore } from '../../store'
import { getSesionParticipante } from './Checkin'

export function Play() {
  const { config, events, estado, now } = useStore()
  const sesion = getSesionParticipante()
  const [tab, setTab] = useState<'inyecciones' | 'bitacora'>('inyecciones')

  if (!sesion) {
    navigate('/checkin')
    return null
  }

  const rol = config.roles.find((r) => r.id === sesion.rol_id)!
  const elapsedMs = elapsedMsAt(events, now)
  const narrativo = narrativeSecAt(events, now)
  const fase = config.fases.find((f) => f.id === estado.fase_actual_id)

  const visibles = config.inyecciones
    .filter((i) => inyeccionVisibleParaRol(i, sesion.rol_id))
    .filter((i) => estado.inyecciones[i.id].estado === 'activa')
    .sort(
      (a, b) =>
        (estado.inyecciones[b.id].disparada_en ?? 0) - (estado.inyecciones[a.id].disparada_en ?? 0),
    )

  const misDecisiones = estado.decisiones
    .filter((d) => d.participante_id === sesion.participante_id)
    .sort((a, b) => b.registrada_en - a.registrada_en)

  return (
    <div className="tt-shell tt-shell--movil">
      <header className="tt-topbar">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>{rol.nombre}</span>
        </div>
        <span className="tt-small tt-suave">{sesion.nombre_visible}</span>
      </header>

      <div className="tt-card">
        <Reloj
          elapsedSeg={elapsedMs / 1000}
          narrativoSeg={narrativo}
          pausado={estado.estado === 'pausado'}
        />
        <hr className="tt-sep" />
        <BarraFases fases={config.fases} actualId={estado.fase_actual_id} />
        {fase && <p className="tt-small tt-suave" style={{ marginBottom: 0 }}>{fase.descripcion}</p>}
      </div>

      <div className="tt-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'inyecciones'}
          className={'tt-tab' + (tab === 'inyecciones' ? ' tt-tab--activa' : '')}
          onClick={() => setTab('inyecciones')}
        >
          Inyecciones
        </button>
        <button
          role="tab"
          aria-selected={tab === 'bitacora'}
          className={'tt-tab' + (tab === 'bitacora' ? ' tt-tab--activa' : '')}
          onClick={() => setTab('bitacora')}
        >
          Mi bitácora ({misDecisiones.length})
        </button>
      </div>

      {tab === 'inyecciones' &&
        (visibles.length === 0 ? (
          <Vacio>
            <h2>Esperando la siguiente inyección</h2>
            <p className="tt-small">El reloj sigue corriendo. Mantente atento.</p>
          </Vacio>
        ) : (
          visibles.map((iny) => (
            <InyeccionCard key={iny.id} iny={iny} sesion={sesion} elapsedMs={elapsedMs} />
          ))
        ))}

      {tab === 'bitacora' && <Bitacora decisiones={misDecisiones} />}
    </div>
  )
}

function InyeccionCard({
  iny,
  sesion,
  elapsedMs,
}: {
  iny: Inyeccion
  sesion: { participante_id: string; rol_id: string }
  elapsedMs: number
}) {
  const { config, estado, append, events, now } = useStore()
  const est = estado.inyecciones[iny.id]
  const [accion, setAccion] = useState<TipoDecision | null>(null)
  const [registrada, setRegistrada] = useState(false)

  const seEsperaDeMi = iny.respuesta_esperada_rol_ids.includes(sesion.rol_id)
  const yaRespondi = estado.decisiones.some(
    (d) => d.inyeccion_id === iny.id && d.participante_id === sesion.participante_id,
  )

  const restanteSeg =
    iny.ventana_decision_seg != null && est.disparada_elapsed_ms != null
      ? iny.ventana_decision_seg - (elapsedMs - est.disparada_elapsed_ms) / 1000
      : null
  const expirada = ventanaExpirada(iny, est, elapsedMs)

  const registrar = (payload: {
    tipo: TipoDecision
    accion_elegida: string | null
    accion_libre: string | null
    justificacion: string
    severidad_percibida: Severidad | null
  }) => {
    const t = Date.now()
    const elapsedAlRegistrar = elapsedMsAt(events, t)
    const decision: Decision = {
      id: uuid(),
      inyeccion_id: iny.id,
      participante_id: sesion.participante_id,
      rol_id: sesion.rol_id,
      registrada_en: t,
      latencia_seg: latenciaSeg(est, elapsedAlRegistrar),
      ...payload,
    }
    const ok = append(
      makeEvent(
        config.id,
        EVENT_TYPES.DECISION_CREATED,
        { decision },
        'participante',
        sesion.participante_id,
        t,
      ),
    )
    if (ok) {
      setAccion(null)
      setRegistrada(true)
    }
  }

  return (
    <div className={`tt-card tt-card--${iny.severidad_disenada}`}>
      <div className="tt-fila">
        <span className="tt-mono tt-small tt-suave">{iny.clave}</span>
        <SeveridadChip severidad={iny.severidad_disenada} />
        {iny.audiencia_rol_ids !== null && <Chip tone="activa">Dirigida a tu rol</Chip>}
      </div>
      <h2 style={{ margin: '8px 0' }}>{iny.titulo}</h2>
      <p>{iny.cuerpo}</p>

      {restanteSeg != null && !expirada && (
        <p className="tt-small tt-mono" style={{ color: 'var(--atencion)' }}>
          Ventana de decisión: {fmtHMS(restanteSeg)}
        </p>
      )}
      {expirada && (
        <p className="tt-small" style={{ color: 'var(--critico)' }}>
          La ventana de decisión expiró. Aún puedes registrar: quedará como captura tardía referida
          al disparo original.
        </p>
      )}
      {!seEsperaDeMi && (
        <p className="tt-aviso">
          Recibes esta información para tu contexto. No se espera necesariamente una respuesta de tu
          rol; puedes actuar si lo consideras necesario.
        </p>
      )}
      {(yaRespondi || registrada) && <Chip tone="ok">Registrado en tu bitácora</Chip>}

      {accion === null ? (
        <div className="tt-cta-lista">
          <button className="tt-btn tt-btn--primario tt-btn--bloque" onClick={() => setAccion('decision')}>
            Registrar mi decisión
          </button>
          <div className="tt-fila">
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('posponer')}>
              Posponer
            </button>
            <button className="tt-btn" style={{ flex: 1 }} onClick={() => setAccion('no_actuar')}>
              No actuar por ahora
            </button>
          </div>
        </div>
      ) : (
        <FormDecision
          iny={iny}
          tipo={accion}
          tardia={esCapturaTardia(iny, est, elapsedMsAt(events, now))}
          onCancel={() => setAccion(null)}
          onSubmit={registrar}
        />
      )}
    </div>
  )
}

function FormDecision({
  iny,
  tipo,
  tardia,
  onCancel,
  onSubmit,
}: {
  iny: Inyeccion
  tipo: TipoDecision
  tardia: boolean
  onCancel: () => void
  onSubmit: (p: {
    tipo: TipoDecision
    accion_elegida: string | null
    accion_libre: string | null
    justificacion: string
    severidad_percibida: Severidad | null
  }) => void
}) {
  const [elegida, setElegida] = useState('')
  const [libre, setLibre] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [severidad, setSeveridad] = useState<Severidad | ''>('')
  const [error, setError] = useState('')

  const titulo =
    tipo === 'decision' ? 'Registrar mi decisión' : tipo === 'posponer' ? 'Posponer' : 'No actuar por ahora'

  const enviar = () => {
    if (tipo === 'decision' && !elegida && !libre.trim()) {
      setError('Elige una alternativa o describe tu acción.')
      return
    }
    if (!justificacion.trim()) {
      setError('La justificación es necesaria: es parte de la evidencia.')
      return
    }
    onSubmit({
      tipo,
      accion_elegida: elegida || null,
      accion_libre: libre.trim() || null,
      justificacion: justificacion.trim(),
      severidad_percibida: severidad || null,
    })
  }

  return (
    <div style={{ marginTop: 14 }}>
      <h3>{titulo}</h3>
      {tardia && (
        <p className="tt-small" style={{ color: 'var(--atencion)' }}>
          Se registrará como captura tardía.
        </p>
      )}
      {tipo === 'decision' && iny.alternativas.length > 0 && (
        <Field label="Alternativa">
          <select value={elegida} onChange={(e) => setElegida(e.target.value)}>
            <option value="">— Acción propia (descríbela abajo) —</option>
            {iny.alternativas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
      )}
      {tipo === 'decision' && (
        <Field label="Descripción de la acción (campo libre)">
          <textarea value={libre} onChange={(e) => setLibre(e.target.value)} />
        </Field>
      )}
      <Field label="Justificación">
        <textarea
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          placeholder="Por qué tomas esta postura, con la información disponible"
        />
      </Field>
      <Field label="Severidad percibida (opcional)">
        <select value={severidad} onChange={(e) => setSeveridad(e.target.value as Severidad | '')}>
          <option value="">Sin registrar</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </Field>
      {error && <p className="tt-small" style={{ color: 'var(--critico)' }}>{error}</p>}
      <div className="tt-fila">
        <button className="tt-btn tt-btn--primario" style={{ flex: 1 }} onClick={enviar}>
          Guardar registro
        </button>
        <button className="tt-btn tt-btn--fantasma" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function Bitacora({ decisiones }: { decisiones: Decision[] }) {
  const { config } = useStore()
  if (decisiones.length === 0) {
    return (
      <Vacio>
        <h2>Tu bitácora está vacía</h2>
        <p className="tt-small">Tus decisiones y registros aparecerán aquí con su hora.</p>
      </Vacio>
    )
  }
  return (
    <>
      {decisiones.map((d) => {
        const iny = config.inyecciones.find((i) => i.id === d.inyeccion_id)
        return (
          <div key={d.id} className="tt-card">
            <div className="tt-fila">
              <span className="tt-mono tt-small tt-suave">{iny?.clave}</span>
              <span className="tt-mono tt-small tt-suave">{fmtHora(d.registrada_en)}</span>
              {d.latencia_seg != null && (
                <span className="tt-mono tt-small tt-suave">latencia {d.latencia_seg}s</span>
              )}
              <Chip tone="ok">Sincronizada</Chip>
            </div>
            <h3 style={{ margin: '6px 0' }}>
              {d.tipo === 'no_actuar'
                ? 'No actuar por ahora'
                : d.tipo === 'posponer'
                  ? 'Posponer'
                  : (d.accion_elegida ?? d.accion_libre)}
            </h3>
            {d.tipo === 'decision' && d.accion_elegida && d.accion_libre && (
              <p className="tt-small">{d.accion_libre}</p>
            )}
            <p className="tt-small tt-suave">«{d.justificacion}»</p>
          </div>
        )
      })}
    </>
  )
}
