# MEBUKI · DMO — Guía de voz para reescritura de preguntas
## Brief para fase Claude Code (acompaña a DMO_MEBUKI_v2_consolidado.md)

**Objetivo:** reescribir las 96 preguntas-hijas eliminando el "molde" (todas arrancan con "¿En qué medida...?"), conservando la capacidad de medición 1–5. La calidez va en el ENUNCIADO; el rigor de madurez va en las OPCIONES de respuesta.

---

## 1. EL PRINCIPIO CENTRAL: calidez arriba, rigor abajo

La pregunta suena humana. Los 5 niveles de madurez viven en las opciones, no en el enunciado.

**Antes (molde):**
> ¿En qué medida existe un inventario vigente de herramientas, suscripciones, repositorios y proveedores tecnológicos?

**Después (cálida + opciones graduadas):**
> **Pregunta:** ¿Tienes claro qué herramientas y suscripciones estás pagando?
> 1. La verdad, no sé bien qué pago ni cuánto.
> 2. Tengo una idea, pero tendría que revisar para estar seguro.
> 3. Sí, tengo una lista de lo que pago.
> 4. La lista está al día, con costo y responsable de cada una.
> 5. La reviso periódicamente y doy de baja lo que no se usa.

La pregunta respira; el scoring queda intacto.

---

## 2. REGLAS DE VOZ (enunciado)

1. **Habla como una persona, no como una norma.** "¿Sabes qué pagas?" en vez de "¿En qué medida existe inventario de activos?".
2. **Prohibido el arranque uniforme.** Ninguna batería de preguntas puede empezar toda igual. Varía la entrada: "¿Tienes...?", "¿Qué pasa cuando...?", "¿Sabrías...?", "¿Con qué frecuencia...?", "Si hoy...".
3. **Tú de confianza, no de auditor.** Segunda persona directa ("¿tienes?", "¿sabes?"), no impersonal ("¿existe?", "¿se encuentra?").
4. **Concreta y aterrizada.** Usa el ejemplo del cliente ("el Workspace que pagas y no usas") en vez de la abstracción ("activos tecnológicos").
5. **Máximo ~15–18 palabras por enunciado.** Si no cabe, la pregunta mide dos cosas: pártela.
6. **Nada de jerga ISO en el enunciado.** El respaldo normativo vive en los metadatos (columna Ancla), nunca en la pregunta que ve el cliente.
7. **Una sola cosa por pregunta.** Sin "y/o" que escondan doble barril.

---

## 3. REGLAS DE RIGOR (opciones — método de arquetipos, sección 7 del doc v2)

1. Las 5 opciones son una escalera Guttman: nivel N implica N−1.
2. Cada opción difiere de la anterior en ≥2 anclas (artefacto, formalidad, titularidad, disparador, evidencia). Si solo cambia un adverbio, están mal.
3. Nivel 1 = ausencia honesta, en voz del cliente ("no sé", "cada vez es distinto"). Nivel 5 = anti-aspiracional: siempre implica que funciona **sin intervención del dueño** o **corre solo**.
4. Las opciones también en lenguaje humano — la escalera no debe sonar a rúbrica de auditor.
5. ~1 pregunta-hecho por sub-dimensión (fecha, frecuencia, cantidad concreta) para anclar contra el sesgo. Ej.: "¿Cuándo fue la última vez que restauraste un respaldo?".

---

## 4. LOS DOS USOS (registro por capa — ya decidido)

La MISMA pregunta cálida sirve a los dos públicos que confirmó Serge (ambos: consultor en profundo, cliente en preventa):

- **Cliente (autoevaluación/preventa):** lee la pregunta cálida y elige la opción que lo describe. Nunca ve la jerga ni la cláusula.
- **Consultor (entrega/profundo):** usa la misma pregunta, pero cuenta con la columna Ancla + etiqueta [D]/[P]/[M] + evidencia esperada como guía interna para calificar y pedir prueba.

No son dos redacciones: es una pregunta humana + una capa de metadatos que solo ve el consultor.

---

## 5. MÉTODO DE EJECUCIÓN RECOMENDADO (para Claude Code)

1. **No generar las 96 de golpe.** Ir dimensión por dimensión.
2. **Calibrar con D1 primero:** reescribir sus 16 hijas + opciones, Serge revisa la VOZ. Una vez que "suena a MEBUKI y no a molde", D1 se vuelve el patrón de referencia.
3. Aplicar ese patrón a D2–D6, revisando dimensión por dimensión, no al final.
4. Mantener los **IDs estables** (D{dim}.{subdim}.{n}) para no perder el mapeo pregunta↔norma↔servicio del doc v2.
5. Conservar intactos: anclas normativas, etiquetas [D]/[P]/[M], reglas de scoring (declarado-vs-validado, piso crítico, índice de consistencia). Solo cambia la REDACCIÓN visible, no la maquinaria.
6. Estructura de datos sugerida: un archivo por pregunta o un JSON/YAML con campos `id`, `enunciado_calido`, `opciones[1..5]`, `ancla`, `soporte`, `annex_sl`, `es_pregunta_hecho`, `subdimension_riesgo`.

---

## 6. TEST DE ACEPTACIÓN (cómo saber que quedó bien)

- **Test del molde:** leer las 16 preguntas de una dimensión en fila. Si suenan repetitivas o "de formulario", falló. Deben sonar a una conversación variada.
- **Test de medición:** cada pregunta debe poder responderse con un grado, no con sí/no. Si es binaria, la calidez se pasó de la raya — reformular hacia grado.
- **Test de voz:** ¿un fundador de PYME en caos leería esto sin sentir que lo auditan? Si no, más humano.
- **Test Guttman:** ¿alguien puede estar en nivel 4 sin cumplir el 3? Si sí, la escalera está rota.

---

## 7. BRANDING VISUAL MEBUKI (para renderizar el artefacto)

El artefacto interactivo debe aplicar la identidad MEBUKI ya establecida. No improvisar colores, tipografía ni símbolos: usar exactamente lo siguiente.

### 7.1 Concepto de marca
MEBUKI = habilitadora de negocios ("germinar/brotar", del japonés 芽吹き). El logo es un **prompt de terminal `>_`**: el usuario le da una orden y MEBUKI la ejecuta. Narrativa central: **"el caos entra, el orden sale."** Sin cerebros, sin redes neuronales (cliché de IA evitado deliberadamente). Estética: tech, futurista, terminal/código.

### 7.2 El logo
Construcción del ícono (de izquierda a derecha):
- Un **corchete/chevron `<`** trazado (líneas, stroke redondeado).
- Una **línea de comando** horizontal (rectángulo redondeado) abajo a la derecha.
- Un **cursor** vertical (rectángulo redondeado) que "parpadea".
- Wordmark **MEBUKI** en mayúsculas, tipografía monoespaciada, con tracking amplio (letras espaciadas).
- Descriptor bajo el wordmark: **AI BUSINESS ENABLER** (o "/ AI BUSINESS ENABLER" en estilo comando).

El ícono `>_` funciona solo (favicon, app-icon, spinner de carga del diagnóstico).

### 7.3 Paleta (tokens exactos)
| Rol | Hex | Uso |
|---|---|---|
| Teal IA | `#5DE0C0` | Acento principal, cursor, comando, respuestas activas, barras de progreso |
| Azul | `#3792DD` | Secundario, descriptor, enlaces, estados |
| Negro base | `#0C1018` | Fondo de marca (modo oscuro por defecto) |
| Superficie | `#141C28` | Tarjetas, contenedores sobre el fondo |
| Borde sutil | `#1F3550` | Divisores, bordes de tarjeta |
| Claro | `#F4F6F8` | Fondo claro / texto sobre oscuro |

Variantes para fondo claro (si se ofrece modo claro): teal profundo `#0F6E56`, azul profundo `#185FA5`, tinta `#0C1018`.

### 7.4 Tipografía
- **Monoespaciada** para wordmark, títulos de sección, IDs de pregunta (D3.3.10), y acentos tipo comando. Sustitutas libres: JetBrains Mono, Space Mono, DejaVu Sans Mono.
- Para el cuerpo de preguntas largas puede usarse una sans legible (Inter, system-ui) para no cansar la vista, manteniendo la mono en encabezados y datos. La mono es el sello; el cuerpo prioriza lectura.

### 7.5 Aplicación al artefacto del diagnóstico
- **Modo oscuro por defecto** (fondo `#0C1018`), coherente con la estética terminal.
- Cada dimensión (D1–D6) puede encabezarse con su ID en mono teal, como un prompt: `> D1 · Procesos`.
- Barra de progreso y nivel de madurez (1–5) en teal `#5DE0C0`.
- El resultado ("estás aquí") se presenta como salida de terminal: el caos entró, el orden sale — coherente con la narrativa.
- Micro-interacción sugerida: cursor parpadeante `>_` mientras "procesa" el resultado.
- Etiquetas de soporte normativo [D]/[P]/[M] y cláusulas: visibles solo en la vista de consultor, nunca en la vista de cliente.

### 7.6 Coherencia con las dos capas
- **Vista cliente (preventa):** cálida, limpia, sin jerga ni cláusulas; branding presente pero discreto; foco en las preguntas humanas.
- **Vista consultor (entrega):** misma identidad + metadatos técnicos (anclas, etiquetas, evidencia) visibles.

---

*Esta guía + DMO_MEBUKI_v2_consolidado.md son el brief completo para la reescritura y el render. El documento v2 es la fuente de verdad del contenido y la maquinaria; esta guía rige la VOZ de la redacción visible y la IDENTIDAD VISUAL del artefacto.*
