# ARSEG Tabletop — Backlog técnico trazado a criterios de aceptación

Los números `CA-n` refieren a la sección 38 del [`SPEC.md`](SPEC.md).
Estado: ✅ implementado en este prototipo (Fase A) · 🔜 fase posterior · 🏗️ requiere backend de producción.

## Fase A — MVP funcional (este prototipo)

| Historia | Criterios | Estado |
|---|---|---|
| Ejercicio de referencia PH con objetivos, fases, roles y MSEL configurados | CA-8, CA-23, CA-24 | ✅ (`data/ph.ts`; editor de preparación 🔜) |
| Check-in de participante por código/QR sin cuenta | CA-1, CA-2 | ✅ (QR válido en el mismo navegador; multi-dispositivo 🏗️) |
| Reloj compartido con pausa global y tiempo narrativo | s.15 | ✅ |
| MSEL: preparar, disparar, omitir, cerrar inyecciones; audiencia por rol | CA-14, s.9 | ✅ |
| Distribución de inyección a superficies conectadas | CA-3 | ✅ (BroadcastChannel; <2 s entre pestañas) |
| Registro de decisión con hora, rol, justificación y latencia | CA-4 | ✅ |
| Ventana de decisión con expiración sin bloqueo y captura tardía | s.16 | ✅ |
| Regla de no respuesta / `no_aplica` en dominio con tests | CA-9 | ✅ |
| EventoBitacora por toda acción relevante | CA-5 | ✅ |
| Bitácora personal del participante | s.19 P4 | ✅ |
| Pantalla de sala sin desempeño individual | CA-15 | ✅ |
| Consola: tablero, sala de decisiones por inyección | s.20 F1/F3 | ✅ |
| Exportación de cronología completa (CSV + JSON) | CA-20 | ✅ |
| Ejercicio cerrado no acepta nuevos eventos | s.43 | ✅ |
| Tests de dominio de reglas críticas | s.43 | ✅ (`domain/rules.test.ts`, vitest) |

## Fase B — TableTop trazable (implementada en este prototipo)

| Historia | Criterios | Estado |
|---|---|---|
| Escalamiento con origen, destino, motivo, urgencia y hora | CA-10 | ✅ |
| Reconocimiento del destino y vínculo automático con su acción posterior | CA-11 | ✅ (derivado en dominio, con test) |
| Solicitud de información con pregunta, destino y tiempos de respuesta | CA-12 | ✅ (responden el rol destino o el facilitador) |
| Compromiso con responsable, plazo narrativo y criterio | CA-13 | ✅ |
| Observación ARSEG de una acción principal con herencia de contexto | CA-6, CA-7 | ✅ (hereda inyección activa, fase, hora, usuario) |
| Evidencia vinculada a observaciones (s.10.12, s.11) | — | ✅ (idempotente, con test) |
| Cobertura de objetivos con los tres estados permitidos, sin score | CA-17, CA-22 | ✅ (`domain/coverage.ts`, con test) |
| Matriz objetivo → evidencia | CA-21 | ✅ (CSV) |
| Paquete D5 completo | s.37 | ✅ (JSON con escalamientos, solicitudes, compromisos, observaciones y cobertura) |
| Bitácora personal unificada del participante | s.19 P4 | ✅ |

Pendiente de Fase B: preguntas de debriefing (acciones a 30 días) y encuestas D5.

## Fase C — Intensividad 🔜

Inyecciones privadas ya soportadas en dominio y UI (CA-14 ✅); faltan: ramas y consecuencias
manuales (CA-16), inserción ad hoc, visualización de cadenas, múltiples observadores (CA-25).

## Fase D — Resiliencia 🏗️

PWA, IndexedDB, cola offline con conservación de hora original (CA-18, CA-19), reconciliación
idempotente, pruebas de red degradada. El dominio ya usa UUID de cliente y `client_timestamp`.

## Fase E — Hardening 🏗️

Threat modeling, ASVS, aislamiento por ejercicio (CA-26), tokens no predecibles con expiración
(CA-27), retención y purga (CA-28), auditoría exportable (CA-29), SAST/DAST, pentest.

## Criterios transversales vigilados en todo el código

- CA-22 / CA-30: sin lenguaje de aprobación, score ni madurez; separación evidencia vs. dictamen.
- Regla 42: sin IA generativa, sin gamificación, sin ranking, reglas de negocio en dominio.
