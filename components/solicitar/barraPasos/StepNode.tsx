'use client'

import { cn } from '@/lib/utils'

interface StepNodeProps {
  numero: number
  etiqueta: string
  icono: string
  estado: 'completado' | 'actual' | 'pendiente'
}

export function StepNode({ etiqueta, icono, estado }: StepNodeProps) {
  const completado = estado === 'completado'
  const actual = estado === 'actual'
  const pendiente = estado === 'pendiente'

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'relative flex size-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
          completado && 'bg-secondary text-white shadow-lg shadow-secondary/30',
          actual && 'bg-white text-primary shadow-xl ring-4 ring-white/20',
          pendiente && 'bg-white/10 text-white/40',
        )}
      >
        {completado ? (
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        ) : (
          <span
            className={cn(
              'material-symbols-outlined text-sm',
              actual ? 'text-primary' : 'text-white/40',
            )}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icono}
          </span>
        )}
        {actual && <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />}
      </div>
      <span
        className={cn(
          'mt-1.5 text-[9px] font-semibold tracking-wide transition-colors',
          actual ? 'text-white' : completado ? 'text-secondary' : 'text-white/30',
        )}
      >
        {etiqueta}
      </span>
    </div>
  )
}
