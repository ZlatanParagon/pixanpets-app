# AAE — Arseg Academy Express

App móvil de capacitación profesional con certificación, implementada en **React + Vite +
TypeScript** dentro de este mismo repositorio. Convive con PIXANPETS: son dos páginas del
mismo proyecto de Vite.

```bash
npm install
npm run dev        # PIXANPETS en /, AAE en /aae.html
npm run build      # typecheck + build de ambas apps a dist/
npm run preview    # sirve el build
```

En desarrollo, AAE se abre en `http://localhost:5173/aae.html`.

## Qué implementa

La ruta completa del documento de producto, con un nicho ya definido —**Auditor Interno
ISO 9001:2015**— porque el plan de lanzamiento pide empezar con uno solo. Todo el
contenido, el banco de preguntas y el voucher cuelgan de esa ruta (`src/aae/data/track.ts`);
cambiar de nicho es cambiar los fixtures, no las pantallas.

| Nivel | Acceso | Qué incluye en la app |
| --- | --- | --- |
| 🟢 1 · Fundamentos | Gratis con registro | 4 módulos, 13 lecciones, quizzes de 4 preguntas con explicación |
| 🟡 2 · Avanzado | 79 USD | 8 módulos, 24 lecciones, simulador adaptativo, 4 casos reales, Coach ilimitado |
| 🔴 3 · Certificación | 349 USD | Requisitos, verificación de identidad, examen proctoreado, certificado + voucher + insignia |

## Pantallas

| Pantalla | Archivo | Ruta interna |
| --- | --- | --- |
| Onboarding (3 slides, uno por nivel) | `screens/Onboarding.tsx` | `onboard` |
| Registro / inicio de sesión | `screens/Auth.tsx` | `auth` |
| Cuestionario de diagnóstico + plan | `screens/Diagnostic.tsx` | `diagnostic` |
| Inicio | `screens/Home.tsx` | `home` |
| Ruta (3 niveles) | `screens/Path.tsx` | `path` |
| Módulo | `screens/Module.tsx` | `module` |
| Lección (reproductor, apuntes, offline) | `screens/Lesson.tsx` | `lesson` |
| Quiz del módulo + resultado | `screens/Quiz.tsx` | `quiz` |
| Muro de pago / planes | `screens/Paywall.tsx` | `paywall` |
| Checkout (2 pasos) | `screens/Checkout.tsx` | `checkout` |
| Práctica (simulador, temas, casos) | `screens/Practice.tsx` | `practice` |
| Examen (práctica / simulador / proctoreado) | `screens/Exam.tsx` | `exam` |
| Resultado del examen | `screens/ExamResult.tsx` | `examresult` |
| Caso de estudio | `screens/Case.tsx` | `case` |
| AAE Coach | `screens/Coach.tsx` | `coach` |
| Dashboard de progreso | `screens/Progress.tsx` | `progress` |
| Comunidad | `screens/Community.tsx` | `community` |
| Hilo | `screens/Thread.tsx` | `thread` |
| Certificación (requisitos y agenda) | `screens/Cert.tsx` | `cert` |
| Credencial, voucher e insignia | `screens/Certificate.tsx` | `certificate` |
| Perfil | `screens/Profile.tsx` | `profile` |
| Logros y ranking | `screens/Achievements.tsx` | `achievements` |
| Notificaciones | `screens/Notifications.tsx` | `notifs` |

La barra inferior tiene 5 destinos: Inicio · Ruta · Práctica · Comunidad · Perfil. El
Coach vive en un botón flotante presente en esas cinco pantallas.

## Estructura

```
src/aae/
  main.tsx            punto de entrada de aae.html
  App.tsx             router por pantalla, barra de pestañas y acceso al Coach
  store.tsx           estado, pila de navegación y derivados (desempeño, logros, XP)
  types.ts            modelos de dominio
  theme.ts            paleta (espejo en TS de los tokens CSS)
  utils.ts            formato de precios, reloj del examen, porcentajes
  data/               ruta, módulos, banco de preguntas, casos, comunidad, logros, Coach
  components/         Icon, TabBar y primitivos de UI compartidos
  screens/            una pantalla por archivo
  styles/aae.css      hoja de estilos completa
aae.html              página de la app
```

## Lo que sí funciona de verdad

No son pantallas decorativas: el estado las conecta entre sí.

- **El diagnóstico manda.** La respuesta de tiempo semanal fija la estimación de "listo
  para el examen", que el dashboard va acercando conforme sube el acierto real.
- **El simulador es adaptativo.** `buildExam` reparte la dificultad de las preguntas según
  el acierto acumulado: con menos de 60 % carga fáciles y medias; arriba de 80 % pesa las
  difíciles. En producción esa mezcla la decide el modelo con el historial completo.
- **El desempeño se calcula, no se inventa.** Aciertos por tema, fortalezas y debilidades,
  tiempo de estudio y XP salen de lo que el usuario respondió. El tema más flojo alimenta
  el aviso del dashboard, la recomendación del Coach y la notificación de estudio.
- **Los logros se evalúan sobre el estado.** Nadie los marca a mano: se derivan de
  lecciones completadas, quizzes perfectos, simuladores hechos y certificación aprobada.
- **La certificación exige requisitos.** 3 simuladores completos, 80 % del Nivel 2 y
  acierto acumulado ≥ 70 %; después identidad verificada y horario agendado. Sólo entonces
  se habilita el examen proctoreado, y sólo al aprobarlo se emiten certificado y voucher.
- **El muro de pago es real dentro del prototipo.** Sin Nivel 2 no hay simulador, ni casos,
  ni Coach ilimitado (3 consultas gratis), ni hilos de graduados.

## Decisiones de producto tomadas en la app

- **Nicho inicial: ISO 9001.** El documento dejaba la elección abierta; la app arranca con
  auditoría interna, que es el terreno del grupo. `TRACK` centraliza nombre, examen,
  aprobatorio y requisitos.
- **Precios.** Nivel 2 en 79 USD (rango 49–99), Nivel 3 en 349 USD (rango 199–499) y
  Premium anual en 249 USD, como en el modelo de negocio.
- **Examen certificador de 30 preguntas en 45 minutos.** El documento hablaba de 3–4
  horas; el banco actual tiene 32 preguntas reales y la app reporta cifras verdaderas en
  lugar de prometer un examen que no puede dar. Al crecer el banco basta subir `TRACK`.
- **El voucher se describe con su letra chica.** Nominativo, 12 meses de vigencia, y la
  certificación externa la emite la entidad acreditada, no AAE. Aparece en el muro de
  pago y en la credencial.

## Lo que aún no tiene backend

Todo corre contra los fixtures de `src/aae/data/`. No hay red, autenticación ni
persistencia: al recargar, el estado vuelve al inicio. Pendientes de conectar:

- **Auth** (correo, LinkedIn, Google) — hoy cualquier envío válido entra.
- **Video** — el reproductor simula la superficie de Cloudflare Stream: play, velocidad,
  subtítulos y descarga offline no reproducen nada todavía.
- **AAE Coach** — es un enrutador por palabra clave sobre respuestas escritas por el
  equipo de contenido (`data/coach.ts`), con el contexto real del usuario inyectado. En
  producción es una llamada a la API de Claude con ese mismo contexto.
- **Pagos** — Stripe y Apple/Google Pay: el checkout no cobra, sólo otorga el acceso.
- **Proctoring** — la franja de sesión supervisada es visual; falta la integración de
  cámara, grabación y detección de comportamientos.
- **Certificado y verificación** — el PDF firmado, el QR y el anclaje en cadena de bloques
  están representados, no emitidos. Los tres accesos de "Compártelo" no hacen nada aún.
- **Comunidad** — los hilos son fixtures; las respuestas del usuario viven en memoria.
- **Analytics y push** — no hay Mixpanel ni FCM; la bandeja de notificaciones es local.
