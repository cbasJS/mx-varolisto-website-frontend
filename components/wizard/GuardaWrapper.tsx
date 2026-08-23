'use client'

import { useEffect, useState } from 'react'
import {
  useNavegacionConGuarda,
  type VarianteDialogo,
} from '@/hooks/solicitar/useNavegacionConGuarda'
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
  // Side-effects a ejecutar antes de la navegación cuando el usuario confirma
  // salir (cleanup, reset del store, etc). Recibe la variante para que el
  // caller decida si aplica — p. ej. en submitting puede preferir no resetear.
  onAntesDeSalir?: (variante: VarianteDialogo) => void
}

export default function GuardaWrapper({
  hayDatos,
  hayArchivos,
  isSubmitting,
  copy,
  children,
  onAntesDeSalir,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { dialogoAbierto, variante, confirmarSalida, cancelarSalida } = useNavegacionConGuarda(
    hayDatos,
    hayArchivos,
    isSubmitting,
  )

  const handleSalir = () => {
    onAntesDeSalir?.(variante)
    confirmarSalida()
  }

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
          onSalir={handleSalir}
        />
      )}
    </>
  )
}
