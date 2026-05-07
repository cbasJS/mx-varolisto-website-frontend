'use client'

import { useEffect, useState } from 'react'
import { useNavegacionConGuarda } from '@/hooks/solicitar/useNavegacionConGuarda'
import ConfirmacionSalidaDialog from './ConfirmacionSalidaDialog'

export interface GuardaCopy {
  submitting: { titulo: string; descripcion: string }
  archivos: { titulo: string; descripcion: string }
  datos: { titulo: string; descripcion: string }
  botonQuedarme: string
  botonSalir: string
}

interface Props {
  hayDatos: boolean
  hayArchivos: boolean
  isSubmitting: boolean
  copy: GuardaCopy
  children: React.ReactNode
}

export default function GuardaWrapper({
  hayDatos,
  hayArchivos,
  isSubmitting,
  copy,
  children,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { dialogoAbierto, variante, confirmarSalida, cancelarSalida } = useNavegacionConGuarda(
    hayDatos,
    hayArchivos,
    isSubmitting,
  )

  return (
    <>
      {children}
      {mounted && (
        <ConfirmacionSalidaDialog
          open={dialogoAbierto}
          copy={{
            titulo: copy[variante].titulo,
            descripcion: copy[variante].descripcion,
            botonQuedarme: copy.botonQuedarme,
            botonSalir: copy.botonSalir,
          }}
          onQuedarme={cancelarSalida}
          onSalir={confirmarSalida}
        />
      )}
    </>
  )
}
