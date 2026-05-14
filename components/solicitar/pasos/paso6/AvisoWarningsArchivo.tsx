'use client'

export interface WarningArchivoItem {
  filename: string
  mensaje: string
}

interface AvisoWarningsArchivoProps {
  items: WarningArchivoItem[]
  onDismiss: () => void
}

export function AvisoWarningsArchivo({ items, onDismiss }: AvisoWarningsArchivoProps) {
  if (items.length === 0) return null
  return (
    <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <span
        className="material-symbols-outlined mt-0.5 shrink-0 text-base text-amber-600"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        warning
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-900">
          Aceptamos tus archivos, pero revisa estos puntos:
        </p>
        <ul className="mt-1.5 space-y-1">
          {items.map((it, i) => (
            <li key={`${it.filename}-${i}`} className="text-[13px] leading-snug text-amber-800">
              <span className="font-semibold">{it.filename}</span>
              {' — '}
              {it.mensaje}
            </li>
          ))}
        </ul>
      </div>
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
