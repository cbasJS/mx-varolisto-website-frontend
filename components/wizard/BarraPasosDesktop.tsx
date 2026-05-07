'use client'

import type { Paso } from '@/content/solicitar'
import { StepNode } from './StepNode'

interface BarraPasosDesktopProps {
  pasoActual: number
  pasos: readonly Paso[]
}

export function BarraPasosDesktop({ pasoActual, pasos }: BarraPasosDesktopProps) {
  return (
    <div className="hidden md:block">
      <div className="flex items-start justify-between">
        {pasos.map((paso, i) => {
          const estado: 'completado' | 'actual' | 'pendiente' =
            paso.numero < pasoActual
              ? 'completado'
              : paso.numero === pasoActual
                ? 'actual'
                : 'pendiente'
          const completado = estado === 'completado'

          return (
            <div key={paso.numero} className="relative flex flex-1 flex-col items-center">
              {i < pasos.length - 1 && (
                <div
                  data-testid={`step-connector-${paso.numero}`}
                  className="absolute left-1/2 top-5 z-0 h-0.5 w-full overflow-hidden bg-outline-variant"
                >
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: completado ? '100%' : '0%' }}
                  />
                </div>
              )}
              <StepNode
                numero={paso.numero}
                etiqueta={paso.etiqueta}
                icono={paso.icono}
                estado={estado}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
