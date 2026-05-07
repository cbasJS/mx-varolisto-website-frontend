'use client'

import { pasos as PASOS } from '@/content/solicitar'

interface BarraPasosMobileProps {
  pasoActual: number
  progreso: number
}

export function BarraPasosMobile({ pasoActual, progreso }: BarraPasosMobileProps) {
  return (
    <div className="mb-6 md:hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Paso {pasoActual} de {PASOS.length}
        </span>
        <span className="text-xs font-bold text-secondary">{PASOS[pasoActual - 1].etiqueta}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/10">
        <div
          className="h-1 rounded-full bg-secondary transition-all duration-500 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}
