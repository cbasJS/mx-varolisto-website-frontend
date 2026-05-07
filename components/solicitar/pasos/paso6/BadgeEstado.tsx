'use client'

import type { EstadoUpload } from '@/hooks/solicitar/usePaso6'

export function BadgeEstado({ estado }: { estado: EstadoUpload }) {
  if (estado === 'uploading' || estado === 'pending') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-surface-container-high border-t-primary" />
        <span className="text-xs text-outline">Subiendo…</span>
      </div>
    )
  }
  if (estado === 'deleting') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-surface-container-high border-t-error" />
        <span className="text-xs text-outline">Eliminando…</span>
      </div>
    )
  }
  if (estado === 'uploaded') {
    return (
      <span
        className="material-symbols-outlined text-lg text-secondary"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        check_circle
      </span>
    )
  }
  return null
}
