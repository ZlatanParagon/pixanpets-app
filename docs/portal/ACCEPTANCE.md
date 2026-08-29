# Portal de Cliente · Trazabilidad de aceptación

Correspondencia entre las pruebas de aceptación de la SPEC v0.3 (II.14) y este prototipo.
Estados: ✅ probado en `src/portal/domain/reglas.test.ts` (`npm test`) · 👁 verificable manualmente en la UI del prototipo · 🏗️ requiere backend/operación de producción · 🔜 capacidad V1 no incluida aún.

Los invariantes INV-01…INV-16 (II.7.1) quedan cubiertos por las mismas pruebas donde aplican; los no listados (INV-06/07 propuestas, INV-09/10 hallazgos, INV-14/15 eliminación) corresponden a capacidades V1/backend.

| PA | Escenario (resumen) | Estado | Nota |
|---|---|---|---|
| PA-01 | Cliente A pide proyecto de B por id | ✅ 👁 | Denegación sin metadatos |
| PA-02 | Escritura con `cliente_id` cruzado | ✅ | Sin registro cruzado |
| PA-03 | Hijo de A con padre de B | 🏗️ | Claves compuestas + RLS en base |
| PA-04 | Conexión reutilizada A→B | ✅* | *Análogo de dominio: el contexto no se hereda entre membresías; la prueba real es de pool de conexiones |
| PA-05 | Consulta intenta ver informe con hallazgos | ✅ 👁 | Ni título, ni acuse, ni exportación indirecta |
| PA-06 | Administración lee contenido | ✅ 👁 | Rol sin acceso a contenido |
| PA-07 | Revocación con sesión abierta y exportación en cola | 🏗️ | El paquete ya re-verifica permisos al generarse |
| PA-08 | Activación/recuperación sin MFA | 🏗️ | Proveedor de identidad (DP-07) |
| PA-09 | Publicar sin clasificación o en cuarentena | ✅ | Bloqueo con motivo |
| PA-10 | Reemplazar archivo de revisión publicada | ✅ | No existe el comando; nueva revisión obligatoria |
| PA-11 | Nueva revisión publicada | ✅ 👁 | Anterior histórica con hash y acuses |
| PA-12 | Mismo instrumento importado dos veces | ✅ | Idempotente, un solo proyecto |
| PA-13 | Registro de firma externa | ✅ 👁 | Firmante ≠ registrador ≠ validador |
| PA-14…PA-18 | Propuestas y aceptación (V1) | 🔜 | INV-05 (autoridad) ya probado en dominio |
| PA-19 | Descarga/acuse no es conformidad | ✅ 👁 | Actos separados |
| PA-20 | Respuesta incompleta | ✅ 👁 | Respondido/requiere aclaración; nunca auto-resuelto |
| PA-21 | Cambio de fecha comprometida | ✅ 👁 | Original + motivo + autorizador + evento |
| PA-22 | Vencimientos simultáneos | 👁 | No existe suma automática de afectación (no hay código que la haga) |
| PA-23 | Compromiso ARSEG vencido | ✅ 👁 | Mismas reglas temporales |
| PA-24 | Controversia de afectación | 🔜 | `AfectacionCompromiso` es V1 en este prototipo |
| PA-25…PA-28 | Hallazgos, riesgo, postura (V1) | 🔜 | |
| PA-29 | Falla el correo tras publicar | 🏗️ | Outbox durable (7.2) |
| PA-30 | Falla la bitácora | ✅ | No se confirma el cambio |
| PA-31 | Autorización de archivo sin transferencia | 🏗️ | Eventos de entrega (7.5) |
| PA-32 | Paquete de cierre para Consulta | ✅ | Sin objetos ni nombres restringidos |
| PA-33 | Cierre no arrastra otros proyectos | ✅ 👁 | |
| PA-34 | Vence una consulta histórica | ✅ | Solo ese expediente se bloquea |
| PA-35 | Editar expediente histórico | ✅ | Rechazo; accesos siguen registrándose |
| PA-36…PA-38 | Eliminación y restauración | 🏗️ | Proceso en [`RETENTION.md`](RETENTION.md) |
| PA-39 | Verificación de expediente exportado | 👁 | Manifiesto con hashes en el JSON exportado |
| PA-40 | Carga de tipo no permitido | 🏗️ | Cuarentena modelada; inspección real en backend |
| PA-41/PA-42 | Teclado, zoom 200 %, contrastes | 👁 | Foco visible, tablas con scroll propio, estados con símbolo+texto (II.10.3) |
| PA-43/PA-44 | Carga, disponibilidad, logs | 🏗️ | Objetivos en II.12.2 |
| PA-45 | Corte antiguo no aparenta actualidad | ✅ 👁 | «Sin actualización reciente» calculado contra cadencia |
| PA-46 | Webhook a destino no autorizado | 🔜 🏗️ | V1 |
| PA-47 | Muestreo de auditor | 👁 | Bitácora + expediente relacionan identidad/objeto/revisión/tiempo |
| PA-48 | Patrocinador y operativo se orientan solos | 👁 | Criterio de aceptación funcional de 5.1 |

## Puertas de habilitación (II.14)

G0 (decisiones DP resueltas) **pendiente** — ver [`DECISIONS.md`](DECISIONS.md). G1–G4 pertenecen a la implementación de producción. **Este prototipo con datos sintéticos no equivale a producción ni sustituye esas puertas.**
