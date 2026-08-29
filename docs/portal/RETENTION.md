# Portal de Cliente · Conservación y eliminación

Traduce II.5.7, II.9 y H13/H14 de la SPEC v0.3. **Requiere validación jurídica antes de producción** (DP-04, DP-05): nada de aquí constituye dictamen legal ni fija plazos comprometidos con clientes.

## Principios

- **Cuatro hitos distintos, nunca mezclados (5.7):** cierre del servicio → consulta histórica → conservación restringida → eliminación verificada. Cerrar acceso no es destruir información; destruir una categoría no es destruir la relación (9.4).
- **Política por clase documental y proyecto, no un solo número por cliente (H14, 9.3).**
- **Ninguna constancia afirma más de lo que se puede demostrar (H13):** el portal acredita sus propios procesos; no certifica el borrado en correo, equipos de consultores o sistemas de terceros. En MVP se admite constancia elaborada y validada fuera del portal, registrada como entregable con su evidencia.

## Clases documentales y criterio (9.3 — plazos por decidir con jurídico)

| Clase | Criterio de conservación | Acceso |
|---|---|---|
| Acuerdos y constancias comerciales | Plazo jurídico aplicable por categoría (C. Comercio art. 49 como referencia a interpretar, no regla universal) | Consulta en periodo acordado; luego conservación restringida si procede |
| Entregables finales | Contrato + necesidad de servicio + política aprobada | Audiencia autorizada hasta fin de consulta |
| Evidencia técnica e insumos del cliente | Mínimo necesario por finalidad; no retener por comodidad | Técnica restringida |
| Compromisos, conformidades y decisiones | Evidencia de relación y obligaciones | Resumen autorizado |
| Auditoría y autenticación | Finalidad de seguridad con plazo definido; no indefinido por defecto | Acceso limitado |
| Respaldos y copias residuales | Ciclo documentado de expiración | Sin consulta ordinaria; purga al agotar ciclo |

La política se versiona (`PoliticaConservacion` en el modelo de producción); un cambio no acorta silenciosamente un plazo comprometido ni habilita conservar todo. Las excepciones (controversia, obligación, investigación) tienen fundamento, autorizador y fecha de revisión; suspenden solo las eliminaciones afectadas, sin extender la consulta de usuarios (PA-36).

## Proceso de eliminación desde MVP (9.4)

1. Simulación del alcance (manifiesto de lo que se eliminaría).
2. Revisión de excepciones vigentes.
3. Autorización humana registrada.
4. Ejecución sobre categorías y sistemas cuyo plazo terminó.
5. Verificación por responsable distinto del ejecutor.
6. Constancia: categorías, sistemas, alcance, método, fecha, verificador, excepciones y vencimiento de respaldos residuales.

Los respaldos que aún contengan objetos eliminados permanecen segregados hasta expirar; una restauración aplica el registro de bajas y eliminaciones antes de habilitar acceso (INV-15, PA-38). La eliminación de copias de trabajo y la conservación del expediente se declaran por separado.

## En este prototipo

- El expediente cerrado queda en solo consulta con `consulta_historica_hasta` y el vencimiento bloquea únicamente ese expediente (PA-34, PA-35 — probados).
- El paquete portable incluye índice, manifiesto con hashes y registros CSV/JSON, filtrado por permisos del solicitante (5.7, PA-32 — probado).
- `PoliticaConservacion`, `ExcepcionConservacion` y `EjecucionEliminacion` no están modeladas aún: entran con el backend (D4 es MVP en producción; la automatización ampliada es V1).

## Privacidad (9.1–9.2 — pendiente jurídico)

Definir por categoría si ARSEG actúa como responsable o encargado; avisos y acuerdos con la LFPDPPP vigente (ley 2025, reforma 14-11-2025); canal para derechos e incidentes. No se reutilizan avisos de la ley abrogada.
