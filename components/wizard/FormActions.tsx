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
 * Botones Atrás / Continuar al pie de cada paso del formulario.
 * Layout alineado con el StickyMobileCTA para que la transición mobile entre
 * sticky e inline (cerca del fondo del form) sea fluida: misma altura
 * (`py-3` ≈ 48px), mismo border-radius (12px), Atrás compacto + Continuar
 * `flex-1`.
 *
 * NOTA: usamos `rounded-[12px]` (en lugar de `rounded-xl`) porque el proyecto
 * sobreescribe `rounded-xl` a 1.5rem (24px). Figma usa 12px para estos botones.
 */
export function FormActions({
  onBack,
  submitLabel = 'Continuar',
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
          className="inline-flex items-center justify-center gap-1.5 rounded-[12px] border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
        >
          <span>Atrás</span>
        </button>
      )}
      <button
        type="submit"
        form={formId}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-base font-medium text-white shadow-md shadow-primary/25 transition-all',
          isFirst ? 'min-w-[12rem]' : 'flex-1',
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-primary/95 active:scale-[0.98]',
        )}
      >
        <span>{submitLabel}</span>
        <ArrowRight className="size-4 shrink-0" aria-hidden />
      </button>
    </div>
  )
}
