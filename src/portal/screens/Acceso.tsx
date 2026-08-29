// Acceso del prototipo: simula al proveedor de identidad con usuarios
// sintéticos. En producción: proveedor administrado con MFA obligatorio,
// invitaciones nominativas y sin autorregistro (SPEC v0.3, 8.3 y 3.4).

import { useStore } from '../store'
import { Tarjeta } from '../components/ui'

const DESCRIPCION_ROL: Record<string, string> = {
  patrocinador: 'Patrocinador',
  responsable_operativo: 'Responsable operativo',
  consulta: 'Consulta',
  socio_responsable: 'Socio responsable (ARSEG)',
  lider_proyecto: 'Líder de proyecto (ARSEG)',
  administracion: 'Administración (ARSEG)',
}

export function Acceso() {
  const { estado, usuario, membresiasDelUsuario, entrar, elegirCuenta, salir, reiniciarDemo } = useStore()

  // Usuario autenticado con varias membresías: selección explícita de cuenta (II.3.1).
  if (usuario && membresiasDelUsuario.length > 1) {
    return (
      <div className="acceso">
        <div className="filete" aria-hidden="true" />
        <Tarjeta className="acceso-caja">
          <h1>Selecciona la cuenta activa</h1>
          <p className="texto-secundario">
            Tienes acceso a más de una organización. El dominio de correo no otorga pertenencia: cada membresía se
            valida por separado.
          </p>
          <ul className="lista-acceso">
            {membresiasDelUsuario.map((m) => {
              const c = estado.clientes.find((x) => x.id === m.cliente_id)
              return (
                <li key={m.id}>
                  <button className="boton-fila" onClick={() => elegirCuenta(m.id)}>
                    <strong>{c?.nombre_visible}</strong>
                    <span>{DESCRIPCION_ROL[m.rol]}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button className="boton-terciario" onClick={salir}>Volver</button>
        </Tarjeta>
      </div>
    )
  }

  return (
    <div className="acceso">
      <div className="filete" aria-hidden="true" />
      <Tarjeta className="acceso-caja">
        <div className="marca marca-acceso" aria-label="ARSEG Cyber, Portal de Cliente">
          <span className="marca-nombre">ARSEG</span>
          <span className="marca-sub">CYBER · Portal de Cliente</span>
        </div>
        <h1>Demostración con datos sintéticos</h1>
        <p className="texto-secundario">
          Este prototipo simula al proveedor de identidad. En producción el acceso exige invitación nominativa y MFA;
          aquí eliges un usuario sintético para recorrer el portal con sus permisos reales.
        </p>
        <ul className="lista-acceso">
          {estado.usuarios.map((u) => {
            const roles = estado.membresias
              .filter((m) => m.usuario_id === u.id && m.activa)
              .map((m) => {
                const c = estado.clientes.find((x) => x.id === m.cliente_id)
                return `${DESCRIPCION_ROL[m.rol]} · ${c?.nombre_visible}`
              })
            if (roles.length === 0) return null
            return (
              <li key={u.id}>
                <button className="boton-fila" onClick={() => entrar(u.id)}>
                  <strong>{u.nombre}</strong>
                  <span>{roles.join(' — ')}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <button className="boton-terciario" onClick={reiniciarDemo}>Restablecer datos de la demostración</button>
      </Tarjeta>
    </div>
  )
}
