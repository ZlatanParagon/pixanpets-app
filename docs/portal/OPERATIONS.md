# Portal de Cliente · Operación

Traduce II.12 de la SPEC v0.3 a un plan operable. «No licenciable» no significa «sin mantenimiento» (I.1): operar el portal exige responsables, presupuesto y procedimientos desde el MVP. Nada de esta sección está cubierto por el prototipo; es el contrato que la implementación de producción debe cumplir antes del piloto.

## Responsabilidades mínimas (II.12.1)

| Función | Titular propuesto | Estado |
|---|---|---|
| Dueño de negocio | Socio responsable ARSEG Cyber | Por designar (DP-10) |
| Responsable de operación + suplente | Por designar | Por designar (DP-10) |
| Custodio del servicio al cliente | Líder de servicio por proyecto | Por designar (DP-08) |
| Revisor de seguridad independiente | Tercero distinto de quien construyó | Por contratar (DP-11) |
| Asesoría jurídica y privacidad | Por designar | Por designar (DP-02/DP-04/DP-05) |

Pueden ser pocas personas, pero ninguna función desaparece; la independencia del pentest se mantiene.

## Objetivos propuestos del piloto (II.12.2 — a aprobar, no SLA)

10 clientes / 100 usuarios / 20 sesiones concurrentes · archivo ≤ 50 MiB · p95 ≤ 2 s en servidor · disponibilidad interna 99.5 % mensual · RPO ≤ 1 h · RTO ≤ 8 h · cadencia de corte semanal inicial. El respaldo de base y de objetos debe reconciliar revisiones, hashes y constancias (no basta restaurar tablas).

## Monitoreo mínimo desde MVP (II.12.3)

Disponibilidad, errores de aplicación, autenticación anómala, fallos de publicación, cola de salida detenida, correo rebotado, carga bloqueada en cuarentena, fracaso de respaldos o eliminaciones. Los rebotes de correo generan incidencia operativa para ARSEG (11.4).

## Manual operativo (contenido exigido)

Alta e invitación nominativa · asignación y revocación de permisos/autoridad · publicación y retirada por error · registro de formalización externa · cierre y exportación de expediente · revocación de membresía · restauración probada (antes del primer cliente y trimestral) · eliminación controlada ([`RETENTION.md`](RETENTION.md)) · contingencia por indisponibilidad: la relación continúa por el canal seguro acordado y los actos externos se incorporan después con origen y fecha reales (II.12.3).

## Notificaciones (11.4)

Correo institucional con autenticación de dominio (DP-14); mensaje mínimo + enlace autenticado; sin adjuntos restringidos ni títulos explotables. Entrega vía outbox durable: un fallo de correo no revierte un acto confirmado (7.2, PA-29). «Entregado» del proveedor no es prueba de lectura. Se re-verifican permisos antes de enviar o entregar una exportación encolada.

## Incidentes

Contención, revocación, preservación de evidencia, comunicación y recuperación. El portal muestra el canal de contacto de emergencia acordado cuando el servicio lo incluya, pero **no** es canal de respuesta urgente a incidentes (1.3).

## Costo total (II.12.4)

Antes del piloto se aprueba presupuesto que incluye construcción, identidad/MFA, infraestructura, base, objetos y transferencia, respaldos, logs, correo, protección perimetral, revisión legal, pentest, mantenimiento, soporte y tiempo de publicación; con límite mensual y alertas de consumo. Superar una cuota genera revisión y aviso; nunca borra archivos ni suspende clientes automáticamente.

## Métricas de continuidad (II.12.5)

Actualidad de cortes · tiempos de respuesta/resolución de compromisos por parte responsable · autoservicio · costo de publicación · integridad de expediente muestreada · (V1) respuesta a ampliaciones. La primera decisión de continuidad se toma tras un ciclo completo del piloto, incluida exportación y cierre de prueba.
