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
import { FloatingInput } from '../../FloatingInput'
import { FieldError } from '../../FieldError'
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
        {cargandoCP ? (
          <div className="h-[52px] animate-pulse rounded-xl bg-surface-bright" />
        ) : (
          <div
            className={cn(
              'relative rounded-xl border-2 bg-white transition-all duration-200',
              errors.colonia
                ? 'border-error'
                : 'border-surface-container-high hover:border-outline-variant',
              !colonias && 'opacity-50',
            )}
          >
            <span
              className={cn(
                'pointer-events-none absolute left-4 z-10 select-none transition-all duration-200',
                coloniaActual
                  ? 'top-2 text-[10px] font-semibold uppercase tracking-widest text-outline'
                  : 'top-1/2 -translate-y-1/2 text-sm text-outline',
              )}
            >
              Colonia{' '}
              <span className="text-error" aria-hidden>
                *
              </span>
            </span>
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
                  '!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0',
                  coloniaActual ? 'pb-2 pt-6' : 'py-0',
                )}
              >
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {colonias?.map((item) => (
                  <SelectItem key={item.response.asentamiento} value={item.response.asentamiento}>
                    {item.response.asentamiento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!errors.colonia && !coloniaActual && colonias && (
          <p className="mt-1.5 text-xs text-outline">Selecciona tu colonia</p>
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
