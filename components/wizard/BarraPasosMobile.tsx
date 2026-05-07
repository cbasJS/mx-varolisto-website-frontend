'use client'

import type { Paso } from '@/content/solicitar'

interface BarraPasosMobileProps {
  pasoActual: number
  progreso: number
  pasos: readonly Paso[]
}

export function BarraPasosMobile({ pasoActual, progreso, pasos }: BarraPasosMobileProps) {
  return (
    <div className="md:hidden">
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="font-semibold text-primary">
          Paso {pasoActual} de {pasos.length}
        </span>
        <span className="text-outline-variant">•</span>
        <span className="text-on-surface-variant">{pasos[pasoActual - 1].etiqueta}</span>
      </div>
      <div
        data-testid="progress-bar"
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}
