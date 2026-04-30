"use client";

import { usePaso4 } from "@/hooks/solicitar/usePaso4";
import type { Paso4Data } from "@/lib/solicitud/schemas/index";
import {
  TIPO_ACTIVIDAD,
  ANTIGUEDAD,
  CANTIDAD_DEUDAS,
  MONTO_TOTAL_DEUDAS,
  ESTADO_CIVIL,
  DEPENDIENTES_ECONOMICOS,
} from "@varolisto/shared-schemas/enums";
import {
  ACTIVIDADES_META,
  CANTIDAD_DEUDAS_META,
  ANTIGUEDAD_META,
  MONTO_TOTAL_DEUDAS_META,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
} from "@/lib/solicitud/utils/lookup-labels";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingInput } from "../FloatingInput";
import { PillOption } from "../PillOption";
import { SectionDivider } from "../SectionDivider";
import { StepTitle } from "../StepTitle";
import { FormActions } from "../FormActions";
import { FieldError } from "../FieldError";
import { cn } from "@/lib/utils";

interface Props {
  onNext: (datos: Paso4Data) => void;
  onBack: () => void;
}

export default function Paso4Economia({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
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
  } = usePaso4(onNext);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={4}
        titulo="Tu situación económica"
        subtitulo="Esta información nos ayuda a diseñar la mejor oferta para ti."
      />

      {/* Tipo de actividad */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Tipo de actividad laboral{" "}
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
                onClick={() =>
                  setValue("tipoActividad", value, { shouldValidate: true })
                }
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all active:scale-[0.97]",
                  tipoActividad === value
                    ? "border-primary bg-primary text-white"
                    : "border-[#e8e8e8] bg-white hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-lg",
                    tipoActividad === value ? "text-secondary" : "text-[#aaa]",
                  )}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden
                >
                  {icono}
                </span>
                <span className="text-sm font-semibold leading-tight">
                  {label}
                </span>
                {hint && (
                  <span
                    className={cn(
                      "text-[11px]",
                      tipoActividad === value ? "text-white/70" : "text-[#aaa]",
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
          {...register("nombreEmpleadorNegocio")}
          placeholder=" "
        />

        {/* Antigüedad */}
        <div>
          <div
            className={cn(
              "relative rounded-xl border-2 bg-white transition-all duration-200",
              errors.antiguedad
                ? "border-error"
                : antiguedadOpen
                  ? "border-primary shadow-sm shadow-primary/10"
                  : "border-[#e8e8e8] hover:border-[#c8c8c8]",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                antiguedadActual
                  ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                  : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
              )}
            >
              Antigüedad{" "}
              <span className="text-error" aria-hidden>
                *
              </span>
            </span>
            <Controller
              control={control}
              name="antiguedad"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={setAntiguedadOpen}
                >
                  <SelectTrigger
                    data-size=""
                    className={cn(
                      "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                      antiguedadActual ? "pb-2 pt-6" : "py-0",
                    )}
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANTIGUEDAD.map((v) => (
                      <SelectItem key={v} value={v}>{ANTIGUEDAD_META[v]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.antiguedad?.message} />
        </div>

        {/* Estado civil */}
        <div>
          <div
            className={cn(
              "relative rounded-xl border-2 bg-white transition-all duration-200",
              errors.estadoCivil
                ? "border-error"
                : estadoCivilOpen
                  ? "border-primary shadow-sm shadow-primary/10"
                  : "border-[#e8e8e8] hover:border-[#c8c8c8]",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                estadoCivilActual
                  ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                  : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
              )}
            >
              Estado civil{" "}
              <span className="text-error" aria-hidden>
                *
              </span>
            </span>
            <Controller
              control={control}
              name="estadoCivil"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={setEstadoCivilOpen}
                >
                  <SelectTrigger
                    data-size=""
                    className={cn(
                      "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                      estadoCivilActual ? "pb-2 pt-6" : "py-0",
                    )}
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_CIVIL.map((v) => (
                      <SelectItem key={v} value={v}>{ESTADO_CIVIL_LABELS[v]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.estadoCivil?.message} />
        </div>

        {/* Dependientes económicos */}
        <div>
          <div
            className={cn(
              "relative rounded-xl border-2 bg-white transition-all duration-200",
              errors.dependientesEconomicos
                ? "border-error"
                : dependientesOpen
                  ? "border-primary shadow-sm shadow-primary/10"
                  : "border-[#e8e8e8] hover:border-[#c8c8c8]",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                dependientesActual
                  ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                  : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
              )}
            >
              Dependientes económicos{" "}
              <span className="text-error" aria-hidden>
                *
              </span>
            </span>
            <Controller
              control={control}
              name="dependientesEconomicos"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={setDependientesOpen}
                >
                  <SelectTrigger
                    data-size=""
                    className={cn(
                      "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                      dependientesActual ? "pb-2 pt-6" : "py-0",
                    )}
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPENDIENTES_ECONOMICOS.map((v) => (
                      <SelectItem key={v} value={v}>{DEPENDIENTES_LABELS[v]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#999]">Personas que dependen de tu ingreso</p>
          <FieldError message={errors.dependientesEconomicos?.message} />
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
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          ¿Tienes deudas actualmente?{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex gap-3">
          {[
            {
              value: "si",
              label: "Sí, tengo deudas",
              icono: "credit_card_off",
            },
            { value: "no", label: "No tengo deudas", icono: "check_circle" },
          ].map(({ value, label, icono }) => (
            <PillOption
              key={value}
              selected={tieneDeudas === value}
              onClick={() => {
                setValue("tieneDeudas", value as "si" | "no", { shouldValidate: true })
                if (value === "no") {
                  setValue("cantidadDeudas", "sin_deudas", { shouldValidate: true })
                } else {
                  setValue("cantidadDeudas", undefined, { shouldValidate: true })
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

      {tieneDeudas === "si" && (
        <div className="rounded-2xl border-2 border-[#e8e8e8] bg-[#fafafa] p-4 space-y-4">
          {/* Cantidad */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
              ¿Cuántas deudas tienes?{" "}
              <span className="text-error" aria-hidden>
                *
              </span>
            </p>
            <div className="flex gap-2">
              {CANTIDAD_DEUDAS.filter((v) => v !== "sin_deudas").map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setValue("cantidadDeudas", value, { shouldValidate: true })
                  }
                  className={cn(
                    "flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                    cantidadDeudas === value
                      ? "border-primary bg-primary text-white"
                      : "border-[#e8e8e8] bg-white text-[#454652] hover:border-primary/40",
                  )}
                >
                  {CANTIDAD_DEUDAS_META[value]}
                </button>
              ))}
            </div>
            <FieldError message={errors.cantidadDeudas?.message} />
          </div>

          {/* Monto total */}
          <div>
            <div
              className={cn(
                "relative rounded-xl border-2 bg-white transition-all duration-200",
                errors.montoTotalDeudas
                  ? "border-error"
                  : montoTotalOpen
                    ? "border-primary shadow-sm shadow-primary/10"
                    : "border-[#e8e8e8] hover:border-[#c8c8c8]",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                  montoTotalDeudasActual
                    ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                    : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
                )}
              >
                Monto total de deudas{" "}
                <span className="text-error" aria-hidden>
                  *
                </span>
              </span>
              <Controller
                control={control}
                name="montoTotalDeudas"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={setMontoTotalOpen}
                  >
                    <SelectTrigger
                      data-size=""
                      className={cn(
                        "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                        montoTotalDeudasActual ? "pb-2 pt-6" : "py-0",
                      )}
                    >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTO_TOTAL_DEUDAS.map((v) => (
                        <SelectItem key={v} value={v}>{MONTO_TOTAL_DEUDAS_META[v]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError message={errors.montoTotalDeudas?.message} />
          </div>

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

      <FormActions
        onBack={onBack}
        submitLabel="Continuar"
        disabled={!isValid}
      />
    </form>
  );
}
