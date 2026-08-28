// Rate limiting simple en memoria (SPEC s.27). En serverless el mapa es por
// instancia: suficiente para frenar fuerza bruta/enumeración en v1; para un
// límite global se integraría un almacén compartido (p. ej. Upstash) después.

const buckets = new Map<string, { count: number; reset: number }>()

export function rateLimit(clave: string, max: number, ventanaSeg: number): boolean {
  const ahora = Date.now()
  const b = buckets.get(clave)
  if (!b || b.reset < ahora) {
    buckets.set(clave, { count: 1, reset: ahora + ventanaSeg * 1000 })
    return true
  }
  b.count += 1
  return b.count <= max
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'local'
}
