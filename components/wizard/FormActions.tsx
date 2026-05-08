'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  onBack?: () => void
  submitLabel?: string
  isFirst?: boolean
  disabled?: boolean
  /**
   * Vincula el botón submit al `<form id="…">` correspondiente. Útil cuando
   * FormActions vive en un slot estático fuera del DOM del form (vía Portal).
   */
  formId?: string
}

/**
 * Botones Atrás / Siguiente al pie de cada paso del formulario.
 * Layout estilo Figma: Atrás flex-1 (gris outline, sólo texto), Siguiente
 * flex-2 (navy con ArrowRight). En el primer paso, sólo Siguiente (sin Atrás).
 *
 * NOTA: usamos `rounded-[12px]` (en lugar de `rounded-xl`) porque el proyecto
 * sobreescribe `rounded-xl` a 1.5rem (24px). Figma usa 12px para estos botones.
 */
export function FormActions({
  onBack,
  submitLabel = 'Siguiente',
  isFirst,
  disabled,
  formId,
}: FormActionsProps) {
  return (
    <div className={cn('mt-8 flex gap-3', isFirst ? 'justify-end' : 'items-stretch')}>
      {!isFirst && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-[12px] border-2 border-gray-300 bg-white py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
        >
          Atrás
        </button>
      )}
      <button
        type="submit"
        form={formId}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center gap-2 rounded-[12px] bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/30 transition-all',
          isFirst ? '' : 'flex-[2]',
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/90 active:scale-[0.98]',
        )}
      >
        <span>{submitLabel}</span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </button>
    </div>
  )
}
