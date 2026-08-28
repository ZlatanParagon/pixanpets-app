// Primitivos de UI compartidos entre superficies.

import type { ReactNode } from 'react'
import { fmtHMS, fmtNarrativo } from '../domain/clock'
import type { Fase, Severidad } from '../domain/types'

export function Chip({
  tone,
  children,
}: {
  tone?: 'critica' | 'alta' | 'media' | 'baja' | 'activa' | 'ok' | 'warn' | 'err'
  children: ReactNode
}) {
  return <span className={'tt-chip' + (tone ? ` tt-chip--${tone}` : '')}>{children}</span>
}

export function SeveridadChip({ severidad }: { severidad: Severidad }) {
  // Etiqueta textual, no solo color (s.35).
  const label: Record<Severidad, string> = {
    baja: 'Severidad baja',
    media: 'Severidad media',
    alta: 'Severidad alta',
    critica: 'Severidad crítica',
  }
  return <Chip tone={severidad}>{label[severidad]}</Chip>
}

export function Reloj({
  elapsedSeg,
  narrativoSeg,
  pausado,
}: {
  elapsedSeg: number
  narrativoSeg: number
  pausado?: boolean
}) {
  return (
    <div className="tt-reloj" role="timer" aria-label="Reloj del ejercicio">
      <span className="tt-reloj__real">{fmtHMS(elapsedSeg)}</span>
      <span className="tt-reloj__narrativo">{fmtNarrativo(narrativoSeg)}</span>
      {pausado && <Chip tone="warn">En pausa</Chip>}
    </div>
  )
}

export function BarraFases({ fases, actualId }: { fases: Fase[]; actualId: string }) {
  const idx = fases.findIndex((f) => f.id === actualId)
  return (
    <div className="tt-fases" aria-label="Fases del ejercicio">
      {fases.map((f, i) => (
        <div
          key={f.id}
          className={
            'tt-fase' + (f.id === actualId ? ' tt-fase--actual' : i < idx ? ' tt-fase--pasada' : '')
          }
          aria-current={f.id === actualId ? 'step' : undefined}
        >
          {f.nombre}
        </div>
      ))}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="tt-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Vacio({ children }: { children: ReactNode }) {
  return <div className="tt-vacio">{children}</div>
}

export function descargar(nombre: string, contenido: string, mime: string) {
  const blob = new Blob([contenido], { type: mime + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  a.click()
  URL.revokeObjectURL(url)
}
