'use client'

import { usePaso4 } from '@/hooks/solicitar/usePaso4'
import type { Paso4Data } from '@/lib/solicitud/schemas/index'
import { ANTIGUEDAD, ESTADO_CIVIL, DEPENDIENTES_ECONOMICOS } from '@varolisto/shared-schemas/enums'
import {
  ANTIGUEDAD_META,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
} from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '../../FloatingInput'
import { FloatingSelect } from '../../FloatingSelect'
import { PillOption } from '../../PillOption'
import { PillGroup } from '../../PillGroup'
import { SectionDivider } from '../../SectionDivider'
import { StepTitle } from '../../StepTitle'
import { FormActions } from '../../FormActions'
import { SelectorActividadLaboral } from './SelectorActividadLaboral'
import { SeccionDeudas } from './SeccionDeudas'

interface Props {
  onNext: (datos: Paso4Data) => void
  onBack: () => void
}

export default function Paso4Economia({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isValid,
    tipoActividad,
    tieneDeudas,
    cantidadDeudas,
    antiguedadActual,
    antiguedadOpen,
    setAntiguedadOpen,
    estadoCivilActual,
    estadoCivilOpen,
    setEstadoCivilOpen,
    dependientesActual,
    dependientesOpen,
    setDependientesOpen,
    montoTotalDeudasActual,
    montoTotalOpen,
    setMontoTotalOpen,
    labelEmpleador,
    ingresoDisplay,
    ingresoHandlers,
    pagoDeudaDisplay,
    pagoDeudaHandlers,
  } = usePaso4(onNext)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={4}
        titulo="Tu situación económica"
        subtitulo="Esta información nos ayuda a diseñar la mejor oferta para ti."
      />

      <SelectorActividadLaboral
        value={tipoActividad}
        onChange={(value) => setValue('tipoActividad', value, { shouldValidate: true })}
        error={errors.tipoActividad?.message}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingInput
          label={labelEmpleador}
          required
          error={errors.nombreEmpleadorNegocio?.message}
          {...register('nombreEmpleadorNegocio')}
          placeholder=" "
        />

        <FloatingSelect
          label="Antigüedad"
          required
          value={antiguedadActual}
          onValueChange={(val) =>
            setValue('antiguedad', val as (typeof ANTIGUEDAD)[number], { shouldValidate: true })
          }
          onOpenChange={setAntiguedadOpen}
          isOpen={antiguedadOpen}
          options={ANTIGUEDAD.map((v) => ({ value: v, label: ANTIGUEDAD_META[v] }))}
          error={errors.antiguedad?.message}
        />
        <FloatingSelect
          label="Estado civil"
          required
          value={estadoCivilActual}
          onValueChange={(val) =>
            setValue('estadoCivil', val as (typeof ESTADO_CIVIL)[number], { shouldValidate: true })
          }
          onOpenChange={setEstadoCivilOpen}
          isOpen={estadoCivilOpen}
          options={ESTADO_CIVIL.map((v) => ({ value: v, label: ESTADO_CIVIL_LABELS[v] }))}
          error={errors.estadoCivil?.message}
        />
        <div>
          <FloatingSelect
            label="Dependientes económicos"
            required
            value={dependientesActual}
            onValueChange={(val) =>
              setValue('dependientesEconomicos', val as (typeof DEPENDIENTES_ECONOMICOS)[number], {
                shouldValidate: true,
              })
            }
            onOpenChange={setDependientesOpen}
            isOpen={dependientesOpen}
            options={DEPENDIENTES_ECONOMICOS.map((v) => ({
              value: v,
              label: DEPENDIENTES_LABELS[v],
            }))}
            error={errors.dependientesEconomicos?.message}
          />
          <p className="mt-1.5 text-xs text-outline">Personas que dependen de tu ingreso</p>
        </div>
      </div>

      {/* Ingreso mensual */}
      <div className="my-4">
        <FloatingInput
          label="Ingreso mensual aproximado"
          required
          type="text"
          inputMode="numeric"
          error={errors.ingresoMensual?.message}
          prefix="$"
          suffix="MXN"
          value={ingresoDisplay}
          onChange={ingresoHandlers.onChange}
          onBlur={ingresoHandlers.onBlur}
          onFocus={ingresoHandlers.onFocus}
          placeholder=" "
        />
      </div>

      <SectionDivider label="Deudas actuales" />

      {/* ¿Tiene deudas? */}
      <PillGroup
        label="¿Tienes deudas actualmente?"
        required
        error={errors.tieneDeudas?.message}
        className="mb-4"
        pillsClassName="flex gap-3"
      >
        {[
          {
            value: 'si',
            label: 'Sí, tengo deudas',
            icono: 'credit_card_off',
          },
          { value: 'no', label: 'No tengo deudas', icono: 'check_circle' },
        ].map(({ value, label, icono }) => (
          <PillOption
            key={value}
            selected={tieneDeudas === value}
            onClick={() => {
              setValue('tieneDeudas', value as 'si' | 'no', { shouldValidate: true })
              if (value === 'no') {
                setValue('cantidadDeudas', 'sin_deudas', { shouldValidate: true })
              } else {
                setValue('cantidadDeudas', undefined, { shouldValidate: true })
              }
            }}
            icon={icono}
            fullWidth
          >
            {label}
          </PillOption>
        ))}
      </PillGroup>

      {tieneDeudas === 'si' && (
        <SeccionDeudas
          cantidadDeudas={cantidadDeudas}
          onCantidadChange={(value) => setValue('cantidadDeudas', value, { shouldValidate: true })}
          errorCantidad={errors.cantidadDeudas?.message}
          montoTotalDeudas={montoTotalDeudasActual}
          onMontoTotalChange={(value) =>
            setValue('montoTotalDeudas', value, { shouldValidate: true })
          }
          montoTotalOpen={montoTotalOpen}
          onMontoTotalOpenChange={setMontoTotalOpen}
          errorMontoTotal={errors.montoTotalDeudas?.message}
          pagoDisplay={pagoDeudaDisplay}
          pagoHandlers={pagoDeudaHandlers}
          errorPago={errors.pagoMensualDeudas?.message}
        />
      )}

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
