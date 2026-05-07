'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '../../FieldError'

interface ConsentimientosSectionProps {
  privacidad: boolean | undefined
  terminos: boolean | undefined
  onPrivacidadChange: (checked: boolean | 'indeterminate') => void
  onTerminosChange: (checked: boolean | 'indeterminate') => void
  errorPrivacidad?: string
  errorTerminos?: string
}

export function ConsentimientosSection({
  privacidad,
  terminos,
  onPrivacidadChange,
  onTerminosChange,
  errorPrivacidad,
  errorTerminos,
}: ConsentimientosSectionProps) {
  return (
    <div className="mb-8 space-y-3 rounded-2xl border-2 border-surface-container-high bg-surface-bright p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-outline">
        Acepto los términos
      </p>

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          id="aceptaPrivacidad"
          checked={privacidad === true}
          onCheckedChange={onPrivacidadChange}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm text-on-surface-variant leading-relaxed">
          He leído y acepto el{' '}
          <a
            href="/aviso-de-privacidad-integral"
            target="_blank"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Aviso de Privacidad
          </a>
          .
        </span>
      </label>
      <FieldError message={errorPrivacidad} />

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          id="aceptaTerminos"
          checked={terminos === true}
          onCheckedChange={onTerminosChange}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm text-on-surface-variant leading-relaxed">
          He leído y acepto los{' '}
          <a
            href="/terminos-condiciones"
            target="_blank"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Términos y Condiciones
          </a>
          .
        </span>
      </label>
      <FieldError message={errorTerminos} />
    </div>
  )
}
