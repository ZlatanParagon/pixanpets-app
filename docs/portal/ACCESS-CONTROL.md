# Portal de Cliente · Control de acceso

Implementa RR-05 y II.3/II.4/8.2 de la SPEC v0.3 en `src/portal/domain/authz.ts`. Toda lectura de la interfaz pasa por `consultas.ts` y toda acción por `comandos.ts`; ninguna pantalla filtra ni decide por su cuenta.

## Capas verificadas por separado (RR-05)

1. **Identidad** — usuario autenticado (en el prototipo, selección de usuario sintético; en producción, proveedor con MFA).
2. **Pertenencia** — `Membresia` activa y vigente del cliente del objeto. El `cliente_id` de una solicitud jamás es prueba de autorización (8.2, PA-02).
3. **Alcance de proyecto** — `alcance: 'cuenta'` o `AsignacionProyecto` explícita (PA-01).
4. **Permiso de contenido** — por `Clasificacion` del objeto, aplicado también a títulos, listados, bitácora y exportaciones (H09, INV-16).
5. **Facultad de acción** — `puedeActuar(accion)`; además, nadie actúa sobre un objeto que no puede consultar (II.3.3).

La cuenta suspendida bloquea toda acción sin borrar información (II.2.2). Un usuario con varias membresías selecciona explícitamente la cuenta activa; el dominio de correo no otorga pertenencia (II.3.1, PA-04).

## Roles y clasificación

| Rol | general | comercial restringida | técnica restringida | interna ARSEG |
|---|---|---|---|---|
| Patrocinador | ✅ | con `comercial:ver` | con `tecnico_restringido:ver` | ❌ |
| Responsable operativo | ✅ | con `comercial:ver` | con `tecnico_restringido:ver` | ❌ |
| Consulta | ✅ | ❌ (límite de rol) | ❌ (límite de rol, II.3.2) | ❌ |
| Socio responsable | ✅ | ✅ | con permiso | ✅ |
| Líder de proyecto | ✅ | con `comercial:ver` | ✅ | ✅ |
| Administración | ❌ | ❌ | ❌ | ❌ |

Administración gestiona cuenta, contactos e invitaciones **sin acceso a contenido** (H19, PA-06): `proyectosVisibles`, `bitacoraVisible` y `acuerdosVisibles` devuelven vacío para ese rol.

## Permisos separados del rol (II.3.3)

`comercial:ver`, `tecnico_restringido:ver`, `entregable:dar_conformidad`, `riesgo:aceptar` (V1), `comercial:formalizar`. Cada permiso puede acotarse a proyecto y tiene vigencia y revocación. La conformidad exige el permiso **y** poder consultar la revisión (probado: quien no ve el informe restringido no puede darle conformidad).

## Autoridad comercial (H08, INV-05)

`AutoridadComercial` es una entidad separada con evidencia, vigencia, validador y revocación. El rol Patrocinador **no** formaliza sin autoridad vigente; y en MVP `formalizar_en_portal` devuelve `false` incondicionalmente (DP-02): la ruta es formalización externa documentada, registrada por el socio, distinguiendo firmante según instrumento, registrador y validador (PA-13).

## Denegaciones

Las denegaciones responden «No tienes acceso a este recurso» sin revelar existencia, títulos ni metadatos de objetos ajenos (PA-01). Los listados omiten el contenido no autorizado en lugar de mostrarlo deshabilitado.

## Pendiente para producción

- RLS por fila en PostgreSQL con rol sin `BYPASSRLS`, políticas para SELECT/INSERT/UPDATE/DELETE y claves compuestas anti-cruce (8.2, PA-03); las pruebas de dominio actuales se convierten en pruebas de integración contra la base.
- Revocación de sesión efectiva y acceso excepcional de soporte con motivo, autorización, duración, MFA y registro (3.4, PA-07).
- Recuperación MFA que no debilite el control (8.3, PA-08; DP-07).
