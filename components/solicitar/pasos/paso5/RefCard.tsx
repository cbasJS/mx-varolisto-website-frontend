'use client'

import { Controller, useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { RELACION_REFERENCIA } from '@varolisto/shared-schemas/enums'
import { RELACIONES_META } from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { FloatingSelect } from '@/components/forms/FloatingSelect'
import { cn } from '@/lib/utils'

interface RefCardProps {
  prefix: 'ref1' | 'ref2'
  register: UseFormRegister<Paso5Data>
  control: Control<Paso5Data>
  errors: FieldErrors<Paso5Data>
}

export function RefCard({ prefix, register, control, errors }: RefCardProps) {
  const nombreKey = `${prefix}Nombre` as keyof Paso5Data
  const telefonoKey = `${prefix}Telefono` as keyof Paso5Data
  const relacionKey = `${prefix}Relacion` as keyof Paso5Data
  const emailKey = `${prefix}Email` as keyof Paso5Data

  const telefonoValue = (useWatch({ control, name: telefonoKey }) as string) ?? ''

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FloatingInput
        label="Nombre completo"
        required
        inputMode="text"
        autoComplete="name"
        error={errors[nombreKey]?.message as string}
        {...register(nombreKey)}
        placeholder=" "
      />
      <FloatingInput
        label="Teléfono"
        required
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        error={errors[telefonoKey]?.message as string}
        {...register(telefonoKey, {
          onChange: (e) => {
            e.target.value = e.target.value.replace(/\D/g, '')
          },
        })}
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
      <Controller
        control={control}
        name={relacionKey}
        render={({ field }) => (
          <FloatingSelect
            label="¿Qué relación tienen?"
            required
            value={field.value as string}
            onValueChange={field.onChange}
            options={RELACION_REFERENCIA.map((v) => ({ value: v, label: RELACIONES_META[v] }))}
            error={errors[relacionKey]?.message as string}
          />
        )}
      />
      <FloatingInput
        label="Correo electrónico"
        type="email"
        inputMode="email"
        autoComplete="email"
        optional
        error={errors[emailKey]?.message as string}
        {...register(emailKey)}
        placeholder=" "
      />
    </div>
  )
}
