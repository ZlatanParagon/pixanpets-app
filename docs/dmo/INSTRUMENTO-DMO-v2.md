# MEBUKI · Diagnóstico de Madurez Operativa (DMO)
## Versión 2.0 — consolidada a tres bandas

**Fecha:** 29 de agosto de 2026
**Estado:** instrumento maestro cerrado para documentación; pendiente de construcción como sistema (Claude Code) y de piloto con 5–10 clientes.
**Consolidación:** integra el criterio de MEBUKI + revisión externa de ChatGPT (v1.1) + revisión externa de Kimi. Este documento es la fuente de verdad que alimentará el motor de scoring y el artefacto interactivo.

---

## 0. QUÉ ES Y QUÉ NO ES

El DMO identifica patrones de madurez operativa en startups y PYMEs B2B, mapea cada dimensión a un servicio de MEBUKI y, al madurar, a un destino de certificación (ISO 9001 y/o 27001). Opera en dos profundidades:

- **Preventa (gancho):** 6 preguntas-madre en lenguaje de cliente, ~2 min. Devuelve un mapa "estás aquí" con nivel estimado por dimensión y global.
- **Post-venta (contexto profundo):** 96 preguntas-hijas en registro técnico, calificadas con evidencia por el facilitador.

**Decisión de diseño (tres bandas):** es **un solo instrumento riguroso**. Las 96 hijas van en registro técnico; las 6 madre conservan lenguaje de cliente. Es registro por capa de uso, no dos instrumentos.

**El DMO NO es** una auditoría de certificación, una evaluación de conformidad ni una opinión legal. Las referencias normativas indican trazabilidad o alineación temática; no prueban por sí solas el cumplimiento de un estándar. El informe lleva nota expresa de esto.

---

## 1. BASE NORMATIVA VERSIONADA

- **ISO 9001:2015** (edición vigente al generar este documento). **Acción crítica:** ISO 9001:2026 se publica el **16 de septiembre de 2026** y reemplaza a la 2015 con transición de ~3 años. Conserva la estructura de cláusulas, pero reorganiza §6.1 en 6.1.1–6.1.3 y amplía §5.1.1 y §7.3 ("cultura de calidad"). El mapa cita §6.1 en varias preguntas → **re-mapear al publicarse la edición 2026**. La transición misma es una oportunidad de servicio para MEBUKI.
- **ISO/IEC 27001:2022** + **27002:2022** para interpretar controles del Anexo A. Estable.
- **ISO 22301:2019.** Estable.
- **México — LFPDPPP** (texto vigente). Confirmar jurisdicción y regulación sectorial antes de cualquier conclusión legal.
- **Marco propio MEBUKI** para criterios de desempeño/madurez que no constituyen requisito directo de una norma.

**Nota sobre 27001:** los controles del Anexo A se seleccionan mediante evaluación y tratamiento de riesgos y la Declaración de Aplicabilidad. No son una lista idéntica y obligatoria para toda organización.

---

## 2. ETIQUETADO HONESTO DE SOPORTE NORMATIVO

Cada ancla lleva una de tres etiquetas (ambos paneles convergieron en esto de forma independiente):

- **[D] Directo:** la pregunta observa una práctica claramente pertinente al requisito/control citado.
- **[P] Parcial:** la práctica contribuye al tema, pero no basta para demostrar conformidad.
- **[M] Marco propio MEBUKI:** criterio propio de desempeño/madurez, sin norma directa.

Este etiquetado blinda el instrumento ante cualquier auditor ISO que lo lea. Forzar una cláusula resta credibilidad; declarar el marco propio la suma.

**Doble cita Annex SL:** 9001 y 27001 comparten la estructura de cláusulas 4–10. Donde aplica, se cita el equivalente 27001 de un ancla 9001 (p. ej. §7.5 ≡ §7.5, §9.1 ≡ §9.1). La equivalencia es **estructural, no de requisitos** (27001 añade evaluación de riesgos en 6.1.2–6.1.3 y su Anexo A). Gana presencia 27001 sin tocar preguntas.

---

## 3. ESCALA COMÚN DE MADUREZ (1–5)

| Nivel | Nombre | Ancla conductual | Evidencia esperada |
|---|---|---|---|
| 1 | Ausente | No hay práctica estable; se improvisa, resultado impredecible. | Sin evidencia reproducible. |
| 2 | Reactivo | Existe parcial, depende de personas, se aplica irregular. | Ejemplos aislados o informales. |
| 3 | Definido | Tiene alcance, responsable y método; se aplica habitualmente. | Artefacto vigente + muestra de uso. |
| 4 | Gestionado | Se mide/revisa con criterio; las desviaciones generan acción. | Indicador o revisión + seguimiento. |
| 5 | Optimizado | Mejora sostenida, resiliencia, escala; se automatiza donde aporta. | Tendencia + aprendizaje + prueba de efectividad. |

**Opciones auxiliares:**
- **NS · No sé:** pendiente de validación; provisionalmente nivel 1–2 y señala baja visibilidad.
- **NA · No aplica:** se excluye solo con justificación aceptada por el facilitador (mínimo 3 preguntas válidas por sub-dimensión para promediar).

**Regla declarado vs. validado (adoptada):** se registra por separado `nivel declarado`, `nivel validado`, `evidencia` y `observación`. Un nivel 4–5 sin evidencia suficiente queda limitado provisionalmente a nivel 2. Nivel 3 exige artefacto vigente + muestra; nivel 4 añade medición + acción trazable; nivel 5 añade tendencia + prueba de efectividad.

---

## 4. MOTOR DE CÁLCULO Y REGLAS ESPECIALES

**Cálculo base:**
1. Promediar preguntas válidas por sub-dimensión.
2. Promediar las 4 sub-dimensiones → dimensión.
3. Promediar las 6 dimensiones → global.
4. No redondear intermedios. Mostrar siempre declarado, validado y cobertura de evidencia.

**Regla de piso crítico (adoptada):** en sub-dimensiones de riesgo (D3.3, D3.4, D5.3, D5.4), una sub-dimensión en nivel 1 **marca la dimensión como riesgo** aunque el promedio sea 3+. Un negocio con buena marca y datos de clientes desprotegidos no está "en Definido": está expuesto. El promedio enmascara; el mínimo informa.

**Índice de consistencia madre↔hijas (adoptado — producto de venta):** se compara el nivel autodeclarado en la madre (preventa) contra el promedio de sus 16 hijas (post-venta). La brecha es un insight de venta: *"te autopercibes en 4; tu operación detallada dice 2.4"*. Es el mejor argumento del post-venta.

**Reporte de dispersión intra-dimensión:** sub-dimensiones [2,2,4,4] ≠ [3,3,3,3] aunque promedien igual. La primera es "fachada" (fuerte en lo visible, débil en lo estructural) — insight vendible.

**Enrutado del motor de recomendación (criterio Kimi — cuestionario estable):**
- Las **2 dimensiones más bajas** (ranking relativo) orientan los servicios de entrada. Robusto al sesgo inflacionario uniforme. Empate <0.25 se resuelve por impacto/urgencia/evidencia, no por decimales.
- **Ruta de certificación por sub-dimensión, no por promedio global:** si D3.3, D3.4, D5.3 o D5.4 están entre las más bajas → ruta **27001/privacidad**. Si dominan D1, D4, D6 → ruta **9001**. El cuestionario no se rebalancea; la inteligencia vive en el enrutado.

**Regla especial D5 (dimensión de madurez progresiva):**
- `P = promedio(D5.1, D5.2)` — presencia y reputación (piso).
- `T = promedio(D5.3, D5.4)` — datos y confianza demostrable (techo).
- El mapa muestra el promedio D5, pero **el reporte y el enrutado usan P y T por separado** (nunca se promedian piso y techo para decidir). Para conversaciones de privacidad/27001 se usa `T`.

---

## 5. LAS 6 PREGUNTAS-MADRE (PREVENTA · LENGUAJE DE CLIENTE)

Se conservan como escenarios de dolor en lenguaje de cliente — es la fortaleza comercial del instrumento. La persona elige la opción que describe lo ocurrido en los últimos 90 días, no la aspiracional.

| Dim | Pregunta-madre | Nota |
|---|---|---|
| **D1 · Procesos** | "Cuando entró un cliente o pedido nuevo, ¿cómo se coordinó el trabajo desde la solicitud hasta la entrega?" | — |
| **D2 · Dependencia del dueño** | "Si durante dos semanas no pudieras responder mensajes ni aprobar decisiones, ¿qué parte de la operación seguiría?" | La mejor pieza del instrumento: duele sin acusar. No suavizar. |
| **D3 · Herramientas y datos** | "Desde la oportunidad comercial hasta el cobro y la atención posterior, ¿cómo circulan la información y los accesos entre tus herramientas?" | — |
| **D4 · Visibilidad y decisión** | "Si hoy tuvieras que decidir dónde invertir, recortar o corregir, ¿con qué información contarías?" | Resuelto el doble barril: se enfoca en info para decidir. |
| **D5 · Presencia y confianza** | "Cuando un cliente corporativo te investiga antes de comprarte, ¿qué puede verificar sobre tu empresa y el cuidado de su información?" | Integra piso (presencia) y techo (datos). |
| **D6 · Capacidad de evolución** | "Cuando quieres lanzar un producto, servicio o mejora, ¿qué suele ocurrir desde la idea hasta la decisión final?" | — |

Las 5 opciones de cada madre se redactan con el mismo molde de arquetipos de las hijas, y la madre debe comportarse como el promedio esperado de sus 16 hijas (habilita el índice de consistencia). Las opciones completas se redactan en la fase Claude Code.

**Regla de aplicación D2:** las hijas 13–16 (institucionalización, tocan ego) nunca se muestran en preventa ni al abrir; son cierre de conversación. La dimensión puede mostrarse como "Continuidad y delegación" en capa comercial (decisión abierta de Serge).

---

## 6. INSTRUMENTO POST-VENTA · 96 PREGUNTAS-HIJAS

Formato de cada tabla: **#** · pregunta · **Ancla** (norma §cláusula/control) · **Soporte** [D]irecto / [P]arcial / [M]arco propio · **27001 (Annex SL)** equivalente estructural donde aplica. Notas de consolidación al pie de cada dimensión.

---

### D1 · PROCESOS — ancla primaria ISO 9001

**Pregunta-madre:** *"Cuando entró un cliente o pedido nuevo, ¿cómo se coordinó el trabajo desde la solicitud hasta la entrega?"*

#### D1.0 · Intake y requisitos *(NUEVA sub-dimensión — corrige vacío de trazabilidad madre↔hijas señalado por Kimi)*
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 1 | ¿En qué medida se capturan y confirman requisitos, alcance y condiciones antes de comprometer la entrega? | 9001 §8.2.1, §8.2.2 | [D] | — |
| 2 | ¿En qué medida la cotización/compromiso refleja el alcance acordado y evita retrabajo por malentendidos? | 9001 §8.2.3 | [D] | — |

#### D1.1 · Definición y documentación
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 3 | ¿En qué medida están identificados los procesos clave y los resultados que debe producir cada uno? | 9001 §4.4 | [D] | §4.4 |
| 4 | ¿En qué medida la forma de ejecutar cada proceso clave está documentada con el detalle necesario para el rol que la usa? | 9001 §4.4, §7.5 | [D] | §7.5 |
| 5 | ¿En qué medida la versión vigente está accesible en el punto de uso y se controlan las obsoletas? | 9001 §7.5.2, §7.5.3 | [D] | §7.5 |
| 6 | ¿En qué medida cada proceso clave tiene responsable, entradas, salidas y criterios de desempeño? | 9001 §4.4.1, §5.3 | [D] | §5.3 |

#### D1.2 · Ejecución y consistencia
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 7 | ¿En qué medida las personas ejecutan el proceso con los mismos criterios y controles definidos? | 9001 §8.5.1 | [D] | — |
| 8 | ¿En qué medida desviaciones, errores y retrabajos se registran, controlan y analizan para evitar recurrencia? *(mejor formato de la dimensión — frecuencia observable)* | 9001 §8.7, §10.2 | [D] | §10.2 |
| 9 | ¿En qué medida se cumplen requisitos y tiempos de entrega pese a cambios de persona o variaciones de demanda? | 9001 §8.1, §8.5.1 | [D] | — |

#### D1.3 · Flujo y cuellos de botella
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 10 | ¿En qué medida se planifica la capacidad frente al volumen y prioridades esperadas? *(capacidad HOY — frontera con D6.4 que es escala planeada)* | 9001 §7.1.1, §8.1 | [D] | — |
| 11 | ¿En qué medida se miden tiempos de ciclo, cargas, colas o bloqueos para localizar restricciones? | 9001 §9.1.1 | [P] | §9.1 |
| 12 | ¿En qué medida las transferencias entre personas/áreas tienen entradas, salidas y criterios de aceptación? | 9001 §4.4.1, §8.1 | [D] | — |

#### D1.4 · Mejora y automatización
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 13 | ¿En qué medida los procesos se revisan con frecuencia definida usando datos, retroalimentación e incidentes? | 9001 §9.1.3, §10.3 | [D] | §10.1 |
| 14 | ¿En qué medida se eliminan pasos, esperas o controles que ya no aportan valor? *(re-anclado: era §6.1 incorrecto → §10.3 mejora)* | 9001 §10.3, §4.4 | [D] | §10.1 |
| 15 | ¿En qué medida las oportunidades de simplificación/automatización se priorizan por impacto, costo y riesgo? *(automatizar lo EXISTENTE — frontera con D6.2 que es adoptar lo nuevo)* | 9001 §10.1 | [P] | §10.1 |
| 16 | ¿En qué medida cada cambio relevante compara línea base con resultado y verifica efectos no deseados? | 9001 §9.1.3, §10.1 | [D] | — |

**Consolidación D1:** Se añadió D1.0 Intake (corrige el vacío del primer eslabón). Se re-ancló #14 (§6.1→§10.3). Fusionadas las antiguas "demasiadas manos" (juicio→hecho) en #12. Frontera explícita #10 (hoy) vs D6.4 (escala). Total: 16 hijas (2 intake + 14 núcleo). *Nota: al sumar D1.0, se retiró una hija redundante de flujo para mantener 16.*

---

### D2 · DEPENDENCIA DEL DUEÑO — ancla ISO 9001 + 22301
*(Etiqueta comercial opcional: "Continuidad y delegación")*

**Pregunta-madre:** *"Si durante dos semanas no pudieras responder mensajes ni aprobar decisiones, ¿qué parte de la operación seguiría?"*

#### D2.1 · Delegación y roles
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 1 | ¿En qué medida cada función crítica tiene responsable y suplencia competente que no dependen del dueño? | 9001 §5.3; 22301 §8.4.2 | [D] | — |
| 2 | ¿En qué medida el equipo toma decisiones rutinarias dentro de límites acordados? *(par calibrador con #3 — verificación de consistencia, NO fusionar)* | 9001 §5.3 | [D] | — |
| 3 | ¿En qué medida están definidos los umbrales para decidir, consultar o escalar una excepción? | 9001 §5.3, §7.4 | [D] | — |
| 4 | ¿En qué medida las decisiones críticas continúan cuando una persona específica no está disponible? *(re-anclado: era 22301 §5.1 incorrecto → §5.3 autoridades)* | 9001 §5.3 | [P] | — |

#### D2.2 · Conocimiento distribuido
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 5 | ¿En qué medida el conocimiento crítico está identificado, conservado y disponible para quien lo necesita? | 9001 §7.1.6 | [D] | — |
| 6 | ¿En qué medida existen cobertura, capacitación y suplencia para roles críticos? | 9001 §7.2; 22301 §8.3.4 | [D] | — |
| 7 | ¿En qué medida las transferencias de conocimiento y suplencias se practican y se corrigen cuando fallan? | 9001 §7.2; 22301 §8.5 | [P] | — |
| 8 | ¿En qué medida credenciales, cuentas, licencias y contactos críticos se administran con mecanismos corporativos y no dependen de cuentas personales? *(re-anclado: era 22301 §8.4.2 → 27001 accesos; suma presencia 27001)* | 27001 A.5.16, A.5.17, A.5.18 | [D] | A.5.16–18 |

#### D2.3 · Continuidad operativa
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 9 | ¿En qué medida está designada una persona que responde y opera, con qué autoridad, cuando el dueño no está? *(reformulada hacia MECANISMO, no repetir escenario de ausencia)* | 22301 §8.4.2 | [D] | — |
| 10 | ¿En qué medida existe un plan de continuidad con estructura de respuesta, comunicaciones, acciones y responsables? *(de los mejores anclajes)* | 22301 §8.4.4 | [D] | — |
| 11 | ¿En qué medida están identificados recursos, proveedores, información y suplentes para continuar/recuperar? | 22301 §8.3.4 | [D] | — |
| 12 | ¿En qué medida los objetivos de recuperación (RTO) y los planes se han probado, medido y ajustado? *(re-anclado: RTO se define en §8.2.2 BIA, no §8.4.1)* | 22301 §8.2.2, §8.5 | [D] | — |

#### D2.4 · Institucionalización *(techo — no mostrar en preventa)*
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 13 | ¿En qué medida el negocio tiene identidad e infraestructura propias más allá del dueño como persona? *(re-etiquetado: era §5.1 forzado → marco propio honesto)* | Marco propio MEBUKI | [M] | — |
| 14 | ¿En qué medida la promesa al cliente la cumple la organización y no una persona? *(reformulada desde "confían en ti")* | 9001 §5.1.2 | [P] | — |
| 15 | ¿En qué medida se ha realizado una ausencia controlada del dueño y se corrigieron los bloqueos observados? *(mecanismo probado, no escenario)* | 22301 §8.5; 9001 §10.1 | [P] | — |
| 16 | ¿En qué medida roles, procesos, activos y obligaciones están documentados para que el negocio pueda venderse sin perder continuidad? *(techo; se eligió "venta" sobre "herencia" por alineación con valor)* | Marco propio MEBUKI | [M] | — |

**Consolidación D2:** #4, #8, #12 re-anclados (corrigen errores). #2/#3 conservados como **par calibrador** declarado. #9 y #15 reformulados hacia mecanismos (no repetir el escenario de la madre). #13 y #16 etiquetados marco propio (honestidad > cláusula forzada). Suplencia designada ahora explícita en #9.

---

### D3 · HERRAMIENTAS Y DATOS — ancla ISO/IEC 27001:2022 (Anexo A)
*La dimensión con mejor mapeo — y donde estaban los 2 errores más claros, ya corregidos.*

**Pregunta-madre:** *"Desde la oportunidad comercial hasta el cobro y la atención posterior, ¿cómo circulan la información y los accesos entre tus herramientas?"*

#### D3.1 · Inventario y racionalización
| # | Pregunta | Ancla | Sop. | 9001 |
|---|---|---|---|---|
| 1 | ¿En qué medida existe un inventario vigente de herramientas, suscripciones, repositorios y proveedores tecnológicos? | 27001 A.5.9 | [D] | — |
| 2 | ¿En qué medida el inventario identifica propietario, finalidad, criticidad, información tratada, costo y renovación? | 27001 A.5.9, A.5.23 | [P] | — |
| 3 | ¿En qué medida se revisan y retiran de forma controlada herramientas duplicadas, inactivas o "suscripciones muertas"? *(mejor tono cliente del instrumento; soporte parcial: es eficiencia+seguridad)* | 27001 A.5.9, A.5.10 | [P] | — |
| 4 | ¿En qué medida el alta, cambio y baja de herramientas sigue un proceso aprobado con responsable y criterios de seguridad? | 27001 A.5.9, A.5.23 | [D] | — |

#### D3.2 · Integración y flujo de datos *(consolidada de 4 a 3 — liberó hueco para anti-malware)*
| # | Pregunta | Ancla | Sop. | 9001 |
|---|---|---|---|---|
| 5 | ¿En qué medida están identificados los flujos de datos críticos (origen, destino, integración, responsable) y se evita la recaptura manual? *(fusiona islas+fuente única+copy-paste; re-etiquetado: A.8.6 era incorrecto → marco propio con apoyo A.5.14)* | Marco propio MEBUKI (apoyo 27001 A.5.14) | [M] | §7.5 |
| 6 | ¿En qué medida la información se transfiere mediante métodos aprobados y protegidos según su clasificación y riesgo? | 27001 A.5.12, A.5.14 | [D] | — |
| 7 | ¿En qué medida cada dato crítico tiene fuente autorizada, responsable y reglas de calidad/actualización? *(única "fuente de verdad"; la duplicada de D4.2 se ajustó — ver D4)* | 9001 §7.5, §9.1.1 | [P] | A.5.14 |

#### D3.3 · Seguridad y acceso *(sub-dimensión de RIESGO — aplica piso crítico)*
| # | Pregunta | Ancla | Sop. | 9001 |
|---|---|---|---|---|
| 8 | ¿En qué medida el acceso a información y sistemas se concede por rol, necesidad y mínimo privilegio? | 27001 A.5.15, A.8.2, A.8.3 | [D] | — |
| 9 | ¿En qué medida identidades y derechos de acceso se autorizan, revisan, modifican y revocan en todo su ciclo de vida? | 27001 A.5.16, A.5.18 | [D] | — |
| 10 | ¿En qué medida se usa autenticación multifactor donde el riesgo lo exige? *(partido de doble barril: 2FA como hecho único)* | 27001 A.8.5, A.5.17 | [D] | — |
| 11 | ¿En qué medida la información sensible se clasifica y protege en almacenamiento y transferencia? *(re-anclado: A.8.2 era incorrecto → A.5.12 clasificación + A.8.3)* | 27001 A.5.12, A.8.3, A.8.24 | [D] | — |

#### D3.4 · Respaldo y resiliencia *(sub-dimensión de RIESGO — aplica piso crítico)*
| # | Pregunta | Ancla | Sop. | 9001 |
|---|---|---|---|---|
| 12 | ¿En qué medida los respaldos cubren información y sistemas críticos con frecuencia, retención y responsables? | 27001 A.8.13 | [D] | — |
| 13 | ¿Cuándo fue la última vez que restauraste un respaldo para verificar que sirve? *(pregunta-hecho anti-sesgo; ambas A.8.13; re-anclado desde A.8.14)* | 27001 A.8.13; 22301 §8.2.2 | [D] | — |
| 14 | ¿En qué medida se revisan responsabilidades, jurisdicción, compromisos, cambios y salida de los servicios en nube críticos? | 27001 A.5.23 | [D] | — |
| 15 | ¿En qué medida los puntos únicos de falla (tecnológico o proveedor) tienen alternativas/redundancia proporcionales al riesgo? *(re-anclado: dependencia de proveedor es A.5.21/A.5.19, no solo A.5.22)* | 27001 A.5.19, A.5.21, A.8.14 | [D] | — |

#### D3.5 · Higiene básica *(NUEVA — vacío de cobertura más importante de D3 según Kimi)*
| # | Pregunta | Ancla | Sop. | 9001 |
|---|---|---|---|---|
| 16 | ¿En qué medida equipos y sistemas se mantienen actualizados y protegidos contra malware (parches, antimalware)? *(vector real de incidente en PYME: ransomware por equipos sin parche)* | 27001 A.8.7, A.8.8 | [D] | — |

**Consolidación D3:** 2 errores de referencia corregidos (#5 A.8.6→marco propio; #11 A.8.2→A.5.12/A.8.3). #13 convertida a pregunta-hecho (fecha de última restauración). #15 re-anclado a cadena de suministro TIC. Añadida higiene anti-malware (#16). D3.2 consolidada de 4→3 para abrir el hueco. D3.3 y D3.4 marcadas como sub-dimensiones de riesgo (piso crítico). Total: 16 hijas.

---

### D4 · VISIBILIDAD Y DECISIÓN — ancla ISO 9001 (Cl. 9)
*La dimensión más financiera y menos "de cláusula" — varias hijas viven del principio de decisión basada en evidencia (ISO 9000). Etiquetado honesto de soporte parcial.*

**Pregunta-madre:** *"Si hoy tuvieras que decidir dónde invertir, recortar o corregir, ¿con qué información contarías?"*

#### D4.1 · Medición e indicadores
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 1 | ¿En qué medida existen objetivos e indicadores vinculados con resultados del negocio y requisitos del cliente? | 9001 §6.2, §9.1.1 | [D] | §9.1 |
| 2 | ¿En qué medida se calcula costo y margen de entrega con un método definido y repetible? | 9001 §9.1.1 | [P] | — |
| 3 | ¿En qué medida se monitorean percepción, satisfacción y quejas de clientes con método y frecuencia definidos? | 9001 §8.2.1, §9.1.2 | [D] | — |
| 4 | ¿En qué medida cada indicador tiene definición, fuente, responsable, frecuencia y umbral de acción? | 9001 §9.1.1 | [D] | §9.1 |

#### D4.2 · Datos confiables
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 5 | ¿Tus números cuadran con el banco/fuentes sin ajustes, o has encontrado errores en los últimos 3 meses? *(convertida de percepción a hecho verificable — conciliación es evidencia)* | 9001 §9.1.3 | [P] | — |
| 6 | ¿En qué medida cada cifra crítica se rastrea hasta una fuente vigente y se distingue de copias obsoletas? *(re-anclado: §7.1.5 era calibración de equipos, incorrecto → §7.5.3/§9.1.1; fuente única vive aquí, no en D3.2)* | 9001 §7.5.3, §9.1.1 | [P] | §7.5 |
| 7 | ¿En qué medida los reportes se producen de forma repetible y a tiempo, sin consolidación heroica? | 9001 §9.1.3 | [P] | — |
| 8 | ¿En qué medida se distingue desempeño/rentabilidad por producto, servicio o segmento con criterios acordados? | 9001 §9.1.3 | [P] | — |

#### D4.3 · Decisión basada en evidencia
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 9 | ¿En qué medida las decisiones relevantes registran datos, supuestos y criterio? *(principio ISO 9000 de decisión basada en evidencia + §9.3)* | 9001 §9.3 (ppio. ISO 9000) | [P] | §9.3 |
| 10 | ¿En qué medida el desempeño se revisa con frecuencia definida y cada acuerdo tiene responsable y fecha? | 9001 §9.3.1 | [D] | §9.3 |
| 11 | ¿En qué medida existen indicadores adelantados y umbrales para actuar antes de que la desviación sea crítica? | 9001 §9.1.1 | [P] | — |
| 12 | ¿Conoces y revisas el punto de equilibrio y umbrales financieros para sostener la operación? *(excelente: concreta y verificable — modelo a imitar)* | 9001 §9.1.1 | [P] | — |

#### D4.4 · Información oportuna para actuar *(consolidada — evita duplicar D4.1)*
| # | Pregunta | Ancla | Sop. | 27001 |
|---|---|---|---|---|
| 13 | ¿En qué medida comparas resultados contra una meta o presupuesto/forecast definido? *(NUEVA — cubre vacío entre "tengo números" y "decido"; escalón natural)* | 9001 §6.2, §9.1.1 | [D] | — |
| 14 | ¿En qué medida quienes deciden acceden a los mismos datos vigentes y comprenden sus definiciones? *(fusiona "vista actualizada" + "mismos datos")* | 9001 §7.4, §9.1.1 | [D] | §7.4 |
| 15 | ¿En qué medida las desviaciones materiales generan alerta y una respuesta previamente definida? | 9001 §9.1.1, §10.2 | [P] | — |
| 16 | ¿En qué medida resultados y acuerdos de revisión se comunican a los responsables y se verifica su cierre? *(anclaje elegante §7.4)* | 9001 §7.4, §9.3 | [D] | §7.4 |

**Consolidación D4:** #6 re-anclado (§7.1.5→§7.5.3/§9.1.1). #5 convertida a pregunta-hecho (conciliación bancaria). "Fuente única de verdad" resuelta en D4.2 #6 (se retiró la duplicada de D3.2). Añadida #13 presupuesto/forecast (vacío real). Consolidadas las 4 hijas de "datos actuales" en 2. Etiquetado honesto: D4 vive del principio de evidencia más que de cláusulas.

<!-- ⚠️ TRUNCADO: integrado hasta el final del Bloque A (consolidación D4).
     Pendiente: Bloque B (D5 y D6) y Bloque C (secciones 7–12).
     Ver docs/dmo/README.md — sección "Contenido pendiente". -->
