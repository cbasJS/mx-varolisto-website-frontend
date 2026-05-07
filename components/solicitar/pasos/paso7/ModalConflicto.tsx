'use client'

import { WHATSAPP_URL } from '@/lib/config'

interface ModalConflictoProps {
  onConfirmado: () => void
}

export function ModalConflicto({ onConfirmado }: ModalConflictoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100">
          <span
            className="material-symbols-outlined text-2xl text-amber-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            warning
          </span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-on-surface">Solicitud activa existente</h2>
        <p className="mb-6 text-sm text-on-surface-variant leading-relaxed">
          Ya existe una solicitud activa con estos datos. Si necesitas ayuda, escríbenos por{' '}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2"
          >
            WhatsApp
          </a>{' '}
          con tu teléfono o CURP.
        </p>
        <button
          type="button"
          onClick={onConfirmado}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
