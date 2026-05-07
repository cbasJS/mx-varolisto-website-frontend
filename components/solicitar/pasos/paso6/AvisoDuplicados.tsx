'use client'

interface AvisoDuplicadosProps {
  cantidad: number
  onDismiss: () => void
}

export function AvisoDuplicados({ cantidad, onDismiss }: AvisoDuplicadosProps) {
  if (cantidad <= 0) return null
  return (
    <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <span
        className="material-symbols-outlined mt-0.5 shrink-0 text-base text-amber-600"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        warning
      </span>
      <p className="flex-1 text-sm text-amber-800">
        {cantidad === 1
          ? 'Un archivo ya estaba en la lista y fue omitido.'
          : `${cantidad} archivos ya estaban en la lista y fueron omitidos.`}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-0.5 text-amber-400 transition-colors hover:bg-amber-100 hover:text-amber-700"
        aria-label="Cerrar aviso"
      >
        <span className="material-symbols-outlined text-base" aria-hidden>
          close
        </span>
      </button>
    </div>
  )
}
