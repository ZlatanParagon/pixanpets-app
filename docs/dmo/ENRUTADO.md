# MEBUKI · DMO — Lógica de enrutado de entrada
## Sección complementaria al brief (acompaña a DMO_MEBUKI_v2_consolidado.md y GUIA_VOZ_reescritura.md)

**Qué resuelve:** cómo decide el instrumento, al inicio, qué "cara" mostrarle al usuario. Esta sección faltaba en el documento v2 (vivía solo en la conversación de diseño). Es la que el plan de testing citaba como "§Enrutado".

---

## 1. PRINCIPIO CENTRAL (no romper)

**El canal es una HIPÓTESIS del estado del cliente. Una pregunta lo CONFIRMA.**

El canal por el que llega el usuario predispone el discurso, pero NO decide la ruta por sí solo. Un contacto en frío puede ser una empresa en pleno incendio; un "cloud-first" puede ser un novato que solo conoce la palabra de moda. **La pregunta de confirmación manda sobre el canal.** Implementar "canal → ruta" directo, sin la pregunta, es un error de diseño.

---

## 2. PASO 1 — El canal predispone (hipótesis)

Si la app conoce el canal de entrada (parámetro, origen, o se pregunta), fija una hipótesis:

| Canal de entrada | Hipótesis de estado | Ruta probable |
|---|---|---|
| **Frío** (MEBUKI lo busca) | No sabe que tiene el dolor; hay que crear conciencia | Germinado (educativa) |
| **Página web** (él busca a MEBUKI) | Ya siente algo, viene con intención | Dolores (directa) |
| **Cloud-first / referido técnico** | Ya opera, ya tiene herramientas | Dolores de fortalecimiento |

Si el canal se desconoce, se omite el Paso 1 y se va directo al Paso 2.

---

## 3. PASO 2 — La pregunta confirma el estado (decisiva)

Una pregunta, en lenguaje de cliente, que sobrescribe la hipótesis del canal:

> **"¿Tu negocio ya está operando y vendiendo, o estás en la etapa de arrancarlo?"**
> - Estoy arrancando / apenas montándolo → **Ruta Germinado**
> - Ya opero y vendo, pero [algo falla] → **Ruta Dolores**

Y si "ya opera", una segunda pregunta enruta al dolor de entrada:

> **"¿Qué es lo que más te está frenando ahora mismo?"**
> Las opciones son los dolores del catálogo (cada uno mapea a una dimensión/servicio):
> - "Cada cliente nuevo me genera más caos que dinero" → dolor D1 (Rescate Operativo)
> - "Pago herramientas que no sé usar y nada conecta" → dolor D3 (Operación Unificada)
> - "Todo depende de mí, si falto se para todo" → dolor D2 (Autonomía)
> - "No sé si voy bien ni dónde pierdo dinero" → dolor D4 (Visibilidad)
> - "Quiero lanzar algo y no arranco" → dolor D6 (Producto con IA)
> - "Me veo improvisado y pierdo clientes" → dolor D5 (Presencia/Confianza)

---

## 4. PASO 3 — Las dos rutas (mismos 6 legos, distinto orden y puerta)

**RUTA A · Germinado** *(para quien arranca — recorrido ordenado)*
Se recorren las 6 dimensiones en orden de etapa (germinar → crecer → fortalecer), porque hay un camino que construir desde cero. La preventa aplica las 6 preguntas-madre en secuencia.

**RUTA B · Dolores** *(para quien ya opera — entrada quirúrgica)*
No hay orden fijo. Se entra por la dimensión del dolor que el usuario nombró en el Paso 2, y de ahí se expande a las adyacentes. La preventa puede priorizar la madre de la dimensión-dolor primero, luego el resto.

En **ambas rutas** se responden finalmente las 6 madre (para calcular el mapa completo). La ruta cambia el **orden de presentación y el énfasis del discurso**, no el conjunto de preguntas.

---

## 5. EL DIAGNÓSTICO DE ENTRADA ES EL GANCHO

Independiente de la ruta, tras las 6 madre el instrumento devuelve el mapa "estás aquí": nivel por dimensión + global + las 2 dimensiones más bajas (= servicios de entrada). Revela el dolor con precisión, **no la solución** (esa se paga). Ese mapa es el valor entregado antes de vender.

---

## 6. IMPLICACIONES PARA LA IMPLEMENTACIÓN (Code)

- El enrutado afecta **orden y discurso de la preventa**, no el motor de scoring (que es idéntico en ambas rutas).
- La pregunta de confirmación (Paso 2) es obligatoria; el canal (Paso 1) es opcional/mejora.
- Guardar la ruta elegida y el dolor de entrada como metadato del diagnóstico (útil para el reporte y para el índice de consistencia: ¿el dolor que declaró coincide con su dimensión más baja real?).
- **Insight vendible adicional:** si el dolor que el cliente eligió en el Paso 2 NO coincide con su dimensión más baja del mapa, esa discrepancia es oro comercial ("crees que tu problema es X, pero tu operación dice que es Y").

---

*Esta sección cierra el vacío detectado en el testing (2026-08-29). Con ella, los tres documentos del brief — instrumento v2, guía de voz/branding, y esta lógica de enrutado — cubren contenido, forma y flujo de entrada.*
