// DATOS SINTÉTICOS DE DEMOSTRACIÓN — SPEC v0.3, 8.6: «Las demostraciones
// utilizan datos sintéticos claramente identificados». Ninguna organización,
// persona, monto o hallazgo de este archivo es real, y ningún dato real debe
// incorporarse aquí (restricción II.16).
//
// Se modelan DOS clientes aunque el piloto tenga uno (8.2): las pruebas de
// aislamiento exigen al menos dos clientes sintéticos.

import type { EstadoPortal } from '../domain/types'

export const AHORA_DEMO = '2026-08-28T18:00:00Z'

export function estadoInicial(): EstadoPortal {
  return {
    clientes: [
      {
        id: 'cli_alt',
        razon_social: 'Altiplano Retail, S.A. de C.V. (sintético)',
        nombre_visible: 'Altiplano Retail',
        sector: 'Comercio minorista',
        estado_cuenta: 'activa',
        acceso_suspendido: false,
        zona_horaria: 'America/Mexico_City',
        socio_responsable_id: 'mem_socia_alt',
        creado_en: '2026-03-02T16:00:00Z',
      },
      {
        id: 'cli_lit',
        razon_social: 'Litoral Farma, S.A.P.I. de C.V. (sintético)',
        nombre_visible: 'Litoral Farma',
        sector: 'Farmacéutico',
        estado_cuenta: 'activa',
        acceso_suspendido: false,
        zona_horaria: 'America/Mexico_City',
        socio_responsable_id: 'mem_socia_lit',
        creado_en: '2026-06-15T16:00:00Z',
      },
    ],

    usuarios: [
      { id: 'usr_mariana', nombre: 'Mariana Cortés', correo: 'mcortes@altiplano.example', activo: true },
      { id: 'usr_rodrigo', nombre: 'Rodrigo Peña', correo: 'rpena@altiplano.example', activo: true },
      { id: 'usr_lucia', nombre: 'Lucía Ferrer', correo: 'lferrer@altiplano.example', activo: true },
      { id: 'usr_diego', nombre: 'Diego Armenta', correo: 'darmenta@litoralfarma.example', activo: true },
      { id: 'usr_elena', nombre: 'Elena Duarte', correo: 'eduarte@arseg.example', activo: true },
      { id: 'usr_ivan', nombre: 'Iván Salas', correo: 'isalas@arseg.example', activo: true },
      { id: 'usr_paola', nombre: 'Paola Núñez', correo: 'pnunez@arseg.example', activo: true },
    ],

    contactos: [
      { id: 'con_mariana', cliente_id: 'cli_alt', nombre: 'Mariana Cortés', correo: 'mcortes@altiplano.example', cargo: 'Directora de Administración', activo: true, usuario_id: 'usr_mariana' },
      { id: 'con_rodrigo', cliente_id: 'cli_alt', nombre: 'Rodrigo Peña', correo: 'rpena@altiplano.example', cargo: 'Gerente de TI', activo: true, usuario_id: 'usr_rodrigo' },
      { id: 'con_ivan_alt', cliente_id: 'cli_alt', nombre: 'Iván Salas', correo: 'isalas@arseg.example', cargo: 'Líder de proyecto ARSEG', activo: true, usuario_id: 'usr_ivan' },
      { id: 'con_diego', cliente_id: 'cli_lit', nombre: 'Diego Armenta', correo: 'darmenta@litoralfarma.example', cargo: 'CISO', activo: true, usuario_id: 'usr_diego' },
    ],

    membresias: [
      // Cliente Altiplano
      { id: 'mem_mariana', cliente_id: 'cli_alt', usuario_id: 'usr_mariana', rol: 'patrocinador', activa: true, alcance: 'cuenta', vigente_desde: '2026-03-02T16:00:00Z' },
      { id: 'mem_rodrigo', cliente_id: 'cli_alt', usuario_id: 'usr_rodrigo', rol: 'responsable_operativo', activa: true, alcance: 'proyectos_asignados', vigente_desde: '2026-03-09T16:00:00Z' },
      { id: 'mem_lucia', cliente_id: 'cli_alt', usuario_id: 'usr_lucia', rol: 'consulta', activa: true, alcance: 'proyectos_asignados', vigente_desde: '2026-04-01T16:00:00Z' },
      // Cliente Litoral
      { id: 'mem_diego', cliente_id: 'cli_lit', usuario_id: 'usr_diego', rol: 'patrocinador', activa: true, alcance: 'cuenta', vigente_desde: '2026-06-15T16:00:00Z' },
      // ARSEG — la socia y Administración tienen membresías en ambos clientes:
      // el usuario debe seleccionar explícitamente la cuenta activa (II.3.1).
      { id: 'mem_socia_alt', cliente_id: 'cli_alt', usuario_id: 'usr_elena', rol: 'socio_responsable', activa: true, alcance: 'cuenta', vigente_desde: '2026-03-02T16:00:00Z' },
      { id: 'mem_socia_lit', cliente_id: 'cli_lit', usuario_id: 'usr_elena', rol: 'socio_responsable', activa: true, alcance: 'cuenta', vigente_desde: '2026-06-15T16:00:00Z' },
      { id: 'mem_lider_alt', cliente_id: 'cli_alt', usuario_id: 'usr_ivan', rol: 'lider_proyecto', activa: true, alcance: 'cuenta', vigente_desde: '2026-03-02T16:00:00Z' },
      { id: 'mem_admin_alt', cliente_id: 'cli_alt', usuario_id: 'usr_paola', rol: 'administracion', activa: true, alcance: 'cuenta', vigente_desde: '2026-03-02T16:00:00Z' },
      { id: 'mem_admin_lit', cliente_id: 'cli_lit', usuario_id: 'usr_paola', rol: 'administracion', activa: true, alcance: 'cuenta', vigente_desde: '2026-06-15T16:00:00Z' },
    ],

    asignaciones: [
      { id: 'asg_rodrigo_1', cliente_id: 'cli_alt', membresia_id: 'mem_rodrigo', proyecto_id: 'pry_alt1' },
      { id: 'asg_lucia_1', cliente_id: 'cli_alt', membresia_id: 'mem_lucia', proyecto_id: 'pry_alt1' },
    ],

    permisos: [
      // La patrocinadora ve lo comercial y puede dar conformidad; NO tiene permiso técnico restringido.
      { id: 'per_mariana_com', cliente_id: 'cli_alt', membresia_id: 'mem_mariana', codigo_permiso: 'comercial:ver', aprobado_por: 'mem_socia_alt', vigente_desde: '2026-03-02T16:00:00Z' },
      { id: 'per_mariana_conf', cliente_id: 'cli_alt', membresia_id: 'mem_mariana', codigo_permiso: 'entregable:dar_conformidad', aprobado_por: 'mem_socia_alt', vigente_desde: '2026-03-02T16:00:00Z' },
      // El responsable operativo ve el detalle técnico restringido SOLO del proyecto asignado.
      { id: 'per_rodrigo_tec', cliente_id: 'cli_alt', membresia_id: 'mem_rodrigo', codigo_permiso: 'tecnico_restringido:ver', proyecto_id: 'pry_alt1', aprobado_por: 'mem_socia_alt', vigente_desde: '2026-03-09T16:00:00Z' },
    ],

    autoridades: [
      // Autoridad comercial documentada y vigente, separada del rol (H08).
      {
        id: 'aut_mariana',
        cliente_id: 'cli_alt',
        membresia_id: 'mem_mariana',
        tipos_acto: ['aceptacion_comercial'],
        limite_monto: 1500000,
        moneda: 'MXN',
        evidencia_facultades_ref: 'evd/poder-notarial-sintetico-0142.pdf',
        vigente_desde: '2026-03-02T16:00:00Z',
        vigente_hasta: '2027-03-01T16:00:00Z',
        validada_por: 'mem_socia_alt',
      },
    ],

    acuerdos: [
      { id: 'acu_nda_alt', cliente_id: 'cli_alt', clave: 'NDA-ALT-001', tipo: 'confidencialidad' },
      { id: 'acu_sow_alt1', cliente_id: 'cli_alt', clave: 'SOW-ALT-001', tipo: 'alcance_inicial', proyecto_destino_id: 'pry_alt1' },
      { id: 'acu_sow_alt2', cliente_id: 'cli_alt', clave: 'SOW-ALT-000', tipo: 'alcance_inicial', proyecto_destino_id: 'pry_alt2' },
      { id: 'acu_sow_lit1', cliente_id: 'cli_lit', clave: 'SOW-LIT-001', tipo: 'alcance_inicial', proyecto_destino_id: 'pry_lit1' },
    ],

    acuerdoRevisiones: [
      { id: 'rev_nda_alt_1', cliente_id: 'cli_alt', acuerdo_id: 'acu_nda_alt', numero_revision: 1, titulo: 'Acuerdo de confidencialidad', estado_editorial: 'publicada', archivo_id: 'arc_nda_alt', hash_documento: '5f1c…nda1', publicado_en: '2026-03-02T17:00:00Z', publicado_por: 'mem_socia_alt', resumen_cambios: 'Versión inicial.', clasificacion: 'general' },
      { id: 'rev_sow_alt1_1', cliente_id: 'cli_alt', acuerdo_id: 'acu_sow_alt1', numero_revision: 1, titulo: 'SOW Evaluación de seguridad de aplicaciones', estado_editorial: 'superada', archivo_id: 'arc_sow_alt1_r1', hash_documento: 'a91b…sw11', publicado_en: '2026-03-20T17:00:00Z', publicado_por: 'mem_socia_alt', resumen_cambios: 'Versión inicial para revisión.', clasificacion: 'comercial_restringida' },
      { id: 'rev_sow_alt1_2', cliente_id: 'cli_alt', acuerdo_id: 'acu_sow_alt1', numero_revision: 2, titulo: 'SOW Evaluación de seguridad de aplicaciones', estado_editorial: 'publicada', archivo_id: 'arc_sow_alt1_r2', hash_documento: 'c22e…sw12', publicado_en: '2026-04-06T17:00:00Z', publicado_por: 'mem_socia_alt', resumen_cambios: 'Ajuste de calendario de entrevistas y ventana de pruebas (secciones 3 y 5).', revision_anterior_id: 'rev_sow_alt1_1', clasificacion: 'comercial_restringida' },
      { id: 'rev_sow_alt2_1', cliente_id: 'cli_alt', acuerdo_id: 'acu_sow_alt2', numero_revision: 1, titulo: 'SOW Diagnóstico inicial de ciberseguridad', estado_editorial: 'publicada', archivo_id: 'arc_sow_alt2_r1', hash_documento: 'e871…sw21', publicado_en: '2026-03-05T17:00:00Z', publicado_por: 'mem_socia_alt', resumen_cambios: 'Versión formalizada.', clasificacion: 'comercial_restringida' },
      { id: 'rev_sow_lit1_1', cliente_id: 'cli_lit', acuerdo_id: 'acu_sow_lit1', numero_revision: 1, titulo: 'SOW Prueba de penetración externa', estado_editorial: 'publicada', archivo_id: 'arc_sow_lit1_r1', hash_documento: 'b3d4…swl1', publicado_en: '2026-07-01T17:00:00Z', publicado_por: 'mem_socia_lit', resumen_cambios: 'Versión formalizada.', clasificacion: 'comercial_restringida' },
    ],

    seccionesAcuerdo: [
      { id: 'sec_sow_alt1_2_a', cliente_id: 'cli_alt', acuerdo_revision_id: 'rev_sow_alt1_2', clave_seccion: '1', titulo: 'Objeto y alcance', orden: 1 },
      { id: 'sec_sow_alt1_2_b', cliente_id: 'cli_alt', acuerdo_revision_id: 'rev_sow_alt1_2', clave_seccion: '3', titulo: 'Calendario y ventanas de prueba', orden: 2 },
      { id: 'sec_sow_alt1_2_c', cliente_id: 'cli_alt', acuerdo_revision_id: 'rev_sow_alt1_2', clave_seccion: '5', titulo: 'Entregables y criterios de conformidad', orden: 3 },
    ],

    comentariosAcuerdo: [
      { id: 'cmt_1', cliente_id: 'cli_alt', acuerdo_revision_id: 'rev_sow_alt1_2', seccion_id: 'sec_sow_alt1_2_b', autor_membresia_id: 'mem_mariana', texto: '¿La ventana nocturna incluye el sábado 12?', creado_en: '2026-04-08T15:30:00Z', estado: 'atendido' },
    ],

    formalizaciones: [
      { id: 'for_alt1', cliente_id: 'cli_alt', tipo_instrumento: 'alcance_inicial', revision_instrumento_id: 'rev_sow_alt1_2', metodo: 'externa', firmante_segun_instrumento: 'Apoderado legal según instrumento (sintético)', fecha_acto: '2026-04-10', registrado_en: '2026-04-10T19:00:00Z', registrado_por: 'mem_socia_alt', validado_por: 'mem_socia_alt', evidencia_ref: 'evd/sow-alt-001-firmado.pdf', hash_documento_objeto: 'c22e…sw12' },
      { id: 'for_alt2', cliente_id: 'cli_alt', tipo_instrumento: 'alcance_inicial', revision_instrumento_id: 'rev_sow_alt2_1', metodo: 'externa', firmante_segun_instrumento: 'Apoderado legal según instrumento (sintético)', fecha_acto: '2026-03-06', registrado_en: '2026-03-06T19:00:00Z', registrado_por: 'mem_socia_alt', validado_por: 'mem_socia_alt', evidencia_ref: 'evd/sow-alt-000-firmado.pdf', hash_documento_objeto: 'e871…sw21' },
      { id: 'for_lit1', cliente_id: 'cli_lit', tipo_instrumento: 'alcance_inicial', revision_instrumento_id: 'rev_sow_lit1_1', metodo: 'externa', firmante_segun_instrumento: 'Representante legal según instrumento (sintético)', fecha_acto: '2026-07-02', registrado_en: '2026-07-02T19:00:00Z', registrado_por: 'mem_socia_lit', validado_por: 'mem_socia_lit', evidencia_ref: 'evd/sow-lit-001-firmado.pdf', hash_documento_objeto: 'b3d4…swl1' },
    ],

    proyectos: [
      {
        id: 'pry_alt1', cliente_id: 'cli_alt', clave: 'ALT-2026-02', nombre: 'Evaluación de seguridad de aplicaciones',
        modalidad: 'puntual', acuerdo_inicial_revision_id: 'rev_sow_alt1_2', formalizacion_inicial_id: 'for_alt1',
        fase: 'ejecucion', lider_membresia_id: 'mem_lider_alt',
        inicio_comprometido: '2026-04-15', fin_original: '2026-10-30', fin_vigente: '2026-10-30',
        fecha_corte_publicada: '2026-08-25', actualizado_por: 'mem_lider_alt',
      },
      {
        id: 'pry_alt2', cliente_id: 'cli_alt', clave: 'ALT-2026-01', nombre: 'Diagnóstico inicial de ciberseguridad',
        modalidad: 'puntual', acuerdo_inicial_revision_id: 'rev_sow_alt2_1', formalizacion_inicial_id: 'for_alt2',
        fase: 'cerrado', lider_membresia_id: 'mem_lider_alt',
        inicio_comprometido: '2026-03-10', fin_original: '2026-05-30', fin_vigente: '2026-05-30', fin_real: '2026-05-28T20:00:00Z',
        fecha_corte_publicada: '2026-05-28', actualizado_por: 'mem_lider_alt',
        consulta_historica_hasta: '2027-05-28T00:00:00Z',
      },
      {
        id: 'pry_lit1', cliente_id: 'cli_lit', clave: 'LIT-2026-01', nombre: 'Prueba de penetración externa',
        modalidad: 'puntual', acuerdo_inicial_revision_id: 'rev_sow_lit1_1', formalizacion_inicial_id: 'for_lit1',
        fase: 'preparacion', lider_membresia_id: 'mem_socia_lit',
        inicio_comprometido: '2026-09-07', fin_original: '2026-11-13', fin_vigente: '2026-11-13',
        fecha_corte_publicada: '2026-08-22', actualizado_por: 'mem_socia_lit',
      },
    ],

    hitos: [
      { id: 'hit_alt1_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', clave: 'H-01', nombre: 'Levantamiento de arquitectura', fecha_original: '2026-05-15', fecha_vigente: '2026-05-15', estado: 'cumplido', criterio_terminacion: 'Inventario de aplicaciones validado por el cliente.', cambios_fecha: [], evidencia_ref: 'evd/minuta-h01.pdf' },
      { id: 'hit_alt1_2', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', clave: 'H-02', nombre: 'Pruebas de la aplicación de comercio', fecha_original: '2026-08-14', fecha_vigente: '2026-09-04', estado: 'en_curso', criterio_terminacion: 'Pruebas ejecutadas en la ventana acordada y evidencia entregada.', cambios_fecha: [{ fecha_anterior: '2026-08-14', fecha_nueva: '2026-09-04', motivo: 'Reprogramación de la ventana de pruebas solicitada por el cliente el 2026-08-05.', autorizado_por: 'mem_lider_alt', registrado_en: '2026-08-05T17:00:00Z' }] },
      { id: 'hit_alt1_3', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', clave: 'H-03', nombre: 'Informe final y presentación ejecutiva', fecha_original: '2026-10-16', fecha_vigente: '2026-10-16', estado: 'pendiente', criterio_terminacion: 'Informe publicado y presentación realizada.', cambios_fecha: [] },
      { id: 'hit_lit1_1', cliente_id: 'cli_lit', proyecto_id: 'pry_lit1', clave: 'H-01', nombre: 'Definición de alcance técnico y reglas de contacto', fecha_original: '2026-09-04', fecha_vigente: '2026-09-04', estado: 'en_curso', criterio_terminacion: 'Documento de reglas de contacto aprobado por ambas partes.', cambios_fecha: [] },
    ],

    publicacionesAvance: [
      { id: 'ava_alt1_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', fecha_corte: '2026-08-25', texto_publicado: 'Concluyó el análisis de la aplicación interna de inventarios. La prueba de la aplicación de comercio queda sujeta a la ventana reprogramada del 4 de septiembre.', autor_membresia_id: 'mem_lider_alt', publicado_en: '2026-08-25T16:00:00Z', sistema_origen: 'herramienta_despacho', id_origen: 'AV-118' },
      { id: 'ava_alt1_0', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', fecha_corte: '2026-08-18', texto_publicado: 'Avance conforme al plan en el módulo de autenticación. Sin bloqueos.', autor_membresia_id: 'mem_lider_alt', publicado_en: '2026-08-18T16:00:00Z', sistema_origen: 'herramienta_despacho', id_origen: 'AV-112' },
      { id: 'ava_lit1_1', cliente_id: 'cli_lit', proyecto_id: 'pry_lit1', fecha_corte: '2026-08-22', texto_publicado: 'En preparación: pendiente la confirmación de rangos de direcciones y reglas de contacto.', autor_membresia_id: 'mem_socia_lit', publicado_en: '2026-08-22T16:00:00Z', sistema_origen: 'portal', id_origen: '' },
    ],

    compromisos: [
      // Del cliente, abierto y en tiempo.
      { id: 'cmp_alt1_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'solicitud_insumo', descripcion: 'Confirmar la ventana de pruebas nocturna de la aplicación de comercio (4 de septiembre, 22:00–06:00).', parte_responsable: 'cliente', contacto_responsable_id: 'con_rodrigo', solicitante_membresia_id: 'mem_lider_alt', solicitada_en: '2026-08-20T16:00:00Z', fecha_original: '2026-09-01', fecha_vigente: '2026-09-01', cambios_fecha: [], criterio_resolucion: 'Confirmación escrita de la ventana con responsable de guardia designado.', hito_afectado_id: 'hit_alt1_2', impacto_previsto: 'Sin confirmación, la fecha del hito H-02 debe revisarse.', estado: 'abierto' },
      // Del cliente, respondido: pendiente de validación de la parte solicitante (ARSEG).
      { id: 'cmp_alt1_2', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'decision', descripcion: 'Decidir si el módulo de facturación heredado entra en el alcance de esta evaluación.', parte_responsable: 'cliente', contacto_responsable_id: 'con_mariana', solicitante_membresia_id: 'mem_lider_alt', solicitada_en: '2026-08-11T16:00:00Z', fecha_original: '2026-08-21', fecha_vigente: '2026-08-21', cambios_fecha: [], criterio_resolucion: 'Decisión registrada por persona autorizada del cliente.', impacto_previsto: 'Define el plan de la última iteración de pruebas.', estado: 'respondido' },
      // De ARSEG, VENCIDO: la reciprocidad se muestra con las mismas reglas (PA-23).
      { id: 'cmp_alt1_3', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'validacion', descripcion: 'Entregar al cliente la guía de preparación del ambiente de pruebas.', parte_responsable: 'arseg', contacto_responsable_id: 'con_ivan_alt', solicitante_membresia_id: 'mem_mariana', solicitada_en: '2026-08-15T16:00:00Z', fecha_original: '2026-08-26', fecha_vigente: '2026-08-26', cambios_fecha: [], criterio_resolucion: 'Guía publicada como entregable y confirmada por el responsable operativo.', impacto_previsto: 'Retrasa la preparación del ambiente del cliente.', estado: 'abierto' },
      { id: 'cmp_lit1_1', cliente_id: 'cli_lit', proyecto_id: 'pry_lit1', tipo: 'solicitud_insumo', descripcion: 'Entregar rangos de direcciones públicas autorizados para la prueba.', parte_responsable: 'cliente', contacto_responsable_id: 'con_diego', solicitante_membresia_id: 'mem_socia_lit', solicitada_en: '2026-08-18T16:00:00Z', fecha_original: '2026-09-02', fecha_vigente: '2026-09-02', cambios_fecha: [], criterio_resolucion: 'Listado validado por el CISO.', impacto_previsto: 'Sin el listado no inicia la ejecución.', estado: 'abierto' },
    ],

    respuestasCompromiso: [
      { id: 'rsp_1', cliente_id: 'cli_alt', compromiso_id: 'cmp_alt1_2', autor_membresia_id: 'mem_mariana', texto: 'El módulo de facturación heredado queda fuera de esta evaluación; se considerará para un servicio posterior.', registrada_en: '2026-08-21T20:00:00Z', origen: 'portal' },
    ],

    resolucionesCompromiso: [],

    entregables: [
      { id: 'ent_plan', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'plan', titulo: 'Plan de trabajo y calendario' },
      { id: 'ent_informe', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'informe_tecnico', titulo: 'Informe técnico de evaluación de aplicaciones', criterio_conformidad: 'El informe cubre el alcance del SOW-ALT-001 rev. 2 y cada observación incluye evidencia y recomendación.' },
      { id: 'ent_resumen', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo: 'resumen_ejecutivo', titulo: 'Resumen ejecutivo de avance' },
      { id: 'ent_diag', cliente_id: 'cli_alt', proyecto_id: 'pry_alt2', tipo: 'informe_tecnico', titulo: 'Informe de diagnóstico inicial', criterio_conformidad: 'El informe cubre los dominios acordados en el SOW-ALT-000.' },
    ],

    entregableRevisiones: [
      { id: 'erv_plan_1', cliente_id: 'cli_alt', entregable_id: 'ent_plan', numero_revision: 1, estado_editorial: 'publicado', proposito: 'informativo', clasificacion: 'general', archivo_id: 'arc_plan_1', hash_archivo: '91ac…pl01', mime: 'application/pdf', bytes: 482133, autor_id: 'mem_lider_alt', publicado_por: 'mem_lider_alt', publicado_en: '2026-04-20T16:00:00Z' },
      { id: 'erv_informe_1', cliente_id: 'cli_alt', entregable_id: 'ent_informe', numero_revision: 1, estado_editorial: 'superado', proposito: 'para_revision', clasificacion: 'tecnica_restringida', archivo_id: 'arc_inf_1', hash_archivo: '3fb0…in01', mime: 'application/pdf', bytes: 2314880, autor_id: 'mem_lider_alt', publicado_por: 'mem_lider_alt', publicado_en: '2026-07-17T16:00:00Z' },
      { id: 'erv_informe_2', cliente_id: 'cli_alt', entregable_id: 'ent_informe', numero_revision: 2, estado_editorial: 'publicado', proposito: 'para_revision', clasificacion: 'tecnica_restringida', archivo_id: 'arc_inf_2', hash_archivo: '77d2…in02', mime: 'application/pdf', bytes: 2408001, autor_id: 'mem_lider_alt', publicado_por: 'mem_lider_alt', publicado_en: '2026-08-12T16:00:00Z', revision_anterior_id: 'erv_informe_1' },
      { id: 'erv_resumen_1', cliente_id: 'cli_alt', entregable_id: 'ent_resumen', numero_revision: 1, estado_editorial: 'publicado', proposito: 'informativo', clasificacion: 'general', archivo_id: 'arc_res_1', hash_archivo: '08ce…re01', mime: 'application/pdf', bytes: 301222, autor_id: 'mem_lider_alt', publicado_por: 'mem_lider_alt', publicado_en: '2026-08-25T16:30:00Z' },
      { id: 'erv_diag_1', cliente_id: 'cli_alt', entregable_id: 'ent_diag', numero_revision: 1, estado_editorial: 'publicado', proposito: 'para_revision', clasificacion: 'tecnica_restringida', archivo_id: 'arc_diag_1', hash_archivo: '6a19…dg01', mime: 'application/pdf', bytes: 1822003, autor_id: 'mem_lider_alt', publicado_por: 'mem_lider_alt', publicado_en: '2026-05-20T16:00:00Z' },
    ],

    archivos: [
      { id: 'arc_nda_alt', cliente_id: 'cli_alt', nombre_visible: 'NDA-ALT-001.pdf', mime_validado: 'application/pdf', bytes: 128733, hash_sha256: '5f1c…nda1', estado_seguridad: 'permitido', clasificacion: 'general', creado_por: 'mem_socia_alt', creado_en: '2026-03-02T17:00:00Z' },
      { id: 'arc_sow_alt1_r1', cliente_id: 'cli_alt', nombre_visible: 'SOW-ALT-001-r1.pdf', mime_validado: 'application/pdf', bytes: 611002, hash_sha256: 'a91b…sw11', estado_seguridad: 'permitido', clasificacion: 'comercial_restringida', creado_por: 'mem_socia_alt', creado_en: '2026-03-20T17:00:00Z' },
      { id: 'arc_sow_alt1_r2', cliente_id: 'cli_alt', nombre_visible: 'SOW-ALT-001-r2.pdf', mime_validado: 'application/pdf', bytes: 612480, hash_sha256: 'c22e…sw12', estado_seguridad: 'permitido', clasificacion: 'comercial_restringida', creado_por: 'mem_socia_alt', creado_en: '2026-04-06T17:00:00Z' },
      { id: 'arc_sow_alt2_r1', cliente_id: 'cli_alt', nombre_visible: 'SOW-ALT-000-r1.pdf', mime_validado: 'application/pdf', bytes: 540118, hash_sha256: 'e871…sw21', estado_seguridad: 'permitido', clasificacion: 'comercial_restringida', creado_por: 'mem_socia_alt', creado_en: '2026-03-05T17:00:00Z' },
      { id: 'arc_sow_lit1_r1', cliente_id: 'cli_lit', nombre_visible: 'SOW-LIT-001-r1.pdf', mime_validado: 'application/pdf', bytes: 528700, hash_sha256: 'b3d4…swl1', estado_seguridad: 'permitido', clasificacion: 'comercial_restringida', creado_por: 'mem_socia_lit', creado_en: '2026-07-01T17:00:00Z' },
      { id: 'arc_plan_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', nombre_visible: 'plan-trabajo-v1.pdf', mime_validado: 'application/pdf', bytes: 482133, hash_sha256: '91ac…pl01', estado_seguridad: 'permitido', clasificacion: 'general', creado_por: 'mem_lider_alt', creado_en: '2026-04-20T15:00:00Z' },
      { id: 'arc_inf_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', nombre_visible: 'informe-evaluacion-r1.pdf', mime_validado: 'application/pdf', bytes: 2314880, hash_sha256: '3fb0…in01', estado_seguridad: 'permitido', clasificacion: 'tecnica_restringida', creado_por: 'mem_lider_alt', creado_en: '2026-07-17T15:00:00Z' },
      { id: 'arc_inf_2', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', nombre_visible: 'informe-evaluacion-r2.pdf', mime_validado: 'application/pdf', bytes: 2408001, hash_sha256: '77d2…in02', estado_seguridad: 'permitido', clasificacion: 'tecnica_restringida', creado_por: 'mem_lider_alt', creado_en: '2026-08-12T15:00:00Z' },
      { id: 'arc_res_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', nombre_visible: 'resumen-ejecutivo-ago.pdf', mime_validado: 'application/pdf', bytes: 301222, hash_sha256: '08ce…re01', estado_seguridad: 'permitido', clasificacion: 'general', creado_por: 'mem_lider_alt', creado_en: '2026-08-25T15:00:00Z' },
      { id: 'arc_diag_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt2', nombre_visible: 'diagnostico-inicial.pdf', mime_validado: 'application/pdf', bytes: 1822003, hash_sha256: '6a19…dg01', estado_seguridad: 'permitido', clasificacion: 'tecnica_restringida', creado_por: 'mem_lider_alt', creado_en: '2026-05-20T15:00:00Z' },
      // Archivo en cuarentena: NO puede publicarse mientras no sea `permitido` (PA-09).
      { id: 'arc_guia', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', nombre_visible: 'guia-preparacion-ambiente.pdf', mime_validado: 'application/pdf', bytes: 90210, hash_sha256: '40aa…gu01', estado_seguridad: 'cuarentena', clasificacion: 'general', creado_por: 'mem_lider_alt', creado_en: '2026-08-27T15:00:00Z' },
    ],

    acuses: [
      { id: 'acu_plan_rec', cliente_id: 'cli_alt', entregable_revision_id: 'erv_plan_1', tipo: 'recepcion', actor_membresia_id: 'mem_rodrigo', resultado: 'recibido', registrado_en: '2026-04-21T16:00:00Z' },
      { id: 'acu_inf1_rec', cliente_id: 'cli_alt', entregable_revision_id: 'erv_informe_1', tipo: 'recepcion', actor_membresia_id: 'mem_rodrigo', resultado: 'recibido', registrado_en: '2026-07-18T16:00:00Z' },
      { id: 'acu_diag_conf', cliente_id: 'cli_alt', entregable_revision_id: 'erv_diag_1', tipo: 'conformidad', actor_membresia_id: 'mem_mariana', resultado: 'conforme', registrado_en: '2026-05-26T16:00:00Z' },
    ],

    cierres: [
      { id: 'cie_alt2', cliente_id: 'cli_alt', proyecto_id: 'pry_alt2', fecha_cierre: '2026-05-28T20:00:00Z', evidencia_conformidad_ref: 'evd/conformidad-diagnostico.pdf', pendientes_transferidos_ref: 'evd/acta-cierre-alt2.pdf', consulta_historica_hasta: '2027-05-28T00:00:00Z' },
    ],

    bitacora: [
      { id: 'evt_seed_1', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo_evento: 'formalizacion_externa_registrada', tipo_objeto: 'formalizacion', objeto_id: 'for_alt1', actor_tipo: 'persona', actor_id: 'mem_socia_alt', ocurrido_en_servidor: '2026-04-10T19:00:00Z', detalle_minimo: 'SOW-ALT-001 rev. 2 formalizado fuera del portal.', clasificacion_evento: 'comercial_restringida' },
      { id: 'evt_seed_2', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo_evento: 'entregable_publicado', tipo_objeto: 'entregable_revision', objeto_id: 'erv_informe_2', actor_tipo: 'persona', actor_id: 'mem_lider_alt', ocurrido_en_servidor: '2026-08-12T16:00:00Z', detalle_minimo: 'Informe técnico rev. 2 publicado; rev. 1 queda histórica.', clasificacion_evento: 'tecnica_restringida' },
      { id: 'evt_seed_3', cliente_id: 'cli_alt', proyecto_id: 'pry_alt1', tipo_evento: 'fecha_hito_modificada', tipo_objeto: 'hito', objeto_id: 'hit_alt1_2', actor_tipo: 'persona', actor_id: 'mem_lider_alt', ocurrido_en_servidor: '2026-08-05T17:00:00Z', detalle_minimo: 'H-02: de 2026-08-14 a 2026-09-04 por reprogramación solicitada por el cliente.', clasificacion_evento: 'general' },
      { id: 'evt_seed_4', cliente_id: 'cli_alt', proyecto_id: 'pry_alt2', tipo_evento: 'proyecto_cerrado', tipo_objeto: 'proyecto', objeto_id: 'pry_alt2', actor_tipo: 'persona', actor_id: 'mem_socia_alt', ocurrido_en_servidor: '2026-05-28T20:00:00Z', detalle_minimo: 'Consulta histórica hasta 2027-05-28.', clasificacion_evento: 'general' },
    ],
  }
}
