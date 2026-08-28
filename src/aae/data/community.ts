import type { Thread } from '../types'

export const THREAD_TOPICS = ['Todos', 'Norma', 'Examen', 'Práctica', 'Graduados'] as const

export const THREADS: Thread[] = [
  {
    id: 't1',
    topic: 'Examen',
    title: '¿Cuántos simuladores hicieron antes de presentar?',
    author: 'Mariana R.',
    initials: 'MR',
    when: 'hace 2 h',
    level: 1,
    body: 'Llevo dos simuladores completos con 68 % y 74 %. ¿Ustedes esperaron a estar arriba de 80 % o presentaron con 75 %?',
    replies: [
      {
        author: 'Instructor Julián O.',
        initials: 'JO',
        when: 'hace 1 h',
        staff: true,
        body: 'La recomendación de AAE es presentar con dos simuladores consecutivos arriba de 80 % y sin ningún tema por debajo de 60 %. El examen certificador tiene la misma distribución de temas que el simulador, así que un tema débil pesa más de lo que parece.',
      },
      {
        author: 'Diego S.',
        initials: 'DS',
        when: 'hace 40 min',
        body: 'Yo presenté con 78 % de promedio y pasé, pero sufrí en redacción de hallazgos. Si te pasa como a mí, dedícale el taller del módulo A5 completo.',
      },
    ],
  },
  {
    id: 't2',
    topic: 'Norma',
    title: 'Cambio en el SGC: ¿6.3 o 8.5.6?',
    author: 'Paula G.',
    initials: 'PG',
    when: 'hace 5 h',
    level: 1,
    body: 'Cambiaron el proveedor de un insumo crítico y también el procedimiento de recepción. ¿Eso se audita contra 6.3 o contra 8.5.6? Me sigo confundiendo.',
    replies: [
      {
        author: 'Instructor Julián O.',
        initials: 'JO',
        when: 'hace 4 h',
        staff: true,
        body: 'Pregúntate qué cambió. Si cambió una parte del sistema de gestión (un procedimiento, una responsabilidad, un proceso), es 6.3. Si cambió algo dentro de la producción o prestación del servicio ya en marcha, es 8.5.6. En tu caso hay las dos cosas: el cambio de procedimiento va por 6.3 y el control del insumo por 8.4 y 8.5.6.',
      },
      {
        author: 'Rafa M.',
        initials: 'RM',
        when: 'hace 2 h',
        body: 'Este ejemplo debería estar en el módulo A2, me habría ahorrado una discusión con mi auditor líder.',
      },
    ],
  },
  {
    id: 't3',
    topic: 'Práctica',
    title: 'Cómo documentan la muestra en campo',
    author: 'Ana Sofía L.',
    initials: 'AL',
    when: 'ayer',
    level: 1,
    body: 'Me cuesta dejar registrada la muestra de forma que se entienda tres semanas después. ¿Tienen algún formato o truco?',
    replies: [
      {
        author: 'Carlos V.',
        initials: 'CV',
        when: 'ayer',
        body: 'Yo anoto siempre cuatro cosas: universo, criterio de selección, identificadores exactos y qué esperaba encontrar. Si falta cualquiera de las cuatro, el hallazgo se cae en la revisión.',
      },
    ],
  },
  {
    id: 't4',
    topic: 'Graduados',
    title: 'Canjeé el voucher: cómo fue el proceso',
    author: 'Héctor N.',
    initials: 'HN',
    when: 'hace 3 días',
    level: 3,
    body: 'Comparto los tiempos por si le sirve a alguien: subí el certificado AAE y el voucher el lunes, me confirmaron elegibilidad en 48 h y agendé el examen de la entidad para tres semanas después. Cero fricción.',
    replies: [
      {
        author: 'Instructora Lucía P.',
        initials: 'LP',
        when: 'hace 3 días',
        staff: true,
        body: 'Gracias por documentarlo, Héctor. Recuerden que el voucher tiene 12 meses de vigencia desde su emisión y es nominativo: no se puede transferir.',
      },
    ],
  },
  {
    id: 't5',
    topic: 'Graduados',
    title: 'Mentoría grupal de octubre: temas propuestos',
    author: 'Instructora Lucía P.',
    initials: 'LP',
    when: 'hace 4 días',
    level: 3,
    body: 'Abrimos la votación para la sesión del mes: (a) auditoría remota, (b) auditar procesos de TI dentro de un SGC, (c) manejo de auditados hostiles. Comenten su preferencia.',
    replies: [
      {
        author: 'Héctor N.',
        initials: 'HN',
        when: 'hace 3 días',
        body: 'Voto por (c). Es lo que menos se practica y lo que más aparece en campo.',
      },
    ],
  },
]

export function threadById(id: string): Thread | undefined {
  return THREADS.find((t) => t.id === id)
}
