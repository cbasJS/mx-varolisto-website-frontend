"use client"

import { useEffect, useCallback, useState } from "react"

export type VarianteDialogo = "submitting" | "archivos" | "datos"

interface UseNavegacionConGuardaReturn {
  dialogoAbierto: boolean
  variante: VarianteDialogo
  confirmarSalida: () => void
  cancelarSalida: () => void
}

export function useNavegacionConGuarda(
  hayDatosCapturados: boolean,
  hayArchivosSubidos: boolean,
  isSubmitting: boolean,
): UseNavegacionConGuardaReturn {
  const debeInterceptar = isSubmitting || hayArchivosSubidos || hayDatosCapturados

  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [destinoPendiente, setDestinoPendiente] = useState<string | null>(null)
  const [variante, setVariante] = useState<VarianteDialogo>("datos")

  const resolverVariante = useCallback((): VarianteDialogo => {
    if (isSubmitting) return "submitting"
    if (hayArchivosSubidos) return "archivos"
    return "datos"
  }, [isSubmitting, hayArchivosSubidos])

  const interceptarClick = useCallback(
    (e: MouseEvent) => {
      if (!debeInterceptar) return

      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href") ?? ""

      // Ignorar: anclas internas, javascript:, mailto:, tel:, rutas de API, y destinos externos
      if (
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("/api/")
      ) return

      // Solo interceptar navegaciones a la misma origin (o relativas)
      let url: URL
      try {
        url = new URL(href, window.location.origin)
      } catch {
        return
      }

      // No interceptar si es el mismo path (para evitar bloquear reloads o links al propio /solicitar)
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      // Solo interceptar si es same-origin
      if (url.origin !== window.location.origin) return

      e.preventDefault()
      e.stopPropagation()
      setVariante(resolverVariante())
      setDestinoPendiente(href)
      setDialogoAbierto(true)
    },
    [debeInterceptar, resolverVariante],
  )

  useEffect(() => {
    // Recalcular variante cuando cambian las condiciones mientras el diálogo está abierto
    if (dialogoAbierto) {
      setVariante(resolverVariante())
    }
  }, [isSubmitting, hayArchivosSubidos, dialogoAbierto, resolverVariante])

  useEffect(() => {
    document.addEventListener("click", interceptarClick, true)
    return () => document.removeEventListener("click", interceptarClick, true)
  }, [interceptarClick])

  const confirmarSalida = useCallback(() => {
    setDialogoAbierto(false)
    const destino = destinoPendiente
    setDestinoPendiente(null)
    if (destino) {
      // setTimeout 0 ensures React flushes state before navigation, preventing
      // interceptarClick from re-registering and intercepting the programmatic navigation
      setTimeout(() => {
        window.location.href = destino
      }, 0)
    }
  }, [destinoPendiente])

  const cancelarSalida = useCallback(() => {
    setDialogoAbierto(false)
    setDestinoPendiente(null)
  }, [])

  return { dialogoAbierto, variante, confirmarSalida, cancelarSalida }
}
