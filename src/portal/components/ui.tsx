// Primitivas de interfaz del Portal. Aplican las reglas de contraste de
// II.10.3: el color nunca es el único portador de significado; los estados
// llevan etiqueta legible en Navy y, cuando corresponde, símbolo.

import type { ReactNode } from 'react'
import type { Clasificacion } from '../domain/types'

export function Tarjeta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`tarjeta ${className}`}>{children}</section>
}

/** Estado con relleno claro y texto Navy: Amber/Green/Crimson no se usan como texto pequeño (II.10.3). */
export function Estado({ tono, children }: { tono: 'estable' | 'atencion' | 'critico' | 'neutro'; children: ReactNode }) {
  const simbolo = { estable: '●', atencion: '▲', critico: '■', neutro: '○' }[tono]
  return (
    <span className={`estado estado-${tono}`}>
      <span aria-hidden="true" className="estado-simbolo">{simbolo}</span>
      {children}
    </span>
  )
}

const ETIQUETA_CLASIFICACION: Record<Clasificacion, string> = {
  general: 'General de servicio',
  comercial_restringida: 'Comercial restringida',
  tecnica_restringida: 'Técnica restringida',
  interna_arseg: 'Interna ARSEG',
}

export function ChipClasificacion({ valor }: { valor: Clasificacion }) {
  return <span className={`chip chip-${valor}`}>{ETIQUETA_CLASIFICACION[valor]}</span>
}

export function Aviso({ children, tono = 'info' }: { children: ReactNode; tono?: 'info' | 'error' }) {
  return (
    <p className={`aviso aviso-${tono}`} role={tono === 'error' ? 'alert' : undefined}>
      {children}
    </p>
  )
}

export function Definicion({ termino, children }: { termino: string; children: ReactNode }) {
  return (
    <div className="definicion">
      <dt>{termino}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function fechaCorta(iso: string): string {
  const soloFecha = iso.slice(0, 10)
  const [a, m, d] = soloFecha.split('-')
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${Number(d)} ${meses[Number(m) - 1]} ${a}`
}

export function bytesLegibles(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
