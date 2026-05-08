'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  onBack?: () => void
  submitLabel?: string
  isFirst?: boolean
  disabled?: boolean
}

/**
 * Botones Atrás / Continuar al pie de cada paso del formulario.
 * Layout estilo Figma: Atrás flex-1 (gris outline, sólo texto), Continuar
 * flex-2 (navy con ArrowRight). En el primer paso, sólo Continuar (sin Atrás).
 */
export function FormActions({
  onBack,
  submitLabel = 'Continuar',
  isFirst,
  disabled,
}: FormActionsProps) {
  return (
    <div className={cn('mt-8 flex gap-3', isFirst ? 'justify-end' : 'items-stretch')}>
      {!isFirst && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-medium text-on-surface-variant transition-all hover:border-outline-variant hover:bg-surface-bright active:scale-[0.98]"
        >
          Atrás
        </button>
      )}
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all',
          isFirst ? '' : 'flex-[2]',
          disabled
            ? 'cursor-not-allowed bg-outline-variant shadow-none'
            : 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]',
        )}
      >
        <span>{submitLabel}</span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </button>
    </div>
  )
}
