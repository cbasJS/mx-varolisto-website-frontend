'use client'

import { usePaso5 } from '@/hooks/solicitar/usePaso5'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { RELACION_REFERENCIA } from '@varolisto/shared-schemas/enums'
import { RELACIONES_META } from '@/lib/solicitud/utils/lookup-labels'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FloatingInput } from '../FloatingInput'
import { StepTitle } from '../StepTitle'
import { FormActions } from '../FormActions'
import { FieldError } from '../FieldError'
import { InfoBanner } from '../InfoBanner'
import { cn } from '@/lib/utils'

interface Props {
  onNext: (datos: Paso5Data) => void
  onBack: () => void
}

function RefCard({
  numero,
  prefix,
  register,
  control,
  errors,
}: {
  numero: 1 | 2
  prefix: 'ref1' | 'ref2'
  register: ReturnType<typeof useForm<Paso5Data>>['register']
  control: ReturnType<typeof useForm<Paso5Data>>['control']
  errors: ReturnType<typeof useForm<Paso5Data>>['formState']['errors']
}) {
  const nombreKey = `${prefix}Nombre` as keyof Paso5Data
  const telefonoKey = `${prefix}Telefono` as keyof Paso5Data
  const relacionKey = `${prefix}Relacion` as keyof Paso5Data
  const emailKey = `${prefix}Email` as keyof Paso5Data

  const telefonoValue = (useWatch({ control, name: telefonoKey }) as string) ?? ''

  return (
    <div className="rounded-2xl border-2 border-surface-container-high bg-surface-bright p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {numero}
        </div>
        <h3 className="font-headline text-base font-semibold text-on-surface">
          Referencia {numero}
        </h3>
      </div>
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
          suffix={
            <span className="tabular-nums text-xs text-outline">{telefonoValue.length}/10</span>
          }
        />
        <div>
          <Controller
            control={control}
            name={relacionKey}
            render={({ field }) => {
              const hasValue = !!(field.value as string)
              return (
                <div
                  className={cn(
                    'relative rounded-xl border-2 bg-white transition-all duration-200',
                    errors[relacionKey]
                      ? 'border-error'
                      : 'border-surface-container-high hover:border-outline-variant',
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none absolute left-4 z-10 select-none transition-all duration-200',
                      hasValue
                        ? 'top-2 text-[10px] font-semibold uppercase tracking-widest text-outline'
                        : 'top-1/2 -translate-y-1/2 text-sm text-outline',
                    )}
                  >
                    Relación{' '}
                    <span className="text-error" aria-hidden>
                      *
                    </span>
                  </span>
                  <Select value={field.value as string} onValueChange={field.onChange}>
                    <SelectTrigger
                      data-size=""
                      className={cn(
                        '!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-base md:text-sm shadow-none focus:ring-0',
                        hasValue ? 'pb-2 pt-6' : 'py-0',
                      )}
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELACION_REFERENCIA.map((v) => (
                        <SelectItem key={v} value={v}>
                          {RELACIONES_META[v]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }}
          />
          <FieldError message={errors[relacionKey]?.message as string} />
        </div>
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
    </div>
  )
}

export default function Paso5Referencias({ onNext, onBack }: Props) {
  const { register, handleSubmit, control, errors, isValid } = usePaso5(onNext)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={5}
        titulo="Referencias personales"
        subtitulo="Necesitamos dos personas que puedan confirmar tu solicitud."
      />

      <InfoBanner variant="info">
        <strong>Avísales antes de enviar.</strong> Contactaremos a estas personas para confirmar tu
        información. Asegúrate de que estén disponibles.
      </InfoBanner>

      <div className="mt-5 space-y-4">
        <RefCard numero={1} prefix="ref1" register={register} control={control} errors={errors} />
        <RefCard numero={2} prefix="ref2" register={register} control={control} errors={errors} />
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
