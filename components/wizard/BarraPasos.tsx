'use client'

import type { Paso } from '@/content/solicitar'
import { BarraPasosMobile } from './BarraPasosMobile'
import { BarraPasosDesktop } from './BarraPasosDesktop'

export type { Paso }

interface BarraPasosProps {
  /**
   * pasoActual del APP (1..7), donde 1=calculadora/landing y 7=revisión/landing.
   * El stepper cubre sólo los form-steps (1..pasos.length); el offset se aplica
   * dentro de los hijos.
   */
  pasoActual: number
  pasos: readonly Paso[]
}

export default function BarraPasos({ pasoActual, pasos }: BarraPasosProps) {
  // App paso 2 = primer form-step (stepperActual=1).
  const stepperActual = pasoActual - 1
  const progreso =
    pasos.length > 1 ? Math.round(((stepperActual - 1) / (pasos.length - 1)) * 100) : 0

  return (
    <>
      <BarraPasosMobile stepperActual={stepperActual} progreso={progreso} pasos={pasos} />
      <BarraPasosDesktop stepperActual={stepperActual} pasos={pasos} />
    </>
  )
}
