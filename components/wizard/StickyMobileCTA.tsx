'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { useMobile } from '@/hooks/useMobile'
import { useWizardActionsState } from './WizardActionsContext'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD_PX = 120

/**
 * CTA fijo abajo del viewport (mobile-only) que reemplaza los botones inline
 * de cada paso del formulario. Lee la configuración del paso activo desde el
 * `WizardActionsContext` (formId, label, disabled, loading, onBack), así
 * funciona idéntico a los CTAs inline en los 3 escenarios:
 *
 *   - Paso 1: solo "Ver mi oferta" (sin Atrás)
 *   - Pasos 2-6: "Atrás" + "Continuar"
 *   - Paso 7: "Atrás" + "Enviar solicitud" (con loading state)
 *
 * Comportamiento:
 *   - Aparece cuando el usuario hace scroll abajo (>120px)
 *   - Se oculta cuando vuelve arriba
 *   - No se renderiza en desktop (md+)
 *   - Respeta `env(safe-area-inset-bottom)` (home indicator de iPhone)
 */
export function StickyMobileCTA() {
  const isMobile = useMobile()
  const scrolled = useScrolled(SCROLL_THRESHOLD_PX)
  const { formId, submitLabel, disabled, loading, loadingLabel, onBack, submitIcon } =
    useWizardActionsState()

  const visible = isMobile && scrolled
  const SubmitIcon = submitIcon
  const showLoading = loading
  const isDisabled = disabled || loading

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
            <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-2.5">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-1 rounded-xl px-4 text-sm font-medium text-on-surface-variant transition-colors hover:bg-black/[0.04] active:scale-[0.97] disabled:opacity-50"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Atrás
                </button>
              )}
              <button
                type="submit"
                form={formId}
                disabled={isDisabled}
                className={cn(
                  'inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all',
                  isDisabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:bg-primary/95 active:scale-[0.98]',
                )}
              >
                {showLoading ? (
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
