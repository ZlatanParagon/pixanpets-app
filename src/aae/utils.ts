/** "$349 USD" — the app prices everything in dollars, like the plans do. */
export function usd(n: number): string {
  return '$' + n.toLocaleString('en-US') + ' USD'
}

/** Seconds as "1:04:22" (or "4:22" under an hour) for the exam timer. */
export function clock(total: number): string {
  const s = Math.max(0, Math.floor(total))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return (h > 0 ? `${h}:` : '') + `${mm}:${String(sec).padStart(2, '0')}`
}

/** "3 h 20 min" — study time on the dashboard. */
export function hours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0
  return Math.round((part / whole) * 100)
}

/** "14 sep" for attempt stamps — the app runs in es-MX. */
export function today(): string {
  return new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace('.', '')
}
