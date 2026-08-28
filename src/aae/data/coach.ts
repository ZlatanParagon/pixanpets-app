/**
 * AAE Coach. En producción esto es una llamada a la API de Claude con el
 * contexto del usuario (progreso, desempeño por tema, lección abierta); aquí
 * es un enrutador por palabra clave sobre respuestas escritas por el equipo de
 * contenido, para que el prototipo funcione sin red ni llaves.
 */
export interface CoachContext {
  /** Tema con peor desempeño, o null si aún no hay datos. */
  weak: string | null
  /** Porcentaje de acierto acumulado. */
  readiness: number
  /** Nombre de pila, para que la respuesta suene dirigida. */
  name: string
}

export const SUGGESTIONS = [
  '¿Mayor o menor?',
  'Explícame el pensamiento basado en riesgos',
  '¿Qué estudio hoy?',
  'Simula una pregunta de examen',
  'Redacta un hallazgo de ejemplo',
]

const RULES: { match: RegExp; reply: (c: CoachContext) => string }[] = [
  {
    match: /mayor|menor|calific|grave/i,
    reply: () =>
      'La calificación depende de dos preguntas. ¿El requisito está ausente por completo, o existe y se cumple parcialmente? ¿El desvío compromete la capacidad del SGC para entregar producto conforme?\n\nAusencia total o falla sistémica → mayor. Desvío aislado que el sistema todavía controla → menor. Si no hay requisito incumplido, no es no conformidad: es oportunidad de mejora, y va en una sección aparte del informe.',
  },
  {
    match: /riesgo|6\.1|oportunidad/i,
    reply: () =>
      'El pensamiento basado en riesgos de la 6.1 no exige metodología ni matriz. Exige tres cosas: que hayas determinado riesgos y oportunidades pertinentes, que hayas planificado acciones proporcionales, y que evalúes su eficacia.\n\nComo auditor, la pregunta que más evidencia produce es: "¿qué hicieron distinto por haber identificado ese riesgo?". Si la respuesta es "lo pusimos en la matriz", el control no existe.',
  },
  {
    match: /qué estudio|que estudio|recomien|siguiente|empiezo/i,
    reply: (c) =>
      c.weak
        ? `Tu punto más débil ahora mismo es ${c.weak.toLowerCase()}. Te propongo 25 minutos: repasa el módulo que cubre ese tema y luego haz 5 preguntas en modo práctica del mismo tema, con la explicación abierta después de cada una.\n\nCuando ese tema pase de 70 %, vuelve al simulador completo.`
        : `Todavía no tengo datos de desempeño tuyos, ${c.name}. Empieza por el Nivel 1: cuatro módulos cortos y sus quizzes. Con eso ya puedo decirte en qué temas conviene invertir el tiempo.`,
  },
  {
    match: /simula|pregunta de examen|examen de ejemplo/i,
    reply: () =>
      'Va una del banco:\n\n"El auditado corrige el desvío frente a ti, durante la auditoría. ¿Qué haces?"\n\na) Aceptas la corrección y no registras nada\nb) Registras el hallazgo; la corrección se documenta como acción tomada\nc) Suspendes la auditoría\nd) Lo bajas a observación\n\nPiénsala y dime tu letra; te digo por qué la respuesta correcta lo es.',
  },
  {
    match: /^b\)?$|respuesta b|opción b/i,
    reply: () =>
      'Correcto: b. El hallazgo documenta lo que ocurría al momento de la auditoría; corregirlo en el momento no borra la evidencia. La corrección se registra como acción tomada, con su propia evidencia, y el hallazgo se mantiene. Ceder aquí compromete la imparcialidad de todo el informe.',
  },
  {
    match: /redacta|hallazgo de ejemplo|cómo se escribe|como se escribe/i,
    reply: () =>
      'La fórmula son tres partes: requisito, evidencia, declaración.\n\n"No se evidenció control de la temperatura en el almacén A: los registros del formato FR-ALM-08 correspondientes al 3 al 17 de marzo se encuentran en blanco, incumpliendo el procedimiento PR-ALM-02 y la cláusula 8.5.1 de ISO 9001:2015."\n\nFíjate en lo que no aparece: ningún nombre, ninguna causa, ninguna acción propuesta. Eso le toca al auditado.',
  },
  {
    match: /listo|preparad|puedo present|cuándo present/i,
    reply: (c) =>
      `Con tu desempeño actual (${c.readiness} % de acierto acumulado), la lectura es esta: AAE recomienda presentar con dos simuladores consecutivos arriba de 80 % y ningún tema por debajo de 60 %.${c.weak ? ` Tu freno hoy es ${c.weak.toLowerCase()}.` : ''}\n\nSi estudias 4 horas por semana enfocadas en ese tema, la brecha se cierra en dos o tres semanas.`,
  },
  {
    match: /causa raíz|causa raiz|cinco porqu|acción correctiva|accion correctiva/i,
    reply: () =>
      'La causa raíz tiene que explicar por qué el sistema permitió el error. "Descuido del operador" no es causa raíz: es donde se detiene el análisis cuando se busca un culpable.\n\nPregunta útil: ¿qué control debió existir para que ese error no llegara a producto? Si tu respuesta a esa pregunta es la acción correctiva, vas bien. Y recuerda el orden de la 10.2.1: primero reaccionar y corregir, después analizar la causa.',
  },
  {
    match: /manual de calidad/i,
    reply: () =>
      'ISO 9001:2015 no exige manual de calidad ni representante de la dirección. Exige "información documentada" donde la norma lo pide explícitamente y donde la organización la considere necesaria.\n\nPedir un manual en auditoría es un error de criterio: estarías auditando contra un requisito que no existe.',
  },
  {
    match: /muestra|muestreo|cuántos registros|cuantos registros/i,
    reply: () =>
      'No hay un número mágico. Lo que se audita es que la muestra sea defendible: universo, criterio de selección, elementos revisados y qué esperabas encontrar.\n\nMuestreo dirigido cuando el riesgo es alto, aleatorio para verificar consistencia. Y si aparece un hallazgo, la pregunta inmediata es si el patrón es sistémico: ahí se amplía.',
  },
  {
    match: /voucher|certificado|credencial|linkedin/i,
    reply: () =>
      'Al aprobar el Nivel 3 recibes tres cosas: el certificado digital de AAE con QR verificable, un voucher nominativo canjeable con la entidad acreditada (12 meses de vigencia, no transferible) y la insignia para tu perfil de LinkedIn.\n\nEl certificado acredita tu formación con AAE; el voucher es lo que te abre la certificación con la entidad externa.',
  },
]

export function coachReply(text: string, ctx: CoachContext): string {
  const rule = RULES.find((r) => r.match.test(text.trim()))
  if (rule) return rule.reply(ctx)
  return `Buena pregunta, ${ctx.name}. En esta versión de demostración respondo sobre los temas del temario: calificación de hallazgos, pensamiento basado en riesgos, evidencia y muestreo, causa raíz, conducta del auditor y el proceso de certificación.\n\nPregúntame por cualquiera de ellos, o dime "¿qué estudio hoy?" y armo un plan con tu desempeño.`
}
