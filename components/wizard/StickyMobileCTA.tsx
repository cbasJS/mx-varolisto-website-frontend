'use client'

import { AnimatePresence, motion } from 'framer-motion'
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
 *   - Paso 1: solo "Ver mi oferta" (sin Atrás), shimmer, alwaysVisible.
 *   - Pasos 2-6: "Atrás" + "Continuar"
 *   - Paso 7: "Atrás" + "Enviar solicitud" (verde, shimmer, loading state,
 *     alwaysVisible)
 *
 * Comportamiento:
 *   - Aparece cuando el usuario hace scroll abajo (>120px). Los pasos con
 *     `alwaysVisible: true` (paso 1 y paso 7) bypassan el threshold y el
 *     sticky aparece desde el inicio.
 *   - Crossfade: en TODOS los pasos, el sticky se oculta cuando el sentinel
 *     al fondo del form entra al viewport (los CTAs inline toman el control
 *     en mobile). `alwaysVisible` NO bypassa el crossfade.
 *   - No se renderiza en desktop (md+).
 *   - Respeta `env(safe-area-inset-bottom)` (home indicator de iPhone).
 *
 * Coherencia visual con los CTAs inline (FormActions, Paso 1, Paso 7) y con
 * el BottomNav del landing:
 *   - Mismo `rounded-full` (pill shape — match BottomNav).
 *   - Misma altura (`py-3` ≈ 48px) y `text-base font-medium`.
 *   - Mismo ancho de fila (`mx-auto max-w-2xl px-4`) que el contenedor del
 *     formulario, así Atrás/Continuar tienen idénticas dimensiones cuando el
 *     usuario cruza el crossfade.
 *   - Look fintech tipo BottomNav: `rounded-t-3xl` en el wrapper, blur,
 *     sombra suave.
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

  // alwaysVisible bypassa el threshold de scroll (sticky aparece desde el
  // inicio sin esperar a que el usuario scrollee). El crossfade hacia los
  // inline al llegar al fondo se respeta siempre — incluso con alwaysVisible.
  const visible = isMobile && (alwaysVisible || scrolled) && !inlineRevealed
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
          className="py-3 fixed inset-x-0 bottom-0 z-50 border-t border-black/5 rounded-t-3xl bg-white/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="mx-auto flex max-w-2xl items-stretch gap-3 px-4 py-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Atrás</span>
              </button>
            )}
            <button
              type="submit"
              form={formId}
              disabled={isDisabled}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-medium transition-all',
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
