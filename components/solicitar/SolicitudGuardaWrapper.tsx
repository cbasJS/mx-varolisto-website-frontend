'use client'

import { useSolicitudStore } from '@/lib/solicitud/store'
import { useSubmittingContext } from '@/lib/solicitud/submitting-context'
import { salidaCopy } from '@/content/solicitar'
import GuardaWrapper from '@/components/wizard/GuardaWrapper'

export default function SolicitudGuardaWrapper({ children }: { children: React.ReactNode }) {
  const datos = useSolicitudStore((s) => s.datos) as Record<string, unknown>
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const isSubmitting = useSubmittingContext()

  return (
    <GuardaWrapper
      hayDatos={Object.keys(datos).length > 0}
      hayArchivos={archivosSubidos.length > 0}
      isSubmitting={isSubmitting}
      copy={salidaCopy}
    >
      {children}
    </GuardaWrapper>
  )
}
