'use client'

import type { FormEventHandler, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FormActions } from './FormActions'
import { useRegisterWizardActions } from './WizardActionsContext'

/**
 * id estable del `<form>` activo. Como el orquestador usa
 * `<AnimatePresence mode="wait">`, sólo un paso está montado a la vez, así que
 * el id no choca. El submit button vive en `actionsSlot` (fuera del DOM del
 * form) y se ata al form con `<button form={ACTIVE_PASO_FORM_ID}>`.
 */
export const ACTIVE_PASO_FORM_ID = 'paso-form-activo'

interface Props {
  onSubmit: FormEventHandler<HTMLFormElement>
  onBack?: () => void
  disabled?: boolean
  submitLabel?: string
  /** Slot donde se portalizan los botones inline (estático en el orquestador). */
  actionsSlot: HTMLElement | null
  children: ReactNode
}

/**
 * Wrapper para los pasos 2-6. Renderiza el `<form>` con id estable, registra
 * el CTA del paso en el WizardActionsContext (para el StickyMobileCTA) y
 * portaliza los `<FormActions>` inline a un slot estático afuera del card
 * animado, así sólo el inner content transiciona entre pasos.
 *
 * El FormActions inline está oculto en mobile (`hidden md:flex`) — el sticky
 * es el único CTA visible en mobile.
 */
export function PasoFormShell({
  onSubmit,
  onBack,
  disabled,
  submitLabel,
  actionsSlot,
  children,
}: Props) {
  useRegisterWizardActions({
    formId: ACTIVE_PASO_FORM_ID,
    submitLabel: submitLabel ?? 'Continuar',
    disabled: disabled ?? false,
    loading: false,
    onBack,
  })

  return (
    <>
      <form id={ACTIVE_PASO_FORM_ID} onSubmit={onSubmit} noValidate>
        {children}
      </form>
      {actionsSlot &&
        createPortal(
          <div className="hidden md:block">
            <FormActions
              formId={ACTIVE_PASO_FORM_ID}
              onBack={onBack}
              disabled={disabled}
              submitLabel={submitLabel}
            />
          </div>,
          actionsSlot,
        )}
    </>
  )
}
