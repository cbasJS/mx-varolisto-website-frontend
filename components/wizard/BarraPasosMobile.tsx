'use client'

import type { Paso } from '@/content/solicitar'

interface BarraPasosMobileProps {
  /** Índice del form-step actual (1..pasos.length). */
  stepperActual: number
  progreso: number
  pasos: readonly Paso[]
}

export function BarraPasosMobile({ stepperActual, progreso, pasos }: BarraPasosMobileProps) {
  const pasoVisible = pasos[stepperActual - 1]
  if (!pasoVisible) return null
  return (
    <div className="md:hidden">
      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="font-medium text-primary">
          Paso {stepperActual} de {pasos.length}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">{pasoVisible.etiqueta}</span>
      </div>
      <div
        data-testid="progress-bar"
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}
