# PIXANPETS — app móvil

> Este repositorio contiene **dos apps** que comparten el proyecto de Vite:
> PIXANPETS en `index.html` (documentada abajo) y **AAE — Arseg Academy Express** en
> `aae.html`, documentada en [`AAE.md`](AAE.md). `npm run build` compila las dos.

Implementación en **React + Vite + TypeScript** del prototipo diseñado en Claude Design
(`project/PIXANPETS App.dc.html`). Es una app móvil responsiva en español (MX): a pantalla
completa en el teléfono y centrada a 402 px en pantallas anchas — sin marco de iPhone.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción a dist/
npm run preview    # sirve el build
npm run typecheck  # solo TypeScript
```

## Estructura

```
src/
  main.tsx            punto de entrada
  App.tsx             router por pantalla + montaje de la barra de pestañas
  store.tsx           estado de la app (el DCLogic del prototipo, tipado)
  types.ts            modelos de dominio
  theme.ts            paleta (espejo en TS de los tokens CSS)
  utils.ts            formato de moneda es-MX
  data/               fixtures: mascotas, catálogo, productos, FAQ, cartilla, pedidos…
  components/         Icon, TabBar y primitivos de UI compartidos
  screens/            una pantalla por archivo
  styles/app.css      hoja de estilos completa
project/              bundle original de Claude Design (diseño de referencia, no se compila)
```

## Pantallas

| Pantalla | Archivo | Ruta interna |
| --- | --- | --- |
| Onboarding (3 slides) | `screens/Onboarding.tsx` | `onboard` |
| Registro / inicio de sesión | `screens/Auth.tsx` | `auth` |
| Alta de mascota | `screens/PetNew.tsx` | `petnew` |
| Inicio | `screens/Home.tsx` | `home` |
| Citas (próximas / historial) | `screens/Citas.tsx` | `citas` |
| Agendar cita (wizard de 5 pasos) | `screens/Book.tsx` | `book` |
| Cita confirmada | `screens/BookDone.tsx` | `bookdone` |
| Tienda | `screens/Shop.tsx` | `shop` |
| Ficha de producto | `screens/Product.tsx` | `product` |
| Carrito | `screens/Cart.tsx` | `cart` |
| Checkout (3 pasos) | `screens/Checkout.tsx` | `checkout` |
| Pedido confirmado | `screens/OrderDone.tsx` | `orderdone` |
| Mis pedidos | `screens/Orders.tsx` | `orders` |
| Consejos / FAQ | `screens/Tips.tsx` | `tips` |
| Artículo | `screens/Article.tsx` | `article` |
| Perfil | `screens/Profile.tsx` | `profile` |
| Cartilla digital | `screens/Record.tsx` | `record` |
| Notificaciones | `screens/Notifications.tsx` | `notifs` |

La barra inferior tiene 5 destinos: Inicio · Citas · Tienda · Consejos · Perfil.

## Cómo se tradujo el diseño

Los valores visuales (colores, tipografías, radios, sombras, espaciados) se copiaron
uno a uno del prototipo. Estas son las decisiones donde el medio obligó a traducir en
lugar de copiar:

- **Marco de iPhone → safe areas.** El prototipo dibujaba la barra de estado y el
  indicador de home dentro de un marco de 402×874. Aquí esos espacios son
  `env(safe-area-inset-*)`, expuestos como `--sb` y `--sbb` en `app.css`. En un
  navegador de escritorio caen a un mínimo razonable; en un iPhone toman el valor real
  del sistema.
- **Alto fijo → `100dvh`.** Cada pantalla ocupa el alto disponible y hace scroll
  internamente, como una app real. Sobre 460 px de ancho la app se centra y recupera el
  alto de 874 px con esquinas redondeadas.
- **Campos falsos → campos reales.** En el prototipo los formularios eran `div`s con
  texto. Aquí son `input` / `select` / `textarea` controlados, con los mismos valores de
  ejemplo. El ojo de la contraseña alterna la visibilidad de verdad.
- **Buscadores conectados.** Las cajas de búsqueda de Tienda y Consejos filtran la lista
  en vivo; en el prototipo eran decorativas.
- **Alta de mascota persiste.** El formulario da de alta la mascota en el estado (con
  foto opcional vía selector de archivos) y aparece en Inicio, Perfil, la cartilla y el
  paso 1 del wizard. En el prototipo el botón solo navegaba.
- **El pedido se cierra al pagar.** Pagar toma una instantánea del pedido, vacía el
  carrito y muestra la confirmación con ese total. En el prototipo el carrito seguía
  lleno después de pagar.
- **Accesibilidad.** Lo interactivo es `button` real, con `aria-pressed` / `aria-current`
  / `role="switch"` donde corresponde y foco visible. Se respeta
  `prefers-reduced-motion`.

## Decisiones abiertas heredadas del diseño

El diseño dejó a la vista, en notas amarillas, las decisiones que faltaba cerrar. Siguen
en la app en el mismo lugar, para que no se pierdan:

- **Política de envío** (checkout, paso Entrega) — fijo, por zona o gratis sobre monto.
  Hoy está implementado como $79 con envío gratis desde $899, y $0 al recoger en
  sucursal (`src/data/products.ts`).
- **Pasarela de pago** (checkout, paso Pago) — Stripe / Mercado Pago / Conekta.
- **CFDI** (checkout, paso Pago) — RFC, régimen y uso fiscal por confirmar.
- **CMS de contenido** (Consejos) — para no republicar la app en cada cambio.
- **Catálogo de servicios y duraciones** (wizard, paso 2) — lo administra la veterinaria
  desde el panel web.

## Lo que aún no tiene backend

Todo corre contra los fixtures de `src/data/`. No hay red, autenticación ni persistencia:
al recargar, el estado vuelve al inicio. Pendientes de conectar cuando exista API:

- Autenticación (correo/contraseña, Google, Apple) — hoy cualquier envío entra.
- Disponibilidad real de agenda; el calendario muestra agosto 2026 con los días 26–29 y
  31 abiertos, y horarios fijos.
- Catálogo, inventario y precios de la tienda; pedidos e historial.
- Cartilla digital y expediente clínico.
- Notificaciones push (la app solo muestra la bandeja).

Además hay dos accesos que en el prototipo apuntaban a una pantalla provisional y se
conservaron así: **Urgencias 24/7** (Inicio) abre Notificaciones, y **Privacidad y datos**
(Perfil) abre Consejos. Ambos necesitan su pantalla propia.

## Diseño original

El bundle exportado de Claude Design queda intacto en `project/` como referencia visual,
junto con la transcripción de la conversación en `chats/`. Las instrucciones originales
del handoff están en `project/HANDOFF.md`. Nada de esa carpeta entra al build.
