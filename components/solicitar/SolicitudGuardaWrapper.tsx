'use client'

import { useSolicitudStore } from '@/lib/solicitud/store'
import { useSubmittingContext } from '@/lib/solicitud/submitting-context'
import { salidaCopy } from '@/content/solicitar'
import GuardaWrapper from '@/components/wizard/GuardaWrapper'
import type { VarianteDialogo } from '@/hooks/solicitar/useNavegacionConGuarda'

export default function SolicitudGuardaWrapper({ children }: { children: React.ReactNode }) {
  const datos = useSolicitudStore((s) => s.datos) as Record<string, unknown>
  const resetForm = useSolicitudStore((s) => s.resetForm)
  const isSubmitting = useSubmittingContext()

  // Al confirmar la salida reseteamos el store, así un re-ingreso al
  // formulario empieza desde cero. En variante 'submitting' no reseteamos:
  // el usuario podría llegar a la pantalla de éxito si el envío completa.
  //
  // Bloque 1: el formulario público ya no captura archivos en línea, así que
  // tampoco necesitamos disparar beacons al staging — la limpieza de archivos
  // huérfanos vivirá en la futura página standalone de carga.
  const handleAntesDeSalir = (variante: VarianteDialogo) => {
    if (variante === 'submitting') return
    resetForm()
  }

  return (
    <GuardaWrapper
      hayDatos={Object.keys(datos).length > 0}
      hayArchivos={false}
      isSubmitting={isSubmitting}
      copy={salidaCopy}
      onAntesDeSalir={handleAntesDeSalir}
    >
      {children}
    </GuardaWrapper>
  )
}
