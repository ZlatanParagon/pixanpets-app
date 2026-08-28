import type { Level, Module } from '../types'

/**
 * Ruta completa de ISO 9001. El Nivel 1 es gratuito y sirve de gancho; el
 * Nivel 2 se desbloquea con la compra. Los minutos alimentan el tiempo de
 * estudio del dashboard, así que reflejan la duración real del contenido.
 */
export const MODULES: Module[] = [
  {
    id: 'f1',
    level: 1,
    title: 'Qué es un sistema de gestión de calidad',
    summary: 'Para qué sirve un SGC y qué problema resuelve en la operación real.',
    topic: 'Contexto y liderazgo',
    lessons: [
      {
        id: 'f1l1',
        title: 'El SGC en cinco minutos',
        min: 6,
        kind: 'video',
        points: [
          'Un SGC es la forma en que una organización asegura, de manera repetible, que entrega lo que prometió.',
          'No es papelería: es el conjunto de procesos, controles y evidencias que sostienen esa promesa.',
          'ISO 9001 es el modelo de referencia más usado del mundo para construirlo y auditarlo.',
        ],
      },
      {
        id: 'f1l2',
        title: 'Contexto y partes interesadas',
        min: 8,
        kind: 'video',
        points: [
          'La cláusula 4.1 pide determinar las cuestiones internas y externas que afectan al SGC.',
          'La 4.2 pide identificar partes interesadas pertinentes y sus requisitos, y darles seguimiento.',
          'Pertinente no es "todas": es aquellas cuyo requisito puede afectar la conformidad del producto o servicio.',
        ],
      },
      {
        id: 'f1l3',
        title: 'Qué cambió en la versión 2015',
        min: 5,
        kind: 'infografía',
        points: [
          'Desaparecen el manual de calidad obligatorio y el representante de la dirección.',
          'Aparecen el pensamiento basado en riesgos y el análisis del contexto.',
          'Los documentos y registros se unifican bajo "información documentada".',
        ],
      },
      {
        id: 'f1l4',
        title: 'Liderazgo: qué se le pide a la dirección',
        min: 7,
        kind: 'video',
        points: [
          'La alta dirección rinde cuentas de la eficacia del SGC: no puede delegarla en el área de calidad.',
          'Debe asegurar que la política y los objetivos sean compatibles con la estrategia del negocio.',
          'En auditoría, esto se verifica con evidencia de decisiones, no con declaraciones de buena voluntad.',
        ],
      },
    ],
    quiz: ['q01', 'q02', 'q03', 'q04'],
  },
  {
    id: 'f2',
    level: 1,
    title: 'Recorrido por ISO 9001:2015',
    summary: 'Las cláusulas 4 a 10 explicadas como un ciclo, no como una lista.',
    topic: 'Planificación y riesgos',
    lessons: [
      {
        id: 'f2l1',
        title: 'La estructura de alto nivel',
        min: 7,
        kind: 'video',
        points: [
          'Las cláusulas 4 a 10 siguen el ciclo Planear–Hacer–Verificar–Actuar.',
          'Planear: 4, 5 y 6. Hacer: 7 y 8. Verificar: 9. Actuar: 10.',
          'Esa misma estructura la comparten ISO 14001, 45001 y 27001: aprenderla una vez sirve para todas.',
        ],
      },
      {
        id: 'f2l2',
        title: 'Riesgos, oportunidades y objetivos',
        min: 9,
        kind: 'video',
        points: [
          'La norma pide determinar riesgos y oportunidades y planificar acciones proporcionales.',
          'No exige matriz, mapa de calor ni ISO 31000: exige evidencia de que se pensó y se actuó.',
          'Los objetivos de calidad deben ser medibles, comunicados y objeto de seguimiento.',
        ],
      },
      {
        id: 'f2l3',
        title: 'Evaluación del desempeño y mejora',
        min: 8,
        kind: 'lectura',
        points: [
          'La cláusula 9 agrupa seguimiento y medición, auditoría interna y revisión por la dirección.',
          'La 10 cierra el ciclo: no conformidad, acción correctiva y mejora continua.',
          'La revisión por la dirección tiene entradas y salidas obligatorias: memorízalas, caen en el examen.',
        ],
      },
    ],
    quiz: ['q05', 'q06', 'q08', 'q30'],
  },
  {
    id: 'f3',
    level: 1,
    title: 'El ciclo de una auditoría interna',
    summary: 'De la programación anual al seguimiento de acciones, paso a paso.',
    topic: 'Proceso de auditoría',
    lessons: [
      {
        id: 'f3l1',
        title: 'Programa, plan y alcance',
        min: 8,
        kind: 'video',
        points: [
          'El programa es anual y cubre todo el SGC; el plan es de una auditoría concreta.',
          'El programa considera importancia de los procesos, cambios y resultados previos.',
          'Alcance, criterios y objetivos se definen antes de pisar el área auditada.',
        ],
      },
      {
        id: 'f3l2',
        title: 'Apertura, ejecución y cierre',
        min: 9,
        kind: 'video',
        points: [
          'La apertura confirma plan, alcance, criterios, método y canales de comunicación.',
          'La ejecución recolecta evidencia verificable por entrevista, observación y revisión documental.',
          'El cierre presenta hallazgos y conclusiones y explica el seguimiento; no negocia calificaciones.',
        ],
      },
      {
        id: 'f3l3',
        title: 'Informe y seguimiento',
        min: 6,
        kind: 'infografía',
        points: [
          'El informe es el entregable formal: alcance, criterios, hallazgos, conclusión.',
          'Las acciones correctivas las define el auditado; el auditor verifica su eficacia.',
          'La auditoría no termina en el informe, termina cuando la causa fue eliminada.',
        ],
      },
    ],
    quiz: ['q09', 'q10', 'q11', 'q13'],
  },
  {
    id: 'f4',
    level: 1,
    title: 'Vocabulario del auditor',
    summary: 'Evidencia, hallazgo, conformidad, corrección: las palabras que sí importan.',
    topic: 'Evidencia y muestreo',
    lessons: [
      {
        id: 'f4l1',
        title: 'Glosario esencial',
        min: 6,
        kind: 'lectura',
        points: [
          'Evidencia objetiva: registros, declaraciones y hechos verificables.',
          'Hallazgo: resultado de comparar la evidencia contra los criterios.',
          'Corrección elimina el desvío; acción correctiva elimina su causa.',
        ],
      },
      {
        id: 'f4l2',
        title: 'Conformidad, no conformidad y observación',
        min: 7,
        kind: 'video',
        points: [
          'Si hay requisito incumplido, es no conformidad, sin importar el tamaño.',
          'Mayor: ausencia total del requisito o falla sistémica; menor: desvío aislado.',
          'La observación y la oportunidad de mejora no tienen requisito incumplido detrás.',
        ],
      },
      {
        id: 'f4l3',
        title: 'Caso introductorio resuelto',
        min: 10,
        kind: 'caso',
        points: [
          'Un registro de capacitación sin evidencia de evaluación de eficacia: ¿mayor, menor u OM?',
          'Se contrasta contra 7.2 d) y se revisa si el patrón se repite en otros expedientes.',
          'Resultado: no conformidad menor, con evidencia citada y muestra documentada.',
        ],
      },
    ],
    quiz: ['q14', 'q16', 'q18', 'q28'],
  },

  {
    id: 'a1',
    level: 2,
    title: 'Programa de auditoría con ISO 19011',
    summary: 'Diseñar un programa defendible y planes que se sostengan en campo.',
    topic: 'Proceso de auditoría',
    lessons: [
      {
        id: 'a1l1',
        title: 'Riesgos del programa de auditoría',
        min: 14,
        kind: 'video',
        points: [
          'ISO 19011 pide gestionar los riesgos del propio programa: recursos, competencia, acceso, imparcialidad.',
          'Un programa que nunca toca los procesos críticos es un hallazgo de la auditoría de certificación.',
          'La frecuencia se justifica con criterios: criticidad, cambios, desempeño e historial.',
        ],
      },
      {
        id: 'a1l2',
        title: 'Competencia y selección del equipo auditor',
        min: 12,
        kind: 'video',
        points: [
          'La competencia se demuestra con formación, experiencia y desempeño evaluado.',
          'El auditor líder distribuye por proceso, no por simpatía o disponibilidad.',
          'El conflicto de interés se declara antes, no se descubre en la reunión de cierre.',
        ],
      },
      {
        id: 'a1l3',
        title: 'Del plan a la lista de verificación',
        min: 16,
        kind: 'caso',
        points: [
          'La lista de verificación es una guía viva, no un cuestionario que se llena a ciegas.',
          'Cada línea nace de un requisito y anticipa qué evidencia lo demostraría.',
          'Deja espacio para seguir el hilo cuando la respuesta abre una pregunta nueva.',
        ],
      },
    ],
    quiz: ['q08', 'q09', 'q10', 'q11', 'q13'],
  },
  {
    id: 'a2',
    level: 2,
    title: 'Riesgos y oportunidades en la práctica',
    summary: 'Cómo auditar la cláusula 6 sin exigir metodologías que la norma no pide.',
    topic: 'Planificación y riesgos',
    lessons: [
      {
        id: 'a2l1',
        title: 'Qué evidencia demuestra pensamiento basado en riesgos',
        min: 13,
        kind: 'video',
        points: [
          'Actas, decisiones, controles añadidos y cambios de proceso valen más que una matriz sin uso.',
          'La pregunta clave: ¿qué hicieron distinto por haber identificado ese riesgo?',
          'Exigir una metodología concreta es el error más frecuente en esta cláusula.',
        ],
      },
      {
        id: 'a2l2',
        title: 'Objetivos de calidad que sí se pueden auditar',
        min: 11,
        kind: 'video',
        points: [
          'Medible, con responsable, con plazo y con seguimiento documentado.',
          'Un objetivo sin datos de seguimiento es una no conformidad en 6.2.1.',
          'Comprueba la coherencia entre política, objetivos y estrategia declarada.',
        ],
      },
      {
        id: 'a2l3',
        title: 'Cambios planificados: 6.3 frente a 8.5.6',
        min: 12,
        kind: 'lectura',
        points: [
          'La 6.3 cubre cambios en el SGC; la 8.5.6, cambios en producción o servicio.',
          'Confundirlas es un clásico de examen: identifica siempre qué cambió y dónde.',
          'La evidencia esperada: análisis de consecuencias, recursos y responsabilidades.',
        ],
      },
    ],
    quiz: ['q05', 'q06', 'q07', 'q27', 'q30'],
  },
  {
    id: 'a3',
    level: 2,
    title: 'Entrevista y muestreo',
    summary: 'Preguntar para obtener evidencia, y decidir cuánto revisar.',
    topic: 'Conducta del auditor',
    lessons: [
      {
        id: 'a3l1',
        title: 'La pregunta abierta y el silencio',
        min: 14,
        kind: 'video',
        points: [
          '"Muéstrame cómo lo haces" produce más evidencia que veinte preguntas de sí/no.',
          'El silencio después de la respuesta suele traer el dato que faltaba.',
          'Nunca preguntes por personas: pregunta por procesos y registros.',
        ],
      },
      {
        id: 'a3l2',
        title: 'Tamaño y selección de la muestra',
        min: 13,
        kind: 'video',
        points: [
          'La muestra se documenta: universo, criterio de selección, elementos revisados.',
          'Muestreo dirigido para riesgo alto; aleatorio para verificar consistencia.',
          'Un hallazgo en la muestra obliga a preguntarse si el patrón es sistémico.',
        ],
      },
      {
        id: 'a3l3',
        title: 'Trazabilidad hacia atrás y hacia adelante',
        min: 15,
        kind: 'caso',
        points: [
          'Hacia atrás: del producto entregado a los registros que debieron generarlo.',
          'Hacia adelante: del requisito del cliente a la evidencia de su cumplimiento.',
          'Ambas rutas exponen eslabones sin control mucho más rápido que revisar carpetas.',
        ],
      },
    ],
    quiz: ['q14', 'q15', 'q16', 'q17', 'q23'],
  },
  {
    id: 'a4',
    level: 2,
    title: 'Evidencia objetiva',
    summary: 'Qué se acepta, qué se descarta y cómo se registra en campo.',
    topic: 'Evidencia y muestreo',
    lessons: [
      {
        id: 'a4l1',
        title: 'Verificable o no es evidencia',
        min: 12,
        kind: 'video',
        points: [
          'Registro, observación directa y declaración concreta y contrastable.',
          'Una afirmación general ("siempre lo hacemos") no sostiene ni un hallazgo ni una conformidad.',
          'Anota identificadores: número de registro, fecha, versión, responsable del proceso.',
        ],
      },
      {
        id: 'a4l2',
        title: 'Notas de campo que sobreviven al informe',
        min: 11,
        kind: 'lectura',
        points: [
          'Escribe la evidencia en el momento; la memoria del tercer día ya no es evidencia.',
          'Separa hecho, criterio y valoración desde la nota, no al redactar.',
          'Si la nota no permite reconstruir el hallazgo tres semanas después, está incompleta.',
        ],
      },
      {
        id: 'a4l3',
        title: 'La corrección inmediata durante la auditoría',
        min: 10,
        kind: 'caso',
        points: [
          'Corregir en el momento no borra lo ocurrido: el hallazgo se registra igual.',
          'La corrección se documenta como acción tomada, con su propia evidencia.',
          'Ceder aquí compromete la imparcialidad de todo el informe.',
        ],
      },
    ],
    quiz: ['q12', 'q14', 'q15', 'q16', 'q17'],
  },
  {
    id: 'a5',
    level: 2,
    title: 'Redacción de hallazgos',
    summary: 'Requisito, evidencia y declaración: la fórmula que resiste la revisión.',
    topic: 'Hallazgos y no conformidades',
    lessons: [
      {
        id: 'a5l1',
        title: 'La fórmula de tres partes',
        min: 13,
        kind: 'video',
        points: [
          'Requisito incumplido + evidencia objetiva + declaración del incumplimiento.',
          'Sin causa raíz y sin acción propuesta: eso le toca al auditado.',
          'Sin nombres de personas: el hallazgo es del proceso, no del operador.',
        ],
      },
      {
        id: 'a5l2',
        title: 'Mayor, menor u oportunidad de mejora',
        min: 14,
        kind: 'video',
        points: [
          'Mayor: requisito ausente por completo o falla sistémica que compromete el SGC.',
          'Menor: desvío aislado que no compromete la capacidad del sistema.',
          'OM: no hay requisito incumplido; se registra aparte para no diluir el informe.',
        ],
      },
      {
        id: 'a5l3',
        title: 'Taller: reescribe cinco hallazgos débiles',
        min: 18,
        kind: 'caso',
        points: [
          '"Falta orden en almacén" no cita criterio ni evidencia: no es un hallazgo.',
          'Cada reescritura debe permitir que un tercero verifique el incumplimiento.',
          'Compara tu redacción con la versión del instructor al final del taller.',
        ],
      },
    ],
    quiz: ['q18', 'q19', 'q20', 'q21', 'q22'],
  },
  {
    id: 'a6',
    level: 2,
    title: 'Informe y reunión de cierre',
    summary: 'Comunicar resultados sin perder el control de la sala.',
    topic: 'Proceso de auditoría',
    lessons: [
      {
        id: 'a6l1',
        title: 'Estructura del informe',
        min: 12,
        kind: 'video',
        points: [
          'Objetivo, alcance, criterios, equipo, fechas, hallazgos y conclusión.',
          'La conclusión responde una pregunta: ¿el SGC es conforme y eficaz en lo auditado?',
          'Los anexos guardan la evidencia; el cuerpo se lee en diez minutos.',
        ],
      },
      {
        id: 'a6l2',
        title: 'Manejar la sala en el cierre',
        min: 13,
        kind: 'video',
        points: [
          'Presenta hallazgos en orden de importancia y con la evidencia a la mano.',
          'Las divergencias se registran; no se resuelven bajando la calificación.',
          'Cierra explicando plazos de respuesta y cómo se verificará la eficacia.',
        ],
      },
      {
        id: 'a6l3',
        title: 'Cuando el auditado presiona',
        min: 11,
        kind: 'caso',
        points: [
          'Vuelve siempre al criterio y a la evidencia: es el único terreno defendible.',
          'Si se impide el acceso a la evidencia, escálalo con el responsable del programa.',
          'Un informe negociado pierde valor para la dirección y para la certificación.',
        ],
      },
    ],
    quiz: ['q10', 'q12', 'q21', 'q22', 'q32'],
  },
  {
    id: 'a7',
    level: 2,
    title: 'Causa raíz y acciones correctivas',
    summary: 'Del "descuido del operador" a la falla real del sistema.',
    topic: 'Mejora y seguimiento',
    lessons: [
      {
        id: 'a7l1',
        title: 'Reaccionar antes de analizar',
        min: 11,
        kind: 'video',
        points: [
          'La 10.2.1 exige primero controlar, corregir y afrontar las consecuencias.',
          'Después se evalúa si hace falta eliminar la causa para que no se repita.',
          'Saltarse la reacción es un hallazgo frecuente en auditorías de seguimiento.',
        ],
      },
      {
        id: 'a7l2',
        title: 'Cinco porqués y espina de pescado',
        min: 15,
        kind: 'video',
        points: [
          'La causa raíz explica por qué el sistema permitió el error, no quién lo cometió.',
          'Si la respuesta es "falta de atención", el análisis se detuvo demasiado pronto.',
          'Una buena causa raíz sugiere por sí sola qué control faltaba.',
        ],
      },
      {
        id: 'a7l3',
        title: 'Verificar la eficacia',
        min: 12,
        kind: 'caso',
        points: [
          'Cerrar el registro no es verificar: hace falta evidencia posterior.',
          'Define de antemano qué evidencia demostrará que la causa fue eliminada.',
          'Si la NC reaparece, la acción no fue correctiva: fue corrección disfrazada.',
        ],
      },
    ],
    quiz: ['q27', 'q28', 'q29', 'q30', 'q31'],
  },
  {
    id: 'a8',
    level: 2,
    title: 'Auditoría integral al proceso de compras',
    summary: 'Un recorrido completo, de la planeación al informe, sobre un caso real.',
    topic: 'Hallazgos y no conformidades',
    lessons: [
      {
        id: 'a8l1',
        title: 'Planeación del caso',
        min: 14,
        kind: 'caso',
        points: [
          'Alcance: evaluación, selección, reevaluación y control de proveedores externos (8.4).',
          'Criterios: la norma, el procedimiento PR-COM-01 y el contrato marco vigente.',
          'Hipótesis de riesgo: proveedores críticos sin reevaluación desde hace dos años.',
        ],
      },
      {
        id: 'a8l2',
        title: 'Ejecución y evidencia recogida',
        min: 18,
        kind: 'caso',
        points: [
          'Muestra de 8 de 214 órdenes de compra, dirigida a proveedores críticos.',
          'Tres proveedores sin criterio de evaluación documentado; dos sin reevaluación.',
          'Entrevistas cruzadas entre compras y almacén revelan un control informal no descrito.',
        ],
      },
      {
        id: 'a8l3',
        title: 'Hallazgos e informe final',
        min: 16,
        kind: 'caso',
        points: [
          'Una no conformidad mayor por ausencia de criterios de evaluación (8.4.1).',
          'Dos menores por registros incompletos y por control no descrito en el procedimiento.',
          'Conclusión: el proceso es conforme en compras operativas, no en proveedores críticos.',
        ],
      },
    ],
    quiz: ['q12', 'q15', 'q19', 'q21', 'q24'],
  },
]

export const BY_LEVEL: Record<Level, Module[]> = {
  1: MODULES.filter((m) => m.level === 1),
  2: MODULES.filter((m) => m.level === 2),
  3: [],
}

export function moduleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}

export function lessonById(id: string) {
  for (const m of MODULES) {
    const l = m.lessons.find((x) => x.id === id)
    if (l) return { module: m, lesson: l }
  }
  return undefined
}

/** Minutos totales de un nivel — el "2–4 h" y "8–15 h" que promete la ficha. */
export function levelMinutes(level: Level): number {
  return BY_LEVEL[level].reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.min, 0),
    0,
  )
}
