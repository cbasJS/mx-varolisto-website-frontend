'use client'

import { formatBytes } from '@/lib/solicitud/utils/formatBytes'
import { cn } from '@/lib/utils'
import type { EntradaUpload } from '@/hooks/solicitar/useUploadArchivo'
import { IconoArchivo } from './IconoArchivo'
import { BadgeEstado } from './BadgeEstado'

interface ListaEntradasProps {
  entradas: EntradaUpload[]
  eliminarEntrada: (id: string) => void
  reintentarUpload: (id: string) => void
}

export function ListaEntradas({ entradas, eliminarEntrada, reintentarUpload }: ListaEntradasProps) {
  if (entradas.length === 0) return null
  return (
    <ul className="mt-3 space-y-2">
      {entradas.map((entrada) => (
        <li
          key={entrada.clienteId}
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-2.5',
            entrada.estado === 'failed'
              ? 'border-red-200 bg-red-50'
              : entrada.estado === 'uploaded'
                ? 'border-secondary/30'
                : 'border-surface-container-high',
          )}
        >
          <IconoArchivo />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-on-surface">{entrada.file.name}</p>
            <p className="text-xs text-outline">{formatBytes(entrada.file.size)}</p>
            {entrada.estado === 'failed' && entrada.error && (
              <p className="mt-0.5 text-xs font-medium text-error">{entrada.error}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <BadgeEstado estado={entrada.estado} />
            {entrada.estado === 'failed' && (
              <button
                type="button"
                onClick={() => reintentarUpload(entrada.clienteId)}
                className="rounded-lg border border-error/30 px-2 py-1 text-xs font-semibold text-error transition-colors hover:bg-red-50"
              >
                Reintentar
              </button>
            )}
            {entrada.estado !== 'uploading' &&
              entrada.estado !== 'pending' &&
              entrada.estado !== 'deleting' && (
                <button
                  type="button"
                  onClick={() => eliminarEntrada(entrada.clienteId)}
                  className="rounded-lg p-1 text-outline-variant transition-colors hover:bg-red-50 hover:text-error"
                  aria-label={`Eliminar ${entrada.file.name}`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden>
                    close
                  </span>
                </button>
              )}
          </div>
        </li>
      ))}
    </ul>
  )
}
