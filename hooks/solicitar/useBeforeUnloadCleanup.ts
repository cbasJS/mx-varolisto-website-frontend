'use client'

import { useEffect } from 'react'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { enviarBeaconCleanup } from '@/lib/solicitud/application/useCases/cleanupStagingFiles'

export function useBeforeUnloadCleanup(isSubmitting: boolean) {
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const sessionUuid = useSolicitudStore((s) => s.sessionUuid)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        // Submit en vuelo: advertir al usuario, NO disparar DELETEs
        e.preventDefault()
        return
      }

      if (!sessionUuid || archivosSubidos.length === 0) return

      archivosSubidos.forEach((archivo) => {
        enviarBeaconCleanup({ sessionUuid, storagePath: archivo.storagePath })
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [archivosSubidos, sessionUuid, isSubmitting])
}
