// Inicio del socio responsable: seguimiento estratégico y comercial de la
// relación — estado de la cuenta, instrumentos y formalizaciones, riesgo de
// relación (compromisos vencidos de ambas partes) y actualidad de lo publicado.
// El detalle operativo vive en la vista del PM y en cada proyecto.

import { useStore } from '../store'
import { compromisoVencido } from '../domain/comandos'
import { compromisosVisibles, hitosDeProyecto, proyectosVisibles, situacionTemporal } from '../domain/consultas'
import { Estado, Tarjeta, fechaCorta } from '../components/ui'

const FASE: Record<string, string> = {
  preparacion: 'Preparación',
  ejecucion: 'Ejecución',
  operacion_recurrente: 'Operación recurrente',
  cierre: 'En cierre',
  cerrado: 'Cerrado',
}

export function InicioSocio() {
  const { estado, ctx, ahora } = useStore()
  if (!ctx) return null
  const cliente = estado.clientes.find((c) => c.id === ctx.membresia.cliente_id)!
  const proyectos = proyectosVisibles(estado, ctx, ahora)
  const compromisos = compromisosVisibles(estado, ctx, ahora)
  const vencidos = compromisos.filter((c) => compromisoVencido(c, ahora))
  const sinCorte = proyectos.filter((p) => p.fase !== 'cerrado' && situacionTemporal(p, hitosDeProyecto(estado, ctx, p.id, ahora), ahora).actualizacion === 'pendiente')
  const acuerdos = estado.acuerdos.filter((a) => a.cliente_id === cliente.id)

  return (
    <>
      <h1>Relación — vista del socio</h1>

      <Tarjeta>
        <h2>Estado de la relación</h2>
        <p className="fila-estados">
          <Estado tono={cliente.estado_cuenta === 'activa' ? 'estable' : 'neutro'}>Cuenta {cliente.estado_cuenta}</Estado>
          {vencidos.length > 0 ? (
            <Estado tono="atencion">{vencidos.length} compromiso(s) vencido(s)</Estado>
          ) : (
            <Estado tono="estable">Sin compromisos vencidos</Estado>
          )}
          {sinCorte.length > 0 && <Estado tono="atencion">{sinCorte.length} proyecto(s) sin actualización reciente</Estado>}
        </p>
        {cliente.estado_cuenta === 'incorporacion' && (
          <p>
            Esta cuenta está en incorporación: continúa el flujo en <a href="#/alta">Alta de cliente</a>.
          </p>
        )}
        <div className="tabla-envoltura">
          <table>
            <thead>
              <tr><th scope="col">Servicio</th><th scope="col">Fase</th><th scope="col">Corte</th><th scope="col">Fin vigente</th></tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td><a href={`#/proyecto/${p.id}`}>{p.clave} — {p.nombre}</a></td>
                  <td>{FASE[p.fase]}</td>
                  <td className="mono">{fechaCorta(p.fecha_corte_publicada)}</td>
                  <td className="mono">{fechaCorta(p.fin_vigente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      <Tarjeta>
        <h2>Instrumentos y formalizaciones</h2>
        <ul className="lista-compromisos">
          {acuerdos.map((a) => {
            const revisiones = estado.acuerdoRevisiones.filter((r) => r.acuerdo_id === a.id)
            const vigente = revisiones.find((r) => r.estado_editorial === 'publicada')
            const formalizada = revisiones.some((r) => estado.formalizaciones.some((f) => f.revision_instrumento_id === r.id))
            return (
              <li key={a.id}>
                <span className="mono">{a.clave}</span> · {a.tipo === 'alcance_inicial' ? 'Alcance' : a.tipo === 'confidencialidad' ? 'NDA' : a.tipo}
                {vigente && <span className="texto-secundario"> · rev. {vigente.numero_revision}</span>}{' '}
                {a.tipo === 'alcance_inicial' &&
                  (formalizada ? <Estado tono="estable">Formalizado</Estado> : <Estado tono="atencion">Sin formalización registrada</Estado>)}
              </li>
            )
          })}
          {acuerdos.length === 0 && <li className="texto-secundario">Sin acuerdos registrados.</li>}
        </ul>
        <p className="texto-secundario">Detalle y comentarios en <a href="#/acuerdos">Acuerdos</a>.</p>
      </Tarjeta>

      <Tarjeta>
        <h2>Riesgo de relación</h2>
        {vencidos.length === 0 && <p className="texto-secundario">Sin compromisos vencidos de ninguna de las partes.</p>}
        <ul className="lista-compromisos">
          {vencidos.map((c) => (
            <li key={c.id}>
              <a href={`#/proyecto/${c.proyecto_id}`}>{c.descripcion}</a>{' '}
              <Estado tono="atencion">{c.parte_responsable === 'arseg' ? 'ARSEG' : 'Cliente'} · vencido desde {fechaCorta(c.fecha_vigente)}</Estado>
            </li>
          ))}
        </ul>
        <p className="texto-secundario">
          Las mismas reglas aplican a ambas partes (RR-03): un vencido de ARSEG pesa igual que uno del cliente.
        </p>
      </Tarjeta>

      <Tarjeta>
        <h2>Acciones del socio</h2>
        <ul className="lista-compromisos">
          <li><a href="#/alta">Alta de un nuevo cliente</a> — del contrato firmado a la cuenta activa.</li>
          <li>Publicaciones comerciales y cierre de proyecto: desde la pantalla de cada proyecto.</li>
          <li>Permisos y autoridad comercial: en <a href="#/cuenta">Cuenta</a>.</li>
        </ul>
      </Tarjeta>
    </>
  )
}
