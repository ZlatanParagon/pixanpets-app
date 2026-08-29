// Pruebas de dominio trazadas a los invariantes (INV, SPEC v0.3 II.7.1) y a las
// pruebas de aceptación (PA, II.14) ejecutables en la capa de dominio de este
// prototipo. Cada test cita el identificador que cubre.

import { describe, expect, it } from 'vitest'
import { estadoInicial, AHORA_DEMO } from '../data/sinteticos'
import type { EstadoPortal } from './types'
import type { ContextoAcceso } from './authz'
import { autoridadComercialVigente, puedeActuar, puedeVerClasificacion } from './authz'
import {
  cambiarFechaHito,
  cerrarProyecto,
  comentarAcuerdo,
  compromisoVencido,
  confirmar,
  publicarAvance,
  publicarRevisionEntregable,
  registrarAcuse,
  registrarFormalizacionInicial,
  resolverCompromiso,
  responderCompromiso,
  solicitarAclaracion,
} from './comandos'
import { bitacoraVisible, entregablesDeProyecto, proyectosVisibles, proyectoVisible } from './consultas'
import { generarPaqueteExpediente } from './expediente'

const AHORA = AHORA_DEMO
let seq = 0
const genId = () => `test_${++seq}`

function ctx(estado: EstadoPortal, membresiaId: string): ContextoAcceso {
  const membresia = estado.membresias.find((m) => m.id === membresiaId)!
  return { usuario_id: membresia.usuario_id, membresia, ahora: AHORA }
}

describe('Aislamiento por cliente (INV-01)', () => {
  it('PA-01: un usuario del cliente B no ve ni resuelve proyectos de A, sin revelar metadatos', () => {
    const estado = estadoInicial()
    const diego = ctx(estado, 'mem_diego') // patrocinador de Litoral
    expect(proyectoVisible(estado, diego, 'pry_alt1', AHORA)).toBeUndefined()
    expect(entregablesDeProyecto(estado, diego, 'pry_alt1', AHORA)).toEqual([])
    expect(proyectosVisibles(estado, diego, AHORA).map((p) => p.id)).toEqual(['pry_lit1'])
  })

  it('PA-02: una escritura con cliente cruzado se rechaza y no deja registro cruzado', () => {
    const estado = estadoInicial()
    const diego = ctx(estado, 'mem_diego')
    const r = responderCompromiso(estado, diego, genId, AHORA, { compromiso_id: 'cmp_alt1_1', texto: 'intento' })
    expect(r.ok).toBe(false)
    expect(estado.compromisos.find((c) => c.id === 'cmp_alt1_1')!.estado).toBe('abierto')
  })

  it('PA-04: el contexto no se hereda — cada consulta se evalúa contra su propia membresía', () => {
    const estado = estadoInicial()
    const socia = ctx(estado, 'mem_socia_alt')
    expect(proyectosVisibles(estado, socia, AHORA).map((p) => p.id)).toContain('pry_alt1')
    // La misma usuaria con su membresía de Litoral no arrastra acceso de Altiplano.
    const sociaLit = ctx(estado, 'mem_socia_lit')
    expect(proyectosVisibles(estado, sociaLit, AHORA).map((p) => p.id)).toEqual(['pry_lit1'])
  })
})

describe('Clasificación y permisos (H09, INV-16)', () => {
  it('PA-05: rol Consulta no ve el informe técnico — ni su título en listados ni acuses', () => {
    const estado = estadoInicial()
    const lucia = ctx(estado, 'mem_lucia')
    const titulos = entregablesDeProyecto(estado, lucia, 'pry_alt1', AHORA).map((e) => e.entregable.id)
    expect(titulos).not.toContain('ent_informe')
    expect(titulos).toContain('ent_plan')
    const r = registrarAcuse(estado, lucia, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'recepcion' })
    expect(r.ok).toBe(false)
  })

  it('PA-06: Administración no obtiene acceso a contenido por su rol', () => {
    const estado = estadoInicial()
    const admin = ctx(estado, 'mem_admin_alt')
    expect(proyectosVisibles(estado, admin, AHORA)).toEqual([])
    expect(puedeVerClasificacion(estado, admin, 'general')).toBe(false)
    expect(bitacoraVisible(estado, admin, AHORA)).toEqual([])
  })

  it('el permiso técnico restringido está acotado a proyecto (II.3.3)', () => {
    const estado = estadoInicial()
    const rodrigo = ctx(estado, 'mem_rodrigo')
    expect(puedeVerClasificacion(estado, rodrigo, 'tecnica_restringida', 'pry_alt1')).toBe(true)
    // Sin asignación a pry_alt2, el alcance de proyecto niega el acceso.
    expect(puedeVerClasificacion(estado, rodrigo, 'tecnica_restringida', 'pry_alt2')).toBe(false)
  })

  it('PA-32/INV-16: el paquete de expediente respeta los permisos del solicitante', () => {
    const estado = estadoInicial()
    const lucia = ctx(estado, 'mem_lucia')
    const paqueteLucia = generarPaqueteExpediente(estado, lucia, 'pry_alt1', AHORA)
    if ('error' in paqueteLucia) throw new Error(paqueteLucia.error)
    expect(paqueteLucia.manifiesto_archivos.every((a) => a.clasificacion === 'general')).toBe(true)
    expect(paqueteLucia.acuerdos_incluidos.every((a) => !a.clave.startsWith('SOW'))).toBe(true)

    const rodrigo = ctx(estado, 'mem_rodrigo')
    const paqueteRodrigo = generarPaqueteExpediente(estado, rodrigo, 'pry_alt1', AHORA)
    if ('error' in paqueteRodrigo) throw new Error(paqueteRodrigo.error)
    expect(paqueteRodrigo.manifiesto_archivos.some((a) => a.clasificacion === 'tecnica_restringida')).toBe(true)
  })
})

describe('Publicación de entregables (INV-02)', () => {
  it('PA-09: no se publica un archivo en cuarentena', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    const r = publicarRevisionEntregable(estado, lider, genId, AHORA, {
      entregable_id: 'ent_plan',
      archivo_id: 'arc_guia', // estado_seguridad: cuarentena
      proposito: 'informativo',
      clasificacion: 'general',
    })
    expect(r.ok).toBe(false)
  })

  it('PA-10/PA-11: una nueva revisión no reescribe la anterior; hash y acuses se preservan', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    // Publica una nueva revisión del plan usando un archivo permitido.
    const conArchivo: EstadoPortal = {
      ...estado,
      archivos: estado.archivos.map((a) => (a.id === 'arc_guia' ? { ...a, estado_seguridad: 'permitido' as const } : a)),
    }
    const r = publicarRevisionEntregable(conArchivo, lider, genId, AHORA, {
      entregable_id: 'ent_plan',
      archivo_id: 'arc_guia',
      proposito: 'informativo',
      clasificacion: 'general',
    })
    if (!r.ok) throw new Error(r.error)
    const revs = r.valor.estado.entregableRevisiones.filter((x) => x.entregable_id === 'ent_plan')
    const anterior = revs.find((x) => x.id === 'erv_plan_1')!
    const nueva = revs.find((x) => x.numero_revision === 2)!
    expect(anterior.estado_editorial).toBe('superado')
    expect(anterior.hash_archivo).toBe('91ac…pl01') // bytes/hash intactos
    expect(nueva.estado_editorial).toBe('publicado')
    expect(nueva.revision_anterior_id).toBe('erv_plan_1')
    // El acuse de la revisión anterior sobrevive (PA-11).
    expect(r.valor.estado.acuses.some((a) => a.entregable_revision_id === 'erv_plan_1')).toBe(true)
  })

  it('no se publica al cliente contenido interno ARSEG (RR-02/H10)', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    const r = publicarRevisionEntregable(estado, lider, genId, AHORA, {
      entregable_id: 'ent_plan',
      archivo_id: 'arc_plan_1',
      proposito: 'informativo',
      clasificacion: 'interna_arseg',
    })
    expect(r.ok).toBe(false)
  })
})

describe('Formalización e inicio de proyecto (INV-03, H07)', () => {
  function conInstrumentoNuevo(estado: EstadoPortal): EstadoPortal {
    return {
      ...estado,
      acuerdos: [...estado.acuerdos, { id: 'acu_nuevo', cliente_id: 'cli_alt', clave: 'SOW-ALT-002', tipo: 'alcance_inicial' as const }],
      acuerdoRevisiones: [
        ...estado.acuerdoRevisiones,
        { id: 'rev_nuevo_1', cliente_id: 'cli_alt', acuerdo_id: 'acu_nuevo', numero_revision: 1, titulo: 'SOW Monitoreo', estado_editorial: 'publicada' as const, archivo_id: 'arc_sow_alt1_r2', hash_documento: 'ff01…nv01', publicado_en: AHORA, publicado_por: 'mem_socia_alt', resumen_cambios: 'Inicial.', clasificacion: 'comercial_restringida' as const },
      ],
    }
  }
  const params = {
    revision_instrumento_id: 'rev_nuevo_1',
    firmante_segun_instrumento: 'Apoderado (sintético)',
    fecha_acto: '2026-08-27',
    evidencia_ref: 'evd/sow-alt-002.pdf',
    validado_por: 'mem_socia_alt',
    proyecto: { clave: 'ALT-2026-03', nombre: 'Monitoreo trimestral', modalidad: 'recurrente' as const, lider_membresia_id: 'mem_lider_alt', inicio_comprometido: '2026-09-15', fin_original: '2027-09-15' },
  }

  it('PA-12: importar dos veces el mismo instrumento conserva un solo proyecto', () => {
    const estado = conInstrumentoNuevo(estadoInicial())
    const socia = ctx(estado, 'mem_socia_alt')
    const r1 = registrarFormalizacionInicial(estado, socia, genId, AHORA, params)
    if (!r1.ok) throw new Error(r1.error)
    const cuantos = r1.valor.estado.proyectos.length
    const r2 = registrarFormalizacionInicial(r1.valor.estado, socia, genId, AHORA, params)
    if (!r2.ok) throw new Error(r2.error)
    expect(r2.valor.estado.proyectos.length).toBe(cuantos)
    expect(r2.valor.eventos).toEqual([]) // reintento sin efecto duplicado
  })

  it('un NDA no habilita la creación de un proyecto (5.2)', () => {
    const estado = estadoInicial()
    const socia = ctx(estado, 'mem_socia_alt')
    const r = registrarFormalizacionInicial(estado, socia, genId, AHORA, { ...params, revision_instrumento_id: 'rev_nda_alt_1' })
    expect(r.ok).toBe(false)
  })

  it('PA-13: la formalización distingue firmante según instrumento de quien registra', () => {
    const estado = conInstrumentoNuevo(estadoInicial())
    const socia = ctx(estado, 'mem_socia_alt')
    const r = registrarFormalizacionInicial(estado, socia, genId, AHORA, params)
    if (!r.ok) throw new Error(r.error)
    const f = r.valor.estado.formalizaciones.at(-1)!
    expect(f.firmante_segun_instrumento).not.toBe(f.registrado_por)
  })

  it('INV-05: la formalización dentro del portal no está habilitada en MVP, ni con autoridad vigente', () => {
    const estado = estadoInicial()
    const mariana = ctx(estado, 'mem_mariana')
    expect(autoridadComercialVigente(estado, mariana)).toBeDefined()
    expect(puedeActuar(estado, mariana, 'formalizar_en_portal')).toBe(false)
    // Y la autoridad vencida deja de estar vigente sin borrar el registro.
    const despues = { ...mariana, ahora: '2027-06-01T00:00:00Z' }
    expect(autoridadComercialVigente(estado, despues)).toBeUndefined()
  })
})

describe('Compromisos compartidos (H05, H15)', () => {
  it('PA-20: responder no resuelve; la validación es de la parte solicitante', () => {
    const estado = estadoInicial()
    const mariana = ctx(estado, 'mem_mariana')
    const r = responderCompromiso(estado, mariana, genId, AHORA, { compromiso_id: 'cmp_alt1_1', texto: 'Ventana confirmada con guardia asignada.' })
    if (!r.ok) throw new Error(r.error)
    const c = r.valor.estado.compromisos.find((x) => x.id === 'cmp_alt1_1')!
    expect(c.estado).toBe('respondido')
    // La respondiente no puede autovalidar la resolución.
    const auto = resolverCompromiso(r.valor.estado, mariana, genId, AHORA, { compromiso_id: 'cmp_alt1_1', motivo: 'listo' })
    expect(auto.ok).toBe(false)
    // La parte solicitante (líder ARSEG) sí resuelve.
    const lider = ctx(estado, 'mem_lider_alt')
    const res = resolverCompromiso(r.valor.estado, lider, genId, AHORA, { compromiso_id: 'cmp_alt1_1', motivo: 'Confirmación recibida conforme al criterio.' })
    if (!res.ok) throw new Error(res.error)
    expect(res.valor.estado.compromisos.find((x) => x.id === 'cmp_alt1_1')!.estado).toBe('resuelto')
  })

  it('respondido puede requerir aclaración y volver a responderse (5.4)', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    const r1 = solicitarAclaracion(estado, lider, genId, AHORA, { compromiso_id: 'cmp_alt1_2', motivo: 'Falta precisar si incluye el módulo de notas de crédito.' })
    if (!r1.ok) throw new Error(r1.error)
    expect(r1.valor.estado.compromisos.find((x) => x.id === 'cmp_alt1_2')!.estado).toBe('requiere_aclaracion')
    const mariana = ctx(estado, 'mem_mariana')
    const r2 = responderCompromiso(r1.valor.estado, mariana, genId, AHORA, { compromiso_id: 'cmp_alt1_2', texto: 'Incluye notas de crédito; queda fuera solo el timbrado heredado.' })
    if (!r2.ok) throw new Error(r2.error)
    expect(r2.valor.estado.compromisos.find((x) => x.id === 'cmp_alt1_2')!.estado).toBe('respondido')
  })

  it('PA-23: un compromiso ARSEG vencido se evalúa con las mismas reglas (RR-03)', () => {
    const estado = estadoInicial()
    const deArseg = estado.compromisos.find((c) => c.id === 'cmp_alt1_3')!
    expect(deArseg.parte_responsable).toBe('arseg')
    expect(compromisoVencido(deArseg, AHORA)).toBe(true)
    const delCliente = estado.compromisos.find((c) => c.id === 'cmp_alt1_1')!
    expect(compromisoVencido(delCliente, AHORA)).toBe(false) // vence 2026-09-01
  })

  it('la suspensión de la cuenta bloquea acciones sin borrar información (II.2.2)', () => {
    const base = estadoInicial()
    const estado: EstadoPortal = {
      ...base,
      clientes: base.clientes.map((c) => (c.id === 'cli_alt' ? { ...c, acceso_suspendido: true, motivo_suspension: 'prueba' } : c)),
    }
    const mariana = ctx(estado, 'mem_mariana')
    const r = responderCompromiso(estado, mariana, genId, AHORA, { compromiso_id: 'cmp_alt1_1', texto: 'x' })
    expect(r.ok).toBe(false)
    expect(estado.compromisos.length).toBe(base.compromisos.length)
  })
})

describe('Fechas comprometidas (H06, INV-11)', () => {
  it('PA-21: cambiar una fecha conserva la original, el motivo y el autorizador', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    const r = cambiarFechaHito(estado, lider, genId, AHORA, { hito_id: 'hit_alt1_3', fecha_nueva: '2026-10-30', motivo: 'Depende de la ventana reprogramada del H-02.' })
    if (!r.ok) throw new Error(r.error)
    const h = r.valor.estado.hitos.find((x) => x.id === 'hit_alt1_3')!
    expect(h.fecha_original).toBe('2026-10-16')
    expect(h.fecha_vigente).toBe('2026-10-30')
    expect(h.cambios_fecha.at(-1)).toMatchObject({ fecha_anterior: '2026-10-16', autorizado_por: 'mem_lider_alt' })
    expect(r.valor.eventos).toHaveLength(1)
  })

  it('sin motivo no hay cambio de fecha', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    expect(cambiarFechaHito(estado, lider, genId, AHORA, { hito_id: 'hit_alt1_3', fecha_nueva: '2026-10-30', motivo: '  ' }).ok).toBe(false)
  })
})

describe('Actos sobre entregables (H22, INV-08)', () => {
  it('PA-19: el acuse de recepción no produce conformidad ni aceptación', () => {
    const estado = estadoInicial()
    const rodrigo = ctx(estado, 'mem_rodrigo')
    const r = registrarAcuse(estado, rodrigo, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'recepcion' })
    if (!r.ok) throw new Error(r.error)
    const acuses = r.valor.estado.acuses.filter((a) => a.entregable_revision_id === 'erv_informe_2')
    expect(acuses).toHaveLength(1)
    expect(acuses[0].tipo).toBe('recepcion')
    // Repetir el acto es idempotente (7.3).
    const r2 = registrarAcuse(r.valor.estado, rodrigo, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'recepcion' })
    if (!r2.ok) throw new Error(r2.error)
    expect(r2.valor.estado.acuses.filter((a) => a.entregable_revision_id === 'erv_informe_2')).toHaveLength(1)
  })

  it('la conformidad exige permiso expreso Y acceso al contenido (II.3.3)', () => {
    const estado = estadoInicial()
    // Rodrigo ve el informe pero no tiene permiso de conformidad.
    const rodrigo = ctx(estado, 'mem_rodrigo')
    expect(registrarAcuse(estado, rodrigo, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'conformidad' }).ok).toBe(false)
    // Mariana tiene permiso de conformidad pero NO puede consultar el informe restringido.
    const mariana = ctx(estado, 'mem_mariana')
    expect(registrarAcuse(estado, mariana, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'conformidad' }).ok).toBe(false)
    // Con permiso técnico otorgado, el acto procede.
    const conPermiso: EstadoPortal = {
      ...estado,
      permisos: [...estado.permisos, { id: 'per_test', cliente_id: 'cli_alt', membresia_id: 'mem_mariana', codigo_permiso: 'tecnico_restringido:ver' as const, aprobado_por: 'mem_socia_alt', vigente_desde: '2026-08-01T00:00:00Z' }],
    }
    const r = registrarAcuse(conPermiso, mariana, genId, AHORA, { entregable_revision_id: 'erv_informe_2', tipo: 'conformidad' })
    expect(r.ok).toBe(true)
  })
})

describe('Transacción de estado y bitácora (INV-12, 7.2)', () => {
  it('PA-30: si la bitácora no puede escribirse, no se confirma el cambio', () => {
    const estado = estadoInicial()
    const mariana = ctx(estado, 'mem_mariana')
    const tx = responderCompromiso(estado, mariana, genId, AHORA, { compromiso_id: 'cmp_alt1_1', texto: 'Confirmada.' })
    if (!tx.ok) throw new Error(tx.error)
    const fallo = confirmar(tx.valor, () => {
      throw new Error('bitácora no disponible')
    })
    expect(fallo.ok).toBe(false)
    // El estado original sigue intacto: el comando es puro y no se aplicó.
    expect(estado.compromisos.find((c) => c.id === 'cmp_alt1_1')!.estado).toBe('abierto')
    // Con bitácora disponible, estado y evento quedan juntos.
    const exito = confirmar(tx.valor)
    if (!exito.ok) throw new Error(exito.error)
    expect(exito.valor.compromisos.find((c) => c.id === 'cmp_alt1_1')!.estado).toBe('respondido')
    expect(exito.valor.bitacora.at(-1)!.tipo_evento).toBe('compromiso_respondido')
  })
})

describe('Cierre, histórico y expediente (H13, INV-13)', () => {
  it('PA-33: cerrar un proyecto no vuelve históricos los demás', () => {
    const estado = estadoInicial()
    const mariana = ctx(estado, 'mem_mariana')
    const ids = proyectosVisibles(estado, mariana, AHORA).map((p) => p.id)
    expect(ids).toContain('pry_alt1') // activo
    expect(ids).toContain('pry_alt2') // cerrado, en consulta histórica
    expect(estado.clientes.find((c) => c.id === 'cli_alt')!.estado_cuenta).toBe('activa')
  })

  it('PA-34: al vencer la consulta de un expediente se bloquea solo ese expediente', () => {
    const estado = estadoInicial()
    const mariana = { ...ctx(estado, 'mem_mariana'), ahora: '2027-06-15T00:00:00Z' }
    const ids = proyectosVisibles(estado, mariana, '2027-06-15T00:00:00Z').map((p) => p.id)
    expect(ids).toContain('pry_alt1')
    expect(ids).not.toContain('pry_alt2')
  })

  it('PA-35: un expediente histórico no admite cambios de contenido', () => {
    const estado = estadoInicial()
    const lider = ctx(estado, 'mem_lider_alt')
    expect(publicarAvance(estado, lider, genId, AHORA, { proyecto_id: 'pry_alt2', texto: 'x', fecha_corte: '2026-08-28' }).ok).toBe(false)
    const socia = ctx(estado, 'mem_socia_alt')
    expect(
      cerrarProyecto(estado, socia, genId, AHORA, { proyecto_id: 'pry_alt2', consulta_historica_hasta: '2028-01-01', evidencia_conformidad_ref: 'x', pendientes_transferidos_ref: 'x' }).ok,
    ).toBe(false)
  })

  it('el cierre exige resolver o documentar los compromisos abiertos (5.7)', () => {
    const estado = estadoInicial()
    const socia = ctx(estado, 'mem_socia_lit')
    const r = cerrarProyecto(estado, socia, genId, AHORA, { proyecto_id: 'pry_lit1', consulta_historica_hasta: '2027-11-13', evidencia_conformidad_ref: 'evd/x.pdf', pendientes_transferidos_ref: 'evd/y.pdf' })
    expect(r.ok).toBe(false)
  })
})

describe('Acuerdos (5.2)', () => {
  it('los comentarios se anclan a una sección del índice de la revisión', () => {
    const estado = estadoInicial()
    const mariana = ctx(estado, 'mem_mariana')
    const bien = comentarAcuerdo(estado, mariana, genId, AHORA, { acuerdo_revision_id: 'rev_sow_alt1_2', seccion_id: 'sec_sow_alt1_2_b', texto: '¿Se conserva la ventana nocturna?' })
    expect(bien.ok).toBe(true)
    const mal = comentarAcuerdo(estado, mariana, genId, AHORA, { acuerdo_revision_id: 'rev_sow_alt1_2', seccion_id: 'sec_inexistente', texto: 'x' })
    expect(mal.ok).toBe(false)
  })

  it('quien no tiene permiso comercial no comenta (ni ve) un SOW restringido', () => {
    const estado = estadoInicial()
    const rodrigo = ctx(estado, 'mem_rodrigo') // sin comercial:ver
    const r = comentarAcuerdo(estado, rodrigo, genId, AHORA, { acuerdo_revision_id: 'rev_sow_alt1_2', seccion_id: 'sec_sow_alt1_2_b', texto: 'x' })
    expect(r.ok).toBe(false)
  })
})
