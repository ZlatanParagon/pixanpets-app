# ARSEG Tabletop — Especificación funcional y técnica

**Versión:** v0.2  
**Estado:** Documento rector para desarrollo  
**Destino:** Claude Code / repositorio de desarrollo  
**Propietario:** ARSEG Cyber — ARSEG Cynergy Systems, S.A.S. de C.V.  
**Cliente de referencia para la primera implementación:** El Palacio de Hierro  
**Tipo de solución:** Aplicación web de instrumentación de ejercicios ejecutivos de cibercrisis tipo TableTop

---

# 0. Propósito del documento

Este documento define el comportamiento esperado de la aplicación ARSEG Tabletop y debe utilizarse como fuente principal de requisitos para diseño, arquitectura, desarrollo, pruebas y aceptación.

La aplicación no reemplaza al facilitador ni emite conclusiones automáticas. Su función es instrumentar el ejercicio y convertir la dinámica observada en evidencia trazable.

Principio rector:

> La madurez no se declara, se demuestra con evidencia.

Cadena de trazabilidad obligatoria:

> Objetivo → Inyección → Rol esperado → Conducta/decisión → Evidencia → Observación ARSEG → Informe

Toda funcionalidad de la aplicación debe existir porque aporta evidencia a esta cadena.

---

# 1. Qué es y qué problema resuelve

ARSEG Tabletop es una aplicación web de apoyo a ejercicios de simulación ejecutiva de cibercrisis.

En el modelo tradicional, el facilitador conduce la sesión y simultáneamente intenta registrar:

- decisiones;
- escalamiento;
- tiempos;
- omisiones;
- compromisos;
- solicitudes de información;
- reacciones entre áreas;
- observaciones cualitativas.

Esto provoca pérdida de evidencia y obliga a reconstruir el informe posteriormente a partir de memoria, notas y material disperso.

ARSEG Tabletop debe:

1. Capturar decisiones con hora, rol y justificación.
2. Registrar la cadena de escalamiento.
3. Registrar solicitudes de información y tiempos de respuesta.
4. Registrar compromisos asumidos.
5. Registrar observaciones del facilitador.
6. Mantener una cronología íntegra de eventos.
7. Mostrar al facilitador qué objetivos ya cuentan con evidencia.
8. Generar al cierre un paquete de evidencia estructurado.
9. Mantener la separación entre dato registrado y juicio profesional.

La aplicación produce evidencia.

ARSEG Cyber emite el dictamen profesional.

---

# 2. Límites explícitos

La aplicación NO debe:

- calificar automáticamente a participantes;
- asignar madurez;
- declarar cumplimiento;
- aprobar o reprobar áreas;
- inferir que una decisión fue correcta o incorrecta;
- sustituir el juicio del facilitador;
- producir conclusiones finales sin revisión humana;
- evaluar BCP o DRP como disciplinas independientes;
- realizar pruebas técnicas durante la sesión;
- generar automáticamente recomendaciones de seguridad como si fueran dictamen.

La aplicación puede registrar:

- práctica efectiva;
- brecha;
- oportunidad de mejora;
- decisión pendiente;
- acción prioritaria.

La clasificación es realizada por ARSEG.

---

# 3. Alcance de referencia — El Palacio de Hierro

La primera implementación debe soportar como mínimo:

- modalidad presencial;
- una sola sede;
- hasta 15 participantes ejecutivos;
- una sesión de hasta 4 horas;
- escenario construido a partir de resultados de una emulación previa;
- evolución hipotética aprobada;
- MSEL;
- inyecciones secuenciales;
- inyecciones privadas por rol;
- saltos temporales;
- consecuencias manualmente seleccionadas por el facilitador.

El escenario definitivo NO debe quedar codificado como ransomware.

Para PH, el escenario debe construirse a partir de:

1. evidencia y resultados de la emulación;
2. hallazgos y rutas observadas;
3. evolución hipotética aprobada;
4. objetivos del TableTop;
5. MSEL autorizado.

---

# 4. Objetivos del ejercicio

La aplicación debe permitir configurar objetivos de evaluación por ejercicio.

Objetivos base de referencia para PH:

| ID | Objetivo | Evidencia esperada |
|---|---|---|
| TT-01 | Declaración del incidente | reconocimiento formal de incidente/crisis, rol, hora, justificación |
| TT-02 | Escalamiento | origen, destino, momento, reconocimiento y acción posterior |
| TT-03 | Convocatoria y coordinación ejecutiva | roles convocados, responsabilidades, coordinación observable |
| TT-04 | Priorización de decisiones | alternativas, justificación, impacto aceptado y latencia |
| TT-05 | Riesgo legal y regulatorio | decisiones, condiciones, destinatarios y tiempos |
| TT-06 | Comunicación de crisis | audiencia, responsable, momento y criterio de comunicación |
| TT-07 | Impacto financiero y reputacional | consideración explícita del impacto al decidir |
| TT-08 | Contención | decisiones para limitar alcance o impacto |
| TT-09 | Recuperación del incidente | criterios y responsables para restaurar/cerrar la crisis |
| TT-10 | Calidad de información técnica | suficiencia, claridad y oportunidad de información para decidir |

Dimensiones transversales observables:

- claridad de comunicación;
- entendimiento de roles;
- coordinación;
- cadena de mando;
- toma de decisiones;
- compromisos;
- omisiones;
- calidad de información técnica.

Estas dimensiones no deben convertirse en score automático.

---

# 5. Principio de intensividad

El ejercicio intensivo NO consiste en aumentar indiscriminadamente el número de inyecciones.

Debe aumentar la calidad de presión mediante:

1. Información incompleta.
2. Información contradictoria.
3. Presión de negocio.
4. Presión externa.
5. Compresión temporal.
6. Consecuencias derivadas de decisiones previas.
7. Distribución asimétrica de información.
8. Dependencia entre roles.
9. Decisiones obligadas con incertidumbre.
10. Cambios de contexto durante la crisis.

La aplicación debe permitir que una decisión anterior cambie el contexto posterior sin automatizar el juicio.

El facilitador debe poder seleccionar consecuencias o ramas narrativas.

---

# 6. Usuarios y superficies

La aplicación tendrá tres superficies simultáneas sobre una misma sesión.

## 6.1 Participante — móvil

Usuario ejecutivo o responsable de área.

Características:

- acceso por QR o código;
- sin cuenta;
- sin contraseña;
- sesión breve e intermitente;
- recibe inyecciones;
- registra decisiones;
- solicita información;
- escala;
- registra compromisos;
- consulta su bitácora personal.

## 6.2 Facilitador — laptop

Usuario ARSEG.

Características:

- acceso autenticado;
- uso continuo;
- controla reloj;
- controla fases;
- dispara inyecciones;
- dispara inyecciones privadas;
- selecciona consecuencias;
- observa respuestas;
- registra observaciones;
- consulta cobertura de objetivos;
- genera paquete de evidencia.

## 6.3 Sala — proyector

Vista pasiva.

Debe mostrar:

- reloj;
- fase actual;
- severidad narrativa;
- inyección activa pública;
- contexto del escenario;
- barra de fases;
- métricas narrativas del incidente.

Nunca debe mostrar:

- quién respondió;
- quién no respondió;
- latencias individuales;
- comentarios privados;
- observaciones ARSEG;
- inyecciones dirigidas a roles específicos.

Regla no negociable:

> La pantalla de sala nunca exhibe individualmente a los participantes.

---

# 7. Roles ARSEG dentro de la consola

La consola debe soportar múltiples usuarios ARSEG simultáneos.

## 7.1 Director de ejercicio

Puede:

- iniciar;
- pausar;
- reanudar;
- terminar;
- cambiar fase;
- disparar inyección;
- omitir inyección;
- seleccionar rama;
- aplicar salto temporal;
- controlar pantalla de sala.

## 7.2 Observador ARSEG

Puede:

- registrar observaciones;
- asociar observaciones a roles;
- asociar observaciones a inyecciones;
- vincular decisiones;
- registrar evidencias;
- marcar prácticas efectivas;
- marcar brechas;
- registrar oportunidades;
- registrar acciones prioritarias.

Debe ser posible que varios observadores trabajen en paralelo.

---

# 8. Flujo del ejercicio

## Etapa 0 — Preparación

El facilitador configura:

- cliente;
- nombre;
- fecha;
- duración;
- escenario;
- objetivos;
- fases;
- roles;
- participantes;
- MSEL;
- inyecciones;
- ramas;
- criterios de observación;
- tiempos;
- retención;
- código de sala;
- QR.

## Etapa 1 — Check-in

El participante:

1. escanea QR;
2. ingresa nombre visible;
3. valida su rol;
4. lee responsabilidades;
5. acepta reglas;
6. entra a sala.

## Etapa 2 — Briefing

Pantalla de sala:

- reglas;
- escenario inicial;
- reloj;
- fase inicial.

## Etapa 3 — Ejecución

Ciclo base:

1. facilitador dispara inyección;
2. sistema distribuye según audiencia;
3. abre ventana de decisión;
4. participantes actúan;
5. acciones generan eventos;
6. ARSEG observa;
7. facilitador registra observaciones;
8. temporizador expira;
9. no se bloquea la captura tardía;
10. facilitador cierra inyección;
11. puede seleccionar consecuencia;
12. avanza narrativa.

## Etapa 4 — Debriefing

Participante responde:

- qué información faltó;
- qué rol faltó;
- qué decisión fue más difícil;
- una acción concreta a 30 días.

## Etapa 5 — Cierre

El sistema genera:

- cronología;
- decisiones;
- escalamiento;
- compromisos;
- solicitudes de información;
- observaciones;
- cobertura de objetivos;
- paquete de evidencia.

---

# 9. MSEL

El MSEL es el corazón del ejercicio.

Cada inyección debe existir dentro del MSEL.

## 9.1 Tipos de inyección

- principal;
- dirigida;
- consecuencia;
- información técnica;
- presión externa;
- presión operativa;
- presión legal;
- presión reputacional;
- salto temporal.

## 9.2 Audiencia

Cada inyección debe poder enviarse a:

- sala;
- todos;
- uno o varios roles.

## 9.3 Propiedades de una inyección

Cada inyección debe declarar:

- identificador;
- fase;
- orden;
- tipo;
- título;
- narrativa;
- fuente;
- evidencia de origen;
- objetivo(s) evaluado(s);
- roles que reciben;
- roles de los que se espera respuesta;
- severidad diseñada;
- ventana de decisión;
- prerequisitos;
- consecuencias posibles;
- estado.

Regla:

> No toda persona que recibe una inyección tiene obligación de responder.

---

# 10. Modelo de datos

## 10.1 Ejercicio

```text
Ejercicio
  id
  nombre
  cliente
  escenario
  fecha
  duracion_estimada_seg
  duracion_real_seg
  estado:
    borrador
    preparado
    en_curso
    pausado
    cerrado
  codigo_sala
  qr_token
  iniciado_en
  cerrado_en
  retencion_hasta
```

## 10.2 Objetivo

```text
Objetivo
  id
  ejercicio_id
  clave
  nombre
  descripcion
  activo
```

## 10.3 Fase

```text
Fase
  id
  ejercicio_id
  orden
  nombre
  descripcion
```

Ejemplo de referencia:

- Detección;
- Activación;
- Contención;
- Crisis;
- Recuperación.

## 10.4 Rol

```text
Rol
  id
  ejercicio_id
  nombre
  responsabilidades_declaradas
  orden
```

## 10.5 Participante

```text
Participante
  id
  ejercicio_id
  rol_id
  nombre_visible
  estado:
    invitado
    conectado
    desconectado
  conectado_en
  ultima_actividad_en
```

## 10.6 Inyección

```text
Inyeccion
  id
  ejercicio_id
  fase_id
  orden
  clave

  tipo:
    principal
    dirigida
    consecuencia
    informacion_tecnica
    presion_externa
    presion_operativa
    presion_legal
    presion_reputacional
    salto_temporal

  titulo
  cuerpo

  fuente:
    emulacion
    hipotetica_aprobada
    respuesta_participante
    facilitador

  evidencia_origen_ref nullable

  severidad_disenada
  ventana_decision_seg

  estado:
    pendiente
    preparada
    activa
    cerrada
    omitida

  disparada_en
  cerrada_en
```

Relaciones:

```text
InyeccionObjetivo
  inyeccion_id
  objetivo_id

InyeccionAudiencia
  inyeccion_id
  rol_id
  visible_en_sala boolean

InyeccionRespuestaEsperada
  inyeccion_id
  rol_id
```

## 10.7 Decisión

```text
Decision
  id
  ejercicio_id
  inyeccion_id
  participante_id
  rol_id

  tipo:
    decision
    no_actuar
    posponer

  accion_elegida nullable
  accion_libre nullable
  justificacion

  severidad_percibida nullable
  registrada_en
  latencia_seg
  sincronizada_en nullable
  origen_offline boolean
```

## 10.8 Escalamiento

```text
Escalamiento
  id
  ejercicio_id
  inyeccion_id

  participante_origen_id
  rol_origen_id
  rol_destino_id

  motivo
  urgencia nullable

  escalado_en
  reconocido_en nullable
  decision_destino_id nullable
  accion_destino_en nullable
```

## 10.9 Solicitud de información

```text
SolicitudInformacion
  id
  ejercicio_id
  inyeccion_id

  solicitada_por_participante_id
  solicitada_por_rol_id
  dirigida_a_rol_id nullable

  pregunta
  solicitada_en

  respuesta nullable
  respondida_en nullable

  fuente_respuesta nullable
  evidencia_ref nullable
```

## 10.10 Compromiso

```text
Compromiso
  id
  ejercicio_id
  inyeccion_id

  descripcion
  participante_responsable_id nullable
  rol_responsable_id

  rol_solicitante_id nullable

  plazo_simulado nullable
  criterio_cumplimiento nullable

  declarado_en
```

## 10.11 Observación ARSEG

```text
Observacion
  id
  ejercicio_id
  inyeccion_id nullable
  objetivo_id nullable
  rol_id nullable

  tipo:
    practica_efectiva
    brecha
    oportunidad_mejora
    decision_pendiente
    accion_prioritaria

  descripcion
  dominio nullable
  severidad nullable

  marcada_en
  creada_por_usuario_id
```

## 10.12 Evidencia vinculada

```text
EvidenciaVinculo
  id
  observacion_id

  tipo_referencia:
    evento
    decision
    escalamiento
    solicitud_informacion
    compromiso
    inyeccion

  referencia_id
```

## 10.13 Evento de bitácora

```text
EventoBitacora
  id
  ejercicio_id
  tipo
  referencia_id nullable
  actor_tipo
  actor_id nullable
  ocurrido_en
  detalle_json
```

`EventoBitacora` es la fuente de verdad de la cronología.

Toda acción significativa debe escribir un evento.

---

# 11. Reglas de trazabilidad

Cada observación debe poder vincularse con una o más evidencias.

Ejemplo:

```text
OBS-017
  tipo: oportunidad_mejora
  objetivo: TT-02
  rol: Legal
  inyeccion: INY-04
  evidencia:
    DEC-038
    ESC-012
    EVT-428
    EVT-441
```

Debe ser posible reconstruir:

> qué ocurrió → cuándo → quién intervino → qué decidió → a quién escaló → qué respondió el destinatario → qué observó ARSEG.

---

# 12. Cobertura de objetivos

La consola debe mostrar cobertura de evidencia.

Ejemplo:

```text
TT-01 Declaración del incidente      evidencia obtenida
TT-02 Escalamiento                   evidencia obtenida
TT-03 Coordinación ejecutiva         evidencia obtenida
TT-04 Priorización                   evidencia parcial
TT-05 Legal / regulatorio            aún no ejercitado
TT-06 Comunicación                   aún no ejercitado
TT-07 Impacto de negocio             aún no ejercitado
TT-08 Contención                     evidencia obtenida
TT-09 Recuperación                   aún no ejercitado
TT-10 Información técnica            evidencia parcial
```

Estados permitidos:

- no ejercitado;
- evidencia parcial;
- evidencia obtenida.

No usar:

- aprobado;
- reprobado;
- cumple;
- no cumple;
- maduro;
- inmaduro.

---

# 13. Reglas de no respuesta

La ausencia de respuesta solo puede considerarse evidencia cuando:

1. el rol estaba incluido en `InyeccionRespuestaEsperada`;
2. la ventana de decisión expiró;
3. no existe acción registrada durante la ventana.

Si un participante recibió la inyección pero su rol no requería respuesta:

```text
estado = no_aplica
```

Nunca debe mostrarse como omisión.

---

# 14. Cadena de escalamiento

La consola debe permitir reconstrucción visual:

```text
INY-04

CISO
  └── escala a Legal        00:41

Legal
  ├── recibe                00:42
  ├── solicita información  00:46
  └── decide                00:53

Dirección General
  └── decide                00:49
```

La aplicación no emite juicio.

Solo presenta secuencia y tiempos.

---

# 15. Reloj compartido

Debe existir una sola fuente de tiempo del ejercicio.

Propiedades:

- tiempo transcurrido;
- pausa global;
- reanudación global;
- saltos temporales narrativos;
- sincronización entre superficies.

La pausa congela:

- reloj;
- temporizadores de inyección;
- pantalla de sala;
- móviles.

Los saltos temporales narrativos NO modifican el reloj técnico.

Ejemplo:

```text
Reloj real: 01:18:22
Tiempo narrativo: T+12 horas
```

Ambos deben coexistir.

---

# 16. Ventana de decisión

Cada inyección puede tener una ventana configurable.

Al expirar:

- no se bloquea el participante;
- el sistema registra expiración;
- se marca potencial no respuesta si aplica;
- puede aceptarse respuesta tardía;
- la latencia conserva referencia al disparo original.

---

# 17. Consecuencias y ramas

Una inyección puede tener una o varias consecuencias.

Ejemplo:

```text
INY-03
  rama A: se autoriza contención
  rama B: se difiere contención
  rama C: se solicita más información
```

El facilitador selecciona manualmente la rama.

La aplicación:

- registra la selección;
- activa inyecciones dependientes;
- conserva trazabilidad.

No debe existir una lógica que califique automáticamente una elección.

---

# 18. Inyecciones privadas

La aplicación debe soportar información asimétrica.

Ejemplo:

- Legal recibe presión regulatoria.
- Comunicación recibe llamada de un medio.
- Operación recibe reporte de tienda.
- CISO recibe nueva evidencia técnica.

El resto de participantes no recibe esa información.

Objetivo:

> observar si la información se mueve correctamente a través de la organización.

---

# 19. Pantallas — participante

## P1. Check-in

Mostrar:

- nombre del ejercicio;
- cliente;
- rol;
- responsabilidades;
- reglas.

Reglas visibles:

- es una simulación;
- ninguna acción afecta sistemas reales;
- no existen respuestas perfectas;
- todo queda registrado con hora;
- la evidencia se utilizará para el análisis del ejercicio.

CTA:

`Entrar al ejercicio`

## P2. Inyección activa

Mostrar:

- reloj;
- tiempo narrativo;
- fase;
- clave;
- título;
- narrativa;
- severidad;
- ventana de decisión;
- audiencia solo si es útil.

CTA contextual:

- Registrar mi decisión
- Solicitar información
- Escalar
- Registrar compromiso
- No actuar por ahora

Estado vacío:

> Esperando la siguiente inyección

El reloj sigue visible.

## P3. Acción

El formulario cambia según acción.

### Decisión

- alternativa;
- campo libre;
- justificación;
- severidad percibida;
- dependencias.

### Solicitud de información

- pregunta;
- rol destinatario.

### Escalamiento

- rol destinatario;
- motivo;
- urgencia.

### Compromiso

- descripción;
- responsable;
- plazo narrativo;
- criterio.

### No actuar

- justificación opcional/obligatoria configurable.

## P4. Bitácora personal

Mostrar:

- decisiones;
- solicitudes;
- escalamiento;
- compromisos;
- hora;
- estado de sincronización.

Al cierre:

- qué información faltó;
- qué rol faltó;
- decisión más difícil;
- acción concreta a 30 días.

---

# 20. Pantallas — facilitador

## F1. Tablero

Mostrar:

- estado de sesión;
- reloj;
- tiempo narrativo;
- fase;
- participantes conectados;
- inyecciones disparadas;
- observaciones;
- latencia promedio;
- actividad reciente;
- cobertura de objetivos.

Controles:

- iniciar;
- pausar;
- reanudar;
- cerrar.

## F2. MSEL / Inyecciones

Mostrar secuencia completa.

Acciones:

- disparar;
- preparar;
- omitir;
- reordenar antes del disparo;
- seleccionar rama;
- insertar inyección ad hoc;
- hacer privada/pública antes de disparo.

No permitir modificar una inyección ya disparada de forma que destruya trazabilidad.

## F3. Sala de decisiones

Por inyección:

- roles esperados;
- roles que respondieron;
- latencia;
- no respuesta;
- escalamientos;
- solicitudes;
- compromisos.

Debe mostrar cadenas temporales.

## F4. Observaciones

Acción primaria de un toque.

Flujo rápido:

1. seleccionar tipo;
2. opcionalmente seleccionar rol;
3. descripción breve;
4. guardar.

El sistema debe autocompletar:

- ejercicio;
- inyección activa;
- fase;
- hora;
- usuario ARSEG.

Después puede enriquecerse con evidencia.

## F5. Cierre

Mostrar:

- totales;
- cobertura;
- participantes;
- observaciones;
- decisiones;
- escalamiento;
- compromisos;
- solicitudes;
- exportaciones.

---

# 21. Pantalla de sala

Una sola vista.

Debe contener:

- logotipo acordado;
- nombre del ejercicio;
- reloj;
- tiempo narrativo;
- fase;
- severidad;
- inyección pública activa;
- barra de fases;
- indicadores narrativos.

No debe contener:

- tabla de participantes;
- nombres;
- tiempos individuales;
- estado de respuesta;
- score;
- observaciones.

---

# 22. MSEL intensivo de referencia

Estructura inicial orientativa:

| Fase | Inyección | Propósito |
|---|---|---|
| Detección | INY-01 Evidencia derivada de la emulación | reconocer situación |
| Activación | INY-02 Expansión del contexto | declaración, escalamiento y convocatoria |
| Contención | INY-03 Riesgo sobre objetivo crítico | decisión ejecutiva con impacto |
| Contención | INY-04 Información técnica incompleta o contradictoria | calidad de información |
| Crisis | INY-05 Posible afectación a información o cliente | legal, privacidad, regulación |
| Crisis | INY-06 Presión externa | comunicación |
| Negocio | INY-07 Consecuencia financiera o reputacional | priorización ejecutiva |
| Recuperación | INY-08 Condiciones para restablecer/cerrar | criterios, responsables y riesgo residual |

Complementar con:

- 4 a 6 inyecciones dirigidas;
- 3 o 4 puertas de decisión;
- 2 o 3 saltos temporales;
- consecuencias manuales.

---

# 23. Puertas de decisión

Configurar decisiones ejecutivas relevantes.

Ejemplo:

## Puerta A
¿Se declara formalmente el incidente y se activa la estructura ejecutiva?

## Puerta B
¿Se autoriza una medida de contención con impacto potencial al negocio?

## Puerta C
¿Qué se comunica externamente y con qué nivel de certeza?

## Puerta D
¿Qué condiciones deben cumplirse para iniciar recuperación o declarar cierre de crisis?

---

# 24. Recuperación — límite de alcance

Para PH la aplicación puede registrar:

- criterios para recuperación;
- autorización;
- responsables;
- dependencias;
- riesgo residual;
- comunicación de recuperación.

No debe evaluar:

- BCP;
- DRP;
- RTO;
- RPO;
- recuperación tecnológica detallada;
- continuidad operativa integral.

---

# 25. Modo degradado / offline-first

Requisito no negociable.

Si la red falla:

- la sesión continúa;
- la inyección activa permanece visible;
- las decisiones pueden registrarse;
- solicitudes pueden registrarse;
- escalamiento puede registrarse;
- compromisos pueden registrarse;
- observaciones ARSEG pueden registrarse.

Cada cliente mantiene una cola local.

Al reconectar:

- sincroniza;
- conserva hora original;
- registra hora de sincronización;
- detecta conflictos;
- no destruye eventos.

Estrategia recomendada:

- Service Worker;
- IndexedDB;
- cola local de eventos;
- identificadores UUID generados en cliente;
- sincronización idempotente;
- resolución por evento y timestamp;
- servidor autoritativo para orden final.

---

# 26. Sincronización en tiempo real

Preferencia:

1. WebSocket;
2. degradación a Server-Sent Events si aplica;
3. polling como fallback.

Eventos que deben propagarse:

- inicio;
- pausa;
- reanudación;
- cambio de fase;
- nueva inyección;
- cierre de inyección;
- cambio de tiempo narrativo;
- cierre de ejercicio.

Objetivo de referencia:

> una inyección debe aparecer en dispositivos conectados en menos de 2 segundos.

---

# 27. Seguridad

La solución debe desarrollarse alineada a OWASP ASVS.

Requisitos:

- TLS;
- cifrado en reposo;
- aislamiento estricto por ejercicio;
- acceso del facilitador autenticado;
- participantes sin cuenta;
- QR con token de sesión;
- token con expiración;
- protección contra enumeración de salas;
- rate limiting;
- CSRF cuando aplique;
- CSP;
- headers de seguridad;
- cookies Secure/HttpOnly/SameSite;
- RBAC;
- auditoría de acceso;
- validación server-side;
- sanitización;
- protección XSS;
- protección inyección SQL;
- control de archivos;
- secretos fuera del repositorio;
- no telemetría de terceros;
- no analítica externa;
- no trackers.

---

# 28. Privacidad

Datos mínimos:

- nombre visible;
- rol;
- participación;
- decisiones.

No capturar por defecto:

- correo;
- teléfono;
- CURP;
- RFC;
- identificadores de empleado;
- ubicación;
- biometría.

Retención:

- configurable por ejercicio;
- acordada con cliente;
- purga programada;
- exportación previa.

---

# 29. Bitácora de auditoría

Registrar:

- login facilitador;
- creación de ejercicio;
- modificación;
- activación;
- pausa;
- disparo;
- omisión;
- cierre;
- exportación;
- acceso a evidencia;
- eliminación.

Debe poder exportarse.

---

# 30. Arquitectura técnica recomendada

Referencia inicial, ajustable por el equipo:

## Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS
- componentes accesibles
- PWA

## Backend
- Next.js server actions / API routes o backend separado
- PostgreSQL
- ORM: Prisma o Drizzle

## Tiempo real
- WebSocket administrado o servidor propio
- alternativa: Supabase Realtime / Ably / Pusher si la política lo permite
- para producción ARSEG se debe evaluar dependencia de terceros

## Offline
- Service Worker
- IndexedDB
- estrategia event queue

## Autenticación
- facilitadores: cuenta ARSEG
- participantes: token de sala + sesión efímera

## Exportación
- PDF
- CSV/XLSX
- JSON de evidencia
- paquete ZIP opcional

---

# 31. Modelo event-driven

Toda acción significativa debe generar evento.

Ejemplos:

```text
exercise.started
exercise.paused
exercise.resumed

inject.dispatched
inject.closed

participant.connected
participant.disconnected

decision.created
decision.synced

escalation.created
escalation.acknowledged

information.requested
information.responded

commitment.created

observation.created
observation.linked

branch.selected
narrative.time_jump
```

Esto simplifica:

- auditoría;
- cronología;
- sincronización;
- reconstrucción;
- exportación;
- trazabilidad.

---

# 32. Integridad de eventos

Cada evento debe incluir:

```text
id
exercise_id
type
actor_id
client_timestamp
server_timestamp
sequence
payload
```

Cuando se sincroniza offline:

- conservar `client_timestamp`;
- añadir `server_timestamp`;
- asignar secuencia definitiva;
- no sobrescribir eventos previos.

---

# 33. Sistema visual

## Colores

```css
--fondo:       #F5F6FC;
--tarjeta:     #FFFFFF;
--tinta:       #0A1128;
--tinta-suave: #5C6A93;
--acento:      #3A6CF4;
--acento-2:    #8A2BE2;
--critico:     #E23D4E;
--atencion:    #E08A00;
--estable:     #109E7C;
--borde:       #E4E7F5;
```

## Tipografía

Montserrat.

Escala:

- 24;
- 18;
- 15;
- 13;
- 11.

Datos y tiempos:

- fuente monoespaciada;
- cifras tabulares.

## Forma

- tarjetas: 12 px;
- controles: 8 px;
- sombras suaves;
- alto contraste;
- superficies claras.

---

# 34. Voz de interfaz

Usar verbos directos y lenguaje humano.

Sí:

- Registrar mi decisión
- Solicitar información
- Escalar
- Registrar compromiso
- Esperando la siguiente inyección

No:

- Enviar formulario
- Procesar input
- Operación completada
- Error de usuario

---

# 35. Accesibilidad

Mínimo:

- WCAG 2.1 AA como objetivo;
- contraste;
- foco visible;
- navegación por teclado en consola;
- botones grandes en móvil;
- áreas táctiles suficientes;
- no depender solo del color;
- etiqueta textual de severidad.

---

# 36. Exportaciones

Al cierre debe generarse un:

# Paquete de evidencia del ejercicio

Contenido mínimo:

1. ficha del ejercicio;
2. participantes;
3. roles;
4. objetivos;
5. escenario;
6. fases;
7. MSEL;
8. cronología;
9. decisiones;
10. escalamiento;
11. solicitudes de información;
12. compromisos;
13. observaciones;
14. prácticas efectivas;
15. brechas;
16. oportunidades;
17. decisiones pendientes;
18. acciones prioritarias;
19. acciones a 30 días;
20. matriz objetivo → evidencia.

No llamarlo automáticamente “informe final”.

---

# 37. Salidas D5 / D6

## D5 — Registro de ejecución

La aplicación sí produce insumos para:

- asistencia;
- bitácora;
- decisiones;
- tiempos;
- observaciones;
- encuestas.

## D6 — Informe posterior

ARSEG utiliza el paquete D5 para redactar:

- resumen ejecutivo;
- prácticas efectivas;
- brechas;
- causas;
- comunicación;
- entendimiento de procesos;
- cadena de mando;
- coordinación;
- toma de decisiones;
- compromisos;
- omisiones;
- recomendaciones;
- plan de mejora.

La aplicación NO firma D6 automáticamente.

---

# 38. Criterios de aceptación

1. Un participante entra mediante QR en menos de 30 segundos.
2. No requiere crear cuenta.
3. Una inyección llega a conectados en menos de 2 segundos.
4. Toda decisión registra hora, rol, justificación y latencia.
5. Toda acción relevante escribe `EventoBitacora`.
6. El facilitador registra una observación en una sola acción principal.
7. La observación hereda ejercicio, inyección y hora.
8. Toda inyección está asociada al menos a un objetivo.
9. Una no respuesta solo existe si el rol tenía respuesta esperada.
10. Un escalamiento registra origen, destino y hora.
11. El sistema puede vincular el escalamiento con acción posterior.
12. Una solicitud de información registra pregunta y tiempo.
13. Un compromiso registra responsable y momento.
14. Una inyección puede ser privada.
15. La pantalla de sala nunca revela desempeño individual.
16. El facilitador puede seleccionar consecuencia manualmente.
17. La consola muestra cobertura de objetivos sin score.
18. La sesión funciona con pérdida temporal de red.
19. Las acciones offline sincronizan conservando hora original.
20. El cierre exporta cronología completa.
21. El cierre exporta matriz objetivo → evidencia.
22. La app no utiliza lenguaje automático de aprobación o madurez.
23. Soporta hasta 15 participantes.
24. Soporta hasta 4 horas de sesión.
25. Varios usuarios ARSEG pueden observar la misma sesión.
26. Ningún usuario de un ejercicio accede a otro ejercicio.
27. El token de sala no expone identificadores predecibles.
28. Los datos pueden purgarse por política de retención.
29. La auditoría de acceso puede exportarse.
30. La aplicación cumple la separación evidencia vs. dictamen.

---

# 39. Fuera de alcance v1

- ejercicios remotos;
- ejercicios híbridos;
- aplicación nativa;
- biblioteca multi-cliente reutilizable;
- generación automática de conclusiones;
- calificación de participantes;
- IA generativa durante la sesión;
- integración con SIEM/SOAR;
- integración con ticketing;
- evaluación BCM;
- evaluación DRP;
- scoring de madurez;
- benchmarking entre clientes.

---

# 40. Prioridad de desarrollo

## Fase A — MVP funcional

- ejercicios;
- roles;
- participantes;
- objetivos;
- fases;
- inyecciones;
- QR;
- participante móvil;
- consola;
- sala;
- reloj;
- decisiones;
- eventos;
- exportación cronológica.

## Fase B — TableTop trazable

- escalamiento;
- solicitudes;
- compromisos;
- observaciones;
- cobertura de objetivos;
- evidencia vinculada;
- exportaciones D5.

## Fase C — Intensividad

- inyecciones privadas;
- ramas;
- consecuencias;
- tiempo narrativo;
- visualización de cadenas;
- múltiples observadores.

## Fase D — Resiliencia

- PWA;
- IndexedDB;
- colas offline;
- reconciliación;
- pruebas de red degradada.

## Fase E — Hardening

- threat modeling;
- ASVS;
- SAST;
- DAST;
- dependencia;
- pentest;
- corrección.

---

# 41. Estructura de repositorio recomendada

```text
/apps
  /web
    /app
      /(participant)
      /(facilitator)
      /(room)
    /components
    /features
      /exercise
      /injects
      /decisions
      /escalations
      /information
      /commitments
      /observations
      /timeline
      /coverage
    /lib
      /auth
      /realtime
      /offline
      /events
      /security
      /export

/packages
  /db
  /domain
  /ui
  /schemas

/docs
  SPEC.md
  ARCHITECTURE.md
  THREAT-MODEL.md
  ACCEPTANCE.md
```

---

# 42. Reglas para Claude Code

1. No inventar funcionalidades fuera de este documento.
2. Si existe ambigüedad, conservar la opción más simple.
3. No agregar IA generativa.
4. No agregar scoring.
5. No agregar gamificación.
6. No agregar ranking.
7. No mostrar respuestas individuales en sala.
8. No obligar a todos a responder todas las inyecciones.
9. Mantener event sourcing lógico para cronología.
10. Priorizar modo offline.
11. Priorizar trazabilidad.
12. Priorizar seguridad.
13. Usar TypeScript estricto.
14. Agregar tests para reglas críticas.
15. Cada regla de negocio debe vivir en dominio, no solo en UI.

---

# 43. Tests mínimos obligatorios

## Dominio

- no respuesta solo si respuesta esperada;
- inyección privada no visible fuera de audiencia;
- evento generado por toda decisión;
- evento generado por escalamiento;
- no modificar cronología histórica destructivamente;
- rama seleccionada solo una vez;
- ejercicio cerrado no acepta nuevos eventos salvo exportación/auditoría.

## Seguridad

- aislamiento por ejercicio;
- expiración de token;
- acceso facilitador;
- rate limiting;
- inputs;
- autorización.

## Offline

- crear decisión sin red;
- sincronizar;
- no duplicar;
- conservar hora;
- resolver reconexión.

## UI

- sala no expone nombres;
- participante solo ve su bitácora;
- facilitador sí ve cobertura.

---

# 44. Definition of Done

Una historia está terminada cuando:

- cumple requisitos;
- tiene pruebas;
- registra eventos;
- respeta aislamiento;
- funciona con teclado si aplica;
- funciona en móvil si aplica;
- no rompe modo offline;
- no introduce telemetría;
- no introduce score;
- no mezcla evidencia con dictamen.

---

# 45. Prompt inicial recomendado para Claude Code

Utilizar este texto al comenzar el proyecto:

> Construye ARSEG Tabletop tomando `SPEC.md` como fuente única de requisitos funcionales.  
> No inventes funcionalidades no definidas.  
> Prioriza arquitectura modular, TypeScript estricto, seguridad, trazabilidad, modo offline y tiempo real.  
> La aplicación registra evidencia, no califica ni emite conclusiones.  
> Implementa primero la Fase A descrita en la sección 40.  
> Antes de escribir código, genera `ARCHITECTURE.md`, el modelo de dominio, el esquema de base de datos y un backlog técnico trazado contra los criterios de aceptación.  
> Después implementa vertical slices completos en lugar de construir todas las pantallas primero.  
> Cada acción relevante debe generar un evento de bitácora.  
> La pantalla de sala nunca debe revelar quién respondió o quién no.  
> Mantén explícita la separación entre tiempo real del ejercicio y tiempo narrativo.  
> La aplicación debe sobrevivir temporalmente sin red.

---

# 46. Orden recomendado de ejecución en Claude Code

1. Leer `SPEC.md`.
2. Proponer arquitectura.
3. Crear esquema de dominio.
4. Crear modelo de datos.
5. Crear amenazas y controles.
6. Crear backlog trazado contra criterios.
7. Construir shell de aplicación.
8. Implementar creación de ejercicio.
9. Implementar QR/check-in.
10. Implementar reloj.
11. Implementar MSEL.
12. Implementar inyección.
13. Implementar decisión.
14. Implementar bitácora.
15. Implementar sala.
16. Implementar escalamiento.
17. Implementar solicitudes.
18. Implementar compromisos.
19. Implementar observaciones.
20. Implementar cobertura.
21. Implementar exportación.
22. Implementar offline.
23. Hardening.
24. Pruebas de aceptación.

---

# 47. Criterio final de producto

ARSEG Tabletop será considerado exitoso cuando permita reconstruir una crisis simulada sin depender de la memoria del facilitador.

Al finalizar una sesión debe ser posible responder, con evidencia:

- qué ocurrió;
- qué información recibió cada rol;
- cuándo la recibió;
- quién decidió;
- qué decidió;
- por qué;
- a quién escaló;
- qué información solicitó;
- qué compromiso asumió;
- cuánto tardó;
- qué ocurrió después;
- qué observó ARSEG;
- qué objetivo del ejercicio quedó evidenciado.

La aplicación instrumenta la crisis.

ARSEG interpreta la evidencia.
