'use client'

import type { FormEventHandler, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FormActions } from './FormActions'

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
  /** Slot donde se portalizan los botones (estático en el orquestador). */
  actionsSlot: HTMLElement | null
  children: ReactNode
}

/**
 * Wrapper para los pasos 2-6. Renderiza el `<form>` con id estable y portal-iza
 * los `<FormActions>` a un slot estático afuera del card animado, así sólo el
 * inner content transiciona entre pasos.
 */
export function PasoFormShell({
  onSubmit,
  onBack,
  disabled,
  submitLabel,
  actionsSlot,
  children,
}: Props) {
  return (
    <>
      <form id={ACTIVE_PASO_FORM_ID} onSubmit={onSubmit} noValidate>
        {children}
      </form>
      {actionsSlot &&
        createPortal(
          <FormActions
            formId={ACTIVE_PASO_FORM_ID}
            onBack={onBack}
            disabled={disabled}
            submitLabel={submitLabel}
          />,
          actionsSlot,
        )}
    </>
  )
}
