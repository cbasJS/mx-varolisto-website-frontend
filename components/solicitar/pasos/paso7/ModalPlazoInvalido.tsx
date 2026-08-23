'use client'

import { WHATSAPP_URL } from '@/lib/config'

interface ModalPlazoInvalidoProps {
  onConfirmado: () => void
}

export function ModalPlazoInvalido({ onConfirmado }: ModalPlazoInvalidoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
          <span
            className="material-symbols-outlined text-2xl text-red-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            gpp_bad
          </span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-on-surface">Solicitud no válida</h2>
        <p className="mb-6 text-sm text-on-surface-variant leading-relaxed">
          La combinación de monto y plazo que enviaste no es válida. Por seguridad, vamos a iniciar
          tu solicitud desde cero. Si crees que es un error, escríbenos por{' '}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2"
          >
            WhatsApp
          </a>
          .
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
