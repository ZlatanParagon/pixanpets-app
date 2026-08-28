'use client'
// Paquete de evidencia del ejercicio en formato imprimible (s.36).
// NO es un informe final: es el insumo D5; ARSEG redacta el dictamen (D6).

import { use, useEffect, useState } from 'react'
import { StoreProvider, useStore } from '@/store'
import { COBERTURA_LABEL, coberturaObjetivos } from '@/domain/coverage'
import { elapsedMsAt, fmtHMS, fmtHora } from '@/domain/clock'
import { describeEvento, tipoLabel, TIPO_OBSERVACION_LABEL } from '@/domain/export'
import { sortEvents } from '@/domain/events'

export default function InformePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [listo, setListo] = useState(false)
  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      const data = (await res.json()) as { tipo: string }
      if (data.tipo !== 'arseg') window.location.href = '/login'
      else setListo(true)
    })
  }, [])
  if (!listo) return <div className="tt-vacio"><h2>Cargando…</h2></div>
  return (
    <StoreProvider ejercicioId={id}>
      <Informe />
    </StoreProvider>
  )
}

function Informe() {
  const { config, events, estado } = useStore()
  const rol = (id: string | null) => (id ? (config.roles.find((r) => r.id === id)?.nombre ?? id) : '—')
  const participante = (id: string | null) =>
    estado.participantes.find((p) => p.id === id)?.nombre_visible ?? '—'
  const clave = (id: string | null) => (id ? (estado.msel.find((i) => i.id === id)?.clave ?? id) : '—')
  const cobertura = coberturaObjetivos(config, estado)
  const cronologia = sortEvents(events)

  return (
    <div className="tt-shell tt-informe">
      <header className="tt-topbar tt-no-imprimir">
        <div className="tt-brand">
          <strong>ARSEG Tabletop</strong>
          <span>Paquete de evidencia</span>
        </div>
        <div className="tt-fila">
          <a className="tt-btn tt-btn--fantasma" href={`/consola/${config.id}`}>Volver a la consola</a>
          <button className="tt-btn tt-btn--primario" onClick={() => window.print()}>
            Imprimir / guardar PDF
          </button>
        </div>
      </header>

      <div className="tt-card">
        <h1>Paquete de evidencia del ejercicio</h1>
        <p className="tt-small tt-suave">
          Este documento reúne la evidencia registrada durante la sesión (insumo D5). No constituye
          informe final ni dictamen: ARSEG interpreta la evidencia (D6).
        </p>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <tbody>
              <tr><td>Ejercicio</td><td><strong>{config.nombre}</strong></td></tr>
              <tr><td>Cliente</td><td>{config.cliente}</td></tr>
              <tr><td>Fecha</td><td className="tt-mono">{config.fecha}</td></tr>
              <tr><td>Escenario</td><td>{config.escenario}</td></tr>
              <tr><td>Estado</td><td>{estado.estado}</td></tr>
              <tr>
                <td>Inicio / cierre</td>
                <td className="tt-mono">
                  {estado.iniciado_en ? fmtHora(estado.iniciado_en) : '—'} · {estado.cerrado_en ? fmtHora(estado.cerrado_en) : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Participantes ({estado.participantes.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Nombre</th><th>Rol</th><th>Check-in</th></tr></thead>
            <tbody>
              {estado.participantes.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre_visible}</td>
                  <td>{rol(p.rol_id)}</td>
                  <td className="tt-mono">{fmtHora(p.conectado_en)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Cobertura de objetivos</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Objetivo</th><th>Nombre</th><th>Evidencias</th><th>Estado</th></tr></thead>
            <tbody>
              {cobertura.map((c) => {
                const o = config.objetivos.find((x) => x.id === c.objetivo_id)!
                return (
                  <tr key={c.objetivo_id}>
                    <td className="tt-mono">{o.clave}</td>
                    <td>{o.nombre}</td>
                    <td className="tt-mono">{c.evidencias}</td>
                    <td>{COBERTURA_LABEL[c.estado]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Decisiones ({estado.decisiones.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead>
              <tr><th>Hora</th><th>Latencia</th><th>Inyección</th><th>Rol</th><th>Participante</th><th>Registro</th><th>Justificación</th></tr>
            </thead>
            <tbody>
              {estado.decisiones.map((d) => (
                <tr key={d.id}>
                  <td className="tt-mono">{fmtHora(d.registrada_en)}</td>
                  <td className="tt-mono">{d.latencia_seg != null ? `${d.latencia_seg}s` : '—'}</td>
                  <td className="tt-mono">{clave(d.inyeccion_id)}</td>
                  <td>{rol(d.rol_id)}</td>
                  <td>{participante(d.participante_id)}</td>
                  <td>{d.tipo === 'no_actuar' ? 'No actuar' : d.tipo === 'posponer' ? 'Posponer' : (d.accion_elegida ?? d.accion_libre)}</td>
                  <td>«{d.justificacion}»</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Escalamientos ({estado.escalamientos.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Hora</th><th>Inyección</th><th>Origen → Destino</th><th>Motivo</th><th>Reconocido</th><th>Acción del destino</th></tr></thead>
            <tbody>
              {estado.escalamientos.map((x) => (
                <tr key={x.id}>
                  <td className="tt-mono">{fmtHora(x.escalado_en)}</td>
                  <td className="tt-mono">{clave(x.inyeccion_id)}</td>
                  <td>{rol(x.rol_origen_id)} → {rol(x.rol_destino_id)}</td>
                  <td>«{x.motivo}»</td>
                  <td className="tt-mono">{x.reconocido_en ? fmtHora(x.reconocido_en) : '—'}</td>
                  <td className="tt-mono">{x.accion_destino_en ? fmtHora(x.accion_destino_en) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Solicitudes de información ({estado.solicitudes.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Hora</th><th>Inyección</th><th>Solicita</th><th>Pregunta</th><th>Respuesta</th></tr></thead>
            <tbody>
              {estado.solicitudes.map((s) => (
                <tr key={s.id}>
                  <td className="tt-mono">{fmtHora(s.solicitada_en)}</td>
                  <td className="tt-mono">{clave(s.inyeccion_id)}</td>
                  <td>{rol(s.solicitada_por_rol_id)} → {s.dirigida_a_rol_id ? rol(s.dirigida_a_rol_id) : 'facilitador'}</td>
                  <td>«{s.pregunta}»</td>
                  <td>{s.respondida_en ? `«${s.respuesta}» (${fmtHora(s.respondida_en)})` : 'Sin respuesta'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Compromisos ({estado.compromisos.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Hora</th><th>Inyección</th><th>Responsable</th><th>Compromiso</th><th>Plazo</th><th>Criterio</th></tr></thead>
            <tbody>
              {estado.compromisos.map((c) => (
                <tr key={c.id}>
                  <td className="tt-mono">{fmtHora(c.declarado_en)}</td>
                  <td className="tt-mono">{clave(c.inyeccion_id)}</td>
                  <td>{rol(c.rol_responsable_id)}</td>
                  <td>«{c.descripcion}»</td>
                  <td>{c.plazo_simulado ?? '—'}</td>
                  <td>{c.criterio_cumplimiento ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Observaciones ARSEG ({estado.observaciones.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Hora</th><th>Tipo</th><th>Inyección</th><th>Rol</th><th>Descripción</th><th>Evidencia vinculada</th><th>Autor</th></tr></thead>
            <tbody>
              {estado.observaciones.map((o) => (
                <tr key={o.id}>
                  <td className="tt-mono">{fmtHora(o.marcada_en)}</td>
                  <td>{TIPO_OBSERVACION_LABEL[o.tipo]}</td>
                  <td className="tt-mono">{clave(o.inyeccion_id)}</td>
                  <td>{rol(o.rol_id)}</td>
                  <td>«{o.descripcion}»</td>
                  <td className="tt-small">
                    {estado.vinculos
                      .filter((v) => v.observacion_id === o.id)
                      .map((v) => `${v.tipo_referencia}:${v.referencia_id.slice(0, 8)}`)
                      .join(', ') || '—'}
                  </td>
                  <td>{o.creada_por_usuario_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Debriefing y acciones a 30 días ({estado.debriefings.length})</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>Rol</th><th>Participante</th><th>Información faltante</th><th>Rol faltante</th><th>Decisión más difícil</th><th>Acción a 30 días</th></tr></thead>
            <tbody>
              {estado.debriefings.map((d) => (
                <tr key={d.id}>
                  <td>{rol(d.rol_id)}</td>
                  <td>{participante(d.participante_id)}</td>
                  <td>{d.informacion_faltante}</td>
                  <td>{d.rol_faltante}</td>
                  <td>{d.decision_mas_dificil}</td>
                  <td><strong>{d.accion_30_dias}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tt-card">
        <h2>Cronología completa ({cronologia.length} eventos)</h2>
        <div className="tt-tabla-wrap">
          <table className="tt-tabla">
            <thead><tr><th>#</th><th>Hora</th><th>T ejercicio</th><th>Evento</th><th>Detalle</th></tr></thead>
            <tbody>
              {cronologia.map((e) => (
                <tr key={e.id}>
                  <td className="tt-mono">{e.sequence}</td>
                  <td className="tt-mono">{fmtHora(e.client_timestamp)}</td>
                  <td className="tt-mono">{fmtHMS(elapsedMsAt(cronologia, e.client_timestamp) / 1000)}</td>
                  <td>{tipoLabel(e.type)}</td>
                  <td>{describeEvento(config, e, estado.msel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="tt-small tt-suave">
        Generado por ARSEG Tabletop. La madurez no se declara: se demuestra con evidencia.
      </p>
    </div>
  )
}
