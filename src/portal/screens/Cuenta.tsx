// Cuenta: datos de la organización, usuarios, permisos y autoridad
// (SPEC v0.3, II.3). Administración gestiona la cuenta sin acceso al
// contenido de los servicios (PA-06).

import { useStore } from '../store'
import { autoridadComercialVigente } from '../domain/authz'
import type { ContextoAcceso } from '../domain/authz'
import { Estado, Tarjeta, fechaCorta } from '../components/ui'

const ROL: Record<string, string> = {
  patrocinador: 'Patrocinador',
  responsable_operativo: 'Responsable operativo',
  consulta: 'Consulta',
  socio_responsable: 'Socio responsable (ARSEG)',
  lider_proyecto: 'Líder de proyecto (ARSEG)',
  administracion: 'Administración (ARSEG)',
}

const PERMISO: Record<string, string> = {
  'comercial:ver': 'Ver información comercial',
  'tecnico_restringido:ver': 'Ver detalle técnico restringido',
  'entregable:dar_conformidad': 'Dar conformidad de entregables',
  'riesgo:aceptar': 'Aceptar riesgo (V1)',
  'comercial:formalizar': 'Formalizar (no habilitado en MVP)',
}

export function Cuenta() {
  const { estado, ctx, ahora } = useStore()
  if (!ctx) return null
  const cliente = estado.clientes.find((c) => c.id === ctx.membresia.cliente_id)
  if (!cliente) return null

  const membresias = estado.membresias.filter((m) => m.cliente_id === cliente.id && m.activa)

  return (
    <>
      <h1>Cuenta</h1>
      <Tarjeta>
        <h2>{cliente.razon_social}</h2>
        <dl className="dl">
          <div className="definicion"><dt>Sector</dt><dd>{cliente.sector}</dd></div>
          <div className="definicion"><dt>Estado de cuenta</dt><dd><Estado tono={cliente.estado_cuenta === 'activa' ? 'estable' : 'neutro'}>{cliente.estado_cuenta}</Estado></dd></div>
          <div className="definicion"><dt>Zona horaria</dt><dd className="mono">{cliente.zona_horaria}</dd></div>
          <div className="definicion"><dt>Cliente desde</dt><dd>{fechaCorta(cliente.creado_en)}</dd></div>
        </dl>
        <p className="texto-secundario">
          El estado de la cuenta no resume la fase de sus servicios: cada proyecto conserva la suya (II.2.1).
        </p>
      </Tarjeta>

      <Tarjeta>
        <h2>Usuarios y permisos</h2>
        <div className="tabla-envoltura">
          <table>
            <thead>
              <tr>
                <th scope="col">Persona</th>
                <th scope="col">Rol</th>
                <th scope="col">Alcance</th>
                <th scope="col">Permisos adicionales</th>
                <th scope="col">Autoridad comercial</th>
              </tr>
            </thead>
            <tbody>
              {membresias.map((m) => {
                const u = estado.usuarios.find((x) => x.id === m.usuario_id)
                const permisos = estado.permisos.filter((p) => p.membresia_id === m.id && !p.revocado_en)
                const ctxM: ContextoAcceso = { usuario_id: m.usuario_id, membresia: m, ahora }
                const autoridad = autoridadComercialVigente(estado, ctxM)
                const proyectosAsignados = estado.asignaciones.filter((a) => a.membresia_id === m.id)
                return (
                  <tr key={m.id}>
                    <td>{u?.nombre}</td>
                    <td>{ROL[m.rol]}</td>
                    <td>
                      {m.alcance === 'cuenta'
                        ? 'Toda la cuenta'
                        : proyectosAsignados
                            .map((a) => estado.proyectos.find((p) => p.id === a.proyecto_id)?.clave ?? a.proyecto_id)
                            .join(', ') || 'Sin proyectos'}
                    </td>
                    <td>{permisos.length === 0 ? '—' : permisos.map((p) => PERMISO[p.codigo_permiso]).join('; ')}</td>
                    <td>
                      {autoridad ? (
                        <>
                          Vigente hasta {autoridad.vigente_hasta ? fechaCorta(autoridad.vigente_hasta) : 'indefinido'}
                          {autoridad.limite_monto != null && (
                            <span className="texto-secundario">
                              {' '}· límite <span className="mono">{autoridad.limite_monto.toLocaleString('es-MX')} {autoridad.moneda}</span>
                            </span>
                          )}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="texto-secundario">
          El rol no prueba facultades legales: la autoridad comercial se documenta y valida por separado, con vigencia
          (II.3.1). En MVP la formalización ocurre fuera del portal y aquí se registra su evidencia.
        </p>
        {ctx.membresia.rol === 'administracion' && (
          <p className="texto-secundario">
            Tu rol ejecuta altas, bajas e invitaciones aprobadas; no aprueba cambios de autoridad por sí solo ni accede
            al contenido de los servicios (II.3.2, II.3.4).
          </p>
        )}
      </Tarjeta>

      <Tarjeta>
        <h2>Condiciones del servicio del portal</h2>
        <ul className="lista-compromisos">
          <li>Las invitaciones son nominativas, de un solo uso y con caducidad; no hay autorregistro (3.4).</li>
          <li>Revocar una membresía bloquea de inmediato consultas, operaciones y descargas nuevas (3.4).</li>
          <li>El portal no es un canal de respuesta urgente a incidentes; usa el canal acordado en tu servicio (1.3).</li>
          <li>La información se publica de forma deliberada, con clasificación y audiencia; nada se refleja de carpetas internas (RR-02).</li>
        </ul>
      </Tarjeta>
    </>
  )
}
