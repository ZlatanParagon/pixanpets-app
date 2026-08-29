// Estado de la aplicación y "sesión" del prototipo.
//
// En producción (SPEC v0.3, 8.1): identidad en proveedor con MFA, dominio y
// transacciones en servidor, PostgreSQL con RLS. En este prototipo el dominio
// puro de `domain/` juega el papel del servidor: la UI solo despacha comandos
// y lee consultas autorizadas. El selector de usuario simula al proveedor de
// identidad con usuarios SINTÉTICOS; no es autenticación real.

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EstadoPortal, Membresia, Usuario } from './domain/types'
import type { ContextoAcceso } from './domain/authz'
import { confirmar, type GenId, type Resultado, type Transaccion } from './domain/comandos'
import { estadoInicial } from './data/sinteticos'

const CLAVE = 'arseg-portal-demo-v1'

interface Persistido {
  estado: EstadoPortal
  usuario_id: string | null
  membresia_id: string | null
}

function cargar(): Persistido {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (crudo) return JSON.parse(crudo) as Persistido
  } catch {
    // almacenamiento no disponible: se opera en memoria
  }
  return { estado: estadoInicial(), usuario_id: null, membresia_id: null }
}

function guardar(p: Persistido) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p))
  } catch {
    // sin persistencia; el estado sigue en memoria
  }
}

export type Comando = (estado: EstadoPortal, ctx: ContextoAcceso, genId: GenId, ahora: string) => Resultado<Transaccion>

interface StoreValor {
  estado: EstadoPortal
  ahora: string
  usuario: Usuario | null
  /** Cuenta activa seleccionada explícitamente (II.3.1). */
  membresia: Membresia | null
  ctx: ContextoAcceso | null
  membresiasDelUsuario: Membresia[]
  entrar: (usuarioId: string) => void
  elegirCuenta: (membresiaId: string) => void
  salir: () => void
  /** Ejecuta un comando de dominio; estado y bitácora se confirman juntos (INV-12). */
  ejecutar: (comando: Comando) => string | null
  reiniciarDemo: () => void
}

const Ctx = createContext<StoreValor | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Persistido>(cargar)
  const ahora = new Date().toISOString()

  const usuario = p.usuario_id ? p.estado.usuarios.find((u) => u.id === p.usuario_id) ?? null : null
  const membresia = p.membresia_id ? p.estado.membresias.find((m) => m.id === p.membresia_id) ?? null : null
  const ctx: ContextoAcceso | null =
    usuario && membresia && membresia.usuario_id === usuario.id
      ? { usuario_id: usuario.id, membresia, ahora }
      : null

  const valor = useMemo<StoreValor>(() => {
    const actualizar = (n: Persistido) => {
      guardar(n)
      setP(n)
    }
    return {
      estado: p.estado,
      ahora,
      usuario,
      membresia,
      ctx,
      membresiasDelUsuario: usuario ? p.estado.membresias.filter((m) => m.usuario_id === usuario.id && m.activa) : [],
      entrar: (usuarioId) => {
        const membresias = p.estado.membresias.filter((m) => m.usuario_id === usuarioId && m.activa)
        // Con una sola membresía se selecciona; con varias, el usuario elige (II.3.1).
        actualizar({ ...p, usuario_id: usuarioId, membresia_id: membresias.length === 1 ? membresias[0].id : null })
      },
      elegirCuenta: (membresiaId) => {
        const m = p.estado.membresias.find((x) => x.id === membresiaId)
        if (m && m.usuario_id === p.usuario_id) actualizar({ ...p, membresia_id: membresiaId })
      },
      salir: () => actualizar({ ...p, usuario_id: null, membresia_id: null }),
      ejecutar: (comando) => {
        if (!ctx) return 'Sesión no válida.'
        const tx = comando(p.estado, ctx, () => crypto.randomUUID(), ahora)
        if (!tx.ok) return tx.error
        const res = confirmar(tx.valor)
        if (!res.ok) return res.error
        actualizar({ ...p, estado: res.valor })
        return null
      },
      reiniciarDemo: () => actualizar({ estado: estadoInicial(), usuario_id: null, membresia_id: null }),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, ahora, usuario?.id, membresia?.id])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useStore(): StoreValor {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore fuera de StoreProvider')
  return v
}
