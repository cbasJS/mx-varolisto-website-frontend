'use client'

import type { Paso } from './BarraPasos'
import { StepNode } from './StepNode'

interface BarraPasosDesktopProps {
  pasoActual: number
  pasos: readonly Paso[]
}

export function BarraPasosDesktop({ pasoActual, pasos }: BarraPasosDesktopProps) {
  return (
    <div className="mb-8 hidden md:block px-4">
      <div className="flex items-center">
        {pasos.map((paso, i) => {
          const estado: 'completado' | 'actual' | 'pendiente' =
            paso.numero < pasoActual
              ? 'completado'
              : paso.numero === pasoActual
                ? 'actual'
                : 'pendiente'

          return (
            <div key={paso.numero} className="flex flex-1 items-center">
              <StepNode
                numero={paso.numero}
                etiqueta={paso.etiqueta}
                icono={paso.icono}
                estado={estado}
              />
              {i < pasos.length - 1 && (
                <div className="relative mx-1 h-px flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-secondary transition-all duration-500 ease-out"
                    style={{ width: estado === 'completado' ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
