'use client'

import { useSolicitudStore } from '@/lib/solicitud/store'
import { useSubmittingContext } from '@/lib/solicitud/submitting-context'
import { salidaCopy } from '@/content/solicitar'
import GuardaWrapper from '@/components/wizard/GuardaWrapper'
import { enviarBeaconCleanup } from '@/lib/solicitud/application/useCases/cleanupStagingFiles'
import type { VarianteDialogo } from '@/hooks/solicitar/useNavegacionConGuarda'

export default function SolicitudGuardaWrapper({ children }: { children: React.ReactNode }) {
  const datos = useSolicitudStore((s) => s.datos) as Record<string, unknown>
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const sessionUuid = useSolicitudStore((s) => s.sessionUuid)
  const resetForm = useSolicitudStore((s) => s.resetForm)
  const isSubmitting = useSubmittingContext()

  // Al confirmar la salida limpiamos el staging del bucket (sendBeacon
  // sobrevive al unload) y reseteamos el store, así un re-ingreso al
  // formulario empieza desde cero. En variante 'submitting' no reseteamos:
  // el usuario podría llegar a la pantalla de éxito si el envío completa.
  const handleAntesDeSalir = (variante: VarianteDialogo) => {
    if (variante === 'submitting') return
    if (sessionUuid) {
      for (const archivo of archivosSubidos) {
        enviarBeaconCleanup({ sessionUuid, storagePath: archivo.storagePath })
      }
    }
    resetForm()
  }

  return (
    <GuardaWrapper
      hayDatos={Object.keys(datos).length > 0}
      hayArchivos={archivosSubidos.length > 0}
      isSubmitting={isSubmitting}
      copy={salidaCopy}
      onAntesDeSalir={handleAntesDeSalir}
    >
      {children}
    </GuardaWrapper>
  )
}
