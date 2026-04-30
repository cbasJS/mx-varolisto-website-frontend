"use client";

import { usePaso2 } from "@/hooks/solicitar/usePaso2";
import type { Paso1Data } from "@/lib/solicitud-schema";
import { SEXO } from "@varolisto/shared-schemas/enums";
import { SEXO_META } from "@/lib/solicitud/utils/lookup-labels";
import { FloatingInput } from "../FloatingInput";
import { DatePickerInput } from "../DatePickerInput";
import { PillOption } from "../PillOption";
import { StepTitle } from "../StepTitle";
import { FormActions } from "../FormActions";
import { FieldError } from "../FieldError";

interface Props {
  onNext: (datos: Paso1Data) => void;
  onBack: () => void;
}

export default function Paso2Identidad({ onNext, onBack }: Props) {
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
  } = usePaso2(onNext);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={2}
        titulo="Cuéntanos sobre ti"
        subtitulo="Necesitamos algunos datos para personalizar tu oferta."
      />

      {/* Nombre */}
      <div className="grid gap-3 sm:grid-cols-3">
        <FloatingInput
          label="Nombre(s)"
          required
          error={errors.nombre?.message}
          {...register("nombre")}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido paterno"
          required
          error={errors.apellidoPaterno?.message}
          {...register("apellidoPaterno")}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido materno"
          required
          error={errors.apellidoMaterno?.message}
          {...register("apellidoMaterno")}
          placeholder=" "
        />
      </div>

      {/* Sexo */}
      <div className="mb-4 mt-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Sexo{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SEXO.map((value) => (
            <PillOption
              key={value}
              selected={sexoActual === value}
              onClick={() => setValue("sexo", value, { shouldValidate: true })}
              icon={SEXO_META[value].icono}
            >
              {SEXO_META[value].label}
            </PillOption>
          ))}
        </div>
        <FieldError message={errors.sexo?.message} />
      </div>

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
        />
        <FloatingInput
          label="CURP"
          required
          error={errors.curp?.message}
          {...register("curp", { setValueAs: (v: string) => v.toUpperCase() })}
          placeholder=" "
          maxLength={18}
          className="uppercase"
          suffix={
            <span className="tabular-nums text-xs text-[#aaa]">
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
          {...register("email")}
          placeholder=" "
        />
        <FloatingInput
          label="Teléfono celular"
          type="tel"
          inputMode="numeric"
          required
          error={errors.telefono?.message}
          {...register("telefono")}
          placeholder=" "
          maxLength={10}
          suffix={
            <span className="tabular-nums text-xs text-[#aaa]">
              {telefonoValue.length}/10
            </span>
          }
        />
      </div>

      {/* RFC — hidden from UI, not removed from schema */}
      <input type="hidden" {...register("rfc")} />

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  );
}
