'use client'

import { cn } from '@/lib/utils'

interface ToggleSinEstadosCuentaProps {
  checked: boolean
  onToggle: () => void
}

export function ToggleSinEstadosCuenta({ checked, onToggle }: ToggleSinEstadosCuentaProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'mt-3 flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all',
        checked
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-surface-container-high bg-white text-on-surface-variant hover:border-outline-variant',
      )}
    >
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          checked ? 'border-amber-500 bg-amber-500' : 'border-outline-variant bg-white',
        )}
        aria-hidden
      >
        {checked && (
          <span
            className="material-symbols-outlined text-xs text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check
          </span>
        )}
      </span>
      <span className="font-medium leading-snug">No cuento con estados de cuenta bancarios</span>
    </button>
  )
}
