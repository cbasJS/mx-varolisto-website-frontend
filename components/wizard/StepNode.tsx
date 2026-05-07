'use client'

import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepNodeProps {
  numero: number
  etiqueta: string
  icono: LucideIcon
  estado: 'completado' | 'actual' | 'pendiente'
}

export function StepNode({ numero, etiqueta, icono: Icono, estado }: StepNodeProps) {
  const completado = estado === 'completado'
  const actual = estado === 'actual'

  return (
    <div className="flex flex-col items-center">
      <div
        data-testid={`step-node-${numero}`}
        className={cn(
          'relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300',
          completado && 'border-primary bg-primary text-white',
          actual && 'border-primary bg-white text-primary shadow-md',
          !completado && !actual && 'border-outline-variant bg-white text-outline',
        )}
      >
        {completado ? <Check className="size-5" /> : <Icono className="size-4" />}
      </div>
      <span
        className={cn(
          'mt-2 text-xs font-medium transition-colors',
          actual && 'text-primary',
          completado && 'text-on-surface',
          !completado && !actual && 'text-outline',
        )}
      >
        {etiqueta}
      </span>
    </div>
  )
}
