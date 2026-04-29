"use client"

import { useEffect, useState } from "react"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { useNavegacionConGuarda } from "@/hooks/solicitar/useNavegacionConGuarda"
import ConfirmacionSalidaDialog from "./ConfirmacionSalidaDialog"
import { useSubmittingContext } from "@/lib/solicitud/submitting-context"

function hayDatosSelector(datos: Record<string, unknown>): boolean {
  return Object.keys(datos).length > 0
}

export default function SolicitudGuardaWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const datos = useSolicitudStore((s) => s.datos) as Record<string, unknown>
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const isSubmitting = useSubmittingContext()

  const hayDatosCapturados = hayDatosSelector(datos)
  const hayArchivosSubidos = archivosSubidos.length > 0

  const { dialogoAbierto, variante, confirmarSalida, cancelarSalida } = useNavegacionConGuarda(
    hayDatosCapturados,
    hayArchivosSubidos,
    isSubmitting,
  )

  return (
    <>
      {children}
      {mounted && (
        <ConfirmacionSalidaDialog
          open={dialogoAbierto}
          variante={variante}
          onQuedarme={cancelarSalida}
          onSalir={confirmarSalida}
        />
      )}
    </>
  )
}
