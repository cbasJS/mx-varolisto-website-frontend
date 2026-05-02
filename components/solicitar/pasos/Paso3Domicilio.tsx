'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePaso3 } from '@/hooks/solicitar/usePaso3'
import type { Paso3Data } from '@/lib/solicitud/schemas/index'
import { ANIOS_VIVIENDO, TIPO_VIVIENDA } from '@varolisto/shared-schemas/enums'
import { ANIOS_VIVIENDO_LABELS, TIPO_VIVIENDA_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FloatingInput } from '../FloatingInput'
import { FloatingSelect } from '../FloatingSelect'
import { SectionDivider } from '../SectionDivider'
import { StepTitle } from '../StepTitle'
import { FormActions } from '../FormActions'
import { FieldError } from '../FieldError'
import { cn } from '@/lib/utils'

interface Props {
  onNext: (datos: Paso3Data) => void
  onBack: () => void
}

export default function Paso3Domicilio({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isValid,
    coloniaActual,
    codigoPostalValue,
    cpValido,
    colonias,
    cargandoCP,
    cpError,
    cpServiceError,
    aniosViviendoActual,
    tipoViviendaActual,
    aniosViviendoOpen,
    setAniosViviendoOpen,
    tipoViviendaOpen,
    setTipoViviendaOpen,
  } = usePaso3(onNext)

  useEffect(() => {
    if (cpServiceError) {
      toast.error(cpServiceError)
    }
  }, [cpServiceError])

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={3}
        titulo="Tu domicilio"
        subtitulo="Usamos tu código postal para encontrar tu colonia automáticamente."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* CP */}
        <div>
          <FloatingInput
            label="Código postal"
            required
            error={errors.codigoPostal?.message}
            {...register('codigoPostal')}
            placeholder=" "
            maxLength={5}
            inputMode="numeric"
            suffix={
              <span className="tabular-nums text-xs text-outline">
                {codigoPostalValue.length}/5
              </span>
            }
          />
          {cpValido && cpError && (
            <p className="mt-1.5 text-xs text-error">Código postal no encontrado</p>
          )}
        </div>

        {/* Colonia — visible solo cuando CP es válido y encontrado */}
        {cpValido && !cpError && (
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
                      <SelectItem
                        key={item.response.asentamiento}
                        value={item.response.asentamiento}
                      >
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
        )}

        {/* Municipio — solo cuando CP válido y encontrado */}
        {cpValido && !cpError && (
          <FloatingInput
            label="Municipio / Alcaldía"
            {...register('municipio')}
            readOnly
            placeholder=" "
            className="cursor-default text-outline"
            // hint="Se llena automáticamente con tu CP"
          />
        )}

        {/* Estado — solo cuando CP válido y encontrado */}
        {cpValido && !cpError && (
          <FloatingInput
            label="Estado"
            {...register('estado')}
            readOnly
            placeholder=" "
            className="cursor-default text-outline"
            // hint="Se llena automáticamente con tu CP"
          />
        )}

        {/* Ciudad — solo cuando CP válido y encontrado */}
        {cpValido && !cpError && (
          <FloatingInput
            label="Ciudad"
            {...register('ciudad')}
            readOnly
            placeholder=" "
            className="cursor-default text-outline"
            // hint="Se llena automáticamente con tu CP"
          />
        )}

        <FloatingInput
          label="Calle"
          required
          error={errors.calle?.message}
          {...register('calle')}
          placeholder=" "
        />
        <FloatingInput
          label="Número exterior"
          required
          error={errors.numeroExterior?.message}
          {...register('numeroExterior')}
          placeholder=" "
        />
        <FloatingInput
          label="Número interior"
          optional
          {...register('numeroInterior')}
          placeholder=" "
        />
      </div>

      <SectionDivider label="Situación de vivienda" />

      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingSelect
          label="Tiempo viviendo aquí"
          required
          value={aniosViviendoActual}
          onValueChange={(val) =>
            setValue('aniosViviendo', val as (typeof ANIOS_VIVIENDO)[number], {
              shouldValidate: true,
            })
          }
          onOpenChange={setAniosViviendoOpen}
          isOpen={aniosViviendoOpen}
          options={ANIOS_VIVIENDO.map((v) => ({ value: v, label: ANIOS_VIVIENDO_LABELS[v] }))}
          error={errors.aniosViviendo?.message}
        />
        <FloatingSelect
          label="Tipo de vivienda"
          required
          value={tipoViviendaActual}
          onValueChange={(val) =>
            setValue('tipoVivienda', val as (typeof TIPO_VIVIENDA)[number], {
              shouldValidate: true,
            })
          }
          onOpenChange={setTipoViviendaOpen}
          isOpen={tipoViviendaOpen}
          options={TIPO_VIVIENDA.map((v) => ({ value: v, label: TIPO_VIVIENDA_LABELS[v] }))}
          error={errors.tipoVivienda?.message}
        />
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
