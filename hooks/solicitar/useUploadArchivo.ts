"use client"

import { useState, useCallback } from "react"
import { apiPost } from "@/lib/api"
import { useSolicitudStore } from "@/lib/solicitud/store"
import type { TipoArchivo } from "@varolisto/shared-schemas/enums"

export type EstadoUpload = "pending" | "uploading" | "uploaded" | "failed"

export interface EntradaUpload {
  clienteId: string
  file: File
  estado: EstadoUpload
  error: string | null
}

interface UploadUrlResponse {
  uploadUrl: string
  storagePath: string
  archivoId: string
  expiresIn: number
}

interface UploadUrlRequest {
  sessionUuid: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
}

export function useUploadArchivo() {
  const sessionUuid = useSolicitudStore((s) => s.sessionUuid)
  const agregarArchivoSubido = useSolicitudStore((s) => s.agregarArchivoSubido)
  const removerArchivoSubido = useSolicitudStore((s) => s.removerArchivoSubido)

  const [entradas, setEntradas] = useState<Map<string, EntradaUpload>>(new Map())

  const actualizarEntrada = useCallback(
    (clienteId: string, patch: Partial<EntradaUpload>) => {
      setEntradas((prev) => {
        const next = new Map(prev)
        const actual = next.get(clienteId)
        if (actual) next.set(clienteId, { ...actual, ...patch })
        return next
      })
    },
    []
  )

  const subirArchivo = useCallback(
    async (file: File, clienteId: string, tipoArchivo: TipoArchivo = "otro") => {
      if (!sessionUuid) return

      actualizarEntrada(clienteId, { estado: "uploading" })

      try {
        const urlResponse = await apiPost<UploadUrlRequest, UploadUrlResponse>(
          "/api/archivos/upload-url",
          {
            sessionUuid,
            tipoArchivo,
            nombreOriginal: file.name,
            mimeType: file.type,
            tamanoBytes: file.size,
          },
          { timeoutMs: 30_000 }
        )

        const putResponse = await fetch(urlResponse.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        })

        if (!putResponse.ok) {
          throw new Error(`Error al subir archivo: ${putResponse.status}`)
        }

        agregarArchivoSubido({
          clienteId,
          tipoArchivo,
          nombreOriginal: file.name,
          mimeType: file.type,
          tamanoBytes: file.size,
          storagePath: urlResponse.storagePath,
          archivoId: urlResponse.archivoId,
        })

        actualizarEntrada(clienteId, { estado: "uploaded", error: null })
      } catch (err) {
        const mensaje =
          err instanceof Error ? err.message : "Error desconocido al subir"
        actualizarEntrada(clienteId, { estado: "failed", error: mensaje })
      }
    },
    [sessionUuid, actualizarEntrada, agregarArchivoSubido]
  )

  const agregarArchivos = useCallback(
    (files: File[], tipoArchivo: TipoArchivo = "otro") => {
      const nuevasEntradas: EntradaUpload[] = files.map((file) => ({
        clienteId: crypto.randomUUID(),
        file,
        estado: "pending" as EstadoUpload,
        error: null,
      }))

      setEntradas((prev) => {
        const next = new Map(prev)
        for (const e of nuevasEntradas) next.set(e.clienteId, e)
        return next
      })

      // Disparar uploads en paralelo
      for (const entrada of nuevasEntradas) {
        subirArchivo(entrada.file, entrada.clienteId, tipoArchivo)
      }
    },
    [subirArchivo]
  )

  const eliminarEntrada = useCallback(
    (clienteId: string) => {
      removerArchivoSubido(clienteId)
      setEntradas((prev) => {
        const next = new Map(prev)
        next.delete(clienteId)
        return next
      })
    },
    [removerArchivoSubido]
  )

  const reintentarUpload = useCallback(
    (clienteId: string, tipoArchivo: TipoArchivo = "otro") => {
      const entrada = entradas.get(clienteId)
      if (!entrada || entrada.estado !== "failed") return
      subirArchivo(entrada.file, clienteId, tipoArchivo)
    },
    [entradas, subirArchivo]
  )

  const listaEntradas = Array.from(entradas.values())

  const hayEnVuelo = listaEntradas.some(
    (e) => e.estado === "pending" || e.estado === "uploading"
  )

  return {
    entradas: listaEntradas,
    agregarArchivos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
  }
}
