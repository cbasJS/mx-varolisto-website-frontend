'use client'

import type { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form'
import type { Paso3Data } from '@/lib/solicitud/schemas/index'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { FieldError } from '@/components/forms/FieldError'
import { cn } from '@/lib/utils'

interface ColoniaItem {
  response: { asentamiento: string }
}

interface CamposCPProps {
  cargandoCP: boolean
  colonias: ColoniaItem[] | undefined
  coloniaActual: string
  errors: FieldErrors<Paso3Data>
  setValue: UseFormSetValue<Paso3Data>
  register: UseFormRegister<Paso3Data>
}

export function CamposCP({
  cargandoCP,
  colonias,
  coloniaActual,
  errors,
  setValue,
  register,
}: CamposCPProps) {
  return (
    <>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          Colonia{' '}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        {cargandoCP ? (
          <div className="h-[48px] animate-pulse rounded-full bg-surface-bright" />
        ) : (
          <Select
            disabled={!colonias}
            value={coloniaActual}
            onValueChange={(val) => setValue('colonia', val, { shouldValidate: true })}
          >
            <SelectTrigger
              id="colonia"
              aria-invalid={!!errors.colonia}
              data-size=""
              className={cn(
                'h-auto w-full rounded-full border-2 bg-white px-4 py-3 text-sm shadow-none transition-colors duration-200 focus:ring-0 data-[size=sm]:h-auto data-[size=default]:h-auto',
                errors.colonia ? 'border-error' : 'border-gray-200 hover:border-outline-variant',
                !colonias && 'opacity-50',
              )}
            >
              <SelectValue placeholder="Selecciona tu colonia" />
            </SelectTrigger>
            <SelectContent>
              {colonias?.map((item) => (
                <SelectItem key={item.response.asentamiento} value={item.response.asentamiento}>
                  {item.response.asentamiento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!errors.colonia && !coloniaActual && colonias && (
          <p className="mt-1.5 px-4 text-xs text-outline">Selecciona tu colonia</p>
        )}
        <FieldError message={errors.colonia?.message} />
      </div>

      <FloatingInput
        label="Municipio / Alcaldía"
        {...register('municipio')}
        readOnly
        placeholder=" "
        className="cursor-default text-outline"
      />

      <FloatingInput
        label="Estado"
        {...register('estado')}
        readOnly
        placeholder=" "
        className="cursor-default text-outline"
      />

      <FloatingInput
        label="Ciudad"
        {...register('ciudad')}
        readOnly
        placeholder=" "
        className="cursor-default text-outline"
      />
    </>
  )
}
