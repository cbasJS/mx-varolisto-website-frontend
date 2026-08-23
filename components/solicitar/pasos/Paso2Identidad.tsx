'use client'

import { usePaso2 } from '@/hooks/solicitar/usePaso2'
import type { Paso1Data } from '@/lib/solicitud/schemas/index'
import { SEXO } from '@varolisto/shared-schemas/enums'
import { SEXO_META } from '@/lib/solicitud/utils/lookup-labels'
import { cn } from '@/lib/utils'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { DatePickerInput } from '@/components/forms/DatePickerInput'
import { PillOption } from '@/components/forms/PillOption'
import { PillGroup } from '@/components/forms/PillGroup'
import { StepTitle } from '@/components/wizard/StepTitle'
import { PasoFormShell } from '@/components/wizard/PasoFormShell'

interface Props {
  onNext: (datos: Paso1Data) => void
  onBack: () => void
  actionsSlot: HTMLElement | null
}

export default function Paso2Identidad({ onNext, onBack, actionsSlot }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    errors,
    isValid,
    sexoActual,
    telefonoValue,
    curpValue,
    maxDateNacimiento,
    minDateNacimiento,
  } = usePaso2(onNext)

  return (
    <PasoFormShell
      onSubmit={handleSubmit}
      onBack={onBack}
      disabled={!isValid}
      actionsSlot={actionsSlot}
    >
      <StepTitle
        titulo="Cuéntanos quién eres"
        subtitulo="Estos datos son sólo para validar tu identidad. Nada se comparte con terceros."
      />

      {/* Nombre */}
      <div className="grid gap-3 sm:grid-cols-3">
        <FloatingInput
          label="Nombre(s)"
          required
          error={errors.nombre?.message}
          {...register('nombre')}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido paterno"
          required
          error={errors.apellidoPaterno?.message}
          {...register('apellidoPaterno')}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido materno"
          required
          error={errors.apellidoMaterno?.message}
          {...register('apellidoMaterno')}
          placeholder=" "
        />
      </div>

      {/* Género */}
      <PillGroup
        label="Género"
        required
        error={errors.sexo?.message}
        className="mb-4 mt-4"
        pillsClassName="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {SEXO.map((value) => (
          <PillOption
            key={value}
            selected={sexoActual === value}
            onClick={() => setValue('sexo', value, { shouldValidate: true })}
            icon={SEXO_META[value].lucideIcon}
          >
            {SEXO_META[value].label}
          </PillOption>
        ))}
      </PillGroup>

      <div className="grid gap-3 sm:grid-cols-2">
        <DatePickerInput<Paso1Data>
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          control={control}
          error={errors.fechaNacimiento}
          maxDate={maxDateNacimiento}
          minDate={minDateNacimiento}
          required
          showYearDropdown
          showMonthDropdown
          hint="Debes ser mayor de edad"
        />
        <FloatingInput
          label="CURP"
          required
          error={errors.curp?.message}
          hint="La encuentras en tu INE"
          {...register('curp', { setValueAs: (v: string) => v.toUpperCase() })}
          placeholder=" "
          maxLength={18}
          className="uppercase"
          labelSuffix={
            <span
              className={cn(
                'tabular-nums',
                curpValue.length === 18 ? 'text-on-secondary-container' : 'text-outline',
              )}
            >
              {curpValue.length}/18
            </span>
          }
        />
        <FloatingInput
          label="Correo electrónico"
          type="text"
          inputMode="email"
          required
          error={errors.email?.message}
          {...register('email')}
          placeholder=" "
        />
        <FloatingInput
          label="WhatsApp · Celular"
          type="tel"
          inputMode="numeric"
          required
          error={errors.telefono?.message}
          hint="Por aquí te avisamos del estatus de tu solicitud"
          {...register('telefono')}
          placeholder=" "
          maxLength={10}
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
      </div>
    </PasoFormShell>
  )
}
