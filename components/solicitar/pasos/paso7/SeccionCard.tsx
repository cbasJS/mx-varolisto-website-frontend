'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SeccionCardProps {
  titulo: string
  paso: number
  onEditar: (paso: number) => void
  children: React.ReactNode
  icono: string
}

export function SeccionCard({ titulo, paso, onEditar, children, icono }: SeccionCardProps) {
  const [abierto, setAbierto] = useState(true)

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-surface-container-high bg-white">
      <div className="flex w-full items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setAbierto((p) => !p)}
          className="flex flex-1 items-center gap-3 text-left transition-colors hover:opacity-70"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
            <span
              className="material-symbols-outlined text-sm text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              {icono}
            </span>
          </div>
          <span className="flex-1 text-sm font-semibold text-on-surface">{titulo}</span>
        </button>
        <button
          type="button"
          onClick={() => onEditar(paso)}
          className="rounded-lg border border-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setAbierto((p) => !p)}
          className="transition-colors hover:opacity-70"
          aria-label={abierto ? 'Colapsar sección' : 'Expandir sección'}
        >
          <span
            className={cn(
              'material-symbols-outlined text-base text-outline transition-transform duration-200',
              abierto && 'rotate-180',
            )}
            aria-hidden
          >
            expand_more
          </span>
        </button>
      </div>
      {abierto && <div className="border-t border-surface-container px-5 py-4">{children}</div>}
    </div>
  )
}
