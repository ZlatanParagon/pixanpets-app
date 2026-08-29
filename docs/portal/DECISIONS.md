# Portal de Cliente · Registro de decisiones

## Decisiones bloqueantes de la SPEC v0.3 (II.15) — TODAS PENDIENTES

Ninguna DP se considera aprobada por aparecer recomendada en la SPEC ni por existir este prototipo (II.15). El dueño de negocio debe registrar aquí decisión, fecha, responsable y evidencia. Qué trabajo bloquea cada una:

| ID | Decisión | Bloquea | Estado |
|---|---|---|---|
| DP-01 | Cliente y servicio piloto | Configurar producción; todo uso con datos reales | ⬜ Pendiente |
| DP-02 | Actos formalizados en el portal | Cualquier acto contractual real; diseño de formalización V1 | ⬜ Pendiente — el prototipo asume la recomendación (externa documentada) |
| DP-03 | Autoridad de usuarios cliente | Otorgar permisos de comercio/conformidad/riesgo reales | ⬜ Pendiente |
| DP-04 | Responsable/encargado, avisos, acuerdos | Tratar datos reales | ⬜ Pendiente |
| DP-05 | Retención, consulta y excepciones | Primer cliente | ⬜ Pendiente — marco en [`RETENTION.md`](RETENTION.md) |
| DP-06 | Nube, región y subprocesadores | Despliegue productivo | ⬜ Pendiente |
| DP-07 | Identidad y recuperación MFA | Invitaciones reales | ⬜ Pendiente |
| DP-08 | Fuente de datos y cadencia por servicio | Piloto | ⬜ Pendiente — prototipo usa corte semanal propuesto |
| DP-09 | Datos admitidos y clasificación | Cargar archivos reales | ⬜ Pendiente |
| DP-10 | Presupuesto y soporte | Piloto | ⬜ Pendiente |
| DP-11 | ASVS y revisor independiente | Producción | ⬜ Pendiente — objetivo propuesto: ASVS 5.0.0 L2 |
| DP-12 | Objetivos de recuperación y capacidad | Producción | ⬜ Pendiente — valores propuestos en [`OPERATIONS.md`](OPERATIONS.md) |
| DP-13 | Marca web y activos oficiales | Validación visual final | ⬜ Pendiente — los 4 SVG de `/public/marca/` **no fueron suministrados y no se recrearon**; el prototipo usa marca tipográfica provisional |
| DP-14 | Remitente y política de correo | Notificaciones reales | ⬜ Pendiente |
| DP-15 | Servicios de V1 por cliente | Desarrollar/activar cada capacidad V1 | ⬜ Pendiente |

La resolución de una DP que cambie los supuestos genera una nueva revisión de la especificación; no se oculta como detalle técnico.

## Decisiones propias de este prototipo (no sustituyen ninguna DP)

| # | Decisión | Fundamento |
|---|---|---|
| P-01 | Implementar el MVP como cuarta app del proyecto Vite, con dominio puro portable y sin backend | Patrón del repositorio (Tabletop); permite probar reglas y flujos sin datos reales |
| P-02 | Dos clientes sintéticos y seis roles desde el inicio | 8.2 y Entrega 1: no avanzar sin demostrar aislamiento |
| P-03 | El selector de usuarios simula al proveedor de identidad | La autenticación real es del backend; se rotula como demostración |
| P-04 | Alcance MVP estricto: sin propuestas, hallazgos, postura ni firma | I.3 y II.13; el informe restringido se publica como entregable |
| P-05 | `formalizar_en_portal` deshabilitado por código | DP-02 sin resolver; la ruta MVP es formalización externa documentada |
| P-06 | Estados visuales con relleno tenue + texto Navy + símbolo | II.10.3: Amber/Green/Crimson no alcanzan contraste como texto pequeño |
| P-07 | Fixtures fechados ago–sep 2026 con reloj real del navegador | Permite ver vencimientos y cortes vigentes sin reloj simulado |
