# ARSEG Tabletop v1

Producto v1 de ARSEG Tabletop (SPEC en [`../docs/tabletop/SPEC.md`](../docs/tabletop/SPEC.md)):
**Next.js 15 + PostgreSQL (Prisma) + polling en tiempo casi real**, con las tres superficies
sincronizadas entre dispositivos, autenticación ARSEG, editor de preparación (Etapa 0), RBAC e
información asimétrica aplicados en el servidor, y exportaciones D5.

El dominio (`src/domain/`) es el mismo del prototipo, con sus 27 tests. `src/store.tsx` es la capa
de transporte: API REST + polling incremental de 1.5 s (en Vercel serverless no hay WebSocket
propio; el SPEC s.26 admite esta degradación y el objetivo de <2 s se cumple).

## Desarrollo local

```bash
cd tabletop-v1
npm install
cp .env.example .env        # ajusta DATABASE_URL y AUTH_SECRET
npx prisma db push          # crea las tablas
npm run db:seed             # usuarios ARSEG + ejercicio de referencia PH
npm run dev                 # http://localhost:3000
npm test                    # tests de dominio (vitest)
npm run typecheck
```

Credenciales sembradas (cámbialas vía variables `SEED_*` antes de sembrar):

| Usuario | Correo | Contraseña | Perfil |
|---|---|---|---|
| Director de ejercicio | `director@arseg.mx` | `arseg-demo` | director |
| Observador ARSEG | `observador@arseg.mx` | `arseg-demo` | observador |

Ejercicio de referencia sembrado: código de sala `PH-CRISIS`.

## Despliegue en Vercel

1. **Base de datos**: crea un Postgres gestionado (Neon o Vercel Postgres) y copia su cadena de
   conexión (con `?sslmode=require`).
2. **Proyecto**: en Vercel, *Add New → Project* sobre este repositorio y establece
   **Root Directory = `tabletop-v1`** (framework: Next.js; el build ya ejecuta `prisma generate`).
3. **Variables de entorno** (Production): `DATABASE_URL`, `AUTH_SECRET` (largo y aleatorio, p. ej.
   `openssl rand -base64 48`) y, si quieres credenciales propias, las `SEED_*`.
4. **Esquema y semilla** (una vez, desde tu máquina, apuntando a la base de producción):
   ```bash
   DATABASE_URL="postgres://…" npx prisma db push
   DATABASE_URL="postgres://…" SEED_DIRECTOR_PASSWORD="…" SEED_OBSERVADOR_PASSWORD="…" npm run db:seed
   ```
5. Despliega. Rutas: `/` (portada), `/login` (consola ARSEG), `/entrar` y `/e/CODIGO`
   (participante, también vía QR), `/sala/CODIGO` (proyector), `/consola` (ejercicios).

## Qué aplica el servidor (no solo la UI)

- **Sesiones**: cookies HttpOnly firmadas (JWT HS256, 12 h) para ARSEG y participantes; el QR lleva
  token de sala firmado con expiración (CA-27).
- **RBAC por tipo de evento** (s.27): director todo; observador solo observaciones/vínculos;
  participante solo sus propios registros, en su propio ejercicio (CA-26).
- **Información asimétrica** (s.18): la config y los eventos se filtran por superficie — el cuerpo
  de una inyección privada nunca viaja a quien no está en su audiencia; la sala solo recibe
  contenido público; los participantes no reciben observaciones ARSEG.
- **Cronología**: append idempotente por UUID (s.25), `server_ts` y secuencia autoritativa (s.32),
  y rechazo de eventos sobre ejercicio cerrado (s.43).
- **Rate limiting** en login, check-in, consulta de salas y append (s.27).
- **Cabeceras**: CSP, nosniff, frame-ancestors, referrer-policy (next.config.ts).

## Límites conocidos del v1 (siguiente iteración)

- Offline Fase D: el cliente tolera cortes (reintenta el polling y conserva el estado en memoria),
  pero aún no hay cola IndexedDB/Service Worker para registrar sin red.
- Rate limiting en memoria por instancia (suficiente para frenar abuso; un límite global requiere
  almacén compartido).
- El PDF del paquete de evidencia se genera con la vista imprimible (`/consola/[id]/informe`);
  XLSX/ZIP pendientes.
- Purga por retención y bitácora de acceso exportable (CA-28/29) pendientes de Fase E completa.
- La latencia usa el `client_timestamp` de cada dispositivo (s.32); un sesgo de reloj extremo entre
  dispositivos puede distorsionarla.
