'use client'

import { TIPO_ACTIVIDAD } from '@varolisto/shared-schemas/enums'
import { ACTIVIDADES_META } from '@/lib/solicitud/utils/lookup-labels'
import { FieldError } from '@/components/forms/FieldError'
import { cn } from '@/lib/utils'

type TipoActividad = (typeof TIPO_ACTIVIDAD)[number]

interface SelectorActividadLaboralProps {
  value: TipoActividad | undefined
  onChange: (value: TipoActividad) => void
  error?: string
}

export function SelectorActividadLaboral({
  value,
  onChange,
  error,
}: SelectorActividadLaboralProps) {
  return (
    <div className="mb-6">
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
        ¿A qué te dedicas?{' '}
        <span className="text-error" aria-hidden>
          *
        </span>
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {TIPO_ACTIVIDAD.map((opcion) => {
          const { label, hint, lucideIcon: Icono } = ACTIVIDADES_META[opcion]
          const selected = value === opcion
          return (
            <button
              key={opcion}
              type="button"
              onClick={() => onChange(opcion)}
              className={cn(
                'flex flex-col rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]',
                selected
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-gray-200 bg-white text-on-surface hover:border-gray-300',
              )}
            >
              <Icono
                className={cn(
                  'mb-2 size-6 shrink-0',
                  selected ? 'text-secondary' : 'text-gray-400',
                )}
                aria-hidden
              />
              <span className="mb-1 font-semibold leading-tight">{label}</span>
              {hint && (
                <span className={cn('text-xs', selected ? 'text-white/70' : 'text-gray-500')}>
                  {hint}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <FieldError message={error} />
    </div>
  )
}
