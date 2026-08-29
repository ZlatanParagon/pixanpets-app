# Portal de Cliente · Backlog trazado a la SPEC v0.3

Estado: ✅ implementado en este prototipo · 🏗️ requiere backend de producción · 🔜 V1 · ⏸ POST/condicionada.
La correspondencia con claves v0.2 está en la SPEC (II.13.4); aquí se traza contra la v0.3.

## MVP — implementado en el prototipo (dominio + UI + pruebas)

| Historia | Referencia | Estado |
|---|---|---|
| Dos clientes sintéticos, seis roles, alcance por proyecto, permisos y autoridad separados del rol | II.3, 8.2 | ✅ |
| Aislamiento por cliente en consultas, acciones, bitácora y exportación | INV-01, PA-01…06 | ✅ (en dominio; RLS 🏗️) |
| Clasificación aplicada a contenido, títulos, listados y paquetes | II.4.1, H09, INV-16 | ✅ |
| Selección explícita de cuenta activa para usuarios multi-membresía | II.3.1 | ✅ |
| Proyecto formalizado externamente con constancia (firmante ≠ registrador ≠ validador) | 5.2, PA-13 | ✅ |
| Idempotencia instrumento→proyecto | INV-03, PA-12 | ✅ |
| Inicio: situación, pendientes recíprocos, hitos, publicaciones, fecha de corte, «sin actualización reciente» | 5.1, H21, PA-45 | ✅ |
| Acuerdos: revisiones inmutables, índice, comentarios anclados, historial | 5.2 | ✅ |
| Compromisos compartidos: abierto→respondido→resuelto, requiere_aclaracion, vencido calculado, reciprocidad | 5.4, PA-20/23 | ✅ |
| Cambios de fecha con original, motivo y autorizador | H06, PA-21 | ✅ |
| Entregables: revisiones inmutables, publicación/acuse/conformidad como actos distintos | 5.5, PA-10/11/19 | ✅ |
| Publicación bloqueada sin clasificación o con archivo en cuarentena | PA-09 | ✅ |
| Cierre por proyecto, consulta histórica con vencimiento, expediente solo lectura | 5.7, PA-33/34/35 | ✅ |
| Expediente portable con manifiesto, hashes y permisos del solicitante | 5.7, RR-08, PA-32 | ✅ |
| Bitácora de solo adición en la misma transacción que el estado | INV-12, PA-30 | ✅ |
| Tokens visuales II.10.2 + reglas de contraste II.10.3 + teclado/foco | II.10, PA-41/42 | ✅ |
| Alta guiada de cliente (socio): evidencia → PM → SOW → formalización → hitos → usuarios → activación | 2.4, 5.2, 8.1 | ✅ |
| Inicio diferenciado por rol: socio (estratégico/comercial y riesgo), PM (operativo), cliente | II.3 | ✅ |
| Gestión operativa del PM: crear/avanzar hitos con evidencia, crear compromisos, publicar avances | 5.4, RR-04 | ✅ |
| Cierre de proyecto desde la interfaz (socio), con compromisos resueltos o documentados | 5.7 | ✅ |

## MVP — pendiente de backend de producción

| Historia | Referencia | Estado |
|---|---|---|
| Identidad administrada, MFA, invitaciones nominativas, revocación de sesión, recuperación | 8.3, 3.4, PA-07/08 | 🏗️ |
| PostgreSQL con RLS sin `BYPASSRLS`, claves compuestas, pruebas de políticas | 8.2, PA-03/04 | 🏗️ |
| Cuarentena real de archivos (tipos, contenido, tamaño), entrega autenticada y eventos de descarga | 8.5, 7.5, PA-31/40 | 🏗️ |
| Outbox durable: correo, exportaciones, webhooks; re-verificación de permisos al entregar | 7.2, 11.4, PA-29 | 🏗️ |
| Notificaciones esenciales, remitente institucional autenticado | 11.4, DP-14 | 🏗️ |
| Contrato mínimo de publicación/importación idempotente con simulación | 11.1, H04 | 🏗️ |
| Copia protegida de bitácora con credenciales separadas | 7.4 | 🏗️ |
| Monitoreo, respaldos probados, manual, proceso de eliminación controlada | II.12.3, 9.4, PA-36…38/43 | 🏗️ |
| Verificación ASVS 5.0.0 L2 + pentest independiente | 8.7, D1/D2 | 🏗️ |

## V1

Propuestas/cotizaciones con aceptación y regla de activación (5.3, PA-14…18) · hallazgos/remediación/aceptación de riesgo (5.6, PA-25…27) · mediciones de postura comparables (PA-28) · periodos de servicio recurrente (5.4) · afectaciones estimadas/confirmadas/controvertidas (PA-22/24) · API ampliada y webhooks (11.2, PA-46) · encuesta de cierre. Todo 🔜 y condicionado a DP-15.

## Condicionada / POST

Formalización dentro del portal o con proveedor de firma (DP-02) ⏸ · comparación documental avanzada ⏸ · conectores adicionales ⏸ · federación empresarial ⏸ · modelo de canales (especificación independiente) ⏸.

## Vigilancia transversal en todo el código

Sin IA generativa, sin scoring de madurez, sin motor de precios, sin firma propia (1.3, II.16) · el portal no afirma más de lo que observa (7.5) · mensajes en español directo sin códigos internos (II.10.4) · datos sintéticos claramente rotulados (8.6).
