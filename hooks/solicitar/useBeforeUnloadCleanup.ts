"use client"

import { useEffect } from "react"
import { useSolicitudStore } from "@/lib/solicitud/store"

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

      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

      archivosSubidos.forEach((archivo) => {
        // text/plain evita el preflight CORS — garantiza que el request sale antes del unload
        const blob = new Blob(
          [JSON.stringify({ sessionUuid, storagePath: archivo.storagePath, motivo: "beforeunload" })],
          { type: "text/plain" },
        )
        navigator.sendBeacon(`${baseUrl}/api/archivos/staging/beacon-cleanup`, blob)
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [archivosSubidos, sessionUuid, isSubmitting])
}
