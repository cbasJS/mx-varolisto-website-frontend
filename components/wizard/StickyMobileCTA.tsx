'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { useMobile } from '@/hooks/useMobile'
import { useInlineRevealed, useWizardActionsState } from './WizardActionsContext'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD_PX = 120

/**
 * CTA fijo abajo del viewport (mobile-only) que reemplaza los botones inline
 * de cada paso del formulario. Lee la configuración del paso activo desde el
 * `WizardActionsContext` (formId, label, disabled, loading, variant, shimmer,
 * alwaysVisible, onBack), así funciona idéntico a los CTAs inline en los 3
 * escenarios:
 *
 *   - Paso 1: solo "Ver mi oferta" (sin Atrás), shimmer, siempre visible.
 *   - Pasos 2-6: "Atrás" + "Continuar"
 *   - Paso 7: "Atrás" + "Enviar solicitud" (verde, shimmer, loading state)
 *
 * Comportamiento:
 *   - Aparece cuando el usuario hace scroll abajo (>120px), excepto en pasos
 *     `alwaysVisible` donde se muestra siempre.
 *   - Se oculta cuando el actionsSlot al fondo del form entra al viewport
 *     (los CTAs inline toman el control en mobile).
 *   - No se renderiza en desktop (md+).
 *   - Respeta `env(safe-area-inset-bottom)` (home indicator de iPhone).
 *
 * Tamaño/estilo: alineado con FormActions inline para una transición fluida —
 * `rounded-[12px]`, altura interna `py-3` (~48px), padding del contenedor
 * `py-2.5`. Anchos: Atrás compacto, Continuar `flex-1`.
 */
export function StickyMobileCTA() {
  const isMobile = useMobile()
  const scrolled = useScrolled(SCROLL_THRESHOLD_PX)
  const { inlineRevealed } = useInlineRevealed()
  const {
    formId,
    submitLabel,
    disabled,
    loading,
    loadingLabel,
    onBack,
    submitIcon,
    submitVariant,
    submitShimmer,
    alwaysVisible,
  } = useWizardActionsState()

  const visible = isMobile && (alwaysVisible || (scrolled && !inlineRevealed))
  const SubmitIcon = submitIcon
  const isDisabled = disabled || loading

  // Variant del botón submit. `primary` = navy de marca; `success` = verde
  // varolisto (#2ECC71) usado en paso 7 (envío final).
  const variantClasses =
    submitVariant === 'success'
      ? cn(
          'bg-secondary text-white shadow-md shadow-secondary/30',
          isDisabled ? '' : 'hover:bg-secondary/95',
        )
      : cn(
          'bg-primary text-white shadow-md shadow-primary/25',
          isDisabled ? '' : 'hover:bg-primary/95',
        )

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="sticky-mobile-cta"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="border-t border-black/5 bg-white/80 shadow-[0_-8px_24px_-12px_rgba(0,6,102,0.12)] backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto flex max-w-2xl items-stretch gap-3 px-4 py-2.5">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-[12px] border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  <span>Atrás</span>
                </button>
              )}
              <button
                type="submit"
                form={formId}
                disabled={isDisabled}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-base font-medium transition-all',
                  variantClasses,
                  submitShimmer && !isDisabled && 'cta-shimmer',
                  isDisabled ? 'cursor-not-allowed opacity-60' : 'active:scale-[0.98]',
                )}
              >
                {loading ? (
                  <>
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{loadingLabel ?? 'Enviando…'}</span>
                  </>
                ) : (
                  <>
                    <span>{submitLabel}</span>
                    {SubmitIcon && <SubmitIcon className="size-4" aria-hidden />}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
