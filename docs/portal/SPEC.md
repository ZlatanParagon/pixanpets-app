# ARSEG Cyber — Portal de Cliente
## Dictamen crítico y definición revisada v0.3

**Propietario:** ARSEG Cyber — ARSEG Cynergy Systems, S.A.S. de C.V.  
**Fecha:** 28 de agosto de 2026  
**Clasificación:** uso interno; definición de negocio y desarrollo.  
**Destino:** proyecto de Claude Code.  
**Estado:** propuesta para aprobación; no constituye autorización de producción.  
**Categoría:** instrumento de relación con clientes; no producto licenciable.  
**Identidad:** REF-001; extensión para interfaz clara sujeta a aprobación de marca.

---

## Cómo utilizar este documento

La **Parte I** explica qué debe corregirse y por qué. La **Parte II** contiene una definición v0.3 autosuficiente propuesta para sustituir el borrador recibido, una vez aprobadas sus decisiones pendientes. La **Parte III** reúne las fuentes y los criterios de interpretación.

Para desarrollo, las reglas de la Parte II prevalecen sobre las descripciones del borrador v0.2. Las decisiones marcadas como pendientes no se deben resolver mediante suposiciones del desarrollador. Los valores de capacidad y operación se identifican expresamente como objetivos propuestos, no como compromisos comerciales existentes.

**Límite de la revisión:** el texto recibido termina a mitad del apartado 9.5, en «Mismo tratamiento que los infor». Contiene referencias a los apartados 14.1 y 14.4 que no están en el material recibido. Esta revisión no presume su contenido ni afirma haber revisado una versión completa. La sección de decisiones de esta v0.3 es una propuesta nueva.

Además del texto compartido, se contrastaron dos antecedentes internos: el estándar REF-001 y la especificación de ARSEG Tabletop. Se emplearon únicamente para preservar marca y fronteras entre aplicaciones; no para incorporar funciones adicionales por defecto. Véanse I-02 e I-03.

---

# PARTE I — DICTAMEN CRÍTICO

## I.1 Dictamen ejecutivo

**La propuesta tiene un propósito comercial y operativo claro, pero todavía no debe entregarse como instrucción cerrada de programación.** Los problemas principales no son de interfaz: son reglas de autoridad, estados, publicación, custodia y cierre que hoy admiten interpretaciones incompatibles.

El mayor valor está en reunir **compromisos visibles de ambas partes, entregables confiables y evidencia de la relación**. No está en construir otro gestor de proyectos ni un GRC reducido. Conviene proteger ese centro y quitar complejidad periférica antes de sumar módulos.

Se recomienda conservar las siete áreas como mapa de experiencia, pero no desarrollar las siete con la misma profundidad desde el inicio. Un primer cliente real necesita una relación consultable de principio a fin, aunque algunas funciones avanzadas se ejecuten fuera del portal y este conserve su evidencia.

### Lo que debe conservarse

- La vista ejecutiva que permite entender qué se contrató, qué se entregó y qué falta resolver.
- La separación entre trabajo interno y publicación al cliente, el versionado y los permisos específicos para información sensible.
- El retiro ordenado como parte del servicio, sin convertirlo en una promesa de eliminación imposible de demostrar.

### Lo que debe cambiar de enfoque

La formulación «hacer atribuible el retraso del cliente» debe traducirse, en la experiencia del cliente, en **responsabilidades recíprocas y consecuencias documentadas**. Un portal que solo registra incumplimientos del cliente puede percibirse como una herramienta de defensa del proveedor. Uno que muestra también los compromisos de ARSEG hace la trazabilidad más creíble.

La frase «el portal refleja estado, no lo produce» es demasiado absoluta: una aceptación, una respuesta y una solicitud de cierre sí nacen en el portal. La frontera correcta es: **el portal no ejecuta la consultoría; publica sus resultados y registra las interacciones formales de la relación**.

Finalmente, «no licenciable» no significa «sin mantenimiento». Si ARSEG construye y opera un portal con información de clientes, necesita responsables, presupuesto, soporte, actualización y respuesta a incidentes. La estrategia debe reducir esa carga, no negarla.

## I.2 Matriz de observaciones

**Bloqueante:** impide operar con información real o formalizar actos. **Alta:** afecta el valor o la consistencia del servicio. **Media:** mejora la experiencia y reduce costo de construcción.

| ID | Prioridad | Observación sobre v0.2 | Ajuste incorporado en v0.3 |
|---|---|---|---|
| H01 | Alta | Una sola `fase_activa` del cliente no representa varios servicios simultáneos. | Estado de cuenta separado de fase por proyecto; inicio agregado sin esconder servicios de otras fases. |
| H02 | Alta | Se entra después de la formalización, pero la contratación inicial parece ocurrir dentro. | Elegibilidad documentada. El piloto incorpora servicios ya formalizados; los nuevos SOW corresponden a relaciones existentes. |
| H03 | Alta | El portal «no produce estado», aunque registra aprobaciones, respuestas y remediación. | Matriz de fuentes de verdad y registros propios del portal, sin convertirlo en herramienta de consultoría. |
| H04 | Alta | La API se pospone, pero se pretende evitar que el consultor trabaje dos veces. | Contrato mínimo de publicación e importación desde MVP. Integraciones amplias después; no sincronización total. |
| H05 | Alta | Solo se modelan decisiones pendientes del cliente. | Compromisos compartidos: insumo, decisión y validación, con parte responsable cliente o ARSEG. |
| H06 | Alta | Faltan vencimiento, calendario, evidencia de comunicación, controversia e impacto real. | Fecha original y vigente, eventos de comunicación, afectación estimada y confirmada por separado. Sin penalización ni prórroga automática. |
| H07 | Bloqueante | «Un proyecto por SOW» y «aceptar cotización genera proyecto» pueden duplicar proyectos o activarlos sin alcance formal. | La activación exige un instrumento de alcance formalizado; las ampliaciones modifican el proyecto existente. Operaciones idempotentes. |
| H08 | Bloqueante | Ser patrocinador en la aplicación no demuestra facultades de representación. | Autoridad comercial documentada y vigente, distinta del rol; formalización externa como ruta inicial. |
| H09 | Bloqueante | Prohibir ver hallazgos no impide descargarlos dentro de un informe o expediente. | Clasificación y permisos en documentos, anexos, metadatos, búsqueda, notificaciones y exportaciones. |
| H10 | Bloqueante | Un «borrador» de entregable puede confundirse con material interno visible. | Borrador interno nunca publicado; documento enviado para revisión es una publicación explícita con propósito y audiencia. |
| H11 | Bloqueante | «Bitácora íntegra» y «fuente de verdad» no definen cómo se impide o detecta alteración. | Estado y evento en una transacción; bitácora de solo adición, copia protegida y controles documentados. No event sourcing completo por defecto. |
| H12 | Alta | Emitir una URL firmada no demuestra que el usuario descargó o leyó el archivo. | Separar autorización de acceso, archivo servido y fallo. Acceso autenticado para descargas; nunca equiparar descarga con aceptación. |
| H13 | Bloqueante | Se certifica eliminación y después se conserva un expediente consultable. | Cierre operativo, consulta histórica, conservación restringida y eliminación son hitos diferentes. Constancias con alcance explícito. |
| H14 | Bloqueante | Un único plazo por cliente no cubre contratos, evidencias, bitácoras, respaldos y obligaciones de conservación. | Política por clase documental y proyecto; suspensión de purga por causa documentada, con revisión. Validación jurídica. [R02][R03][R04] |
| H15 | Alta | El catálogo permite al cliente marcar «remediado», pero el flujo exige validación ARSEG. | Estado «cierre solicitado» y validación separada. La aceptación de riesgo no equivale a remediación. |
| H16 | Alta | La tendencia podría mejorar por cerrar registros, sin nueva evaluación comparable. | Mediciones importadas y validadas, con metodología, alcance y fecha. Métricas de seguimiento separadas de madurez. |
| H17 | Bloqueante | Notificaciones, monitoreo, manual y retención se posponen pese a ser necesarios para un cliente real. | Sus versiones mínimas pasan a MVP; la sofisticación y automatización ampliada se mantienen en V1. |
| H18 | Media | Comparar Word/PDF y comentar por sección implica un editor documental que no se ha dimensionado. | MVP: índice de secciones, comentarios ligados a versión y resumen de cambios. Comparación visual avanzada posterior. |
| H19 | Bloqueante | Recuperación MFA, bajas, acceso de soporte y alcance de Administracion no están definidos. | Identidad administrada; revocación efectiva; Administración sin acceso general al contenido; acceso excepcional trazado. |
| H20 | Alta | Excluir canales es razonable, pero condiciona quién puede ser el primer cliente. | Piloto directo. No representar al canal como otro contacto de cliente ni publicar condiciones internas al cliente final. |
| H21 | Alta | No hay indicador de actualidad: una pantalla desactualizada puede aparentar normalidad. | Fecha de corte, última publicación, responsable y advertencia de actualización pendiente. |
| H22 | Alta | No se distingue entregar, recibir, revisar y aceptar un entregable. | Publicación, acuse y conformidad son actos distintos; criterios y autorizados definidos por servicio. |
| H23 | Alta | Operación recurrente carece de periodos y renovación explícita. | Proyecto recurrente con periodos de servicio; renovar no borra la línea base ni crea compromisos retroactivos. |
| H24 | Media | La paleta no garantiza legibilidad en todas sus combinaciones; algunos colores de estado no sirven para texto pequeño. | Reglas de contraste calculadas y aplicación accesible sin recolorear la marca. Véase II.10. [R09][R10] |
| H25 | Alta | Compartir columna vertebral con Tabletop puede convertirse en dependencia de entrega o superficie de ataque común. | Compartir componentes y contratos de datos cuando convenga; no asumir sesiones, base de datos ni permisos comunes. |
| H26 | Alta | No hay costo de operación, responsable del sistema ni puerta de salida técnica. | Dueño de operación, presupuesto total, exportación portable, restauración probada y criterios de lanzamiento. |
| H27 | Media | Hay referencias incorrectas o incompletas: áreas en apartado 6 y decisiones 14 no recibidas. | Reestructuración autosuficiente, glosario y decisiones pendientes explícitas. |

## I.3 Cambios de prioridad recomendados

| Cambio | Razón |
|---|---|
| Subir notificaciones esenciales, monitoreo básico, política de retención, cierre básico y manual a MVP. | No son adornos: permiten que la operación se sostenga y que el primer cliente pueda salir de forma ordenada. |
| Mantener en MVP identidad, aislamiento, clasificación, versionado, compromisos y verificación independiente. | Constituyen el piso de confianza de todo el portal. |
| Reducir edición de acuerdos a publicación, índice, comentarios y constancia de formalización externa. | Evita construir un gestor de contratos antes de validar el uso. |
| Dejar aceptación contractual dentro del portal condicionada a decisión jurídica y, cuando corresponda, proveedor externo. | Su prioridad deriva de la necesidad legal y de negocio; no debe etiquetarse POST de manera incondicional. |
| Dejar remediación estructurada, propuestas de ampliación y tendencia comparable para V1. | Primero comprobar que estado, documentos y compromisos reducen coordinación. |
| Posponer comparación documental avanzada, conectores numerosos y automatismos complejos. | Reducen poco riesgo inicial frente a su costo de construcción y mantenimiento. |

## I.4 Preguntas que deben tener respuesta antes de producción

Las respuestas propuestas, los responsables y el bloqueo correspondiente están en II.15. Estas son las decisiones de negocio principales:

1. ¿Quién será el primer cliente directo y qué servicio ya formalizado se publicará?
2. ¿Qué actos se harán dentro del portal y cuáles continuarán formalizándose fuera?
3. ¿Quién puede aprobar comercialmente, dar conformidad técnica y aceptar riesgos? No necesariamente es la misma persona.
4. ¿Dónde se produce cada dato y quién se compromete a mantener actualizada su publicación?
5. ¿Qué información jamás debe subirse, incluso si el cliente la ofrece?
6. ¿Qué conservará ARSEG al cerrar, para qué finalidad, en qué sistemas y durante cuánto tiempo?
7. ¿Quién operará el portal y con qué presupuesto de mantenimiento, soporte y revisión independiente?
8. ¿La disponibilidad del portal es informativa o es un compromiso contractual específico? La v0.3 propone lo primero para el piloto.

---

# PARTE II — DEFINICIÓN REVISADA v0.3

## II.1 Propósito, límites y reglas rectoras

### 1.1 Propósito

El Portal de Cliente es la ventana de una organización cliente hacia sus servicios con ARSEG Cyber. Publica información revisada del servicio, permite responder compromisos y conserva evidencia de las interacciones relevantes desde la incorporación hasta el fin del acceso histórico.

Debe permitir responder:

- ¿Qué servicios tengo contratados y cuál es su situación actual?
- ¿Qué entregables están disponibles, cuál es su versión vigente y qué requiere mi revisión?
- ¿Qué está pendiente del cliente y qué está pendiente de ARSEG?
- ¿Qué evidencia de avance existe y qué evaluaciones comparables permiten hablar de evolución de seguridad?

La cuarta pregunta no obliga a inventar una calificación. Cuando no exista evaluación aplicable, se mostrará «Este servicio no incluye una medición de postura». Cuando falte una segunda medición comparable, se mostrará «Aún no hay una comparación disponible».

### 1.2 Reglas rectoras

**RR-01 — Relación, no ejecución interna.** El portal registra interacción y publica resultados; no gestiona la producción de la consultoría.

**RR-02 — Información publicada, no espejo indiscriminado.** Nada se vuelve visible por aparecer en una carpeta o herramienta interna. Publicar exige una decisión explícita de audiencia, versión y clasificación.

**RR-03 — Compromisos recíprocos.** Las mismas reglas de fechas, evidencia y estado aplican al cliente y a ARSEG.

**RR-04 — Evidencia antes que afirmación.** Cada estado que implique formalización, publicación, conformidad, validación o eliminación tiene evidencia identificable.

**RR-05 — Menor privilegio.** Identidad, pertenencia al cliente, alcance de proyectos, permiso de información y facultad para actuar se verifican por separado.

**RR-06 — Historia preservada.** Las correcciones no reescriben documentos publicados, aceptaciones ni fechas originales. Se agregan versiones y eventos.

**RR-07 — No automatizar juicio profesional.** El portal no diagnostica, no declara cumplimiento y no calcula madurez a partir de contadores.

**RR-08 — Salida posible desde el primer cliente.** Exportación, revocación de acceso, consulta histórica y eliminación controlada tienen una ruta operable desde MVP.

**RR-09 — Simplicidad operable.** Una aplicación modular con servicios administrados es preferible a una plataforma propia de microservicios, firma o identidad.

**RR-10 — Seguridad verificable.** Un control se considera implementado por su prueba y evidencia, no por una etiqueta en la arquitectura.

### 1.3 Exclusiones permanentes

No incluye CRM, prospección, gestión de tareas internas, horas, capacidad de consultores, facturación, cobranza, mesa de ayuda, repositorio libre de archivos, motor de precios, editor completo de contratos, firma electrónica propia, escáner de vulnerabilidades ni GRC integral.

No incluye IA generativa, análisis automático de expedientes, conclusiones automáticas ni envío de información a servicios de IA. Su eventual incorporación requeriría una decisión de alcance y tratamiento de datos independiente.

El portal no es un canal de respuesta urgente a incidentes. Mostrará el canal de contacto acordado para ese fin, cuando forme parte del servicio.

### 1.4 Alcance inicial por tipo de relación

MVP y V1 atienden relaciones directas entre ARSEG y la organización cliente. Una cuenta representa una organización contratante dentro de un perímetro autorizado; no un conglomerado completo por coincidencia de dominio de correo.

El acceso de aliados, canales y clientes finales de canal queda fuera. No se resolverá asignando al aliado el rol de patrocinador del cliente final. Es un modelo diferente de titularidad, visibilidad comercial y autorización.

---

## II.2 Ciclo de vida y unidad de servicio

### 2.1 Tres niveles distintos

| Nivel | Qué representa | Regla |
|---|---|---|
| Cuenta de cliente | Organización, usuarios, acuerdos de acceso y configuración. | Su estado no resume artificialmente la fase de todos sus servicios. |
| Proyecto o servicio contratado | Unidad visible que se origina en un alcance formalizado. | Puede ser puntual o recurrente. Conserva su propia fase y su expediente. |
| Periodo de servicio | Ventana de seguimiento de un servicio recurrente. | Tiene fecha de corte, compromisos, publicaciones y cierre de periodo; no es un nuevo contrato por sí mismo. |

### 2.2 Estados de cuenta

`incorporacion → activa → historica → acceso_cerrado`

`suspendida` es una condición de acceso independiente y temporal. Suspender no borra información, no termina contratos ni detiene automáticamente plazos comerciales.

Una cuenta solo pasa a histórica cuando no tiene servicios activos. El cierre de un proyecto no vuelve históricos los demás. El vencimiento del acceso a un expediente puede ocurrir aunque la cuenta siga activa por otros servicios.

### 2.3 Fases por proyecto

`preparacion → ejecucion` o `operacion_recurrente → cierre → cerrado`

La revisión de un nuevo alcance o cambio se gestiona en su acuerdo; no hace retroceder todo el proyecto ni cambia su alcance vigente hasta que se formalice.

Para cada proyecto se registran modalidad, responsable ARSEG, contactos designados, alcance vigente, fechas, estado operativo y fecha de corte de la información.

### 2.4 Elegibilidad e incorporación

El socio responsable documenta que existe una relación comercial formalizada y autoriza el alta. Un NDA aislado con un prospecto no habilita el uso del portal como CRM.

El piloto comienza con un servicio ya formalizado fuera del portal. La incorporación registra organización, evidencia de relación, responsables, permisos, condiciones de uso, aviso de privacidad y política de conservación aplicable.

No se exige que todos los clientes usen el mismo proveedor de identidad empresarial de ARSEG.

---

## II.3 Usuarios, permisos y autoridad

### 3.1 Identidad y pertenencia

`Usuario` identifica a la persona autenticada. `Contacto` es un dato de la relación y puede existir sin acceso. `Membresia` vincula a un usuario con un cliente y un rol. `AsignacionProyecto` limita los proyectos que puede consultar o gestionar.

Un mismo usuario puede tener distintas membresías, pero debe seleccionar explícitamente la cuenta activa. El dominio de correo no otorga pertenencia ni acceso automático.

El rol no prueba facultades legales. La autoridad comercial y la autorización de aceptación de riesgo se documentan de manera independiente.

### 3.2 Se conservan los seis roles

| Rol | Acceso ordinario | Acciones permitidas | Límites |
|---|---|---|---|
| Patrocinador | Resumen ejecutivo, alcance, documentos comerciales y proyectos autorizados. | Responder compromisos; formalizar cuando tenga autoridad vigente y el mecanismo esté habilitado. | El detalle técnico restringido requiere permiso adicional. No puede asignarse a sí mismo facultades. |
| Responsable operativo | Estado, entregables operativos y compromisos de proyectos asignados. | Responder solicitudes, aportar evidencia permitida y solicitar cierre de hallazgos. | Sin aceptación comercial. La conformidad técnica y la aceptación de riesgo requieren autorización expresa. |
| Consulta | Lectura de estado y entregables generales de proyectos autorizados. | Consultar y descargar lo permitido. | Sin cambios; sin hallazgos ni documentos restringidos. Ver importes exige permiso comercial de lectura. |
| Socio responsable | Clientes y proyectos asignados; contenido comercial. | Autorizar publicaciones comerciales, registrar formalización externa y autorizar cierre. | No formaliza en nombre del cliente. Acceso técnico restringido solo si está autorizado. |
| Líder de proyecto | Proyectos asignados y contenido técnico habilitado. | Publicar avances y entregables autorizados, gestionar compromisos y validar remediación. | No modifica precios ni acepta riesgos del cliente. |
| Administración | Datos de cuenta, contactos y configuración autorizada. | Ejecutar altas, bajas e invitaciones; configurar políticas aprobadas. | No obtiene acceso automático a contratos, hallazgos o archivos; no se concede privilegios de contenido. |

### 3.3 Permisos separados del rol

Los permisos mínimos explícitos son `comercial:ver`, `tecnico_restringido:ver`, `entregable:dar_conformidad` y `riesgo:aceptar`. La capacidad `comercial:formalizar` requiere además rol Patrocinador y una autoridad documentada vigente.

Cada permiso puede estar limitado a proyectos. Ver un resumen ejecutivo de seguridad no implica ver detalles explotables.

La aceptación de riesgo es una decisión de la organización cliente, no una aceptación comercial. Puede otorgarse a un patrocinador o responsable operativo con responsabilidad de riesgo documentada. ARSEG no acepta riesgos por el cliente. Todo permiso de actuar exige acceso autorizado al objeto y a la evidencia necesaria para decidir; no se concede aceptación de un hallazgo que la persona no puede consultar.

### 3.4 Altas, cambios y bajas

Las invitaciones son nominativas, de un solo uso y con caducidad. No hay autorregistro abierto.

El primer patrocinador y sus facultades se validan con evidencia externa. Cambios posteriores de patrocinador o autoridad requieren solicitud de una persona autorizada del cliente y validación del socio. Administración ejecuta el cambio; no lo aprueba por sí sola.

Revocar una membresía bloquea inmediatamente nuevas consultas, operaciones y descargas y revoca las sesiones o permisos derivados. No es posible retirar archivos que ya se hayan entregado al destinatario. La revocación no reescribe actos anteriores: estos conservan identidad, facultades registradas y evidencia del momento en que ocurrieron.

El acceso técnico excepcional de soporte exige motivo, autorización, duración, MFA y registro. No se implementa suplantación silenciosa de usuarios. Las cuentas de servicio son identidades técnicas separadas, sin facultades de aprobación del cliente.

---

## II.4 Información, publicación y fuentes de verdad

### 4.1 Clasificación mínima

| Clase | Contenido | Audiencia |
|---|---|---|
| General de servicio | Hitos, compromisos no sensibles y resúmenes ejecutivos revisados. | Miembros autorizados del proyecto. |
| Comercial restringida | Importes, condiciones, SOW completos, propuestas y constancias comerciales. | Permiso comercial y alcance de proyecto aplicable. |
| Técnica restringida | Hallazgos detallados, evidencia técnica e informes que los incluyan. | Permiso técnico restringido y alcance de proyecto aplicable. |
| Interna ARSEG | Papeles de trabajo, costos, márgenes, borradores y deliberaciones internas. | No se publica al cliente. |

Un documento de clasificación mixta adopta la restricción más alta. No se protege un informe ocultando únicamente el menú de hallazgos. Un resumen ejecutivo es un artefacto separado, revisado y aprobado; no un recorte automático no validado.

La clasificación se aplica también a nombres, miniaturas, búsqueda, comentarios, eventos visibles, correo y exportaciones. El mero título de un archivo puede revelar información sensible.

### 4.2 Fuentes de verdad

| Información | Se produce en | Qué conserva el portal |
|---|---|---|
| Metodología, análisis y trabajo de consultoría | Herramientas del despacho. | Resultado aprobado y referencia de origen; no papeles de trabajo. |
| Precio y configuración de alcance | Calculadora, configurador o propuesta elaborada fuera. | Copia publicada exacta; no recalcula precios. |
| Alcance contractual | Instrumento formalizado y sus modificaciones. | Versiones, anexos y evidencia de formalización. |
| Avance de hitos | Herramienta de ejecución o declaración revisada del líder. | Corte publicado con fecha y autor. |
| Compromisos compartidos y respuestas | Portal, o importación explícita de una comunicación externa. | Registro histórico y evidencia del origen. |
| Hallazgo técnico | Informe o evaluación aprobada. | Copia publicada, identificador de origen y revisiones. |
| Seguimiento de remediación | Portal cuando el servicio lo incluya. | Estados y validaciones; si existe GRC rector, la integración debe fijar un solo dueño de cada campo. |
| Evaluación de postura | Evaluación profesional externa al portal. | Medición validada, metodología y documento soporte. |

Una copia importada debe identificar `sistema_origen`, `id_origen`, `version_origen` y `fecha_corte`. No habrá dos sistemas editando silenciosamente el mismo campo.

### 4.3 Publicación deliberada

Flujo básico: **borrador interno → revisión → publicación explícita → versión histórica**.

Antes de publicar se verifica destinatario, proyecto, clasificación, versión, seguridad del archivo y aprobación requerida. Las publicaciones comerciales las autoriza el socio. En informes técnicos restringidos, una segunda persona ARSEG habilitada verifica audiencia y saneamiento antes de la primera publicación; en el piloto puede ser el socio con permiso técnico.

La vista previa «como cliente» aplica los permisos seleccionados sin crear una sesión suplantada. El evento identifica al usuario ARSEG que realizó la previsualización.

La publicación no equivale a aceptación del cliente. Un archivo publicado para revisión es visible porque ARSEG lo decidió; no porque todos los borradores internos sean accesibles.

---

## II.5 Experiencias funcionales

### 5.1 Inicio — situación de la relación

El inicio presenta servicios activos, alertas accionables, próximas fechas y fecha de corte. No es un tablero de ventas ni un panel con indicadores decorativos.

Orden recomendado: resumen de situación; compromisos que requieren respuesta del usuario; compromisos pendientes de ARSEG; próximos hitos; últimas publicaciones; evaluaciones disponibles.

Cada tarjeta de proyecto incluye nombre, modalidad, responsable, fase, situación temporal y última actualización. «Sin actualización reciente» es distinto de «En tiempo».

El estado temporal se calcula frente a las fechas vigentes y el último corte publicado. No se presenta un porcentaje global si no hay una regla documentada. Cuando el servicio lo requiera, el porcentaje debe venir de un plan aprobado con ponderaciones explícitas; no del número de documentos cargados.

Los pendientes aparecen también dentro del proyecto para no crear un octavo módulo. Los módulos no contratados o no habilitados no se muestran como pantallas vacías.

**Aceptación funcional:** un patrocinador de prueba debe identificar sin ayuda servicio, situación, entregable vigente, próximo hito y pendientes de ambas partes.

### 5.2 Acuerdos y alcance

El acuerdo de alcance de trabajo —SOW— tiene identidad estable y revisiones inmutables una vez publicadas. Se registran documento, anexos, índice de secciones, resumen de cambios y evidencia de formalización. En esta área también se consultan los acuerdos de confidencialidad, contratos marco y convenios aplicables. Solo un instrumento de alcance inicial habilita la creación de un proyecto; un NDA o un contrato marco sin servicio definido no lo hacen.

En MVP, los comentarios se anclan a una revisión y a una sección de un índice cargado explícitamente; pueden incluir página como referencia auxiliar. No se promete comparación semántica automática de Word o PDF. Una nueva revisión no mueve comentarios antiguos por coincidencia de texto; los pendientes se vinculan expresamente a su tratamiento.

Debe ser posible consultar el alcance vigente y su historial. «Revisión superada» describe una versión editorial; no declara que un compromiso contractual previamente formalizado desapareció.

**Rutas de formalización:**

- **MVP — externa documentada.** El portal muestra «Formalizado fuera del portal», fecha, instrumento y evidencia. Se separa quién firmó según el documento de quién registró y validó la evidencia en ARSEG. Un firmante externo puede no ser usuario del portal; se conserva su identidad real según el instrumento, sin asignarle artificialmente el rol Patrocinador.
- **V1 condicionada — dentro del portal o mediante proveedor externo.** Solo después de la decisión jurídica sobre mecanismo, identidad, facultades, consentimiento y conservación. El uso de un proveedor de firma, cuando proceda, no reemplaza la verificación de quién puede obligar al cliente.

Una aceptación debe señalar revisión exacta, anexos incluidos, huellas de archivos, identidad, autoridad aplicable, instante del servidor, intención expresada, método y constancia. Si un proceso de firma genera un nuevo PDF, se conservan tanto la referencia del documento enviado como el documento firmado y su relación; sus hashes no se asumen iguales.

No se acepta una revisión retirada ni una revisión sustituida antes del acto. La interfaz debe recargar el contenido cuando detecta una versión concurrente diferente. No hay casillas preseleccionadas ni aceptación por descarga.

### 5.3 Propuestas y cotizaciones

Se publican únicamente ampliaciones o nuevos servicios sobre una relación existente. Cada revisión fija alcance ofertado, monto, moneda, tratamiento de impuestos tal como fue publicado, condiciones, vigencia y origen.

El portal no calcula precios, impuestos o descuentos. Los montos se almacenan en unidades menores enteras o decimal exacto, nunca en coma flotante para operaciones monetarias.

Estados de una revisión: `borrador`, `publicada`, `aceptada`, `declinada`, `vencida`, `retirada`. Una revisión aceptada no pasa después a vencida por el transcurso del tiempo. No se modifica una oferta ya publicada: se retira o se sustituye por otra revisión.

La elegibilidad para aceptar se verifica en el servidor al momento de la acción. La vigencia se guarda como instante inequívoco; si se captura una fecha, la pantalla muestra hora de corte y zona horaria. La zona inicial propuesta es `America/Mexico_City`, configurable por cuenta.

Aceptar y declinar tienen una complejidad equivalente. La razón de declinación es opcional, salvo acuerdo explícito distinto; declinar no abre automáticamente una tarea comercial al cliente.

**Regla de activación:** aceptar una propuesta no activa por sí solo la ejecución. Si la propuesta formalizada constituye el instrumento de alcance válido, se vincula como tal; en otro caso queda «Aceptada comercialmente; formalización de alcance pendiente». Se activa el proyecto solo cuando existe ese instrumento. Si una propuesta cumple esa función, se registra también como acuerdo de alcance inicial vinculado a los mismos archivos y constancia; no se regenera el documento ni se exige una aceptación duplicada.

Una ampliación de un proyecto produce una modificación de alcance; no un segundo proyecto por defecto. Un nuevo servicio sí puede generar un proyecto distinto. La decisión `nuevo_servicio` o `ampliacion` se fija antes de publicar y se muestra al cliente.

### 5.4 Proyectos y compromisos compartidos

El proyecto contiene alcance vigente, hitos externos, publicaciones de avance y compromisos entre las partes. No contiene tareas internas ni horas de consultores.

Cada hito tiene fecha original, fecha vigente, estado, criterio de terminación y evidencia de cumplimiento. Un cambio de fecha conserva la anterior y su motivo; si cambia el compromiso contractual, requiere el mecanismo de cambio acordado.

#### Compromiso compartido

Los tipos admitidos son solicitud de insumo, decisión, acceso coordinado y validación. El acceso coordinado registra la gestión; nunca almacena contraseñas, llaves o tokens.

Campos mínimos: proyecto, descripción inequívoca, parte responsable, persona responsable, solicitante, fecha de solicitud, fecha original de respuesta, fecha vigente, criterio de resolución, hito afectado cuando aplique y consecuencia prevista.

Estados: `abierto → respondido → resuelto`. Puede pasar de `respondido` a `requiere_aclaracion`, y volver a `respondido`. Puede cancelarse con motivo. «Vencido» es una condición calculada, no un estado que borra la etapa de resolución.

Responder no equivale a resolver. Quien valida la resolución debe tener autoridad sobre el compromiso; por defecto es la parte solicitante a través del contacto designado. Un compromiso de ARSEG que depende de conformidad del cliente no se resuelve unilateralmente por ARSEG.

Se permiten adjuntos únicamente cuando son insumos expresamente solicitados y autorizados o evidencia de una respuesta. Esto amplía de forma acotada el borrador original: no abre una carpeta libre de intercambio.

#### Registro de afectación

Se distinguen fecha de publicación, envío de notificación, resultado del correo, primera consulta registrada, respuesta y resolución. No se afirma que un mensaje fue leído por el simple resultado «entregado» del proveedor de correo.

El atraso del compromiso se muestra contra su fecha vigente, usando el calendario documentado. El calendario inicial propuesto es días naturales; los días hábiles requieren calendario y zona acordados.

La afectación del proyecto se registra aparte: estimada o confirmada, hito afectado, causa y evidencia. Puede estar pendiente de acuerdo, reconocida o controvertida. No se suman automáticamente retrasos simultáneos, no se recalcula la ruta crítica y no se aplican penalizaciones, prórrogas ni cargos automáticos.

**Ejemplo:** «Se requiere confirmar la ventana de entrevistas antes del 12 de octubre a las 17:00. Sin confirmación, la fecha del hito H-03 debe revisarse». No: «El cliente causó cinco días de retraso» por haber contestado cinco días después.

#### Operación recurrente

En V1, el proyecto recurrente publica por periodo: actividades comprometidas, corte de avances, entregables, compromisos abiertos y próxima revisión. Los compromisos pueden continuar entre periodos sin perder su fecha original.

La renovación exige evidencia contractual según el servicio. No se renueva automáticamente por uso del portal.

### 5.5 Entregables

Cada entregable tiene identidad estable y versiones independientes. La versión publicada conserva archivo, hash, tamaño, tipo, autor, fecha, clasificación, audiencia, propósito de publicación y criterio de conformidad cuando aplique.

Estados editoriales: `borrador_interno`, `en_revision_interna`, `publicado`, `superado`, `retirado`. Una versión publicada no cambia sus bytes. Retirar requiere motivo y notificación proporcional; no elimina retroactivamente los registros de entrega o aceptación.

Se diferencian tres actos:

| Acto | Significado | Lo que no significa |
|---|---|---|
| Publicación | ARSEG pone una versión a disposición de una audiencia. | No implica lectura ni aceptación. |
| Acuse de recepción | Una persona autorizada confirma recepción. | No implica conformidad técnica o comercial. |
| Conformidad | La persona habilitada declara que cumple el criterio acordado. | No amplía el alcance ni sustituye firma contractual cuando sea necesaria. |

No se implementa aceptación tácita por silencio en MVP. Cualquier mecanismo posterior requiere soporte contractual y revisión jurídica.

La versión superada sigue accesible durante su plazo de consulta a quienes estén autorizados. Una versión retirada por error de destinatario o exposición indebida puede dejar de ser accesible, conservando el registro del retiro y la respuesta al incidente.

El portal no presenta una URL firmada emitida como prueba de descarga. Las descargas pasan por autorización de sesión y objeto; sus eventos se describen en II.7.

### 5.6 Hallazgos, remediación y postura

Esta capacidad se habilita únicamente cuando esté contratada. El informe técnico puede publicarse como entregable restringido en MVP sin que exista todavía un módulo de remediación.

#### Hallazgo

Incluye identificador de origen, título, dominio, severidad y esquema utilizado, descripción, evidencia saneada, recomendación, fecha de identificación y versión del informe fuente.

Estados de seguimiento: `abierto`, `en_tratamiento`, `cierre_solicitado`, `en_validacion`, `remediado`, `reabierto`, `riesgo_aceptado`.

El cliente puede asignar un responsable, registrar tratamiento y solicitar cierre. ARSEG puede iniciar validación, aprobar el cierre con evidencia o rechazarlo con motivo. Reabrir conserva los cierres anteriores y la nueva evidencia.

Ningún usuario cliente ni cuenta de integración puede pasar directamente a `remediado`. La validación requiere persona ARSEG habilitada, fecha, método y evidencia.

#### Aceptación de riesgo

Se registra en una entidad separada: solicitante, aprobador autorizado, motivo, alcance, exposición residual descrita, controles compensatorios cuando existan, fecha de aprobación, vencimiento y evidencia.

Estados de la solicitud: `solicitada`, `aprobada`, `rechazada`, `revocada`, `vencida`. Solo una aprobación vigente cambia la presentación del hallazgo a `riesgo_aceptado`.

Al vencer o revocarse la aceptación, el hallazgo vuelve a seguimiento abierto mediante evento y notificación, salvo que exista una validación de remediación posterior. Su vigencia efectiva se comprueba con el tiempo del servidor al consultar y actuar, aunque el trabajo programado de notificación aún no haya corrido. La aceptación no elimina el hallazgo ni lo suma a «remediados».

#### Evolución de postura

Cada medición conserva marco, versión de metodología, alcance, escala, fecha de evaluación, evaluador, periodo y referencia de evidencia. Las series solo se comparan cuando su comparabilidad está validada por ARSEG.

Cambiar de metodología, alcance o escala interrumpe la continuidad o exige una justificación de homologación documentada. No se conectan puntos incompatibles en una gráfica.

Los contadores de abiertos, vencidos, remediados y riesgos aceptados describen seguimiento. No sustituyen una evaluación de madurez y no producen automáticamente una mejora de postura.

### 5.7 Cierre y expediente

Cerrar un proyecto exige revisar entregables, compromisos pendientes, controversias, transferencia y condiciones de salida. Los pendientes no desaparecen: se resuelven o se documenta su tratamiento aceptado.

Se distinguen cuatro hitos:

1. **Cierre del servicio:** se documenta lo entregado, transferido y pendiente.
2. **Consulta histórica:** el expediente permanece disponible en solo lectura hasta la fecha acordada.
3. **Conservación restringida:** determinados documentos se mantienen fuera del acceso ordinario por finalidad o obligación documentada.
4. **Eliminación verificada:** se ejecuta sobre las categorías y sistemas cuyo plazo terminó y que no están sujetos a una excepción válida.

La cuenta histórica permite autenticar, consultar, descargar y administrar seguridad de acceso. «Solo lectura» impide modificar el expediente; no impide registrar accesos, revocar usuarios o ejecutar una purga autorizada.

El paquete portable contiene índice legible, archivos originales autorizados, versiones pertinentes, constancias, compromisos y resultados de seguimiento, además de un manifiesto de archivos con identificador, versión y hash. Los registros estructurados se exportan en CSV o JSON documentado.

El paquete para Consulta no contiene hallazgos ni documentos técnicos restringidos. Un paquete completo solo se entrega a un destinatario que reúna todos los permisos necesarios. No se genera un ZIP global para después confiar en que el receptor no abrirá ciertos archivos.

La constancia de eliminación especifica categorías, sistemas, alcance, método, fecha, responsable verificador, excepciones y vencimiento de respaldos residuales. El portal puede acreditar sus propios procesos; no puede certificar por sí solo que se borró información de correo, Drive, equipos de consultores o sistemas de terceros.

En MVP se admite una constancia elaborada y validada fuera del portal, acompañada de evidencias y registrada como entregable. La eliminación de copias de trabajo y la conservación del expediente se declaran por separado.

La encuesta de cierre es V1, opcional para el cliente y no condiciona la descarga del expediente ni la baja.

---

## II.6 Modelo conceptual de datos

Este modelo define responsabilidades e invariantes; no impone una tabla física por cada concepto. El diseño detallado deberá conservar estas separaciones sin construir un motor genérico innecesario.

### 6.1 Convenciones obligatorias

Toda entidad que pertenezca a un cliente incluye `cliente_id`, incluso cuando también tenga `proyecto_id`. Las claves foráneas compuestas deben impedir vincular un hijo de un cliente con el padre de otro. `Usuario` y los catálogos globales son excepciones explícitas, no entidades de contenido del cliente.

Los identificadores no secuenciales reducen enumeración, pero no sustituyen autorización. Las fechas de eventos se guardan en UTC; las fechas de negocio conservan zona horaria y calendario. Las revisiones publicadas tienen número de revisión propio; la concurrencia se controla además con un contador técnico de versión.

Un `archivo_ref` es una referencia a almacenamiento privado, no una URL pública persistente. Los datos personales se minimizan; no se replica contenido técnico dentro de la bitácora.

### 6.2 Identidad y autorización

```text
Cliente
  id, razon_social, nombre_visible, sector
  estado_cuenta, acceso_suspendido, motivo_suspension
  zona_horaria, politica_conservacion_id, evidencia_relacion_ref
  socio_responsable_id, creado_en

Usuario
  id, proveedor_identidad, sujeto_identidad
  nombre, correo_verificado, activo
  # La autenticación y los factores se gestionan en el proveedor de identidad.

Contacto
  id, cliente_id, nombre, correo, cargo, activo, usuario_id opcional

Membresia
  id, cliente_id, usuario_id, rol, activa
  alcance (cuenta o proyectos_asignados)
  vigente_desde, vigente_hasta, version_permisos

AsignacionProyecto
  id, cliente_id, membresia_id, proyecto_id

PermisoAdicional
  id, cliente_id, membresia_id, codigo_permiso
  proyecto_id opcional, evidencia_autorizacion_ref
  aprobado_por, vigente_desde, vigente_hasta, revocado_en

AutoridadComercial
  id, cliente_id, membresia_id
  tipos_acto, limite_monto opcional, moneda opcional
  proyecto_id opcional, evidencia_facultades_ref
  vigente_desde, vigente_hasta, validada_por, revocada_en
```

### 6.3 Relación contractual y servicio

```text
Acuerdo
  id, cliente_id, clave
  tipo (confidencialidad, marco, alcance_inicial o modificacion)
  proyecto_destino_id opcional, acuerdo_base_id opcional

AcuerdoRevision
  id, cliente_id, acuerdo_id, numero_revision
  titulo, estado_editorial, documento_ref, manifiesto_anexos_ref
  hash_documento, hash_manifiesto, publicado_en, publicado_por
  resumen_cambios, revision_anterior_id opcional

SeccionAcuerdo
  id, cliente_id, acuerdo_revision_id, clave_seccion, titulo, orden

ComentarioAcuerdo
  id, cliente_id, acuerdo_revision_id, seccion_id
  autor_membresia_id, texto, creado_en, respuesta_ref opcional
  estado (abierto, atendido, trasladado)
  comentario_sucesor_id opcional

Formalizacion
  id, cliente_id, tipo_instrumento, revision_instrumento_id
  metodo (externa o mecanismo_habilitado)
  identidad_actuante_ref, autoridad_snapshot_ref
  fecha_acto, registrado_en, registrado_por, validado_por
  evidencia_ref, documento_firmado_ref opcional
  hash_documento_objeto, hash_documento_firmado opcional
  texto_consentimiento_version opcional, proveedor_ref opcional
  # La identidad del firmante no se confunde con la persona que carga evidencia.

Propuesta
  id, cliente_id, clave, tipo (propuesta o cotizacion)
  destino (nuevo_servicio o ampliacion), proyecto_destino_id opcional
  sistema_origen, id_origen

PropuestaRevision
  id, cliente_id, propuesta_id, numero_revision
  alcance_ref, archivo_ref, hash_archivo
  monto_exacto, moneda, tratamiento_impuestos_texto
  condiciones_ref, vigente_hasta, estado
  publicado_en, respuesta_en, formalizacion_id opcional

Proyecto
  id, cliente_id, clave, nombre, modalidad (puntual o recurrente)
  acuerdo_inicial_revision_id, formalizacion_inicial_id
  fase, estado_operativo, lider_membresia_id
  inicio_comprometido, fin_original, fin_vigente, fin_real
  fecha_corte_publicada, actualizado_por
  consulta_historica_hasta opcional

CambioAlcance
  id, cliente_id, proyecto_id, acuerdo_revision_id
  formalizacion_id, descripcion_impacto, vigente_desde

PeriodoServicio
  id, cliente_id, proyecto_id, inicio, fin, fecha_corte, estado

Hito
  id, cliente_id, proyecto_id, periodo_id opcional
  clave, nombre, fecha_original, fecha_vigente, estado
  criterio_terminacion, evidencia_ref opcional

PublicacionAvance
  id, cliente_id, proyecto_id, periodo_id opcional
  fecha_corte, texto_publicado, autor_id, publicado_en
  sistema_origen, id_origen, version_origen
```

### 6.4 Compromisos y documentos

```text
CompromisoCompartido
  id, cliente_id, proyecto_id, tipo, descripcion
  parte_responsable (cliente o arseg)
  contacto_responsable_id, solicitante_membresia_id
  solicitada_en, fecha_original, fecha_vigente, calendario_ref
  criterio_resolucion, hito_afectado_id opcional
  impacto_previsto, estado, version_concurrencia

RespuestaCompromiso
  id, cliente_id, compromiso_id, autor_membresia_id
  texto, evidencia_ref opcional, registrada_en
  origen (portal o comunicacion_externa), referencia_origen opcional
  # Una importación identifica al autor de la comunicación y al registrador.

ResolucionCompromiso
  id, cliente_id, compromiso_id, resultado, motivo
  validada_por, validada_en, evidencia_ref opcional

AfectacionCompromiso
  id, cliente_id, compromiso_id, hito_id
  tipo (estimada o confirmada), descripcion, magnitud opcional
  estado_acuerdo (pendiente, reconocida, controvertida)
  evidencia_ref, registrada_por, registrada_en

Entregable
  id, cliente_id, proyecto_id, tipo, titulo, criterio_conformidad opcional

EntregableRevision
  id, cliente_id, entregable_id, numero_revision
  estado_editorial, proposito (informativo o para_revision)
  clasificacion, archivo_ref, hash_archivo, mime, bytes
  autor_id, revisado_por, publicado_por, publicado_en
  revision_anterior_id opcional

Archivo
  id, cliente_id, proyecto_id opcional, almacenamiento_key
  nombre_visible, mime_validado, bytes, hash_sha256
  estado_seguridad (cuarentena, permitido, bloqueado)
  clasificacion, creado_por, creado_en, politica_conservacion_id

AcuseEntregable
  id, cliente_id, entregable_revision_id
  tipo (recepcion o conformidad), actor_membresia_id
  resultado, observaciones, registrado_en, evidencia_ref opcional
```

### 6.5 Hallazgos, evidencia de postura y retiro

```text
Hallazgo
  id, cliente_id, proyecto_id, clave, id_origen
  titulo, dominio, severidad, esquema_severidad
  descripcion, evidencia_ref, recomendacion, informe_revision_id
  estado_seguimiento, responsable_contacto_id, actualizado_en

ValidacionRemediacion
  id, cliente_id, hallazgo_id, solicitud_cliente_ref
  resultado, metodo, evidencia_ref, validado_por, validado_en

AceptacionRiesgo
  id, cliente_id, hallazgo_id, solicitante_id, aprobador_id
  autoridad_ref, justificacion, alcance, exposicion_residual
  controles_compensatorios opcional, estado
  aprobada_en, vigente_hasta, evidencia_ref

MedicionPostura
  id, cliente_id, proyecto_id opcional
  marco, version_metodologia, alcance_ref, escala
  fecha_evaluacion, fecha_corte, evaluador, informe_revision_id
  resultados_estructurados, grupo_comparabilidad
  comparabilidad_validada_por, comparabilidad_justificacion

CierreProyecto
  id, cliente_id, proyecto_id, fecha_cierre
  evidencia_conformidad_ref, pendientes_transferidos_ref
  paquete_expediente_ref, consulta_historica_hasta

PoliticaConservacion
  id, version, clase_documental, finalidad
  evento_inicio_plazo, plazo, destino_conservacion
  fundamento_ref, aprobada_por, aprobada_en

ExcepcionConservacion
  id, cliente_id, proyecto_id opcional, objeto_ref opcional
  motivo, fundamento_ref, autorizada_por
  vigente_desde, revisar_en, liberada_en opcional

EjecucionEliminacion
  id, cliente_id, alcance_manifiesto_ref, politica_version
  solicitada_por, autorizada_por, ejecutada_en, verificada_por
  resultado, excepciones_ref, evidencia_ref
  fecha_agotamiento_respaldos opcional
```

### 6.6 Bitácora y entrega de eventos

```text
EventoBitacora
  id, cliente_id, proyecto_id opcional
  tipo_evento, tipo_objeto, objeto_id, version_objeto
  actor_tipo (persona, servicio o sistema), actor_id
  ocurrido_en_servidor, origen, correlacion_id
  detalle_minimo, clasificacion_evento
  contexto_seguridad_ref opcional

EventoSalida
  id, cliente_id, evento_bitacora_id, destino_tipo
  estado, intentos, proximo_intento_en, ultimo_error_saneado
  clave_idempotencia

Notificacion
  id, cliente_id, evento_origen_id, destinatario_usuario_id
  plantilla_version, canal, creada_en
  estado_envio, enviada_en, resultado_proveedor, proveedor_id

Exportacion
  id, cliente_id, proyecto_id opcional, solicitante_membresia_id
  permisos_snapshot, estado, manifiesto_ref, archivo_ref
  creada_en, vigente_hasta, error_saneado opcional
```

La política de exportación vuelve a comprobar permisos al entregar el archivo, no solo al solicitar su generación.

---

## II.7 Invariantes, transacciones y bitácora

### 7.1 Reglas que deben vivir en servidor y dominio

| ID | Invariante |
|---|---|
| INV-01 | Ninguna lectura o escritura de contenido puede cruzar la pertenencia a cliente ni el alcance de proyecto autorizado. |
| INV-02 | Una revisión publicada conserva sus bytes, anexos e identificación; cualquier corrección genera una nueva revisión. |
| INV-03 | Un mismo instrumento inicial formalizado no crea dos proyectos por reintento, doble clic o webhook repetido. |
| INV-04 | Una ampliación formalizada actualiza el alcance de su proyecto; no sustituye el historial ni crea un servicio por accidente. |
| INV-05 | El rol Patrocinador sin autoridad comercial vigente no puede formalizar. |
| INV-06 | Una acción no puede aceptar una oferta vencida o una revisión retirada, aunque el navegador aún muestre el botón. |
| INV-07 | Una aceptación registrada sobre una revisión no se cambia para apuntar a otra. |
| INV-08 | Ni descargar ni acusar recibo de un archivo equivale a conformidad o aceptación contractual. |
| INV-09 | Solo ARSEG habilitado valida remediación; solo el cliente autorizado acepta su riesgo. |
| INV-10 | Riesgo aceptado no cuenta como remediado ni mejora automáticamente la medición de postura. |
| INV-11 | Las fechas originales, las respuestas y los eventos publicados no se corrigen mediante sobrescritura silenciosa. |
| INV-12 | Un estado de negocio relevante no se confirma sin su evento durable. |
| INV-13 | Una operación en modo histórico no puede alterar el expediente, salvo actuación de seguridad o conservación autorizada y trazada. |
| INV-14 | Ninguna eliminación ignora una excepción de conservación vigente ni excede el alcance de su autorización. |
| INV-15 | Una restauración no puede reexponer datos ya eliminados o accesos ya revocados. |
| INV-16 | El contenido técnico restringido conserva su restricción al transformarse, exportarse, notificarse o versionarse. |

### 7.2 Fuente de verdad: distinción necesaria

Los documentos formalizados son la evidencia del alcance acordado. La base transaccional mantiene el estado operativo. `EventoBitacora` conserva la secuencia de actos registrados en el portal. Son funciones complementarias.

No se implementa reconstrucción total de toda la base a partir de eventos como requisito inicial. Una arquitectura de event sourcing completo solo se justificaría mediante una decisión posterior; no es necesaria para cumplir este propósito.

El cambio de estado, el evento de bitácora y el registro de salida pendiente se escriben en la misma transacción. Si esa transacción falla, la interfaz no anuncia éxito. El envío de correo ocurre después, mediante una cola durable de salida —outbox—; un fallo de correo no revierte una aceptación ya confirmada.

El almacenamiento de objetos no se presume parte de la transacción de base de datos. Antes de publicar se comprueba que el archivo permitido existe, que su hash coincide y que su clave no permite reemplazo. Las cargas incompletas o huérfanas se limpian mediante un proceso controlado; no se borran objetos referenciados por versiones publicadas.

### 7.3 Concurrencia e idempotencia

Las acciones sensibles incluyen versión esperada e identificador de operación. El servidor comprueba autorización, estado, vigencia y versión dentro de la operación transaccional.

Los reintentos con la misma clave y contenido devuelven el resultado anterior. Reutilizar una clave con contenido distinto produce conflicto. Se usan restricciones de unicidad para evitar proyectos o aceptaciones duplicados; no se confía únicamente en deshabilitar el botón.

Los eventos externos se deduplican por proveedor e identificador. El receptor debe tolerar duplicados y orden distinto. Un webhook no crea por sí solo autoridad comercial ni reemplaza la verificación del instrumento exacto.

### 7.4 Integridad y visibilidad de bitácora

La aplicación ordinaria solo puede agregar eventos. No dispone de funciones para editar o borrar su historia. Las correcciones son eventos posteriores relacionados.

Se mantiene una copia protegida en un destino de auditoría con permisos y conservación independientes de las credenciales ordinarias de la aplicación. Las capacidades concretas de inmutabilidad o detección de alteración se documentan y prueban; no se usa «inalterable» como promesa absoluta frente a cualquier administrador de infraestructura. [R07]

Se distinguen la bitácora de negocio, los registros técnicos y los eventos de seguridad. No se almacenan contraseñas, tokens, URLs firmadas completas ni texto íntegro de hallazgos en los logs. IP y agente, cuando se justifiquen, tienen finalidad, acceso y retención definidos; no se exponen indiscriminadamente en el expediente del cliente. [R07]

El cliente ve los accesos de personas ARSEG a su contenido que atraviesan los canales instrumentados, indicando persona, objeto, acción y fecha. Los accesos de infraestructura se integran o se declaran como límite de cobertura. No se promete registrar una lectura hecha sobre una copia ya descargada fuera del sistema.

MVP ofrece consulta básica por proyecto y exportación autorizada. V1 amplía filtros, presentación y cobertura de accesos administrativos.

### 7.5 Descargas y archivos servidos

Por defecto, las descargas y previsualizaciones se entregan a través de una ruta autenticada que vuelve a comprobar membresía, proyecto y clasificación. El almacenamiento es privado. Si internamente se utilizan URLs firmadas de corta duración, no se exponen como enlaces públicos permanentes.

Se registran al menos `acceso_archivo_autorizado`, `archivo_servido` o `entrega_archivo_fallida`, según la evidencia disponible en el canal de entrega. Las respuestas parciales y reintentos se correlacionan para no inflar contadores.

«Archivo servido» significa que el sistema efectuó la entrega en los términos de su canal de transporte. No acredita lectura humana, conformidad ni ausencia de redistribución. El portal no debe afirmar más de lo que puede observar.

Una alternativa que entregue directamente al navegador una URL firmada de tipo portador necesita una decisión explícita: puede ser reutilizada durante su vigencia y el acceso posterior no identifica necesariamente a la persona originalmente autorizada. No es la opción inicial para contenido restringido.

---

## II.8 Arquitectura y seguridad mínima

### 8.1 Arquitectura propuesta

Se propone una aplicación web modular en TypeScript, una base PostgreSQL administrada con aislamiento por filas, un proveedor de identidad con MFA, almacenamiento privado de objetos, correo transaccional y un procesador durable de trabajos de salida, exportación y eliminación.

No se selecciona proveedor de nube ni región en este documento. La decisión debe comprobar residencia, subprocessadores, costos, respaldos, soporte y posibilidad de exportación. No se presupone que todas esas capacidades queden en una misma región por elegir allí la base de datos.

Componentes de responsabilidad:

```text
Navegador autenticado
  -> protección perimetral y limitación de tasa
  -> aplicación y autorización por objeto
  -> dominio y transacciones
       -> PostgreSQL con políticas de aislamiento
       -> almacenamiento privado de archivos
       -> bitácora y salida durable
            -> correo, exportación, eliminación, webhooks habilitados

Proveedor de identidad -> sesión verificada y membresía autorizada
Herramienta ARSEG -> interfaz de publicación acotada -> mismas reglas de dominio
```

No se requieren microservicios, Kubernetes, blockchain, un motor propio de firma ni un directorio de identidad desarrollado desde cero. Compartir código con Tabletop es una optimización, no una dependencia obligatoria para entregar el portal.

### 8.2 Aislamiento por cliente

La autorización combina sesión válida, membresía activa, alcance de proyecto, permiso de contenido y facultad de acción. El `cliente_id` recibido en una URL o solicitud no se considera una prueba de autorización.

PostgreSQL debe aplicar políticas de seguridad por fila a las tablas de contenido. El rol utilizado en solicitudes normales no puede ser superusuario, propietario que evada las políticas ni tener `BYPASSRLS`. Las políticas, vistas y funciones se prueban expresamente. PostgreSQL documenta excepciones de propietario y roles privilegiados; habilitar RLS por sí solo no demuestra aislamiento. [R05]

El contexto de cliente de una conexión reutilizada queda limitado a la transacción y se valida contra identidad y membresía; no se hereda de una solicitud previa. Las políticas incluyen lectura, inserción, actualización y borrado, además de claves que impiden relaciones entre clientes. [R05][R06]

Se verifican también almacenamiento, búsquedas, caché, previsualizaciones, exportaciones, procesos de fondo, colas y correo. Ningún proceso masivo utiliza un contexto global para entregar resultados a clientes sin verificación individual. [R06]

Las pruebas usan al menos dos clientes sintéticos aunque el piloto tenga uno solo.

### 8.3 Identidad y sesión

MFA es obligatorio para usuarios cliente y ARSEG. Se recomienda un mecanismo resistente a phishing cuando el proveedor y los usuarios lo soporten; el mecanismo inicial y su recuperación se aprueban antes de producción. No se desarrolla un sistema propio de factores. [R12][R13]

La recuperación de cuenta no debe ser más débil que el acceso ordinario. Cambiar correo, restablecer factores y habilitar una nueva autoridad son acciones sensibles; requieren verificación, notificación y registro. No se permite desactivar MFA informalmente desde Administración. [R12][R13]

Valores propuestos para piloto: inactividad de 30 minutos y duración máxima de sesión de 12 horas, con advertencia antes del cierre. Formalización, ampliación de permisos, exportación restringida masiva y autorización de eliminación requieren autenticación reciente, propuesta de hasta 5 minutos. Estos números son decisiones operativas a aprobar, no valores exigidos por OWASP. [R14]

Las sesiones se protegen en cookies seguras y contra falsificación de solicitudes. No se almacenan tokens de sesión en ubicaciones de navegador accesibles sin necesidad a código de la página. Se limita el acceso a datos sensibles en cachés y no se habilita almacenamiento offline de expedientes en el navegador.

### 8.4 Protección perimetral

Se mantiene Cloudflare como componente previsto por el borrador, condicionado a la arquitectura aprobada. WAF y limitación de tasa complementan, pero no sustituyen, la autorización de la aplicación.

Las reglas de país no se activan como una restricción universal: requieren justificación para no bloquear a un patrocinador autorizado que viaje o a una organización con operación internacional.

La protección antibot se concentra en autenticación, invitaciones y recuperación, con escalamiento según riesgo y alternativa accesible. Cuando se utilice Turnstile, el token debe validarse en servidor; renderizar el widget no basta. [R11]

Se limita por separado autenticación, descarga, búsqueda, aceptación, generación de exportaciones y API. Se protege el origen para evitar que una ruta alternativa eluda el perímetro.

### 8.5 Archivos y contenido

MVP admite solo tipos necesarios y aprobados: PDF, DOCX, XLSX, PPTX, CSV, PNG y JPEG, sujetos a validación real de tipo y contenido. Los formatos Office con macros, ejecutables, HTML y archivos cifrados que no puedan inspeccionarse se rechazan. Los ZIP de entrada no se admiten inicialmente; los expedientes ZIP los genera el servidor con nombres de ruta seguros. [R08]

Toda carga entra en cuarentena. Se revisan tamaño, extensión, tipo real y contenido malicioso antes de publicarla; no se confía en el `Content-Type` del navegador. Los nombres internos son generados por el sistema. La previsualización no ejecuta contenido activo. [R08]

El límite propuesto por archivo es 50 MiB para el piloto; su aumento requiere prueba de capacidad y costo. Los archivos no se envían a analizadores públicos ni a servicios externos no autorizados. Los insumos del cliente deben estar saneados: sin credenciales, bases de datos productivas completas ni datos personales ajenos al propósito del servicio.

Los SVG oficiales de marca son activos estáticos de despliegue previamente aprobados, no una excepción para que cualquier usuario cargue SVG ejecutable.

### 8.6 Cifrado, secretos y ambientes

Se exige cifrado en tránsito y en reposo, inventario de llaves, gestión de secretos fuera del repositorio y procedimiento probado de rotación y revocación. Las capacidades y responsabilidades del proveedor se documentan; «cifrado administrado» no elimina la responsabilidad de configurar accesos.

Desarrollo, pruebas y producción tienen bases, objetos, secretos e identidades de integración segregados. No se copian datos reales a desarrollo o pruebas. Las demostraciones utilizan datos sintéticos claramente identificados.

No se comparten cookies o credenciales de producción con despliegues de vista previa. No se permiten datos sensibles en telemetría, herramientas de reproducción de sesiones ni rastreadores comerciales.

### 8.7 Verificación antes de producción

Se propone **OWASP ASVS 5.0.0, nivel 2**, como objetivo inicial, con requisitos adicionales por amenaza donde corresponda. La versión estable publicada consultada es 5.0.0. La matriz debe usar identificadores con versión, requisito, aplicabilidad, evidencia y resultado; no se declara una certificación ASVS por haber utilizado el estándar. [R01]

La revisión incluye modelo de amenazas, análisis de dependencias, pruebas de autorización por objeto, carga de archivos, concurrencia, sesión y controles de publicación. El pentest previo a producción lo ejecuta un tercero distinto de quien construyó y comprende los flujos autenticados de todos los roles relevantes.

La puerta de producción exige cierre y repetición de prueba de vulnerabilidades críticas y altas; las restantes requieren tratamiento aprobado. No se sustituyen esas pruebas por un escaneo sin autenticación ni por una captura del WAF.

---

## II.9 Privacidad, formalización y conservación

### 9.1 Validaciones jurídicas necesarias

Esta es una especificación de producto y control, no un dictamen jurídico. Antes de producción, asesoría legal debe validar los instrumentos de la relación, las facultades de los aprobadores, el mecanismo de formalización y la política de conservación.

El Código de Comercio contempla mensajes de datos y firma electrónica, pero el valor de un acto no debe reducirse a «hubo un clic». Deben revisarse identidad, atribución, intención, documento exacto y conservación. La NOM-151-SCFI-2016 trata conservación de mensajes de datos y digitalización; no se usa como sustituto de verificar autoridad o consentimiento. [R02][R03]

El artículo 49 del Código de Comercio establece un mínimo de diez años para los documentos en que se consignen los contratos, convenios o compromisos descritos en ese artículo. Esto no convierte todos los archivos técnicos en expedientes que deban conservarse diez años ni determina que todo deba seguir visible en el portal. [R02]

La revisión de privacidad debe utilizar la LFPDPPP vigente: la nueva ley fue publicada el 20 de marzo de 2025; el texto oficial consultado señala última reforma del 14 de noviembre de 2025. Deben considerarse finalidad, información a titulares, seguridad, incidentes, cancelación y excepciones aplicables. No se reutilizan sin revisión avisos o referencias de autoridad de la ley abrogada. [R04]

### 9.2 Roles y obligaciones de tratamiento

Se documenta para cada categoría si ARSEG actúa como responsable o encargado, las instrucciones del cliente, proveedores/subprocesadores, finalidades, ubicaciones de tratamiento y mecanismos de transferencia cuando procedan. No se determina ese papel únicamente porque ARSEG sea dueño del software.

Los avisos, acuerdos y procedimientos cubren datos de contactos, accesos, trazabilidad y evidencia técnica que pueda contener datos personales. Las solicitudes de derechos y los incidentes cuentan con responsables y canal de atención. Los plazos y destinatarios legales de aviso se definen por el caso aplicable; no se inventa un plazo universal para todos los clientes.

### 9.3 Política por categoría, no un solo número por cliente

| Categoría | Criterio de conservación | Regla de acceso |
|---|---|---|
| Acuerdos y constancias comerciales | Plazo jurídico aplicable, determinado por categoría. | Consulta durante periodo acordado; después conservación restringida si procede. |
| Entregables finales | Contrato, necesidad de servicio y política aprobada. | Audiencia autorizada hasta el fin de su consulta. |
| Evidencia técnica e insumos de cliente | Mínimo necesario según finalidad y contrato. | Técnica restringida; no retener por comodidad. |
| Compromisos, conformidades y decisiones | Evidencia de relación y obligaciones; clasificación jurídica específica. | Resumen autorizado; restringir datos no necesarios. |
| Auditoría y datos de autenticación | Finalidad de seguridad y trazabilidad con plazo definido. | Acceso limitado; no conservación indefinida por defecto. |
| Respaldos y copias residuales | Ciclo documentado de expiración y recuperación. | Sin consulta ordinaria; eliminación al agotar el ciclo. |

La política se versiona y se asigna a categorías y proyectos. Un cambio no acorta silenciosamente un plazo comprometido ni permite conservar todo indefinidamente.

Una excepción de conservación por controversia, obligación o investigación tiene fundamento, autorizador y fecha de revisión. Suspende únicamente las eliminaciones afectadas; no extiende automáticamente la consulta de usuarios.

### 9.4 Ejecución y evidencia de eliminación

Desde MVP existe un proceso controlado: simulación del alcance, revisión de excepciones, autorización, ejecución, verificación y evidencia. La primera versión puede requerir autorización humana; no debe depender de instrucciones informales ni de que alguien recuerde borrar una carpeta.

V1 amplía la programación, los avisos previos y la conciliación con otros sistemas. Los plazos no se fijan automáticamente en seis o doce meses sin decisión del cliente y ARSEG.

Los respaldos que aún contengan objetos eliminados permanecen segregados hasta expirar según política. Una restauración aplica el registro de bajas y eliminaciones antes de habilitar el acceso. La constancia indica qué fue eliminado, qué permanece temporalmente y cuándo se agota ese remanente.

La conservación legal puede mantenerse en un archivo restringido separado del expediente consultable. Cerrar acceso no es destruir información; destruir una categoría no es destruir toda la relación.

---

## II.10 Sistema visual y experiencia accesible

### 10.1 Relación con REF-001

Se conservan los archivos oficiales, los colores institucionales y Montserrat. El antecedente REF-001 consultado establece Navy como primario, Cobalt como acento y Purple como terciario de uso escaso; esa jerarquía debe preservarse, sin tratar el morado como una segunda superficie dominante. fileciteturn0file1L101-L116

La variante web clara es una extensión propuesta, no una modificación automáticamente aprobada del estándar documental. `Portal Mist` e `Ink Muted`, radios, escala digital y reglas accesibles se documentarán como tokens de interfaz antes de declarar oficial esa extensión.

### 10.2 Tokens propuestos

| Token | Valor | Aplicación |
|---|---|---|
| Deep Cyber Navy | `#0A1128` | Texto principal, títulos, banda de marca y etiquetas legibles. |
| Electric Cobalt | `#3A6CF4` | Acción principal, filetes y enlaces sobre superficies compatibles. |
| Nebula Purple | `#8A2BE2` | Acento terciario escaso; no fondo de lectura. |
| Pure White | `#FFFFFF` | Tarjetas y superficies de lectura. |
| Portal Mist | `#F5F6FC` | Fondo de aplicación. |
| Security Silver | `#E2E8F0` | Divisores decorativos y superficies inactivas. |
| Ink Muted | `#5C6A93` | Texto secundario y límites de controles cuando aplique. |
| Alert Crimson | `#EF4444` | Indicador crítico acompañado de texto y símbolo. |
| Signal Amber | `#E08A00` | Atención, con contorno o etiqueta legible cuando sea necesario. |
| Steady Green | `#109E7C` | Estado estable o remediación validada, sin depender solo del color. |

El gradiente `#3A6CF4 → #8A2BE2` se limita a filete superior de 3 px, acentos autorizados e isotipo oficial. No se pone detrás de texto de lectura ni en el fondo de tarjetas.

Tarjetas con radio de 12 px y controles con 8 px. La angularidad institucional se expresa con estructura y filetes, no con elementos decorativos que compitan con el estado del servicio.

### 10.3 Contraste: corrección necesaria

Objetivo propuesto: WCAG 2.2 AA. Para texto normal se utiliza la referencia de 4.5:1; para texto grande y componentes gráficos se aplican los criterios pertinentes. Los siguientes son cálculos propios sobre colores sólidos, sin transparencia, mediante luminancia relativa sRGB. No sustituyen revisar los estados finales de la interfaz. [R09][R10]

| Combinación | Contraste aproximado | Regla de aplicación |
|---|---:|---|
| Navy sobre blanco | 18.69:1 | Apto para texto normal. |
| Ink Muted sobre blanco | 5.33:1 | Apto para texto secundario normal. |
| Cobalt sobre blanco | 4.53:1 | Apto por margen estrecho; no reducir opacidad. |
| Cobalt sobre Portal Mist | 4.20:1 | No usar para texto normal pequeño. Usar Navy con subrayado o colocar el enlace en blanco. |
| Crimson sobre blanco | 3.76:1 | No usar como único texto pequeño. Etiqueta Navy y símbolo de estado. |
| Amber sobre blanco | 2.69:1 | No basta como texto normal ni como único indicador gráfico esencial. Añadir forma/contorno Navy y etiqueta. |
| Green sobre blanco | 3.39:1 | No usar como texto normal pequeño. Mantener etiqueta Navy. |
| Security Silver sobre blanco | 1.23:1 | No sirve como único límite que permita identificar un control activo. Reservar a divisores decorativos. |

No se cambian los colores institucionales para corregir estos casos: se cambian su función, superficie, contorno o color del texto. Un botón Cobalt puede usar texto blanco sin opacidad; un estado de atención puede usar relleno Amber con texto Navy.

### 10.4 Tipografía y interacción

Montserrat se usa en interfaz y lectura: Regular 400 para cuerpo, Medium 500 para interfaz, SemiBold 600 para etiquetas y Bold 700 para encabezados. Black 900 se reserva a portadas o títulos de impacto de la extensión web, sujeto a aprobación de marca. Se conserva la escala 28/22/18/15/13/11; 11 px se limita a metadatos secundarios no críticos, nunca a condiciones legales, importes o acciones. El cuerpo de lectura parte de 15–16 px y espaciado suficiente.

Para cifras, fechas, montos y folios se utiliza una familia monoespaciada autorizada o de sistema y cifras tabulares. No se distribuyen archivos de fuentes como parte de este documento.

Se exige navegación por teclado, foco visible, etiquetas de campos, mensajes de error comprensibles, anuncios accesibles de cambios de estado, zoom al 200 % y navegación móvil sin pérdida de acciones. La selección y la severidad no dependen exclusivamente del color. Las tablas extensas pueden desplazarse dentro de su contenedor sin desplazar toda la página. [R09]

Los mensajes de negocio se redactan en español directo: «Pendiente de tu confirmación», «ARSEG está revisando la evidencia», «Versión anterior» o «Consulta disponible hasta…». No se muestran códigos internos como sustituto de explicación.

### 10.5 Logos

Archivos oficiales esperados, sin recreación:

```text
/public/marca/arseg-cyber-horizontal.svg
/public/marca/arseg-cyber-horizontal-neg.svg
/public/marca/arseg-isotipo.svg
/public/marca/arseg-isotipo-mono.svg
```

No se han suministrado estos cuatro activos SVG en el texto revisado. No se reconstruyen a partir de su descripción. La revisión visual final queda condicionada a incorporarlos.

El logotipo horizontal aparece una sola vez en cada vista, en el encabezado, con ancho mínimo de 120 px y zona de protección. El logo del cliente aparece en su bloque de cuenta, con jerarquía subordinada; no en una línea de coautoría equivalente.

El isotipo no es fondo decorativo. No se agrega una marca de agua improvisada que contradiga esa restricción. El acceso no autenticado no revela logos ni nombres de clientes existentes.

---

## II.11 Integraciones y notificaciones

### 11.1 Contrato mínimo de publicación — MVP

Se define una interfaz de publicación acotada para avances, hitos, compromisos y metadatos de entregables. Puede comenzar como importación controlada de un paquete JSON y archivos mediante la misma capa de dominio que utiliza la interfaz. No necesita convertirse desde el primer día en una API pública para terceros.

El paquete incluye organización y proyecto de destino, origen, identificador externo, revisión, fecha de corte, tipo de contenido, clasificación y archivos. El servidor valida el destino autorizado; no lo acepta porque venga declarado en el paquete.

La importación es idempotente, ofrece simulación de resultado y reporta errores por registro sin publicar un conjunto parcialmente ambiguo. Por defecto crea contenido pendiente de revisión. La publicación automática de avances generales solo se habilita para una integración y un alcance expresamente autorizados. Los documentos comerciales y la primera publicación técnica restringida conservan revisión humana.

La carga manual sigue disponible como ruta de contingencia. No se construye un conector nuevo por cada cliente ni se obliga a replicar todo el tablero interno.

### 11.2 API de publicación y webhooks — V1

La API soporta las operaciones de publicación definidas, con las mismas validaciones que la interfaz. «Paridad» significa mismas reglas en operaciones equivalentes; no acceso de integración a toda función administrativa ni a actos reservados al cliente.

Las cuentas de integración tienen credenciales de alcance mínimo, por cliente o conjunto explícito de proyectos, rotación y revocación. No pueden formalizar instrumentos, aceptar riesgos, otorgar permisos o autorizar eliminación en nombre de personas.

Los webhooks salientes contienen identificador de evento, tipo, cliente/proyecto autorizado y referencias mínimas. No incluyen evidencia técnica, importes o documentos completos por defecto. Se autentican con un mecanismo estándar, se reintentan, se deduplican y se monitorean.

Los destinos son administrados y autorizados; no se permite que un usuario convierta una URL arbitraria en un destino de llamadas del servidor. Se previenen accesos a redes internas y destinos no permitidos.

### 11.3 Fronteras con el portafolio

| Pieza | Regla de integración |
|---|---|
| Calculadora de pentesting | Publica el monto aprobado y su referencia. El portal no reproduce fórmulas ni bandas de precios. |
| Configurador Discovery→Oferta | Entrega alcance y condiciones. El portal conserva la revisión publicada y su respuesta. |
| ARSEG Tabletop | Publica el informe y la evidencia seleccionada por ARSEG como entregables. No comparte por defecto respuestas individuales, sesiones de sala, QR ni permisos de participantes. |
| CyberPosture | Provee informe y mediciones validadas. El portal presenta la serie compatible, sin reconstruir la metodología. |
| GRC del cliente o de ARSEG | Debe fijar un dueño por dato y una frontera de publicación. No se promete sincronización bidireccional de todos los registros. |
| Canales comerciales | Sin integración en MVP/V1. Requieren diseño de relación independiente. |

El antecedente Tabletop excluye scoring de madurez y conclusiones automáticas; su integración no debe convertir el portal en una vía indirecta para introducirlos. fileciteturn0file3L319-L333

### 11.4 Notificaciones esenciales — MVP

Se notifican invitaciones, cambios sensibles de acceso, publicaciones que requieran atención, nuevas solicitudes y respuestas, vencimientos relevantes y cierre o fin próximo de consulta. Los recordatorios se agrupan y limitan para no convertir el portal en otra fuente de ruido.

El correo contiene un mensaje mínimo y un enlace al portal que exige autenticación. No contiene adjuntos restringidos, títulos explotables ni URLs de almacenamiento. La pantalla del portal es el estado consultable; el correo no transporta una segunda versión del expediente.

Se conserva creación, intento, envío, entrega reportada o rebote. «Entregado» es un dato del proveedor, no prueba de lectura. Los rebotes generan una incidencia operativa para ARSEG. El usuario puede ajustar recordatorios ordinarios, pero no desactivar comunicaciones críticas de seguridad o actos que deban notificarse según el acuerdo.

El remitente debe ser institucional y aprobado por ARSEG, con autenticación de dominio. No se utiliza por defecto la cuenta personal de un socio. La identidad exacta del remitente se define antes del piloto.

Un cambio o baja de permisos se vuelve a comprobar antes de enviar una notificación o entregar una exportación previamente encolada.

---

## II.12 Operación, capacidad y sostenibilidad

### 12.1 Responsabilidades mínimas

| Responsabilidad | Función requerida |
|---|---|
| Dueño de negocio | Aprueba alcance, política de publicación, prioridades y criterios de éxito. |
| Responsable de operación | Mantiene accesos, monitoreo, respaldos, calendario de mantenimiento y coordinación de incidentes. |
| Suplente operativo | Puede ejecutar restauración, revocación y contingencia con procedimientos documentados. |
| Custodio del servicio al cliente | Mantiene el corte publicado, valida compromisos y coordina el cierre. |
| Revisor de seguridad independiente | Evalúa el sistema sin ser quien lo construyó; valida correcciones críticas del pentest. |
| Asesoría jurídica y privacidad | Valida facultades, actos, conservación y tratamiento de datos. |

Estas funciones pueden ser cubiertas por pocas personas, pero no desaparecer por falta de un puesto dedicado. La independencia de la prueba de intrusión se mantiene.

### 12.2 Objetivos propuestos para dimensionar el piloto

Son supuestos de diseño a confirmar, no una predicción de demanda ni un SLA contratado.

| Variable | Objetivo inicial propuesto | Cómo se comprueba |
|---|---|---|
| Capacidad | 10 clientes, 100 usuarios habilitados, 20 sesiones concurrentes. | Prueba sintética con mezcla de lectura, publicación y descargas. |
| Archivo individual | Hasta 50 MiB. | Carga, inspección y descarga bajo el tamaño máximo. |
| Respuesta de consultas habituales | Percentil 95 de hasta 2 segundos en servidor, excluyendo transferencia de archivos y autenticación externa. | Medición con volumen representativo y ambiente equivalente al piloto. |
| Disponibilidad interna objetivo | 99.5 % mensual para piloto. | Monitoreo sintético independiente; no se ofrece comercialmente hasta aprobar capacidad de soporte. |
| RPO — pérdida máxima objetivo de datos | Hasta 1 hora. | Configuración de respaldo/recuperación y prueba con puntos de control conocidos. |
| RTO — tiempo objetivo de recuperación | Hasta 8 horas. | Restauración cronometrada y validación de acceso y archivos. |
| Actualidad de estado | Cadencia pactada por servicio; propuesta inicial semanal y ante eventos relevantes. | Fecha de corte visible y alerta de actualización omitida. |

El respaldo de objetos y el de base de datos deben permitir reconciliar revisiones, hashes y constancias. No basta restaurar tablas si los documentos formalizados o sus anexos faltan.

Los objetivos RPO/RTO no garantizan pérdida cero. Si un contrato requiere durabilidad mayor para un acto, se define un mecanismo adicional de conservación antes de habilitarlo.

### 12.3 Operación desde MVP

Se monitorean disponibilidad, errores de aplicación, autenticación anómala, fallos de publicación, cola detenida, correo rebotado, carga bloqueada y fracaso de respaldos o eliminaciones.

El manual cubre alta, permisos, publicación, retirada por error, formalización externa, cierre, exportación, revocación, restauración y eliminación. Incluye responsables, verificación y canal de escalamiento.

Se realiza una prueba de restauración antes del primer cliente y una periodicidad propuesta trimestral después, además de cambios relevantes. Se utiliza un destino de respaldo con permisos separados de la operación ordinaria.

En una indisponibilidad, ARSEG continúa la relación mediante el canal seguro acordado, identifica actos efectuados fuera del portal y los incorpora después con origen y fecha reales. No se anuncian respuestas que no quedaron guardadas ni se conserva un «borrador offline» con información restringida sin autorización.

El procedimiento de incidente contempla contención, revocación, preservación de evidencia, comunicación y recuperación. Se distingue atención del portal de los servicios de ciberrespuesta que el cliente haya contratado.

### 12.4 Costo total que debe aprobarse

El presupuesto incluirá construcción inicial, proveedor de identidad y MFA, infraestructura, base de datos, objetos y transferencia, respaldos, logs, correo, protección perimetral, revisión legal, prueba independiente, mantenimiento, soporte y tiempo de publicación.

No se asume costo cero por usar un plan gratuito ni se incluyen cifras de mercado sin cotización y volumetría. El expediente histórico y los registros pueden seguir generando costo después del cierre comercial.

Antes del piloto se aprueba un límite mensual y alertas de consumo. Superar una cuota interna genera revisión y aviso; no borra archivos ni suspende a un cliente de forma automática.

### 12.5 Métricas para decidir si vale la pena continuar

| Métrica | Definición | Lectura correcta |
|---|---|---|
| Actualidad | Proyectos con corte publicado dentro de su cadencia / proyectos activos. | Mide confiabilidad del estado mostrado. |
| Resolución de compromisos | Mediana y distribución de tiempo hasta respuesta y hasta resolución, separadas por parte responsable. | No equivale a responsabilidad contractual por retraso. |
| Autoservicio | Consultas representativas resueltas por usuarios sin apoyo y reducción observada de solicitudes repetidas. | Se mide en piloto; no se promete ahorro antes de medir. |
| Costo de publicación | Tiempo adicional que ARSEG dedica a mantener el portal por servicio. | Si crece más de lo que baja la coordinación, se simplifica o se integra. |
| Integridad de expediente | Entregables/actos muestreados con versión, evidencia y clasificación completas. | Mide trazabilidad, no madurez del cliente. |
| Ampliaciones | Respuestas y decisiones sobre propuestas habilitadas en V1. | No atribuir causalmente al portal todo aumento de ventas. |

La primera decisión de continuidad se toma después de un ciclo completo del piloto, incluyendo exportación y cierre de prueba. No se fija fecha de lanzamiento sin confirmar responsables y decisiones bloqueantes.

---

## II.13 Alcance por entrega y trazabilidad con v0.2

### 13.1 MVP: una relación real, acotada y segura

MVP permite incorporar un cliente directo con un servicio ya formalizado, autorizar a sus usuarios, mostrar estado vigente, publicar entregables, gestionar compromisos recíprocos y cerrar/exportar el expediente con conservación controlada.

Incluye seguridad, notificaciones esenciales, monitoreo, manual, respaldo probado y verificación independiente. Puede usar formalización externa y procedimientos asistidos, siempre que estén documentados y generen evidencia.

La respuesta a postura en MVP consiste en presentar el diagnóstico o informe aprobado cuando exista, con fecha y alcance. No se promete todavía una serie interactiva de madurez.

### 13.2 V1: primera versión funcional completa

V1 incorpora propuestas de ampliación, ciclo estructurado de remediación, aceptación de riesgo con vigencia, mediciones comparables, periodos recurrentes, API ampliada, webhooks y mayor automatización del cierre y la conservación.

La formalización dentro del portal se habilita únicamente con el mecanismo jurídicamente aprobado. No se presume imprescindible para validar el valor del piloto.

### 13.3 POST

Quedan para una decisión posterior: comparación visual avanzada de documentos, conectores adicionales, funciones complejas de firma o aprobación mediante proveedor, federación empresarial especializada y analítica avanzada de uso.

El modelo de canales no entra automáticamente en POST: necesita una especificación independiente antes de comprometerlo. No se agregan aplicaciones móviles nativas, offline de expedientes ni GRC completo por evolución accidental.

### 13.4 Correspondencia de elementos originales

| Clave v0.2 | Decisión v0.3 | Entrega |
|---|---|---|
| A1 Identidad y sesión | Se mantiene; añade recuperación, revocación y autenticación reciente. | MVP |
| A2 Multi-tenencia | Se mantiene; prueba en datos, archivos y procesos de fondo. | MVP |
| A3 Roles y permisos | Se mantiene; distingue rol, alcance y autoridad; protege informes y exportaciones. | MVP |
| A4 Bitácora | Se mantiene; transacción, solo adición y destino protegido. | MVP |
| A5 Componentes REF-001 | Se mantiene; variante clara propuesta y contraste verificado. | MVP |
| A6 Archivos | Se mantiene; incorpora clasificación, cuarentena y entrega autenticada. | MVP |
| A7 Notificaciones | Se adelanta el mínimo operativo; preferencias y agrupación avanzada después. | MVP / V1 |
| B1 Inicio | Se mantiene; múltiples servicios, reciprocidad y fecha de corte. | MVP |
| B2 Acuerdos | Versiones, comentarios por índice y formalización externa; comparación avanzada después. | MVP / POST |
| B3 Propuestas | Se mantiene; distingue aceptación comercial de activación de servicio. | V1 |
| B4 Proyectos | Se mantiene; compromisos compartidos y afectación no automática. | MVP |
| B5 Entregables | Se mantiene; recepción, conformidad y clasificación separadas. | MVP |
| B6 Hallazgos | Seguimiento estructurado y tendencia solo cuando estén contratados y exista evidencia. | V1 |
| B7 Cierre | Exportación, modo histórico y procedimiento mínimo desde el primer cliente; encuesta después. | MVP / V1 |
| B8 Cuenta | Se mantiene; Administración no obtiene acceso a contenido por defecto. | MVP |
| C1 API | Contrato e importación mínima; API ampliada posteriormente. | MVP / V1 |
| C2 Webhooks | Se mantienen acotados, autenticados e idempotentes. | V1 |
| C3 Configurador/calculadora | Se conserva alcance/monto publicados, sin copiar su lógica. | V1 |
| C4 Cloudflare | Se mantiene como previsión; capacidades exactas según arquitectura. | MVP |
| C5 Captcha | Protección antibot validada en servidor y con accesibilidad. | MVP |
| C6 Firma externa | No se fija POST por defecto: depende del mecanismo legal elegido. Ruta externa documentada en piloto. | Condicionada |
| D1 ASVS | Se concreta objetivo 5.0.0 nivel 2 y evidencia por requisito aplicable. | MVP |
| D2 Pentest | Independiente, previo a producción y con repetición de prueba. | MVP |
| D3 Cifrado/llaves | Se mantiene con responsabilidades de operación. | MVP |
| D4 Retención/purga | Política y proceso seguro mínimo; automatización ampliada después. | MVP / V1 |
| D5 Ambientes | Se mantiene; segregación también de secretos y objetos. | MVP |
| D6 Bitácora cliente | Vista/exportación básica desde piloto; experiencia y cobertura ampliadas después. | MVP / V1 |
| E1 Despliegue | Decisión bloqueante de proveedor/región y control del origen. | MVP |
| E2 Respaldo | RPO/RTO propuestos y restauración probada. | MVP |
| E3 Monitoreo | Se adelanta el mínimo operativo y de seguridad. | MVP |
| E4 Manual | Se adelanta; incluye contingencia y suplente. | MVP |
| E5 Arquitectura | Se adelanta el mínimo: modelo de datos, amenazas, decisiones y dependencias. | MVP |

### 13.5 Secuencia de construcción

**Entrega 0 — definición aprobada.** Resolver identidad, hosting, autoridad, conservación, datos permitidos, presupuesto y piloto. Verificar activos de marca. Producir arquitectura, amenazas y pruebas de aceptación.

**Entrega 1 — aislamiento y acceso.** Dos clientes sintéticos, seis roles, alcance por proyecto, clasificación y bitácora. No avanzar a información real sin demostrar aislamiento.

**Entrega 2 — estado y publicación.** Cuenta, proyecto formalizado externamente, hitos, entregable versionado, importación mínima, notificación y descarga autenticada.

**Entrega 3 — compromisos y retiro.** Compromisos recíprocos, respuestas, conformidad, expediente portable, acceso histórico y eliminación de prueba.

**Entrega 4 — preparación de producción.** Monitoreo, restauración, manual, revisión legal, pentest independiente y correcciones verificadas.

**Entrega 5 — piloto y aprendizaje.** Uso real acotado y medición de costo/valor. Ajustes antes de desarrollar el resto de V1.

No se construyen todas las pantallas primero para añadir después el modelo de seguridad. Cada entrega debe completar un flujo usable y probado.

---

## II.14 Pruebas de aceptación

Son escenarios exigibles a la implementación, no pruebas ejecutadas durante esta revisión documental. Los casos V1 se vuelven obligatorios al habilitar la capacidad correspondiente.

| ID | Entrega | Escenario | Resultado esperado |
|---|---|---|---|
| PA-01 | MVP | Usuario de cliente A solicita por identificador un proyecto de B. | Acceso denegado sin revelar contenido ni metadatos de B. |
| PA-02 | MVP | Usuario A cambia `cliente_id` en una escritura hacia B. | Rechazo en autorización y datos; sin registro cruzado. |
| PA-03 | MVP | Se intenta insertar un hijo A con padre B. | La restricción de integridad y la política rechazan la relación. |
| PA-04 | MVP | Conexión reutilizada atiende consecutivamente A y B. | No conserva contexto ni resultados del cliente anterior. |
| PA-05 | MVP | Consulta intenta descargar informe que contiene hallazgos. | No accede al archivo, miniatura, título sensible ni exportación indirecta. |
| PA-06 | MVP | Administración intenta leer contenido sin asignación/permiso. | No tiene acceso por su rol administrativo. |
| PA-07 | MVP | Se revoca una membresía con sesión abierta y exportación en cola. | Bloqueo de nuevas acciones y entrega del archivo; evento de revocación. |
| PA-08 | MVP | Se intenta activar cuenta sin MFA o recuperar el acceso omitiéndolo. | El procedimiento no reduce los requisitos de verificación aprobados. |
| PA-09 | MVP | Se publica entregable sin clasificación o archivo aún en cuarentena. | Publicación bloqueada con motivo claro. |
| PA-10 | MVP | Se intenta reemplazar el archivo de una revisión publicada. | Rechazo; solo puede crearse nueva revisión. |
| PA-11 | MVP | Se publica revisión nueva de un entregable. | La anterior queda histórica, con su hash y acuses preservados. |
| PA-12 | MVP | Se importa el mismo instrumento inicial dos veces. | Se conserva un solo proyecto vinculado; el reintento no duplica. |
| PA-13 | MVP | ARSEG registra una firma externa. | Pantalla distingue firmante del instrumento, registrador y validador. |
| PA-14 | V1 | Patrocinador sin autoridad vigente intenta aceptar. | Rechazo aunque su rol sea correcto. |
| PA-15 | V1 | El navegador intenta aceptar una revisión sustituida. | Conflicto; se exige revisar la vigente antes de una nueva acción. |
| PA-16 | V1 | Se acepta exactamente después del instante de vencimiento. | Rechazo determinado por el servidor, no por el cron ni por el navegador. |
| PA-17 | V1 | Doble clic o webhook duplicado de aceptación. | Un acto de aceptación y un único efecto de negocio. |
| PA-18 | V1 | Se acepta ampliación de proyecto existente. | Se registra modificación, no proyecto duplicado. |
| PA-19 | MVP | El cliente descarga o acusa recepción de un entregable. | No cambia automáticamente a conformidad ni aceptación comercial. |
| PA-20 | MVP | Cliente responde a una solicitud incompleta. | Queda respondida o requiere aclaración; no resuelta automáticamente. |
| PA-21 | MVP | Se cambia una fecha comprometida. | Permanecen fecha original, nueva fecha, motivo, autorizador y evento. |
| PA-22 | MVP | Vencen simultáneamente varios compromisos relacionados. | No se suman días como afectación contractual automática. |
| PA-23 | MVP | ARSEG tiene un compromiso vencido. | Se muestra con las mismas reglas temporales que uno del cliente. |
| PA-24 | MVP | El cliente controvierte una afectación. | Se conserva la controversia y no se presenta como reconocimiento. |
| PA-25 | V1 | Cliente intenta marcar hallazgo remediado. | Solo puede solicitar cierre; exige validación ARSEG para remediado. |
| PA-26 | V1 | Se aprueba aceptación de riesgo sin justificación o vencimiento. | Operación rechazada. |
| PA-27 | V1 | Vence una aceptación de riesgo vigente. | Reapertura/seguimiento y notificación, sin contabilizarlo como remediado. |
| PA-28 | V1 | Se mezclan dos mediciones de metodologías o alcances incompatibles. | No se presenta una tendencia continua engañosa. |
| PA-29 | MVP | Falla el envío de correo después de guardar una publicación. | Publicación permanece; notificación reintentable e incidencia visible. |
| PA-30 | MVP | Falla la escritura de bitácora en una acción de negocio. | No se confirma el cambio de estado ni se anuncia éxito. |
| PA-31 | MVP | Se emite autorización de archivo y falla la transferencia. | No se registra como lectura ni como descarga exitosa sin evidencia. |
| PA-32 | MVP | Usuario de Consulta solicita paquete de cierre. | El paquete no contiene objetos ni nombres técnicos restringidos. |
| PA-33 | MVP | Se cierra un proyecto y otro del cliente sigue activo. | Solo el cerrado entra en su régimen histórico. |
| PA-34 | MVP | Vence la consulta de un expediente mientras otro sigue vigente. | Se bloquea el primero y se conserva acceso autorizado al segundo. |
| PA-35 | MVP | Se intenta editar alcance o remediación en expediente histórico. | Rechazo; accesos y seguridad continúan registrándose. |
| PA-36 | MVP | Se programa eliminación de contratos/evidencia con excepción vigente. | La categoría afectada queda excluida y la excepción se reporta. |
| PA-37 | MVP | Se ejecuta una eliminación de prueba. | Manifiesto, autorización, resultado y verificación; no afecta otro cliente. |
| PA-38 | MVP | Se restaura respaldo previo a una baja y una eliminación. | No reabre la cuenta ni reexpone los objetos eliminados. |
| PA-39 | MVP | Se verifica un expediente exportado. | Archivos legibles, manifiesto coherente y hashes coincidentes. |
| PA-40 | MVP | Se carga tipo no permitido o contenido detectado como malicioso. | Cuarentena/rechazo, sin publicación ni ejecución en previsualización. |
| PA-41 | MVP | Se recorren acciones principales solo con teclado y zoom 200 %. | Se completa el flujo con foco, etiquetas y mensajes utilizables. |
| PA-42 | MVP | Se revisan estados visuales, enlaces y errores con la paleta final. | Contrastes medidos y significado no dependiente solo de color. |
| PA-43 | MVP | Se evalúan carga, disponibilidad y restauración con datos sintéticos. | Evidencia frente a objetivos aprobados; límites y desvíos documentados. |
| PA-44 | MVP | Se inspeccionan correo, telemetría, errores y logs. | No hay secretos, documentos completos ni contenido restringido indebido. |
| PA-45 | MVP | Se revisa la antigüedad del último corte de proyecto. | La interfaz no presenta estado atrasado como información actual. |
| PA-46 | V1 | Un usuario configura un webhook a un destino no autorizado. | No se realiza la llamada ni se accede a red interna. |
| PA-47 | MVP | Un auditor muestrea actos y cambios de estado. | Puede relacionar identidad, objeto, revisión, tiempo y evidencia sin reconstrucción manual de correos. |
| PA-48 | MVP | Un patrocinador y un responsable operativo usan el piloto. | Encuentran su información y resuelven los compromisos permitidos sin ayuda constante. |

### Puertas de habilitación

**G0 — diseño:** decisiones bloqueantes resueltas y alcance aprobado.  
**G1 — seguridad:** aislamiento, permisos, carga de archivos, autenticación y bitácora demostrados.  
**G2 — operación:** notificaciones, restauración, manual y cierre de prueba funcionan.  
**G3 — revisión externa:** pruebas independientes, tratamiento de hallazgos y validación jurídica completados.  
**G4 — piloto:** cliente, usuarios y datos acotados autorizados; operación y soporte asignados.

No se habilitan datos reales antes de G0–G3. Una demo con datos sintéticos no equivale a producción ni sustituye estas puertas.

---

## II.15 Registro de decisiones pendientes

Estas decisiones no se consideran aprobadas por aparecer recomendadas aquí. El dueño de negocio debe registrar decisión, fecha, responsable y evidencia. Pueden resolverse en una sesión de definición; no exigen una fase de análisis indefinida.

| ID | Decisión | Recomendación inicial | Quién la resuelve | Bloqueo |
|---|---|---|---|---|
| DP-01 | Cliente y servicio piloto. | Una relación directa con alcance ya formalizado y volumen acotado. | Socio responsable. | Antes de configurar producción. |
| DP-02 | Actos formalizados en el portal. | MVP con formalización externa documentada; no habilitar aceptación contractual propia por defecto. | Socios y asesoría jurídica. | Antes de cualquier acto contractual real. |
| DP-03 | Autoridad de usuarios cliente. | Designación nominativa separada para comercio, conformidad y riesgo. | Cliente autorizado y socio. | Antes de otorgar esos permisos. |
| DP-04 | Responsable/encargado, avisos y acuerdos. | Validación por categoría de datos y servicio, no por una etiqueta global. | Jurídico/privacidad y socio. | Antes de tratar datos reales. |
| DP-05 | Retención, consulta y excepciones. | Política por categoría y proyecto con archivo restringido cuando proceda. | Jurídico, operación y dueño de negocio. | Antes del primer cliente. |
| DP-06 | Nube, región y subprocessadores. | Servicios administrados; revisar autenticación, correo, logs, CDN, archivos y respaldos, no solo base de datos. | Responsable técnico y privacidad. | Antes del despliegue productivo. |
| DP-07 | Identidad y recuperación MFA. | Proveedor administrado; recuperación controlada y revocación comprobada. | Responsable técnico/seguridad. | Antes de invitaciones reales. |
| DP-08 | Fuente de datos y cadencia. | Dueño de publicación por servicio; importación acotada; corte semanal inicial donde sea adecuado. | Operación y líderes de servicio. | Antes del piloto. |
| DP-09 | Datos admitidos y clasificación. | Solo información necesaria, saneada y expresamente publicable. | Dueño de servicio y seguridad. | Antes de cargar archivos reales. |
| DP-10 | Presupuesto y soporte. | Aprobar costo total, responsable y suplente, horarios y canal de atención. | Socios y Administración. | Antes del piloto. |
| DP-11 | ASVS y revisor independiente. | Objetivo ASVS 5.0.0 L2, alcance autenticado y tercero independiente. | Seguridad y dueño de negocio. | Antes de producción. |
| DP-12 | Objetivos de recuperación y capacidad. | Aprobar o ajustar II.12.2 con prueba de restauración. | Operación y dueño de negocio. | Antes de producción. |
| DP-13 | Marca web y activos oficiales. | Aprobar extensión clara, aplicar contraste y usar los SVG originales. | Responsable de marca ARSEG. | Antes de validación visual final. |
| DP-14 | Remitente y política de correo. | Identidad institucional transaccional, sin cuenta personal ni adjuntos sensibles. | Administración y responsable técnico. | Antes de notificaciones reales. |
| DP-15 | Servicios de V1. | Habilitar remediación, recurrencia y postura solo para servicios que los incluyan. | Dueño de negocio y operación. | Antes de desarrollar/activar cada capacidad. |

La resolución de una decisión que cambie estos supuestos genera una nueva revisión de la especificación. No se oculta como un detalle técnico.

---

## II.16 Instrucción de arranque para Claude Code

El siguiente bloque es una instrucción de proyecto, no una autorización para desplegar ni para usar datos reales.

```text
Construye ARSEG Cyber — Portal de Cliente conforme a la Parte II de esta
especificación v0.3, una vez registradas las decisiones bloqueantes.

Primero:
1. Identifica qué decisiones DP siguen pendientes y qué trabajo bloquea cada una.
2. Propón una arquitectura modular y administrada, sin microservicios por defecto.
3. Define modelo de datos, amenazas, permisos y clasificación de información.
4. Convierte INV y PA en reglas y pruebas trazables.
5. Presenta el backlog MVP y separa V1/POST; no amplíes el alcance por conveniencia.

Implementa flujos completos en este orden:
- Identidad, dos clientes sintéticos, permisos e aislamiento de datos/archivos.
- Proyecto formalizado externamente, estado, publicación y descarga autenticada.
- Compromisos recíprocos, respuestas y conformidad de entregables.
- Exportación, histórico, baja y eliminación de prueba.
- Preparación operativa, revisión independiente y piloto autorizado.

Restricciones:
- No inventes clientes, aprobadores, facultades jurídicas o plazos de conservación.
- No crees firma propia, un motor de precios, scoring de madurez ni IA generativa.
- No uses datos reales en desarrollo, pruebas, demos o proveedores no autorizados.
- No publiques automáticamente carpetas ni documentos internos completos.
- No recrees el logo. Los activos oficiales deben estar en /public/marca/.
- No copies las sesiones de sala, QR u offline de Tabletop al portal.
- No presentes un control como cumplido sin prueba y evidencia.
- No despliegues ni conectes servicios de producción sin autorización explícita.

Artefactos esperados del proyecto:
ARCHITECTURE.md, DATA-MODEL.md, ACCESS-CONTROL.md, THREAT-MODEL.md,
ACCEPTANCE.md, OPERATIONS.md, RETENTION.md y DECISIONS.md.

Usa versiones soportadas verificadas en la documentación oficial al implementar,
TypeScript estricto y pruebas de dominio/integración. Las decisiones de negocio
viven en servidor, no solo en botones o menús. Devuelve en cada entrega qué flujo
funciona, qué pruebas se ejecutaron y qué límites o decisiones siguen abiertos.
```

---

# PARTE III — FUENTES Y NOTAS DE REVISIÓN

## III.1 Fuentes internas y alcance de contraste

**I-01 — Borrador del Portal v0.2.** Texto proporcionado por el usuario en esta conversación. Fuente principal de propósito, exclusiones, módulos, prioridades iniciales y paleta. La copia termina parcialmente en 9.5; no se le atribuye contenido no recibido.

**I-02 — `SKILL.md`, estándar ARSEG REF-001.** Consultado en Biblioteca para contrastar paleta, jerarquía del morado y tipografía. Su alcance original es documental DOCX; no prueba por sí mismo que la variante web clara ya esté aprobada. fileciteturn0file1L83-L116

**I-03 — `ARSEG_Tabletop_SPEC_v0.2.md`.** Consultado para preservar las exclusiones de scoring/conclusiones automáticas y la separación de una aplicación de ejercicios. No se asume que su infraestructura compartida ya esté construida. fileciteturn0file3L319-L333

## III.2 Fuentes primarias externas

**Fecha de consulta: 28 de agosto de 2026.** Las referencias respaldan fundamentos legales, técnicos o de accesibilidad. Las elecciones de alcance, prioridades y objetivos de operación de este documento son propuestas de diseño, no exigencias textuales universales de esas fuentes.

**R01 — OWASP Application Security Verification Standard.** Página oficial del proyecto; versión estable anunciada 5.0.0 y esquema de referencia de requisitos con versión. Soporta el marco de verificación propuesto, no declara cumplimiento de este portal.

`https://owasp.org/www-project-application-security-verification-standard/`

**R02 — Código de Comercio, texto oficial de la Cámara de Diputados.** Artículos 49, 89 y siguientes, 93 y 97 para conservación, mensajes de datos y firma electrónica. Deben interpretarse por asesoría jurídica para los actos concretos del portal.

`https://www.diputados.gob.mx/LeyesBiblio/pdf/CCom.pdf`

**R03 — NOM-151-SCFI-2016.** Texto oficial en DOF y ficha de normalización de la Secretaría de Economía, que la identifica como vigente. Referencia de conservación de mensajes de datos y digitalización, no una equivalencia automática entre clic y firma válida.

`https://dof.gob.mx/normasOficiales/6499/seeco11_C/seeco11_C.html`

`https://platiica.economia.gob.mx/normalizacion/nom-151-scfi-2016/`

**R04 — Ley Federal de Protección de Datos Personales en Posesión de los Particulares.** Texto oficial de Cámara de Diputados: nueva ley publicada el 20-03-2025, última reforma indicada 14-11-2025. Referencia para finalidad, seguridad, tratamiento, cancelación y excepciones de conservación.

`https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf`

**R05 — PostgreSQL, Row Security Policies.** Documentación oficial de políticas por fila y excepciones de propietarios, superusuarios y roles con BYPASSRLS.

`https://www.postgresql.org/docs/current/ddl-rowsecurity.html`

**R06 — OWASP Multi Tenant Security Cheat Sheet.** Referencia para aislamiento de clientes y alcance de verificaciones fuera de una sola consulta de base de datos.

`https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html`

**R07 — OWASP Logging Cheat Sheet.** Referencia para protección, contenido y tratamiento de registros de aplicación.

`https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html`

**R08 — OWASP File Upload Cheat Sheet.** Referencia para validación, almacenamiento, límites e inspección de archivos.

`https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html`

**R09 — W3C, Web Content Accessibility Guidelines 2.2.** Referencia de accesibilidad de interfaz, navegación y presentación de contenido.

`https://www.w3.org/TR/WCAG22/`

**R10 — W3C, Understanding Contrast (Minimum) y Non-text Contrast.** Fundamentan umbrales y uso de contraste. Las relaciones numéricas de II.10.3 son cálculo propio con los hexadecimales del borrador.

`https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum`

`https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html`

**R11 — Cloudflare Turnstile, validación en servidor.** Documentación oficial de verificación del token; la interfaz visual no sustituye esa validación.

`https://developers.cloudflare.com/turnstile/get-started/server-side-validation/`

**R12 — OWASP Authentication Cheat Sheet.** Referencia para autenticación, acciones sensibles y reautenticación.

`https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html`

**R13 — OWASP Multifactor Authentication Cheat Sheet.** Referencia para factores y recuperación sin debilitamiento del control.

`https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html`

**R14 — OWASP Session Management Cheat Sheet.** Referencia para ciclo de sesión y reautenticación. Los tiempos concretos del piloto son propuestas de ARSEG a aprobar.

`https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html`

## III.3 Qué no acredita este documento

No acredita que la aplicación exista, que los controles estén implementados, que se haya ejecutado un pentest, que los flujos tengan validez jurídica definitiva ni que los activos gráficos hayan sido recibidos.

Tampoco asigna fechas de entrega, costos contratados, niveles de servicio comerciales o facultades personales no confirmadas.

**Criterio final de éxito:** el cliente entiende su relación con ARSEG y puede actuar sobre ella; ARSEG conserva evidencia defendible de lo publicado y acordado, sin duplicar su operación interna ni prometer seguridad, madurez o eliminación que no pueda demostrar.
