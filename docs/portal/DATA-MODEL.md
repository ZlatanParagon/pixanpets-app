# Portal de Cliente · Modelo de datos

Implementa el modelo conceptual de la SPEC v0.3 (II.6) en `src/portal/domain/types.ts`. Este documento registra las decisiones de traducción y los invariantes de datos; no repite campo por campo lo que el código ya declara.

## Convenciones obligatorias aplicadas (6.1)

- **`cliente_id` en toda entidad de contenido**, incluso cuando existe `proyecto_id`. En producción esto se refuerza con claves foráneas compuestas que impiden vincular un hijo de un cliente con el padre de otro (PA-03); en el prototipo lo verifica cada comando y consulta.
- **Fechas**: eventos en UTC ISO-8601 (`ocurrido_en_servidor`); fechas de negocio como fecha civil (`YYYY-MM-DD`) con zona por cuenta (`Cliente.zona_horaria`, propuesta `America/Mexico_City`).
- **Revisiones inmutables**: `AcuerdoRevision` y `EntregableRevision` llevan número de revisión propio, hash y `revision_anterior_id`; una corrección crea revisión nueva (INV-02).
- **`archivo_ref`**: en el prototipo `ArchivoMeta` guarda solo metadatos (nombre, mime validado, bytes, hash, `estado_seguridad`); nunca URLs públicas.
- **Sin datos personales de más**: la bitácora guarda `detalle_minimo`, no contenido técnico (7.4).

## Entidades implementadas (subconjunto MVP)

| Grupo SPEC | Entidades en `types.ts` |
|---|---|
| Identidad y autorización (6.2) | `Cliente`, `Usuario`, `Contacto`, `Membresia`, `AsignacionProyecto`, `PermisoAdicional`, `AutoridadComercial` |
| Relación contractual (6.3) | `Acuerdo`, `AcuerdoRevision`, `SeccionAcuerdo`, `ComentarioAcuerdo`, `Formalizacion`, `Proyecto`, `Hito`, `PublicacionAvance` |
| Compromisos y documentos (6.4) | `CompromisoCompartido`, `RespuestaCompromiso`, `ResolucionCompromiso`, `Entregable`, `EntregableRevision`, `ArchivoMeta`, `AcuseEntregable` |
| Cierre (6.5) | `CierreProyecto` |
| Bitácora (6.6) | `EventoBitacora` |

Quedan para V1 (no modeladas aún, conforme a II.13): `Propuesta`/`PropuestaRevision`, `CambioAlcance`, `PeriodoServicio`, `AfectacionCompromiso`, `Hallazgo`/`ValidacionRemediacion`/`AceptacionRiesgo`, `MedicionPostura`, `PoliticaConservacion`/`ExcepcionConservacion`/`EjecucionEliminacion` (su política operativa está en [`RETENTION.md`](RETENTION.md)), `EventoSalida`, `Notificacion`, `Exportacion` persistida.

## Decisiones de traducción respecto del texto de II.6

| Decisión | Razón |
|---|---|
| `Hito.cambios_fecha[]` y `CompromisoCompartido.cambios_fecha[]` como lista embebida | Conserva fecha anterior, motivo, autorizador y momento (H06, PA-21) sin una tabla adicional en el prototipo; en SQL sería tabla hija. |
| `Formalizacion.metodo` restringido a `'externa'` | DP-02: el mecanismo dentro del portal no está habilitado; el tipo se ampliará cuando exista la decisión jurídica. |
| `firmante_segun_instrumento` como texto | El firmante puede no ser usuario del portal (5.2); no se le asigna artificialmente rol ni cuenta (PA-13). |
| Estados editoriales de `AcuerdoRevision` sin `borrador` | El borrador interno nunca se publica al cliente (H10); el prototipo solo modela lo publicado, superado o retirado. |
| `version_concurrencia`/claves de idempotencia técnicas omitidas | En un estado en memoria mononavegador no hay concurrencia real; la idempotencia de negocio (mismo instrumento → mismo proyecto; mismo acuse → sin duplicado) sí está implementada y probada (INV-03, 7.3). El contador técnico de versión es requisito del backend. |
| Montos como `number` entero en `AutoridadComercial.limite_monto` | Solo se muestra; el portal no calcula precios (5.3). En producción: unidades menores enteras o decimal exacto. |

## Invariantes de datos verificados por pruebas

`src/portal/domain/reglas.test.ts` cubre: INV-01/02/03/05/08/11/12/13/16 y las PA ejecutables en dominio (PA-01…06, 09…13, 19…21, 23, 30, 32…35). La correspondencia completa está en [`ACCEPTANCE.md`](ACCEPTANCE.md).
