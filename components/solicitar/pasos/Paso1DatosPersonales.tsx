"use client";

import { usePaso1 } from "@/hooks/solicitar/usePaso1";
import type { Paso1Data } from "@/lib/solicitud-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FloatingInput,
  DatePickerInput,
  PillOption,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
} from "../FormUI";
import { cn } from "@/lib/utils";

interface Props {
  onNext: (datos: Paso1Data) => void;
}

const SEXO_OPTS = [
  { value: "M", label: "Hombre", icono: "man" },
  { value: "F", label: "Mujer", icono: "woman" },
  { value: "ND", label: "Prefiero no decir", icono: "person" },
];

export default function Paso1DatosPersonales({ onNext }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    errors,
    isValid,
    sexoActual,
    coloniaActual,
    cpValido,
    colonias,
    cargandoCP,
    cpError,
    maxDateNacimiento,
  } = usePaso1(onNext);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={1}
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

      <SectionDivider label="Información personal" />

      {/* Sexo — pill cards */}
      <div className="mb-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Sexo{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SEXO_OPTS.map(({ value, label, icono }) => (
            <PillOption
              key={value}
              selected={sexoActual === value}
              onClick={() =>
                setValue("sexo", value as "M" | "F" | "ND", {
                  shouldValidate: true,
                })
              }
              icon={icono}
            >
              {label}
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
          hint="18 caracteres en mayúsculas"
        />
        <FloatingInput
          label="Correo electrónico"
          type="email"
          optional
          error={errors.email?.message}
          {...register("email")}
          placeholder=" "
        />
        <FloatingInput
          label="Teléfono celular"
          type="tel"
          required
          error={errors.telefono?.message}
          {...register("telefono")}
          placeholder=" "
          maxLength={10}
          hint="10 dígitos sin guiones ni espacios"
        />
      </div>

      <SectionDivider label="Dirección" />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* CP */}
        <div>
          <FloatingInput
            label="Código postal"
            required
            error={errors.codigoPostal?.message}
            {...register("codigoPostal")}
            placeholder=" "
            maxLength={5}
            inputMode="numeric"
          />
          {cpValido && cpError && (
            <p className="mt-1.5 text-xs text-error">
              Código postal no encontrado
            </p>
          )}
        </div>

        {/* Colonia */}
        <div>
          {cargandoCP ? (
            <div className="h-[52px] animate-pulse rounded-xl bg-[#f5f5f7]" />
          ) : (
            <div
              className={cn(
                "relative rounded-xl border-2 bg-white transition-all duration-200",
                errors.colonia
                  ? "border-error"
                  : "border-[#e8e8e8] hover:border-[#c8c8c8]",
                (!cpValido || !colonias) && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                  coloniaActual
                    ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                    : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
                )}
              >
                Colonia{" "}
                <span className="text-error" aria-hidden>
                  *
                </span>
              </span>
              <Select
                disabled={!cpValido || !colonias}
                value={coloniaActual}
                onValueChange={(val) =>
                  setValue("colonia", val, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="colonia"
                  aria-invalid={!!errors.colonia}
                  data-size=""
                  className={cn(
                    "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                    coloniaActual ? "pb-2 pt-6" : "py-0",
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
          {!errors.colonia && !coloniaActual && cpValido && colonias && (
            <p className="mt-1.5 text-xs text-[#999]">Selecciona tu colonia</p>
          )}
          {!errors.colonia && !cpValido && (
            <p className="mt-1.5 text-xs text-[#999]">Ingresa tu CP primero</p>
          )}
          <FieldError message={errors.colonia?.message} />
        </div>

        {/* Municipio (read-only) */}
        <FloatingInput
          label="Municipio / Alcaldía"
          {...register("municipio")}
          readOnly
          placeholder=" "
          className="cursor-default text-[#aaa]"
          hint="Se llena automáticamente con tu CP"
        />

        <FloatingInput
          label="Calle"
          required
          error={errors.calle?.message}
          {...register("calle")}
          placeholder=" "
        />
        <FloatingInput
          label="Número exterior"
          required
          error={errors.numeroExterior?.message}
          {...register("numeroExterior")}
          placeholder=" "
        />
        <FloatingInput
          label="Número interior"
          optional
          {...register("numeroInterior")}
          placeholder=" "
        />
      </div>

      <FormActions submitLabel="Continuar" isFirst disabled={!isValid} />
    </form>
  );
}
