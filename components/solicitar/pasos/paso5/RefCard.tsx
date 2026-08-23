'use client'

import { Controller, useWatch } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { RELACION_REFERENCIA } from '@varolisto/shared-schemas/enums'
import { RELACIONES_META } from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { FloatingSelect } from '@/components/forms/FloatingSelect'
import { cn } from '@/lib/utils'

interface RefCardProps {
  index: number
  control: Control<Paso5Data>
  errors: FieldErrors<Paso5Data>
  canRemove: boolean
  onRemove: () => void
}

export function RefCard({ index, control, errors, canRemove, onRemove }: RefCardProps) {
  const telefonoValue =
    (useWatch({ control, name: `referencias.${index}.telefono` }) as string) ?? ''

  const referenciaErrors = errors.referencias?.[index]

  return (
    <div className="relative">
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Eliminar referencia ${index + 1}`}
          className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-error transition-colors hover:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error/40"
        >
          <Trash2 className="size-3.5" aria-hidden />
          <span>Eliminar</span>
        </button>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name={`referencias.${index}.nombre`}
          render={({ field }) => (
            <FloatingInput
              label="Nombre completo"
              required
              inputMode="text"
              autoComplete="name"
              error={referenciaErrors?.nombre?.message}
              {...field}
              value={field.value ?? ''}
              placeholder=" "
            />
          )}
        />
        <Controller
          control={control}
          name={`referencias.${index}.telefono`}
          render={({ field }) => (
            <FloatingInput
              label="Teléfono"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              error={referenciaErrors?.telefono?.message}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
              placeholder=" "
              labelSuffix={
                <span
                  className={cn(
                    'tabular-nums',
                    telefonoValue.length === 10 ? 'text-on-secondary-container' : 'text-outline',
                  )}
                >
                  {telefonoValue.length}/10
                </span>
              }
            />
          )}
        />
        <Controller
          control={control}
          name={`referencias.${index}.relacion`}
          render={({ field }) => (
            <FloatingSelect
              label="¿Qué relación tienen?"
              required
              value={field.value as string}
              onValueChange={field.onChange}
              options={RELACION_REFERENCIA.map((v) => ({ value: v, label: RELACIONES_META[v] }))}
              error={referenciaErrors?.relacion?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={`referencias.${index}.email`}
          render={({ field }) => (
            <FloatingInput
              label="Correo electrónico"
              type="email"
              inputMode="email"
              autoComplete="email"
              optional
              error={referenciaErrors?.email?.message}
              {...field}
              value={field.value ?? ''}
              placeholder=" "
            />
          )}
        />
      </div>
    </div>
  )
}
