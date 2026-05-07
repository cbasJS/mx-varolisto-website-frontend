'use client'

import { BarraPasosMobile } from './BarraPasosMobile'
import { BarraPasosDesktop } from './BarraPasosDesktop'

export interface Paso {
  numero: number
  etiqueta: string
  icono: string
}

interface BarraPasosProps {
  pasoActual: number
  pasos: readonly Paso[]
}

export default function BarraPasos({ pasoActual, pasos }: BarraPasosProps) {
  const progreso = Math.round(((pasoActual - 1) / (pasos.length - 1)) * 100)

  return (
    <>
      <BarraPasosMobile pasoActual={pasoActual} progreso={progreso} pasos={pasos} />
      <BarraPasosDesktop pasoActual={pasoActual} pasos={pasos} />
    </>
  )
}
