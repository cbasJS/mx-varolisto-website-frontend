'use client'

import { pasos as PASOS } from '@/content/solicitar'
import { BarraPasosMobile } from './BarraPasosMobile'
import { BarraPasosDesktop } from './BarraPasosDesktop'

interface BarraPasosProps {
  pasoActual: number
}

export default function BarraPasos({ pasoActual }: BarraPasosProps) {
  const progreso = Math.round(((pasoActual - 1) / (PASOS.length - 1)) * 100)

  return (
    <>
      <BarraPasosMobile pasoActual={pasoActual} progreso={progreso} />
      <BarraPasosDesktop pasoActual={pasoActual} />
    </>
  )
}
