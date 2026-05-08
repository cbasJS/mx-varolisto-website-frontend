'use client'

import { Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/forms/FieldError'

interface ConsentimientosSectionProps {
  privacidad: boolean | undefined
  terminos: boolean | undefined
  onPrivacidadChange: (checked: boolean | 'indeterminate') => void
  onTerminosChange: (checked: boolean | 'indeterminate') => void
  errorPrivacidad?: string
  errorTerminos?: string
}

const checkboxClassName =
  'mt-0.5 size-5 rounded-md border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary'

export function ConsentimientosSection({
  privacidad,
  terminos,
  onPrivacidadChange,
  onTerminosChange,
  errorPrivacidad,
  errorTerminos,
}: ConsentimientosSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          id="aceptaTerminos"
          checked={terminos === true}
          onCheckedChange={onTerminosChange}
          className={checkboxClassName}
        >
          <Check className="size-3.5 text-white" aria-hidden />
        </Checkbox>
        <span className="text-sm leading-tight text-gray-600">
          He leído y acepto los{' '}
          <a
            href="/terminos-condiciones"
            target="_blank"
            className="font-bold text-primary hover:underline"
          >
            Términos y Condiciones
          </a>{' '}
          y el uso de medios electrónicos para la celebración del contrato.
        </span>
      </label>
      <FieldError message={errorTerminos} />

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          id="aceptaPrivacidad"
          checked={privacidad === true}
          onCheckedChange={onPrivacidadChange}
          className={checkboxClassName}
        >
          <Check className="size-3.5 text-white" aria-hidden />
        </Checkbox>
        <span className="text-sm leading-tight text-gray-600">
          Autorizo el tratamiento de mis datos personales de acuerdo al{' '}
          <a
            href="/aviso-de-privacidad-integral"
            target="_blank"
            className="font-bold text-primary hover:underline"
          >
            Aviso de Privacidad
          </a>
          .
        </span>
      </label>
      <FieldError message={errorPrivacidad} />
    </div>
  )
}
