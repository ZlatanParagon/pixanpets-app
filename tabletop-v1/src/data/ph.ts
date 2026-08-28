// Ejercicio de referencia — El Palacio de Hierro (SPEC s.3, s.4, s.22, s.23).
// El escenario NO está codificado como ransomware: se construye a partir de la
// evidencia de la emulación previa y una evolución hipotética aprobada.

import type { EjercicioConfig, Inyeccion } from '../domain/types'

const OBJ = (clave: string, nombre: string, descripcion: string) => ({
  id: clave.toLowerCase(),
  clave,
  nombre,
  descripcion,
  activo: true,
})

// Roles ejecutivos de referencia
export const ROLES = {
  DG: 'rol-dg',
  CISO: 'rol-ciso',
  TI: 'rol-ti',
  LEGAL: 'rol-legal',
  COM: 'rol-com',
  OPS: 'rol-ops',
  FIN: 'rol-fin',
  RH: 'rol-rh',
} as const

const FASES = {
  DETECCION: 'fase-deteccion',
  ACTIVACION: 'fase-activacion',
  CONTENCION: 'fase-contencion',
  CRISIS: 'fase-crisis',
  RECUPERACION: 'fase-recuperacion',
} as const

let orden = 0
const iny = (
  clave: string,
  fase_id: string,
  tipo: Inyeccion['tipo'],
  titulo: string,
  cuerpo: string,
  extra: Partial<Inyeccion> = {},
): Inyeccion => ({
  id: clave.toLowerCase(),
  fase_id,
  orden: ++orden,
  clave,
  tipo,
  titulo,
  cuerpo,
  fuente: 'hipotetica_aprobada',
  evidencia_origen_ref: null,
  severidad_disenada: 'media',
  ventana_decision_seg: 420,
  objetivo_ids: [],
  audiencia_rol_ids: null,
  visible_en_sala: true,
  respuesta_esperada_rol_ids: [],
  alternativas: [],
  consecuencias: [],
  salto_narrativo_seg: null,
  ...extra,
})

export const EJERCICIO_PH: EjercicioConfig = {
  id: 'ej-ph-2026',
  nombre: 'TableTop Ejecutivo de Cibercrisis',
  cliente: 'El Palacio de Hierro',
  escenario:
    'A partir de los hallazgos de la emulación previa, se plantea una evolución hipotética aprobada: ' +
    'un adversario con acceso persistente escala privilegios y compromete servicios que sostienen la ' +
    'operación comercial. La organización debe reconocer la situación, activar su estructura ejecutiva ' +
    'y tomar decisiones bajo información incompleta y presión creciente.',
  fecha: '2026-09-15',
  duracion_estimada_seg: 4 * 3600,
  codigo_sala: 'PH-CRISIS',
  qr_token: 'tk-ph-7f3a9c2e',
  reglas_participante: [
    'Esto es una simulación: ninguna acción afecta sistemas reales.',
    'No existen respuestas perfectas.',
    'Todo queda registrado con hora.',
    'La evidencia se utilizará para el análisis del ejercicio.',
  ],
  objetivos: [
    OBJ('TT-01', 'Declaración del incidente', 'Reconocimiento formal de incidente/crisis: rol, hora y justificación.'),
    OBJ('TT-02', 'Escalamiento', 'Origen, destino, momento, reconocimiento y acción posterior.'),
    OBJ('TT-03', 'Convocatoria y coordinación ejecutiva', 'Roles convocados, responsabilidades y coordinación observable.'),
    OBJ('TT-04', 'Priorización de decisiones', 'Alternativas, justificación, impacto aceptado y latencia.'),
    OBJ('TT-05', 'Riesgo legal y regulatorio', 'Decisiones, condiciones, destinatarios y tiempos.'),
    OBJ('TT-06', 'Comunicación de crisis', 'Audiencia, responsable, momento y criterio de comunicación.'),
    OBJ('TT-07', 'Impacto financiero y reputacional', 'Consideración explícita del impacto al decidir.'),
    OBJ('TT-08', 'Contención', 'Decisiones para limitar alcance o impacto.'),
    OBJ('TT-09', 'Recuperación del incidente', 'Criterios y responsables para restaurar/cerrar la crisis.'),
    OBJ('TT-10', 'Calidad de información técnica', 'Suficiencia, claridad y oportunidad de la información para decidir.'),
  ],
  fases: [
    { id: FASES.DETECCION, orden: 1, nombre: 'Detección', descripcion: 'Reconocer la situación.' },
    { id: FASES.ACTIVACION, orden: 2, nombre: 'Activación', descripcion: 'Declaración, escalamiento y convocatoria.' },
    { id: FASES.CONTENCION, orden: 3, nombre: 'Contención', descripcion: 'Decisiones para limitar alcance o impacto.' },
    { id: FASES.CRISIS, orden: 4, nombre: 'Crisis', descripcion: 'Presión legal, regulatoria y externa.' },
    { id: FASES.RECUPERACION, orden: 5, nombre: 'Recuperación', descripcion: 'Criterios y condiciones de cierre.' },
  ],
  roles: [
    { id: ROLES.DG, nombre: 'Dirección General', orden: 1, responsabilidades_declaradas: 'Decisión ejecutiva final, aceptación de impacto al negocio y conducción de la crisis.' },
    { id: ROLES.CISO, nombre: 'CISO', orden: 2, responsabilidades_declaradas: 'Evaluación técnica del incidente, recomendación de contención y escalamiento oportuno.' },
    { id: ROLES.TI, nombre: 'Dirección de TI / Operación tecnológica', orden: 3, responsabilidades_declaradas: 'Operación de sistemas, ejecución de medidas técnicas y continuidad de servicios.' },
    { id: ROLES.LEGAL, nombre: 'Legal y Cumplimiento', orden: 4, responsabilidades_declaradas: 'Riesgo legal y regulatorio, notificaciones a autoridades y condiciones de comunicación.' },
    { id: ROLES.COM, nombre: 'Comunicación corporativa', orden: 5, responsabilidades_declaradas: 'Comunicación interna y externa, manejo de medios y mensajes autorizados.' },
    { id: ROLES.OPS, nombre: 'Operación comercial / Tiendas', orden: 6, responsabilidades_declaradas: 'Continuidad de la operación comercial y atención a clientes en piso.' },
    { id: ROLES.FIN, nombre: 'Finanzas', orden: 7, responsabilidades_declaradas: 'Dimensionamiento del impacto financiero y autorización de gasto de respuesta.' },
    { id: ROLES.RH, nombre: 'Recursos Humanos', orden: 8, responsabilidades_declaradas: 'Comunicación al personal y gestión de personas durante la crisis.' },
  ],
  inyecciones: [
    iny(
      'INY-01', FASES.DETECCION, 'principal',
      'Evidencia derivada de la emulación',
      'El equipo de monitoreo reporta actividad anómala consistente con los hallazgos de la emulación: ' +
        'autenticaciones inusuales fuera de horario sobre una cuenta con privilegios y movimiento lateral ' +
        'hacia servidores de aplicaciones internas. La información disponible es parcial y no está confirmada.',
      {
        fuente: 'emulacion',
        evidencia_origen_ref: 'EMU-2026-HALLAZGO-03',
        severidad_disenada: 'media',
        objetivo_ids: ['tt-01', 'tt-02', 'tt-10'],
        respuesta_esperada_rol_ids: [ROLES.CISO, ROLES.TI],
        alternativas: ['Tratar como alerta y seguir monitoreando', 'Declarar incidente de seguridad', 'Solicitar confirmación técnica antes de actuar'],
      },
    ),
    iny(
      'INY-02', FASES.ACTIVACION, 'principal',
      'Expansión del contexto',
      'Nueva evidencia confirma acceso no autorizado a más de un sistema. Hay indicios de que el adversario ' +
        'sigue activo. La operación comercial funciona con normalidad, pero el alcance real se desconoce. ' +
        '¿Se declara formalmente el incidente y se activa la estructura ejecutiva de crisis? (Puerta A)',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-01', 'tt-03'],
        respuesta_esperada_rol_ids: [ROLES.DG, ROLES.CISO],
        alternativas: ['Declarar crisis y convocar al comité ejecutivo', 'Mantener gestión como incidente técnico', 'Convocar solo a un grupo reducido'],
        ventana_decision_seg: 600,
        consecuencias: [
          { id: 'iny-02-a', etiqueta: 'A · Se declara la crisis y se activa la estructura', activa_inyeccion_ids: [] },
          { id: 'iny-02-b', etiqueta: 'B · Se mantiene como incidente técnico', activa_inyeccion_ids: ['iny-12'] },
        ],
      },
    ),
    iny(
      'INY-03', FASES.CONTENCION, 'principal',
      'Riesgo sobre objetivo crítico',
      'El equipo técnico identifica que el adversario podría alcanzar la plataforma que sostiene ventas y ' +
        'facturación. Contener implica aislar servicios con impacto directo en la operación comercial. ' +
        '¿Se autoriza una medida de contención con impacto potencial al negocio? (Puerta B)',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-04', 'tt-07', 'tt-08'],
        respuesta_esperada_rol_ids: [ROLES.DG, ROLES.CISO, ROLES.OPS, ROLES.FIN],
        alternativas: ['Autorizar contención inmediata', 'Diferir contención a horario de menor impacto', 'Solicitar más información antes de decidir'],
        ventana_decision_seg: 600,
        consecuencias: [
          { id: 'iny-03-a', etiqueta: 'A · Se autoriza la contención', activa_inyeccion_ids: ['iny-13'] },
          { id: 'iny-03-b', etiqueta: 'B · Se difiere la contención', activa_inyeccion_ids: ['iny-14'] },
          { id: 'iny-03-c', etiqueta: 'C · Se solicita más información', activa_inyeccion_ids: ['iny-04'] },
        ],
      },
    ),
    iny(
      'INY-04', FASES.CONTENCION, 'informacion_tecnica',
      'Información técnica incompleta o contradictoria',
      'Dos reportes técnicos se contradicen: uno indica que el acceso fue contenido; otro muestra actividad ' +
        'posterior del adversario. No es posible confirmar cuál es correcto en este momento. Decidan con la ' +
        'información disponible.',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-10', 'tt-02'],
        respuesta_esperada_rol_ids: [ROLES.CISO, ROLES.TI],
      },
    ),
    iny(
      'INY-05', FASES.CRISIS, 'presion_legal',
      'Posible afectación a información de clientes',
      'Se identifica que uno de los sistemas alcanzados almacena datos personales de clientes del programa de ' +
        'lealtad. No hay confirmación de extracción. Existen obligaciones regulatorias con plazos definidos.',
      {
        severidad_disenada: 'critica',
        objetivo_ids: ['tt-05', 'tt-04'],
        audiencia_rol_ids: [ROLES.LEGAL, ROLES.DG, ROLES.CISO],
        visible_en_sala: false,
        respuesta_esperada_rol_ids: [ROLES.LEGAL],
        alternativas: ['Notificar a la autoridad de inmediato', 'Preparar notificación y esperar confirmación técnica', 'Documentar y evaluar con evidencia adicional'],
      },
    ),
    iny(
      'INY-06', FASES.CRISIS, 'presion_externa',
      'Presión externa — medio de comunicación',
      'Un medio nacional contacta a Comunicación: afirma tener conocimiento de "una falla mayor de sistemas" ' +
        'y publicará en 45 minutos, con o sin postura oficial. ¿Qué se comunica externamente y con qué nivel ' +
        'de certeza? (Puerta C)',
      {
        severidad_disenada: 'critica',
        objetivo_ids: ['tt-06', 'tt-07'],
        audiencia_rol_ids: [ROLES.COM, ROLES.DG, ROLES.LEGAL],
        visible_en_sala: false,
        respuesta_esperada_rol_ids: [ROLES.COM],
        alternativas: ['Emitir postura oficial acotada', 'No emitir postura por ahora', 'Solicitar tiempo al medio y preparar mensaje'],
        ventana_decision_seg: 300,
      },
    ),
    iny(
      'INY-07', FASES.CRISIS, 'presion_reputacional',
      'Consecuencia financiera y reputacional',
      'La medida de contención y la cobertura mediática generan afectación a ventas en canales digitales y ' +
        'dudas de socios comerciales. Finanzas presenta un primer dimensionamiento del impacto. Se requiere ' +
        'priorización ejecutiva: qué se protege primero y qué impacto se acepta.',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-07', 'tt-04'],
        respuesta_esperada_rol_ids: [ROLES.DG, ROLES.FIN],
      },
    ),
    iny(
      'INY-08', FASES.RECUPERACION, 'principal',
      'Condiciones para restablecer y cerrar',
      'El equipo técnico reporta que el acceso del adversario fue revocado y los sistemas pueden restablecerse ' +
        'por etapas. ¿Qué condiciones deben cumplirse para iniciar la recuperación y declarar el cierre de la ' +
        'crisis? Definan criterios, responsables y riesgo residual aceptado. (Puerta D)',
      {
        severidad_disenada: 'media',
        objetivo_ids: ['tt-09', 'tt-04'],
        respuesta_esperada_rol_ids: [ROLES.DG, ROLES.CISO, ROLES.TI],
        alternativas: ['Restablecer por etapas con verificación', 'Restablecer todo de inmediato', 'Mantener contención hasta verificación completa'],
        ventana_decision_seg: 600,
        consecuencias: [
          { id: 'iny-08-a', etiqueta: 'A · Recuperación por etapas con verificación', activa_inyeccion_ids: [] },
          { id: 'iny-08-b', etiqueta: 'B · Restablecimiento inmediato', activa_inyeccion_ids: [] },
        ],
      },
    ),
    // Inyecciones dirigidas (información asimétrica — SPEC s.18, s.22)
    iny(
      'INY-09', FASES.CONTENCION, 'dirigida',
      'Reporte de tienda insignia',
      'La gerencia de la tienda insignia reporta intermitencia en cobro con tarjeta y filas crecientes. ' +
        'El personal pregunta qué decir a los clientes.',
      {
        severidad_disenada: 'media',
        objetivo_ids: ['tt-02', 'tt-03'],
        audiencia_rol_ids: [ROLES.OPS],
        visible_en_sala: false,
        respuesta_esperada_rol_ids: [ROLES.OPS],
      },
    ),
    iny(
      'INY-10', FASES.CRISIS, 'dirigida',
      'Nueva evidencia técnica para el CISO',
      'El equipo forense entrega al CISO evidencia preliminar de herramientas de exfiltración en un servidor ' +
        'alcanzado. Aún no se confirma extracción de datos. Esta información no la tiene nadie más.',
      {
        severidad_disenada: 'critica',
        objetivo_ids: ['tt-02', 'tt-10'],
        audiencia_rol_ids: [ROLES.CISO],
        visible_en_sala: false,
        respuesta_esperada_rol_ids: [ROLES.CISO],
      },
    ),
    iny(
      'INY-11', FASES.CRISIS, 'dirigida',
      'Pregunta del personal',
      'Colaboradores comparten en grupos internos capturas de pantalla sobre "sistemas caídos" y preguntan ' +
        'si hay riesgo para su información. RH debe decidir qué y cuándo comunicar internamente.',
      {
        severidad_disenada: 'media',
        objetivo_ids: ['tt-06'],
        audiencia_rol_ids: [ROLES.RH, ROLES.COM],
        visible_en_sala: false,
        respuesta_esperada_rol_ids: [ROLES.RH],
      },
    ),
    iny(
      'SALTO-01', FASES.CRISIS, 'salto_temporal',
      'Salto temporal: +12 horas',
      'La narrativa avanza 12 horas: es la mañana siguiente. La cobertura mediática creció durante la noche ' +
        'y la operación abre tiendas en 2 horas.',
      {
        severidad_disenada: 'media',
        objetivo_ids: ['tt-04'],
        ventana_decision_seg: null,
        respuesta_esperada_rol_ids: [],
        salto_narrativo_seg: 12 * 3600,
      },
    ),
    // Consecuencias (s.17): quedan preparadas al seleccionar una rama.
    iny(
      'INY-12', FASES.ACTIVACION, 'consecuencia',
      'El incidente escala sin estructura activada',
      'Al mantenerse la gestión como incidente técnico, nuevas áreas reportan afectación sin un canal ' +
        'ejecutivo claro. Se duplican esfuerzos y se pierde tiempo en coordinación informal.',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-03', 'tt-01'],
        respuesta_esperada_rol_ids: [ROLES.DG],
      },
    ),
    iny(
      'INY-13', FASES.CONTENCION, 'consecuencia',
      'La contención afecta la operación comercial',
      'La medida de contención autorizada deja fuera de línea el cobro con tarjeta en tiendas. Operación ' +
        'reporta filas y quejas; se requiere decidir cómo se sostiene la venta mientras dura la contención.',
      {
        severidad_disenada: 'alta',
        objetivo_ids: ['tt-07', 'tt-08'],
        respuesta_esperada_rol_ids: [ROLES.OPS, ROLES.FIN],
      },
    ),
    iny(
      'INY-14', FASES.CONTENCION, 'consecuencia',
      'El adversario avanza durante la espera',
      'Al diferirse la contención, el monitoreo detecta actividad del adversario sobre un sistema adicional. ' +
        'La ventana de oportunidad se está cerrando.',
      {
        severidad_disenada: 'critica',
        objetivo_ids: ['tt-08', 'tt-04'],
        respuesta_esperada_rol_ids: [ROLES.CISO, ROLES.DG],
      },
    ),
  ],
}
