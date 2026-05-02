'use client'

import { useState, useCallback } from 'react'
import { ApiError } from '@/lib/api'
import {
  solicitarUploadUrl,
  eliminarArchivoStaging,
} from '@/lib/solicitud/application/useCases/uploadFile'
import { useSolicitudStore } from '@/lib/solicitud/store'
import type { ArchivoSubido } from '@/lib/solicitud/store'
import type { TipoArchivo } from '@varolisto/shared-schemas/enums'
import { generateUUID } from '@/lib/utils'

export type EstadoUpload = 'pending' | 'uploading' | 'uploaded' | 'failed' | 'deleting'

export interface EntradaUpload {
  clienteId: string
  file: File
  tipoArchivo: TipoArchivo
  estado: EstadoUpload
  error: string | null
}

function archivoSubidoAEntrada(a: ArchivoSubido): EntradaUpload {
  return {
    clienteId: a.clienteId,
    file: new File([], a.nombreOriginal, { type: a.mimeType }),
    tipoArchivo: a.tipoArchivo,
    estado: 'uploaded',
    error: null,
  }
}

export function useUploadArchivo() {
  const sessionUuid = useSolicitudStore((s) => s.sessionUuid)
  const agregarArchivoSubido = useSolicitudStore((s) => s.agregarArchivoSubido)
  const removerArchivoSubido = useSolicitudStore((s) => s.removerArchivoSubido)
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)

  const [entradas, setEntradas] = useState<Map<string, EntradaUpload>>(() => new Map())

  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null)

  const actualizarEntrada = useCallback((clienteId: string, patch: Partial<EntradaUpload>) => {
    setEntradas((prev) => {
      const next = new Map(prev)
      const actual = next.get(clienteId)
      if (actual) next.set(clienteId, { ...actual, ...patch })
      return next
    })
  }, [])

  const subirArchivo = useCallback(
    async (file: File, clienteId: string, tipoArchivo: TipoArchivo = 'otro') => {
      if (!sessionUuid) return

      actualizarEntrada(clienteId, { estado: 'uploading' })

      try {
        const urlResponse = await solicitarUploadUrl({
          sessionUuid,
          tipoArchivo,
          nombreOriginal: file.name,
          mimeType: file.type,
          tamanoBytes: file.size,
        })

        const putResponse = await fetch(urlResponse.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
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

        actualizarEntrada(clienteId, { estado: 'uploaded', error: null })
      } catch (err) {
        const mensaje =
          err instanceof ApiError && err.status === 422
            ? 'No pudimos procesar este archivo. Verifica que sea JPG o PNG y vuelve a intentar.'
            : err instanceof Error
              ? err.message
              : 'Error desconocido al subir'
        actualizarEntrada(clienteId, { estado: 'failed', error: mensaje })
      }
    },
    [sessionUuid, actualizarEntrada, agregarArchivoSubido],
  )

  const agregarArchivos = useCallback(
    (files: File[], tipoArchivo: TipoArchivo = 'otro') => {
      const nuevasEntradas: EntradaUpload[] = files.map((file) => ({
        clienteId: generateUUID(),
        file,
        tipoArchivo,
        estado: 'pending' as EstadoUpload,
        error: null,
      }))

      setEntradas((prev) => {
        const next = new Map(prev)
        for (const e of nuevasEntradas) next.set(e.clienteId, e)
        return next
      })

      for (const entrada of nuevasEntradas) {
        subirArchivo(entrada.file, entrada.clienteId, tipoArchivo)
      }
    },
    [subirArchivo],
  )

  const eliminarEntrada = useCallback(
    async (
      clienteId: string,
      motivo: 'user_action' | 'tipo_identificacion_changed' = 'user_action',
    ) => {
      if (!sessionUuid) return

      const archivoSubido = archivosSubidos.find((a) => a.clienteId === clienteId)

      if (archivoSubido) {
        // Marca como deleting para feedback visual inmediato
        actualizarEntrada(clienteId, { estado: 'deleting' })
        try {
          await eliminarArchivoStaging(sessionUuid, archivoSubido.storagePath, motivo)
        } catch {
          // Ambos intentos fallaron — NO mutar state, mostrar error
          actualizarEntrada(clienteId, { estado: 'uploaded' })
          setErrorEliminacion('No pudimos eliminar el archivo. Intenta de nuevo.')
          return
        }
      }

      // DELETE exitoso (o archivo solo en estado local sin storagePath confirmado)
      removerArchivoSubido(clienteId)
      setEntradas((prev) => {
        const next = new Map(prev)
        next.delete(clienteId)
        return next
      })
    },
    [sessionUuid, archivosSubidos, actualizarEntrada, removerArchivoSubido],
  )

  const reintentarUpload = useCallback(
    (clienteId: string, tipoArchivo: TipoArchivo = 'otro') => {
      const entrada = entradas.get(clienteId)
      if (!entrada || entrada.estado !== 'failed') return
      subirArchivo(entrada.file, clienteId, tipoArchivo)
    },
    [entradas, subirArchivo],
  )

  const hidratarEntradas = useCallback((archivos: ArchivoSubido[]) => {
    setEntradas((prev) => {
      const next = new Map(prev)
      for (const a of archivos) {
        if (!next.has(a.clienteId)) {
          next.set(a.clienteId, archivoSubidoAEntrada(a))
        }
      }
      return next
    })
  }, [])

  const listaEntradas = Array.from(entradas.values())

  const hayEnVuelo = listaEntradas.some(
    (e) => e.estado === 'pending' || e.estado === 'uploading' || e.estado === 'deleting',
  )

  return {
    entradas: listaEntradas,
    agregarArchivos,
    eliminarEntrada,
    reintentarUpload,
    hidratarEntradas,
    hayEnVuelo,
    errorEliminacion,
    setErrorEliminacion,
  }
}
