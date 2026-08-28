# ARSEG Tabletop — Arquitectura

**Fuente de requisitos:** [`SPEC.md`](SPEC.md) v0.2 (documento rector).
**Estado de esta implementación:** prototipo funcional de la **Fase A** (sección 40 del SPEC), integrado como tercera app del proyecto Vite de este repositorio.

---

## 1. Decisión de alcance de este prototipo

El SPEC describe la arquitectura de producción (Next.js + PostgreSQL + WebSocket + PWA offline).
Este repositorio es un proyecto Vite multi-app sin backend, por lo que la Fase A se implementa como
**prototipo cliente completo** que respeta el modelo de dominio, el event sourcing y las reglas de
negocio del SPEC, de forma que el dominio sea portable tal cual a la arquitectura de producción.

| Capa del SPEC | Producción (sección 30) | Este prototipo |
|---|---|---|
| Frontend | Next.js + React + TS | Vite + React + TS (`src/tabletop/`) |
| Persistencia | PostgreSQL + ORM | `localStorage` (paquete de eventos serializado) |
| Tiempo real | WebSocket | `BroadcastChannel` entre pestañas del mismo navegador |
| Offline | Service Worker + IndexedDB (Fase D) | inherente: el estado vive en el cliente |
| Auth facilitador | cuenta ARSEG | passcode local de demostración (no es seguridad real) |

**Limitación explícita:** la sincronización por `BroadcastChannel` + `localStorage` solo une
superficies abiertas en el **mismo navegador** (pestañas/ventanas distintas para participante,
facilitador y sala). El QR de check-in se genera y funciona en el mismo equipo; la sincronización
entre dispositivos requiere el backend de producción. Nada del dominio depende de esta limitación:
la capa de transporte (`store.tsx`) es el único módulo a sustituir.

## 2. Principio arquitectónico: event sourcing lógico

Conforme a las secciones 10.13, 31 y 32 del SPEC:

- **`EventoBitacora` es la fuente de verdad.** El estado de la sesión (reloj, fase, estado de
  inyecciones, participantes, decisiones) se **deriva** de la lista de eventos con un reducer puro.
- Toda acción significativa **añade** un evento; nunca se muta ni borra un evento previo.
- Cada evento lleva `id` (UUID de cliente), `client_timestamp`, `sequence` (asignada al ordenar) y
  `payload`. La fusión entre pestañas es idempotente por `id`.
- Un ejercicio `cerrado` no acepta nuevos eventos (solo lectura/exportación/auditoría).

```
config (Ejercicio, Objetivos, Fases, Roles, MSEL)   ← estático, definido en preparación
events: EventoBitacora[]                            ← append-only, fuente de verdad
estado = reduce(config, events)                     ← derivado, nunca almacenado
```

## 3. Módulos

```
src/tabletop/
  domain/            ← puro TypeScript, sin React ni I/O (regla 42.15 del SPEC)
    types.ts           entidades de la sección 10 (nombres en español, como el SPEC)
    events.ts          tipos de evento (sección 31) y fábrica de eventos
    clock.ts           reloj compartido: transcurrido, pausa, tiempo narrativo (sección 15)
    reducer.ts         proyección eventos → estado derivado
    rules.ts           reglas críticas: no respuesta (s.13), audiencia (s.18), cierre (s.43)
    export.ts          cronología CSV y paquete de evidencia JSON (s.36, Fase A: cronología)
    rules.test.ts      tests mínimos obligatorios de dominio (s.43)
  data/ph.ts         ← ejercicio de referencia El Palacio de Hierro (s.3, s.22): objetivos
                       TT-01..TT-10, 5 fases, roles ejecutivos, MSEL INY-01..INY-08
  store.tsx          ← transporte: localStorage + BroadcastChannel + guardas de append
  components/ui.tsx  ← primitivos de UI (sistema visual s.33, voz s.34)
  screens/
    Join.tsx           portada: elegir superficie / código de sala
    participant/       P1 check-in, P2 inyección activa, P3 decisión, P4 bitácora (s.19)
    facilitator/       F1 tablero, F2 MSEL, F3 sala de decisiones, F5 cierre (s.20)
    room/Room.tsx      pantalla de sala (s.21) — nunca muestra desempeño individual
  styles/tabletop.css  tokens de color del SPEC s.33, Montserrat + monoespaciada
tabletop.html        ← punto de entrada (tercera app del build de Vite)
```

## 4. Reloj compartido (sección 15)

- Una sola fuente de tiempo: los eventos `exercise.started/paused/resumed/closed`.
- `elapsedMs(events, now)` suma los intervalos en marcha; la pausa congela reloj, temporizadores,
  sala y móviles porque **todas** las superficies derivan el reloj de los mismos eventos.
- El tiempo narrativo es un **desfase acumulado** por eventos `narrative.time_jump`; nunca modifica
  el reloj técnico. Ambos coexisten en pantalla (`01:18:22` / `T+12:00`).
- La latencia de una decisión se calcula en **tiempo de ejercicio** (excluye pausas): transcurrido
  al registrar menos transcurrido al disparo de la inyección.

## 5. Reglas de negocio en dominio (no en UI)

- **No respuesta (s.13):** solo existe si el rol estaba en `respuesta_esperada`, la ventana expiró
  y no hay acción registrada. Quien recibió sin respuesta esperada queda `no_aplica`, nunca omisión.
- **Audiencia (s.18):** una inyección dirigida solo es visible para los roles de su audiencia; la
  sala solo ve inyecciones marcadas `visible_en_sala`.
- **Trazabilidad (s.11):** toda decisión referencia inyección, participante, rol, hora y latencia,
  y genera su evento de bitácora.
- **Cierre (s.43):** el store rechaza eventos sobre un ejercicio cerrado.
- **Sin score (s.2, s.12):** ningún módulo califica; los estados de cobertura y el lenguaje de la
  UI usan solo el vocabulario permitido.

## 6. Ruta a producción

1. Sustituir `store.tsx` por cliente WebSocket + API (server actions / API routes) con el mismo
   contrato `append(event)` / `subscribe(events)`.
2. Persistir `EventoBitacora` en PostgreSQL con `server_timestamp` y `sequence` autoritativa
   (sección 32); el reducer del dominio se reutiliza en servidor y cliente.
3. Fase D: cola local IndexedDB + Service Worker delante del mismo contrato (sincronización
   idempotente por UUID de cliente, conservando `client_timestamp`).
4. Fase E: hardening ASVS (tokens de sala firmados y con expiración, rate limiting, RBAC, CSP,
   auditoría de acceso exportable). Ver `THREAT-MODEL.md` (pendiente, Fase E).
