'use client'

import { Minus, Plus } from 'lucide-react'
import { usePaso4 } from '@/hooks/solicitar/usePaso4'
import type { Paso4Data } from '@/lib/solicitud/schemas/index'
import { ANTIGUEDAD, ESTADO_CIVIL, DEPENDIENTES_ECONOMICOS } from '@varolisto/shared-schemas/enums'
import {
  ANTIGUEDAD_META,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
} from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { FloatingSelect } from '@/components/forms/FloatingSelect'
import { FieldError } from '@/components/forms/FieldError'
import { StepTitle } from '@/components/wizard/StepTitle'
import { PasoFormShell } from '@/components/wizard/PasoFormShell'
import { SelectorActividadLaboral } from './SelectorActividadLaboral'
import { pasos } from '@/content/solicitar'
import { cn } from '@/lib/utils'

interface Props {
  onNext: (datos: Paso4Data) => void
  onBack: () => void
  actionsSlot: HTMLElement | null
}

export default function Paso4Economia({ onNext, onBack, actionsSlot }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isValid,
    tipoActividad,
    antiguedadActual,
    antiguedadOpen,
    setAntiguedadOpen,
    estadoCivilActual,
    estadoCivilOpen,
    setEstadoCivilOpen,
    dependientesActual,
    dependientesOpen,
    setDependientesOpen,
    labelEmpleador,
    ingresoDisplay,
    ingresoHandlers,
    gastoDisplay,
    gastoHandlers,
    incrementarGasto,
    decrementarGasto,
    puedeDecrementarGasto,
  } = usePaso4(onNext)

  const gastoErrorMsg = errors.gastoMensual?.message

  return (
    <PasoFormShell
      onSubmit={handleSubmit}
      onBack={onBack}
      disabled={!isValid}
      actionsSlot={actionsSlot}
    >
      <StepTitle
        numero={4}
        total={pasos.length}
        titulo="Sobre tu trabajo y finanzas"
        subtitulo="Con esto definimos la cuota y el plazo más cómodos para ti."
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
            setValue('estadoCivil', val as (typeof ESTADO_CIVIL)[number], {
              shouldValidate: true,
            })
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

      {/* Gasto mensual con stepper de $500 (Bloque 1.A v7) */}
      <div className="my-4">
        <label
          htmlFor="gastoMensual"
          className="mb-2 flex items-center text-xs font-medium uppercase tracking-wider text-on-surface-variant"
        >
          Gasto mensual aproximado
          <span className="ml-0.5 text-error" aria-hidden>
            *
          </span>
        </label>
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={decrementarGasto}
            disabled={!puedeDecrementarGasto}
            aria-label="Restar 500 pesos al gasto mensual"
            className="grid w-12 flex-none place-items-center rounded-xl border-2 border-gray-200 bg-white text-primary transition-all active:scale-[0.96] hover:border-primary/40 active:border-primary active:bg-primary active:text-white disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:border-gray-100"
          >
            <Minus className="size-5" />
          </button>
          <div
            className={cn(
              'flex flex-1 items-center rounded-full border-2 bg-white px-4 py-3 transition-colors duration-200',
              gastoErrorMsg
                ? 'border-error'
                : 'border-gray-200 hover:border-outline-variant focus-within:border-primary',
            )}
          >
            <span className="mr-2 shrink-0 text-sm text-outline">$</span>
            <input
              id="gastoMensual"
              type="text"
              inputMode="numeric"
              value={gastoDisplay}
              onChange={gastoHandlers.onChange}
              onBlur={gastoHandlers.onBlur}
              onFocus={gastoHandlers.onFocus}
              placeholder=" "
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-invalid={!!gastoErrorMsg}
              aria-describedby={gastoErrorMsg ? 'gastoMensual-error' : 'gastoMensual-hint'}
              className="w-full bg-transparent text-base text-on-surface outline-none placeholder:text-outline-variant md:text-sm"
            />
            <span className="ml-2 shrink-0 text-xs text-outline">MXN</span>
          </div>
          <button
            type="button"
            onClick={incrementarGasto}
            aria-label="Sumar 500 pesos al gasto mensual"
            className="grid w-12 flex-none place-items-center rounded-xl border-2 border-gray-200 bg-white text-primary transition-all active:scale-[0.96] hover:border-primary/40 active:border-primary active:bg-primary active:text-white"
          >
            <Plus className="size-5" />
          </button>
        </div>
        <FieldError message={gastoErrorMsg} id="gastoMensual-error" />
        {!gastoErrorMsg && (
          <p id="gastoMensual-hint" className="mt-1.5 text-xs text-outline">
            Renta, transporte, comida, deudas y demás gastos del mes.
          </p>
        )}
      </div>
    </PasoFormShell>
  )
}
