import type { CaseStudy } from '../types'

/** Casos documentados de auditorías reales, anonimizados. Nivel 2. */
export const CASES: CaseStudy[] = [
  {
    id: 'c1',
    title: 'El proveedor crítico que nunca se reevaluó',
    sector: 'Manufactura automotriz · 340 empleados',
    read: '12 min',
    context:
      'La planta subcontrata el tratamiento térmico de una pieza de seguridad. El procedimiento de compras exige reevaluar proveedores críticos cada año. La última reevaluación en expediente es de hace 26 meses; el proveedor sigue surtiendo semanalmente.',
    steps: [
      {
        title: '1. Fija el criterio antes de opinar',
        body: 'ISO 9001 8.4.1 exige determinar criterios para la evaluación, selección, seguimiento del desempeño y reevaluación de proveedores externos. El PR-COM-01 de la planta fija la periodicidad anual. Ambos son criterio de auditoría.',
      },
      {
        title: '2. Recoge la evidencia verificable',
        body: 'Expediente PROV-118: última reevaluación con fecha de hace 26 meses. Órdenes de compra OC-4471 a OC-4610 emitidas después de esa fecha. Correo del jefe de compras reconociendo que "se dejó de hacer por carga de trabajo".',
      },
      {
        title: '3. Decide si es sistémico',
        body: 'Se amplía la muestra a los 6 proveedores clasificados como críticos: 4 sin reevaluación vigente. El patrón deja de ser un caso aislado y pasa a ser una falla del control.',
      },
      {
        title: '4. Redacta sin adjetivos',
        body: 'Nada de "compras trabaja mal". El hallazgo cita el requisito, describe la evidencia y declara el incumplimiento. La causa y la acción las determinará el auditado.',
      },
    ],
    finding:
      'No conformidad mayor. No se realizó la reevaluación de proveedores externos críticos conforme al PR-COM-01 y a la cláusula 8.4.1: 4 de 6 proveedores críticos carecen de reevaluación vigente, con órdenes de compra emitidas en el periodo (OC-4471 a OC-4610).',
  },
  {
    id: 'c2',
    title: 'Objetivos de calidad sin datos detrás',
    sector: 'Servicios logísticos · 90 empleados',
    read: '9 min',
    context:
      'La organización presenta cinco objetivos de calidad aprobados en enero. Están comunicados, tienen responsable y meta numérica. Al pedir el seguimiento, el área entrega la misma presentación de enero: ningún dato posterior.',
    steps: [
      {
        title: '1. Distingue el requisito exacto',
        body: 'La 6.2.1 pide objetivos medibles, comunicados, actualizados y objeto de seguimiento. Aquí lo que falta no son los objetivos: es el seguimiento.',
      },
      {
        title: '2. Verifica antes de concluir',
        body: 'Se pregunta por otras fuentes: tableros, minutas de revisión por la dirección, reportes mensuales. Se revisan dos minutas: mencionan los objetivos pero sin cifras de avance.',
      },
      {
        title: '3. Califica con criterio',
        body: 'El requisito existe y se cumple parcialmente: hay objetivos, falta seguimiento. Es una no conformidad menor, no mayor, porque el sistema no queda comprometido en su conjunto.',
      },
    ],
    finding:
      'No conformidad menor. No se evidenció seguimiento de los objetivos de la calidad (cláusula 6.2.1 e): los cinco objetivos vigentes no cuentan con registros de avance posteriores a su aprobación en enero.',
  },
  {
    id: 'c3',
    title: 'La calibración que llegó tarde',
    sector: 'Laboratorio de alimentos · 45 empleados',
    read: '10 min',
    context:
      'Un termómetro usado en la liberación de lotes tiene certificado de calibración vencido hace tres meses. Se liberaron 22 lotes en ese periodo. El responsable asegura que "el equipo está bien, se comparó contra otro".',
    steps: [
      {
        title: '1. Requisito: 7.1.5.2',
        body: 'Los recursos de seguimiento y medición deben calibrarse o verificarse a intervalos especificados y conservarse la información documentada como evidencia de aptitud.',
      },
      {
        title: '2. La comparación informal no es evidencia',
        body: 'No hay registro de la comparación mencionada, ni patrón trazable, ni criterio de aceptación. Sin registro verificable, la declaración no sostiene la conformidad.',
      },
      {
        title: '3. Evalúa el impacto sobre el producto',
        body: 'La 7.1.5.2 exige determinar la validez de los resultados previos cuando el equipo se encuentra no apto. Se pregunta qué se hizo con los 22 lotes: no hay evaluación de impacto.',
      },
      {
        title: '4. Dos incumplimientos, un solo hallazgo bien escrito',
        body: 'Calibración vencida y ausencia de evaluación del impacto son el mismo requisito. Se redactan juntos, citando ambas evidencias.',
      },
    ],
    finding:
      'No conformidad mayor. El termómetro TE-07, usado en la liberación de producto, opera con calibración vencida desde hace tres meses y no se evaluó la validez de los resultados de los 22 lotes liberados en el periodo (cláusula 7.1.5.2).',
  },
  {
    id: 'c4',
    title: 'Acción correctiva que no corrigió nada',
    sector: 'Dispositivos médicos · 210 empleados',
    read: '11 min',
    context:
      'La auditoría del año pasado levantó una NC por etiquetado incorrecto. La acción correctiva registrada dice: "se capacitó al personal y se reforzó la supervisión". Este año aparecen dos casos nuevos del mismo error.',
    steps: [
      {
        title: '1. Revisa la eficacia, no el cierre',
        body: 'La 10.2.1 exige revisar la eficacia de la acción correctiva. Que el registro esté cerrado no demuestra nada por sí mismo.',
      },
      {
        title: '2. Examina el análisis de causa',
        body: 'La causa raíz declarada fue "descuido del operador". Eso culpa a una persona y no explica por qué el sistema permitió el error: no hay control de verificación en la línea.',
      },
      {
        title: '3. Contrasta con la reincidencia',
        body: 'Dos casos nuevos documentados en los reportes de no conforme NC-231 y NC-244. La reincidencia es la evidencia de que la acción no eliminó la causa.',
      },
    ],
    finding:
      'No conformidad mayor. No se evidenció la eficacia de la acción correctiva derivada del hallazgo AI-2024-06: el análisis de causa se limitó al error humano y el desvío reincidió en dos ocasiones (NC-231, NC-244), incumpliendo la cláusula 10.2.1.',
  },
]

export function caseById(id: string): CaseStudy | undefined {
  return CASES.find((c) => c.id === id)
}
