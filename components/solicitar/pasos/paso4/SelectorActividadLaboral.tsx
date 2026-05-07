'use client'

import { TIPO_ACTIVIDAD } from '@varolisto/shared-schemas/enums'
import { ACTIVIDADES_META } from '@/lib/solicitud/utils/lookup-labels'
import { FieldError } from '../../FieldError'
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
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-outline">
        Tipo de actividad laboral{' '}
        <span className="text-error" aria-hidden>
          *
        </span>
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TIPO_ACTIVIDAD.map((opcion) => {
          const { label, icono, hint } = ACTIVIDADES_META[opcion]
          return (
            <button
              key={opcion}
              type="button"
              onClick={() => onChange(opcion)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all active:scale-[0.97]',
                value === opcion
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-container-high bg-white hover:border-primary/30',
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-lg',
                  value === opcion ? 'text-secondary' : 'text-outline',
                )}
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden
              >
                {icono}
              </span>
              <span className="text-sm font-semibold leading-tight">{label}</span>
              {hint && (
                <span
                  className={cn('text-[11px]', value === opcion ? 'text-white/70' : 'text-outline')}
                >
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
