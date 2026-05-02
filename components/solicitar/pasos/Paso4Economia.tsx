'use client'

import { usePaso4 } from '@/hooks/solicitar/usePaso4'
import type { Paso4Data } from '@/lib/solicitud/schemas/index'
import {
  TIPO_ACTIVIDAD,
  ANTIGUEDAD,
  CANTIDAD_DEUDAS,
  MONTO_TOTAL_DEUDAS,
  ESTADO_CIVIL,
  DEPENDIENTES_ECONOMICOS,
} from '@varolisto/shared-schemas/enums'
import {
  ACTIVIDADES_META,
  CANTIDAD_DEUDAS_META,
  ANTIGUEDAD_META,
  MONTO_TOTAL_DEUDAS_META,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
} from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '../FloatingInput'
import { FloatingSelect } from '../FloatingSelect'
import { PillOption } from '../PillOption'
import { SectionDivider } from '../SectionDivider'
import { StepTitle } from '../StepTitle'
import { FormActions } from '../FormActions'
import { FieldError } from '../FieldError'
import { cn } from '@/lib/utils'

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

      {/* Tipo de actividad */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-outline">
          Tipo de actividad laboral{' '}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIPO_ACTIVIDAD.map((value) => {
            const { label, icono, hint } = ACTIVIDADES_META[value]
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('tipoActividad', value, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all active:scale-[0.97]',
                  tipoActividad === value
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-container-high bg-white hover:border-primary/30',
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-lg',
                    tipoActividad === value ? 'text-secondary' : 'text-outline',
                  )}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden
                >
                  {icono}
                </span>
                <span className="text-sm font-semibold leading-tight">{label}</span>
                {hint && (
                  <span
                    className={cn(
                      'text-[11px]',
                      tipoActividad === value ? 'text-white/70' : 'text-outline',
                    )}
                  >
                    {hint}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <FieldError message={errors.tipoActividad?.message} />
      </div>

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
      <div className="mb-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-outline">
          ¿Tienes deudas actualmente?{' '}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex gap-3">
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
        </div>
        <FieldError message={errors.tieneDeudas?.message} />
      </div>

      {tieneDeudas === 'si' && (
        <div className="rounded-2xl border-2 border-surface-container-high bg-surface-bright p-4 space-y-4">
          {/* Cantidad */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-outline">
              ¿Cuántas deudas tienes?{' '}
              <span className="text-error" aria-hidden>
                *
              </span>
            </p>
            <div className="flex gap-2">
              {CANTIDAD_DEUDAS.filter((v) => v !== 'sin_deudas').map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('cantidadDeudas', value, { shouldValidate: true })}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all',
                    cantidadDeudas === value
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-container-high bg-white text-on-surface-variant hover:border-primary/40',
                  )}
                >
                  {CANTIDAD_DEUDAS_META[value]}
                </button>
              ))}
            </div>
            <FieldError message={errors.cantidadDeudas?.message} />
          </div>

          <FloatingSelect
            label="Monto total de deudas"
            required
            value={montoTotalDeudasActual}
            onValueChange={(val) =>
              setValue('montoTotalDeudas', val as (typeof MONTO_TOTAL_DEUDAS)[number], {
                shouldValidate: true,
              })
            }
            onOpenChange={setMontoTotalOpen}
            isOpen={montoTotalOpen}
            options={MONTO_TOTAL_DEUDAS.map((v) => ({
              value: v,
              label: MONTO_TOTAL_DEUDAS_META[v],
            }))}
            error={errors.montoTotalDeudas?.message}
          />

          {/* Pago mensual */}
          <FloatingInput
            label="Pago mensual de deudas"
            required
            type="text"
            inputMode="numeric"
            prefix="$"
            error={errors.pagoMensualDeudas?.message}
            value={pagoDeudaDisplay}
            onChange={pagoDeudaHandlers.onChange}
            onBlur={pagoDeudaHandlers.onBlur}
            onFocus={pagoDeudaHandlers.onFocus}
            placeholder=" "
          />
        </div>
      )}

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
