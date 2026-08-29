# Portal de Cliente · Modelo de amenazas (inicial)

Modelo de amenazas de diseño para el MVP descrito en la SPEC v0.3. Cubre la arquitectura de producción propuesta (8.1); indica qué mitigación existe ya en la capa de dominio del prototipo y cuál pertenece al backend. **Este documento no declara controles cumplidos** (RR-10): cada mitigación se considera implementada cuando exista su prueba y evidencia (matriz ASVS 5.0.0 L2, DP-11).

## Activos

1. Documentos formalizados, entregables y sus hashes (evidencia de la relación).
2. Hallazgos y evidencia técnica restringida (explotables si se filtran).
3. Información comercial (importes, condiciones).
4. Bitácora de actos (valor probatorio).
5. Identidades, membresías, permisos y autoridad comercial.
6. Disponibilidad del servicio para la relación (no compromiso contractual en piloto, II.12.2).

## Amenazas y mitigaciones

| # | Amenaza | Vector típico | Mitigación de diseño | Dónde vive |
|---|---|---|---|---|
| T01 | Cruce entre clientes (IDOR) | Manipular `cliente_id`/ids en solicitudes | Autorización por objeto en servidor + RLS sin `BYPASSRLS` + claves compuestas; ids no secuenciales no sustituyen autorización (6.1) | Dominio ✅ (PA-01…04) + backend |
| T02 | Fuga de restringido por canales secundarios | Títulos, búsqueda, miniaturas, notificaciones, exportaciones, logs | Clasificación aplicada a metadatos, listados, bitácora y paquete de expediente (H09, INV-16) | Dominio ✅ (PA-05, PA-32) + backend (correo/logs) |
| T03 | Escalamiento por rol administrativo | Administración lee contenido o se otorga permisos | Administración sin acceso a contenido; no aprueba autoridad por sí sola (H19) | Dominio ✅ (PA-06) |
| T04 | Suplantación de facultades | Patrocinador "firma" sin poderes | Autoridad comercial documentada, vigente y validada, separada del rol; MVP solo formalización externa (H08, INV-05) | Dominio ✅ |
| T05 | Alteración de historia | Editar revisiones, fechas o bitácora | Revisiones inmutables, `cambios_fecha` acumulativo, bitácora de solo adición + copia protegida con credenciales separadas (7.4) | Dominio ✅ (INV-02/11) + backend (copia protegida) |
| T06 | Estados sin evidencia | UI anuncia éxito sin registro durable | Estado + evento en la misma transacción; fallo de bitácora ⇒ no se confirma (INV-12) | Dominio ✅ (PA-30) |
| T07 | Duplicación de actos | Doble clic, reintentos, webhooks repetidos | Idempotencia de negocio (instrumento→proyecto único; acuse único por actor) + unicidad en base (7.3) | Dominio ✅ (PA-12) + backend |
| T08 | Carga maliciosa | Archivos con macros, HTML, ejecutables, ZIP | Lista blanca de tipos, cuarentena, validación real de contenido, nombres generados, previsualización sin contenido activo (8.5) | Dominio: `estado_seguridad` bloquea publicación (PA-09) ✅; inspección real: backend |
| T09 | Robo de sesión / phishing | Credenciales, tokens en navegador | MFA obligatorio, cookies seguras, reautenticación para actos sensibles, sin offline de expedientes (8.3) | Backend/proveedor de identidad |
| T10 | Acceso tras revocación | Sesiones vivas, exportaciones encoladas | Revocación efectiva de sesiones y re-verificación de permisos al entregar (3.4, II.6.6) | Backend (PA-07); el paquete ya re-verifica permisos al generarse ✅ |
| T11 | URL firmadas como portador | Reutilización del enlace durante su vigencia | Entrega autenticada por defecto; URLs firmadas internas de corta vida, nunca como enlace público (7.5, H12) | Backend |
| T12 | Abuso de importación/integraciones | Paquete declara destino ajeno; SSRF en webhooks | El servidor valida destino autorizado; destinos de webhook administrados, sin URLs arbitrarias (11.1, 11.2, PA-46) | Backend (V1) |
| T13 | Exposición en telemetría/logs | Secretos o contenido en logs, session replay | Sin contraseñas/tokens/hallazgos en logs; IP/agente con finalidad y retención definidas (7.4, PA-44) | Backend |
| T14 | Restauración que reexpone | Backup restaurado reabre bajas/eliminaciones | La restauración aplica registro de bajas y purgas antes de habilitar acceso (INV-15, PA-38) | Backend/operación |
| T15 | Dependencia compartida con Tabletop | Sesiones/BD/permisos comunes como superficie única | Compartir componentes y contratos de datos, no sesiones ni base (H25); apps separadas en este repo ✅ | Diseño ✅ |

## Supuestos y límites aceptados

- El prototipo corre íntegro en el navegador: **no defiende contra nada por sí mismo**; sirve para probar el modelo.
- El portal no puede impedir la redistribución de archivos ya entregados (3.4) ni acreditar lectura humana (7.5); no se prometerá.
- La inmutabilidad de bitácora frente a un administrador de infraestructura se documenta y prueba; no se promete «inalterable» absoluto (7.4).

## Próximos pasos (puerta G3)

Matriz ASVS 5.0.0 L2 con evidencia por requisito, análisis de dependencias, pruebas de autorización por objeto en los flujos autenticados de los seis roles y pentest por tercero independiente con repetición de prueba (8.7, D2).
