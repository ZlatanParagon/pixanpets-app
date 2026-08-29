// Inicio del líder de proyecto (PM): seguimiento operativo — hitos por vencer
// o vencidos, compromisos por validar o responder, cortes pendientes de
// publicar. Lo estratégico/comercial vive en la vista del socio.

import { useStore } from '../store'
import { compromisoVencido } from '../domain/comandos'
import { compromisosDeProyecto, hitosDeProyecto, proyectosVisibles, situacionTemporal } from '../domain/consultas'
import { Estado, Tarjeta, fechaCorta } from '../components/ui'

export function InicioLider() {
  const { estado, ctx, ahora } = useStore()
  if (!ctx) return null
  const proyectos = proyectosVisibles(estado, ctx, ahora).filter((p) => p.fase !== 'cerrado')

  return (
    <>
      <h1>Operación — vista del PM</h1>
      {proyectos.length === 0 && (
        <Tarjeta><p className="texto-secundario">No tienes proyectos activos asignados en esta cuenta.</p></Tarjeta>
      )}
      {proyectos.map((p) => {
        const hitos = hitosDeProyecto(estado, ctx, p.id, ahora)
        const st = situacionTemporal(p, hitos, ahora)
        const compromisos = compromisosDeProyecto(estado, ctx, p.id, ahora)
        const porValidar = compromisos.filter((c) => c.estado === 'respondido' && c.solicitante_membresia_id === ctx.membresia.id)
        const deArsegAbiertos = compromisos.filter((c) => c.parte_responsable === 'arseg' && (c.estado === 'abierto' || c.estado === 'requiere_aclaracion'))
        const hitosAtencion = hitos
          .filter((h) => h.estado !== 'cumplido')
          .sort((a, b) => a.fecha_vigente.localeCompare(b.fecha_vigente))
          .slice(0, 4)
        return (
          <Tarjeta key={p.id}>
            <h2><a href={`#/proyecto/${p.id}`}>{p.clave} — {p.nombre}</a></h2>
            <p className="fila-estados">
              {st.actualizacion === 'pendiente' ? (
                <Estado tono="atencion">Corte pendiente de publicar (último: {fechaCorta(p.fecha_corte_publicada)})</Estado>
              ) : (
                <Estado tono="estable">Corte al día ({fechaCorta(p.fecha_corte_publicada)})</Estado>
              )}
              {st.hitosVencidos > 0 && <Estado tono="atencion">{st.hitosVencidos} hito(s) vencido(s)</Estado>}
              {porValidar.length > 0 && <Estado tono="atencion">{porValidar.length} respuesta(s) por validar</Estado>}
              {deArsegAbiertos.length > 0 && <Estado tono="neutro">{deArsegAbiertos.length} compromiso(s) ARSEG abiertos</Estado>}
            </p>

            <h3>Hitos próximos</h3>
            <ul className="lista-compromisos">
              {hitosAtencion.map((h) => (
                <li key={h.id}>
                  <span className="mono">{h.clave}</span> {h.nombre} · {fechaCorta(h.fecha_vigente)}{' '}
                  {h.fecha_vigente < ahora ? <Estado tono="atencion">Vencido</Estado> : h.estado === 'en_curso' ? <Estado tono="neutro">En curso</Estado> : null}
                </li>
              ))}
              {hitosAtencion.length === 0 && <li className="texto-secundario">Sin hitos pendientes.</li>}
            </ul>

            {(porValidar.length > 0 || deArsegAbiertos.length > 0) && (
              <>
                <h3>Requiere tu acción</h3>
                <ul className="lista-compromisos">
                  {porValidar.map((c) => (
                    <li key={c.id}><a href={`#/proyecto/${p.id}`}>{c.descripcion}</a> — el cliente respondió; valida o pide aclaración.</li>
                  ))}
                  {deArsegAbiertos.map((c) => (
                    <li key={c.id}>
                      <a href={`#/proyecto/${p.id}`}>{c.descripcion}</a> — pendiente de ARSEG
                      {compromisoVencido(c, ahora) && <> · <Estado tono="atencion">vencido</Estado></>}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="texto-secundario">Publicar avance, gestionar hitos y compromisos: dentro del proyecto.</p>
          </Tarjeta>
        )
      })}
    </>
  )
}
