# ARSEG Cyber — Portal de Cliente · Arquitectura

**Fuente de requisitos:** [`SPEC.md`](SPEC.md) v0.3 (dictamen y definición revisada; documento rector).
**Estado:** prototipo funcional del alcance MVP (Entregas 1–3 de II.13.5), integrado como **cuarta app** del proyecto Vite de este repositorio. **No es la arquitectura de producción ni autoriza producción**; las decisiones bloqueantes DP-01…DP-15 siguen pendientes ([`DECISIONS.md`](DECISIONS.md)).

---

## 1. Decisión de alcance de este prototipo

La SPEC define para producción una aplicación web modular en TypeScript con PostgreSQL administrado (RLS), proveedor de identidad con MFA, almacenamiento privado de objetos, correo transaccional y colas durables (8.1). Este repositorio es un proyecto Vite multi-app sin backend, así que el MVP se implementa como **prototipo cliente completo cuya capa de dominio es portable tal cual al servidor**: reglas de negocio, autorización por capas, comandos transaccionales y consultas filtradas viven en TypeScript puro sin React ni I/O.

| Capa de la SPEC | Producción (8.1) | Este prototipo |
|---|---|---|
| Identidad y MFA | Proveedor administrado | Selector de usuarios sintéticos (`screens/Acceso.tsx`); **no es autenticación real** |
| Autorización | Servidor + RLS en PostgreSQL | `domain/authz.ts` — única puerta de lectura/acción, probada con dos clientes sintéticos |
| Dominio y transacciones | Servidor | `domain/comandos.ts` — funciones puras; estado + evento de bitácora se confirman juntos |
| Persistencia | PostgreSQL administrado | `localStorage` (estado serializado); `store.tsx` es el único módulo a sustituir |
| Archivos | Almacenamiento privado, cuarentena, entrega autenticada | Metadatos (`ArchivoMeta`) con `estado_seguridad`; sin bytes reales |
| Correo / colas | Transaccional + outbox | Fuera del prototipo; el contrato queda descrito en [`OPERATIONS.md`](OPERATIONS.md) |

**Limitación explícita:** nada de lo que este prototipo "impide" constituye un control de seguridad real — todo corre en el navegador. Su valor es demostrar y probar el **modelo de dominio, permisos y flujos** antes de construir el servidor. Las verificaciones de seguridad reales (RLS, ASVS 5.0.0 L2, pentest independiente) pertenecen a las puertas G1–G3 de la SPEC y no se declaran cumplidas aquí (RR-10).

## 2. Principios aplicados

- **RR-01/RR-02** — el portal publica resultados con decisión explícita de audiencia, versión y clasificación; no hay "carpeta espejo".
- **RR-03** — compromisos recíprocos: `CompromisoCompartido.parte_responsable ∈ {cliente, arseg}` con las mismas reglas de fechas y vencimiento.
- **RR-05** — autorización por capas separadas (pertenencia → alcance de proyecto → permiso de contenido → facultad de acción), ver [`ACCESS-CONTROL.md`](ACCESS-CONTROL.md).
- **RR-06/INV-11** — nada se sobrescribe: revisiones inmutables, `cambios_fecha` acumulativos, bitácora de solo adición.
- **INV-12 (7.2)** — cada comando devuelve `{estado', eventos[]}` y `confirmar()` los aplica juntos o no aplica nada; **no** se implementa event sourcing completo (7.2 lo excluye por defecto).
- **RR-07** — sin porcentajes inventados, sin scoring, sin IA generativa. «Sin actualización reciente» ≠ «En tiempo» (H21).

## 3. Módulos

```
portal.html                  ← entrada Vite (cuarta app)
src/portal/
  domain/                    ← TypeScript puro, portable a servidor
    types.ts                   entidades de II.6 (subconjunto MVP), con cliente_id obligatorio
    authz.ts                   capas de autorización de RR-05/8.2
    comandos.ts                comandos transaccionales + invariantes (INV-02/03/05/08/11/12/13)
    gestion.ts                 flujo de origen (2.4): alta de cliente, equipo, acuerdo, hitos, compromisos
    consultas.ts               lecturas filtradas: la UI nunca filtra por su cuenta
    expediente.ts              paquete portable con manifiesto y permisos del solicitante (5.7)
    reglas.test.ts             29 pruebas trazadas a INV/PA (vitest)
  data/sinteticos.ts         ← DOS clientes sintéticos, seis roles, permisos y autoridad (8.2)
  store.tsx                  ← sesión del prototipo + persistencia localStorage (capa a sustituir)
  components/ui.tsx          ← estados con símbolo + texto Navy (II.10.3), chips de clasificación
  screens/                   ← Acceso, Inicio (por rol: InicioSocio/InicioLider), Proyecto,
                               Acuerdos, Cuenta, AltaCliente (alta guiada del socio)
  styles/portal.css          ← tokens de II.10.2 y reglas de contraste de II.10.3
```

## 4. Qué queda explícitamente fuera (y por qué)

| Capacidad | Entrega según SPEC | Razón |
|---|---|---|
| Propuestas/cotizaciones y su aceptación | V1 (13.4 B3) | Primero validar estado + documentos + compromisos |
| Hallazgos, remediación, aceptación de riesgo, postura | V1 (13.4 B6) | Solo si el servicio lo contrata; el informe restringido ya se publica como entregable en MVP |
| Formalización dentro del portal | Condicionada (DP-02) | Decisión jurídica pendiente; MVP registra formalización externa |
| Firma, API pública, webhooks, comparación documental | V1/POST | II.13 |
| Notificaciones por correo, monitoreo, respaldos | MVP en producción | Requieren backend; contrato descrito en `OPERATIONS.md` |

## 5. Ruta a producción

1. Resolver DP-01…DP-15 (Entrega 0) — dueños y bloqueos en [`DECISIONS.md`](DECISIONS.md).
2. Levantar el backend (8.1) portando `domain/` a servicios de servidor; `store.tsx` se sustituye por API autenticada.
3. RLS por fila con rol sin `BYPASSRLS`, probado con los dos clientes sintéticos (8.2, PA-01…PA-04).
4. Identidad administrada con MFA, invitaciones nominativas, revocación efectiva (8.3, PA-07/PA-08).
5. Cuarentena real de archivos y entrega autenticada (8.5, 7.5).
6. Puertas G0–G4 de II.14 antes de datos reales.
