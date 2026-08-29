// Inicio — situación de la relación (SPEC v0.3, 5.1). Orden: resumen;
// compromisos que requieren respuesta del usuario; compromisos pendientes de
// ARSEG; próximos hitos; últimas publicaciones. Sin porcentajes sin regla
// documentada y sin módulos vacíos.

import { useStore } from '../store'
import { compromisoVencido } from '../domain/comandos'
import {
  avancesDeProyecto,
  compromisosVisibles,
  hitosDeProyecto,
  proyectosVisibles,
  situacionTemporal,
} from '../domain/consultas'
import { PARTE_POR_ROL } from '../domain/types'
import { Estado, Tarjeta, fechaCorta } from '../components/ui'
import { InicioSocio } from './InicioSocio'
import { InicioLider } from './InicioLider'

const FASE: Record<string, string> = {
  preparacion: 'Preparación',
  ejecucion: 'Ejecución',
  operacion_recurrente: 'Operación recurrente',
  cierre: 'En cierre',
  cerrado: 'Cerrado — consulta histórica',
}

export function Inicio() {
  const { estado, ctx, ahora } = useStore()
  if (!ctx) return null

  // Cada rol tiene un seguimiento distinto (II.3): el socio ve la relación
  // estratégica/comercial, el PM la operación, el cliente su servicio.
  if (ctx.membresia.rol === 'socio_responsable') return <InicioSocio />
  if (ctx.membresia.rol === 'lider_proyecto') return <InicioLider />

  if (ctx.membresia.rol === 'administracion') {
    return (
      <>
        <h1>Inicio</h1>
        <Tarjeta>
          <p>
            Tu rol de Administración gestiona datos de cuenta, contactos e invitaciones, sin acceso al contenido de los
            servicios (II.3.2). Consulta la sección <a href="#/cuenta">Cuenta</a>.
          </p>
        </Tarjeta>
      </>
    )
  }

  const proyectos = proyectosVisibles(estado, ctx, ahora)
  const compromisos = compromisosVisibles(estado, ctx, ahora)
  const parteUsuario = PARTE_POR_ROL[ctx.membresia.rol]
  const pendientesUsuario = compromisos.filter(
    (c) => c.parte_responsable === parteUsuario && (c.estado === 'abierto' || c.estado === 'requiere_aclaracion'),
  )
  const pendientesOtraParte = compromisos.filter(
    (c) => c.parte_responsable !== parteUsuario && (c.estado === 'abierto' || c.estado === 'requiere_aclaracion'),
  )
  const proximosHitos = proyectos
    .flatMap((p) => hitosDeProyecto(estado, ctx, p.id, ahora).map((h) => ({ p, h })))
    .filter(({ h }) => h.estado !== 'cumplido')
    .sort((a, b) => a.h.fecha_vigente.localeCompare(b.h.fecha_vigente))
    .slice(0, 4)
  const ultimasPublicaciones = proyectos
    .flatMap((p) => avancesDeProyecto(estado, ctx, p.id, ahora).map((a) => ({ p, a })))
    .sort((x, y) => y.a.publicado_en.localeCompare(x.a.publicado_en))
    .slice(0, 3)

  return (
    <>
      <h1>Situación de la relación</h1>

      <div className="rejilla-proyectos">
        {proyectos.map((p) => {
          const hitos = hitosDeProyecto(estado, ctx, p.id, ahora)
          const st = situacionTemporal(p, hitos, ahora)
          const lider = estado.contactos.find((c) => c.usuario_id === estado.membresias.find((m) => m.id === p.lider_membresia_id)?.usuario_id)
          return (
            <Tarjeta key={p.id} className="tarjeta-proyecto">
              <h2>
                <a href={`#/proyecto/${p.id}`}>{p.nombre}</a>
              </h2>
              <p className="texto-secundario">
                {p.clave} · {p.modalidad === 'puntual' ? 'Servicio puntual' : 'Servicio recurrente'}
                {lider ? ` · Responsable ARSEG: ${lider.nombre}` : ''}
              </p>
              <p className="fila-estados">
                <Estado tono={p.fase === 'cerrado' ? 'neutro' : 'estable'}>{FASE[p.fase]}</Estado>
                {p.fase !== 'cerrado' && (
                  <Estado tono={st.actualizacion === 'al_corte' ? 'estable' : 'atencion'}>
                    {st.actualizacion === 'al_corte' ? 'Información al corte' : 'Sin actualización reciente'}
                  </Estado>
                )}
                {st.hitosVencidos > 0 && <Estado tono="atencion">{st.hitosVencidos} hito(s) por revisar</Estado>}
              </p>
              <p className="texto-secundario">
                Fecha de corte de la información: <strong>{fechaCorta(p.fecha_corte_publicada)}</strong>
                {p.fase === 'cerrado' && p.consulta_historica_hasta && (
                  <> · Consulta disponible hasta {fechaCorta(p.consulta_historica_hasta)}</>
                )}
              </p>
            </Tarjeta>
          )
        })}
        {proyectos.length === 0 && (
          <Tarjeta>
            <p>No tienes proyectos asignados en esta cuenta.</p>
          </Tarjeta>
        )}
      </div>

      <section aria-labelledby="tit-pend">
        <h2 id="tit-pend">Pendiente de tu parte</h2>
        {pendientesUsuario.length === 0 && <p className="texto-secundario">Nada requiere tu respuesta por ahora.</p>}
        <ul className="lista-compromisos">
          {pendientesUsuario.map((c) => (
            <li key={c.id}>
              <a href={`#/proyecto/${c.proyecto_id}`}>{c.descripcion}</a>{' '}
              {compromisoVencido(c, ahora) ? (
                <Estado tono="atencion">Vencido — fecha comprometida {fechaCorta(c.fecha_vigente)}</Estado>
              ) : (
                <Estado tono="neutro">Responder antes del {fechaCorta(c.fecha_vigente)}</Estado>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tit-otra">
        <h2 id="tit-otra">Pendiente de {parteUsuario === 'cliente' ? 'ARSEG' : 'tu cliente'}</h2>
        {pendientesOtraParte.length === 0 && <p className="texto-secundario">Sin pendientes de la otra parte.</p>}
        <ul className="lista-compromisos">
          {pendientesOtraParte.map((c) => (
            <li key={c.id}>
              <a href={`#/proyecto/${c.proyecto_id}`}>{c.descripcion}</a>{' '}
              {compromisoVencido(c, ahora) ? (
                <Estado tono="atencion">Vencido — fecha comprometida {fechaCorta(c.fecha_vigente)}</Estado>
              ) : (
                <Estado tono="neutro">Comprometido para el {fechaCorta(c.fecha_vigente)}</Estado>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tit-hitos">
        <h2 id="tit-hitos">Próximos hitos</h2>
        <ul className="lista-compromisos">
          {proximosHitos.map(({ p, h }) => (
            <li key={h.id}>
              <a href={`#/proyecto/${p.id}`}>{h.clave} — {h.nombre}</a>{' '}
              <span className="texto-secundario">
                {fechaCorta(h.fecha_vigente)}
                {h.fecha_vigente !== h.fecha_original && ` (fecha original: ${fechaCorta(h.fecha_original)})`}
              </span>
            </li>
          ))}
          {proximosHitos.length === 0 && <li className="texto-secundario">Sin hitos próximos.</li>}
        </ul>
      </section>

      <section aria-labelledby="tit-pub">
        <h2 id="tit-pub">Últimas publicaciones</h2>
        <ul className="lista-compromisos">
          {ultimasPublicaciones.map(({ p, a }) => (
            <li key={a.id}>
              <span className="texto-secundario">{fechaCorta(a.fecha_corte)} · {p.clave}</span> {a.texto_publicado}
            </li>
          ))}
          {ultimasPublicaciones.length === 0 && <li className="texto-secundario">Sin publicaciones recientes.</li>}
        </ul>
      </section>
    </>
  )
}
