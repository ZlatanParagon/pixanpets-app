// Pruebas del flujo de origen de la relación (SPEC v0.3, 2.4 + 5.2) y de la
// gestión del líder de proyecto: firmar fuera → alta con evidencia → equipo →
// acuerdo → formalización (crea proyecto) → hitos/compromisos → cuenta activa.

import { describe, expect, it } from 'vitest'
import { estadoInicial, AHORA_DEMO } from '../data/sinteticos'
import type { EstadoPortal } from './types'
import type { ContextoAcceso } from './authz'
import { registrarFormalizacionInicial } from './comandos'
import { actualizarHito, activarCuenta, altaCliente, asignarMembresia, crearCompromiso, crearHito, registrarAcuerdoInicial } from './gestion'
import { proyectosVisibles } from './consultas'

const AHORA = AHORA_DEMO
let seq = 100
const genId = () => `g_${++seq}`

function ctxDe(estado: EstadoPortal, membresiaId: string): ContextoAcceso {
  const membresia = estado.membresias.find((m) => m.id === membresiaId)!
  return { usuario_id: membresia.usuario_id, membresia, ahora: AHORA }
}

function aplicar(_estado: EstadoPortal, tx: { ok: true; valor: { estado: EstadoPortal; eventos: unknown[] } } | { ok: false; error: string }): EstadoPortal {
  if (!tx.ok) throw new Error(tx.error)
  return { ...tx.valor.estado, bitacora: [...tx.valor.estado.bitacora, ...(tx.valor.eventos as never[])] }
}

describe('Flujo de origen: del contrato firmado a la cuenta activa', () => {
  it('recorre alta → equipo → acuerdo → formalización → hitos → activación', () => {
    let estado = estadoInicial()
    const socia = ctxDe(estado, 'mem_socia_alt')

    // 1. Alta de la cuenta con evidencia de relación formalizada.
    estado = aplicar(estado, altaCliente(estado, socia, genId, AHORA, {
      razon_social: 'Norte Textil, S.A. de C.V. (sintético)',
      nombre_visible: 'Norte Textil',
      sector: 'Manufactura',
      evidencia_relacion_ref: 'evd/contrato-nor-001.pdf',
    }))
    const cliente = estado.clientes.find((c) => c.nombre_visible === 'Norte Textil')!
    expect(cliente.estado_cuenta).toBe('incorporacion')
    const memSocia = estado.membresias.find((m) => m.cliente_id === cliente.id && m.rol === 'socio_responsable')!
    const sociaNueva = ctxDe(estado, memSocia.id)

    // 2. Sin servicio formalizado, la cuenta no se activa (2.4).
    expect(activarCuenta(estado, sociaNueva, genId, AHORA).ok).toBe(false)

    // 3. Se asigna al PM (usuario ARSEG existente, reutilizado por correo) y queda como contacto.
    estado = aplicar(estado, asignarMembresia(estado, sociaNueva, genId, AHORA, {
      nombre: 'Iván Salas', correo: 'isalas@arseg.example', rol: 'lider_proyecto', alcance: 'cuenta',
    }))
    const memPm = estado.membresias.find((m) => m.cliente_id === cliente.id && m.rol === 'lider_proyecto')!
    expect(memPm.usuario_id).toBe('usr_ivan') // reutilizado, no duplicado
    const contactoPm = estado.contactos.find((c) => c.cliente_id === cliente.id && c.usuario_id === 'usr_ivan')!
    expect(contactoPm).toBeDefined()

    // 4. Acuerdo de alcance con revisión publicada.
    estado = aplicar(estado, registrarAcuerdoInicial(estado, sociaNueva, genId, AHORA, {
      clave: 'SOW-NOR-001', titulo: 'SOW Evaluación de red industrial', tipo: 'alcance_inicial', resumen: 'Versión formalizada.',
    }))
    const revision = estado.acuerdoRevisiones.find((r) => r.cliente_id === cliente.id)!

    // 5. La formalización externa crea el proyecto (INV-03).
    estado = aplicar(estado, registrarFormalizacionInicial(estado, sociaNueva, genId, AHORA, {
      revision_instrumento_id: revision.id,
      firmante_segun_instrumento: 'Apoderado legal (sintético)',
      fecha_acto: '2026-08-27',
      evidencia_ref: 'evd/sow-nor-001-firmado.pdf',
      validado_por: memSocia.id,
      proyecto: { clave: 'NOR-2026-01', nombre: 'Evaluación de red industrial', modalidad: 'puntual', lider_membresia_id: memPm.id, inicio_comprometido: '2026-09-15', fin_original: '2026-12-15' },
    }))
    const proyecto = estado.proyectos.find((p) => p.cliente_id === cliente.id)!
    expect(proyecto.fase).toBe('preparacion')

    // 6. El PM mapea los hitos publicables; cumplir exige evidencia (RR-04).
    const pm = ctxDe(estado, memPm.id)
    estado = aplicar(estado, crearHito(estado, pm, genId, AHORA, {
      proyecto_id: proyecto.id, clave: 'H-01', nombre: 'Levantamiento de planta', fecha: '2026-10-02', criterio_terminacion: 'Inventario OT validado por el cliente.',
    }))
    const hito = estado.hitos.find((h) => h.proyecto_id === proyecto.id)!
    expect(actualizarHito(estado, pm, genId, AHORA, { hito_id: hito.id, estado: 'cumplido' }).ok).toBe(false)
    estado = aplicar(estado, actualizarHito(estado, pm, genId, AHORA, { hito_id: hito.id, estado: 'cumplido', evidencia_ref: 'evd/minuta-nor-h01.pdf' }))
    expect(estado.hitos.find((h) => h.id === hito.id)!.estado).toBe('cumplido')

    // 7. Cuenta activa con el servicio formalizado.
    estado = aplicar(estado, activarCuenta(estado, ctxDe(estado, memSocia.id), genId, AHORA))
    expect(estado.clientes.find((c) => c.id === cliente.id)!.estado_cuenta).toBe('activa')

    // 8. Se invita a la patrocinadora del cliente; ve su proyecto y nada de otros clientes.
    estado = aplicar(estado, asignarMembresia(estado, ctxDe(estado, memSocia.id), genId, AHORA, {
      nombre: 'Ana Reyes', correo: 'areyes@nortetextil.example', rol: 'patrocinador', alcance: 'cuenta', cargo: 'Directora de Operaciones',
    }))
    const memPat = estado.membresias.find((m) => m.cliente_id === cliente.id && m.rol === 'patrocinador')!
    const ids = proyectosVisibles(estado, ctxDe(estado, memPat.id), AHORA).map((p) => p.id)
    expect(ids).toEqual([proyecto.id])

    // 9. El PM registra un compromiso del cliente vinculado a la relación.
    const contactoAna = estado.contactos.find((c) => c.cliente_id === cliente.id && c.correo === 'areyes@nortetextil.example')!
    estado = aplicar(estado, crearCompromiso(estado, ctxDe(estado, memPm.id), genId, AHORA, {
      proyecto_id: proyecto.id, tipo: 'solicitud_insumo', descripcion: 'Entregar diagrama de red de la planta.',
      parte_responsable: 'cliente', contacto_responsable_id: contactoAna.id, fecha: '2026-09-22',
      criterio_resolucion: 'Diagrama recibido y validado por ARSEG.', impacto_previsto: 'Sin el diagrama no inicia el levantamiento.',
    }))
    expect(estado.compromisos.filter((c) => c.cliente_id === cliente.id)).toHaveLength(1)
  })

  it('el alta exige rol de socio y evidencia; la razón social no se duplica', () => {
    const estado = estadoInicial()
    const patrocinadora = ctxDe(estado, 'mem_mariana')
    expect(altaCliente(estado, patrocinadora, genId, AHORA, { razon_social: 'X', nombre_visible: 'X', sector: 'Y', evidencia_relacion_ref: 'e' }).ok).toBe(false)
    const socia = ctxDe(estado, 'mem_socia_alt')
    expect(altaCliente(estado, socia, genId, AHORA, { razon_social: 'Z', nombre_visible: 'Z', sector: 'Y', evidencia_relacion_ref: '  ' }).ok).toBe(false)
    expect(altaCliente(estado, socia, genId, AHORA, { razon_social: 'Altiplano Retail, S.A. de C.V. (sintético)', nombre_visible: 'Alt', sector: 'Y', evidencia_relacion_ref: 'e' }).ok).toBe(false)
  })

  it('los hitos publicables los gestionan solo los roles ARSEG de servicio', () => {
    const estado = estadoInicial()
    const rodrigo = ctxDe(estado, 'mem_rodrigo')
    expect(crearHito(estado, rodrigo, genId, AHORA, { proyecto_id: 'pry_alt1', clave: 'H-09', nombre: 'x', fecha: '2026-10-01', criterio_terminacion: 'c' }).ok).toBe(false)
    const admin = ctxDe(estado, 'mem_admin_alt')
    expect(crearHito(estado, admin, genId, AHORA, { proyecto_id: 'pry_alt1', clave: 'H-09', nombre: 'x', fecha: '2026-10-01', criterio_terminacion: 'c' }).ok).toBe(false)
    const lider = ctxDe(estado, 'mem_lider_alt')
    expect(crearHito(estado, lider, genId, AHORA, { proyecto_id: 'pry_alt2', clave: 'H-09', nombre: 'x', fecha: '2026-10-01', criterio_terminacion: 'c' }).ok).toBe(false) // cerrado
  })

  it('un compromiso puede solicitarlo también el cliente hacia ARSEG (RR-03)', () => {
    const estado = estadoInicial()
    const mariana = ctxDe(estado, 'mem_mariana')
    const r = crearCompromiso(estado, mariana, genId, AHORA, {
      proyecto_id: 'pry_alt1', tipo: 'validacion', descripcion: 'Confirmar el plan de comunicación de resultados.',
      parte_responsable: 'arseg', contacto_responsable_id: 'con_ivan_alt', fecha: '2026-09-10',
      criterio_resolucion: 'Plan confirmado por el líder.', impacto_previsto: 'Define la sesión ejecutiva.',
    })
    expect(r.ok).toBe(true)
    const lucia = ctxDe(estado, 'mem_lucia')
    expect(crearCompromiso(estado, lucia, genId, AHORA, {
      proyecto_id: 'pry_alt1', tipo: 'decision', descripcion: 'x', parte_responsable: 'cliente',
      contacto_responsable_id: 'con_rodrigo', fecha: '2026-09-10', criterio_resolucion: 'c', impacto_previsto: '',
    }).ok).toBe(false) // rol Consulta no crea compromisos
  })
})
