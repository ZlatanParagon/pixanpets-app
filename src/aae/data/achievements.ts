import type { Achievement } from '../types'

/** Los logros se evalúan en el store a partir del estado real, no se marcan a mano. */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'Primer paso', detail: 'Completaste tu primera lección.', icon: 'play', xp: 20 },
  { id: 'quiz', title: 'Sin errores', detail: 'Un quiz con puntaje perfecto.', icon: 'target', xp: 40 },
  { id: 'level1', title: 'Fundamentos completos', detail: 'Terminaste los 4 módulos del Nivel 1.', icon: 'check', xp: 120 },
  { id: 'streak3', title: 'Racha de 3 días', detail: 'Tres días seguidos estudiando.', icon: 'flame', xp: 60 },
  { id: 'sim1', title: 'Primer simulador', detail: 'Completaste un simulador de examen.', icon: 'clock', xp: 80 },
  { id: 'sim3', title: 'Listo para certificar', detail: 'Tres simuladores completos.', icon: 'shield', xp: 150 },
  { id: 'score80', title: 'Zona de aprobación', detail: 'Un simulador con 80 % o más.', icon: 'chart', xp: 100 },
  { id: 'cases', title: 'Auditor de campo', detail: 'Revisaste los cuatro casos de estudio.', icon: 'folder', xp: 90 },
  { id: 'certified', title: 'Certificado', detail: 'Aprobaste el examen del Nivel 3.', icon: 'award', xp: 300 },
]

/** Tabla de posiciones — el usuario se inserta según su XP. */
export const LEADERBOARD: { name: string; initials: string; place: string; xp: number }[] = [
  { name: 'Héctor N.', initials: 'HN', place: 'Monterrey', xp: 1840 },
  { name: 'Mariana R.', initials: 'MR', place: 'CDMX', xp: 1520 },
  { name: 'Diego S.', initials: 'DS', place: 'Guadalajara', xp: 1180 },
  { name: 'Paula G.', initials: 'PG', place: 'Querétaro', xp: 960 },
  { name: 'Ana Sofía L.', initials: 'AL', place: 'Bogotá', xp: 740 },
  { name: 'Carlos V.', initials: 'CV', place: 'Lima', xp: 520 },
  { name: 'Rafa M.', initials: 'RM', place: 'Puebla', xp: 380 },
]
