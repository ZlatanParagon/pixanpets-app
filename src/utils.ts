/** "$1,067.00" — Mexican peso formatting, matching the prototype. */
export function money(n: number): string {
  return (
    '$' +
    n.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}
