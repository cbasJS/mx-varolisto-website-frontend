"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paso3Schema, type Paso3Data } from "@/lib/solicitud-schema";
import { useSolicitudStore } from "@/lib/solicitud-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FloatingInput,
  PillOption,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
} from "../FormUI";
import { cn } from "@/lib/utils";

interface Props {
  onNext: (datos: Paso3Data) => void;
  onBack: () => void;
}

const ACTIVIDADES = [
  {
    value: "empleado_formal",
    label: "Empleado formal",
    icono: "badge",
    hint: "Con CFDI de nómina",
  },
  {
    value: "empleado_informal",
    label: "Empleado informal",
    icono: "handshake",
    hint: "Sin contrato",
  },
  {
    value: "negocio_propio",
    label: "Negocio propio",
    icono: "store",
    hint: "Dueño de negocio",
  },
  {
    value: "independiente",
    label: "Freelance",
    icono: "laptop_mac",
    hint: "Honorarios",
  },
  { value: "otro", label: "Otro", icono: "more_horiz", hint: "" },
];

const CANTIDAD_DEUDAS = [
  { value: "1", label: "1 deuda" },
  { value: "2", label: "2 deudas" },
  { value: "3_o_mas", label: "3 o más" },
];

export default function Paso3SituacionEconomica({ onNext, onBack }: Props) {
  const datos = useSolicitudStore((s) => s.datos);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Paso3Data>({
    resolver: zodResolver(paso3Schema),
    defaultValues: {
      tipoActividad: datos.tipoActividad,
      nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? "",
      antiguedad: datos.antiguedad,
      ingresoMensual: datos.ingresoMensual,
      tieneDeudas: datos.tieneDeudas,
      cantidadDeudas: datos.cantidadDeudas,
      montoTotalDeudas: datos.montoTotalDeudas,
      pagoMensualDeudas: datos.pagoMensualDeudas,
    },
  });

  const [ingresoDisplay, setIngresoDisplay] = useState<string>(
    datos.ingresoMensual
      ? datos.ingresoMensual.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "",
  );

  const [pagoDeudaDisplay, setPagoDeudaDisplay] = useState<string>(
    datos.pagoMensualDeudas
      ? datos.pagoMensualDeudas.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "",
  );

  const [antiguedadOpen, setAntiguedadOpen] = useState(false);
  const [montoTotalOpen, setMontoTotalOpen] = useState(false);

  const tipoActividad = watch("tipoActividad");
  const tieneDeudas = watch("tieneDeudas");
  const cantidadDeudas = watch("cantidadDeudas");
  const antiguedadActual = watch("antiguedad");
  const montoTotalDeudasActual = watch("montoTotalDeudas");

  const labelEmpleador =
    tipoActividad === "negocio_propio"
      ? "Nombre de tu negocio"
      : tipoActividad === "independiente"
        ? "Actividad principal"
        : "Empresa / Empleador";

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        useSolicitudStore
          .getState()
          .guardarPaso(3, value as Partial<Paso3Data>);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <StepTitle
        numero={3}
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
          {ACTIVIDADES.map(({ value, label, icono, hint }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("tipoActividad", value as Paso3Data["tipoActividad"], {
                  shouldValidate: true,
                })
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
          ))}
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
                    <SelectItem value="menos_1">Menos de 1 año</SelectItem>
                    <SelectItem value="uno_a_dos">Entre 1 y 2 años</SelectItem>
                    <SelectItem value="mas_2">Más de 2 años</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FieldError message={errors.antiguedad?.message} />
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
          onChange={(e) => {
            // Conservar si el usuario está escribiendo decimales (termina en "." o "0" tras ".")
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            const endsWithDot = raw.endsWith(".");
            const num = parseFloat(raw);
            if (!isNaN(num)) {
              // Formatear miles en tiempo real, preservando el sufijo decimal en curso
              const [intPart, decPart] = raw.split(".");
              const formattedInt = parseInt(intPart || "0", 10).toLocaleString(
                "es-MX",
              );
              if (endsWithDot) {
                setIngresoDisplay(`${formattedInt}.`);
              } else if (decPart !== undefined) {
                setIngresoDisplay(`${formattedInt}.${decPart}`);
              } else {
                setIngresoDisplay(formattedInt);
              }
              setValue("ingresoMensual", num, { shouldValidate: true });
            } else if (raw === "" || raw === ".") {
              setIngresoDisplay(raw);
              setValue("ingresoMensual", undefined as unknown as number, {
                shouldValidate: true,
              });
            }
          }}
          onBlur={() => {
            const num = parseFloat(ingresoDisplay.replace(/,/g, ""));
            if (!isNaN(num)) {
              setIngresoDisplay(
                num.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
              );
            }
          }}
          onFocus={() => {
            // Al enfocar, quitar el .00 del blur para edición más cómoda
            const num = parseFloat(ingresoDisplay.replace(/,/g, ""));
            if (!isNaN(num)) {
              setIngresoDisplay(num.toLocaleString("es-MX"));
            }
          }}
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
              onClick={() =>
                setValue("tieneDeudas", value as "si" | "no", {
                  shouldValidate: true,
                })
              }
              icon={icono}
              fullWidth
            >
              {label}
            </PillOption>
          ))}
        </div>
        <FieldError message={errors.tieneDeudas?.message} />
      </div>

      {/* Detalles de deudas */}
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
              {CANTIDAD_DEUDAS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "cantidadDeudas",
                      value as Paso3Data["cantidadDeudas"],
                      { shouldValidate: true },
                    )
                  }
                  className={cn(
                    "flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all",
                    cantidadDeudas === value
                      ? "border-primary bg-primary text-white"
                      : "border-[#e8e8e8] bg-white text-[#454652] hover:border-primary/40",
                  )}
                >
                  {label}
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
                      <SelectItem value="menos_5k">Menos de $5,000</SelectItem>
                      <SelectItem value="5k_15k">$5,000 – $15,000</SelectItem>
                      <SelectItem value="15k_30k">$15,000 – $30,000</SelectItem>
                      <SelectItem value="mas_30k">Más de $30,000</SelectItem>
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
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "");
              const endsWithDot = raw.endsWith(".");
              const num = parseFloat(raw);
              if (!isNaN(num)) {
                const [intPart, decPart] = raw.split(".");
                const formattedInt = parseInt(
                  intPart || "0",
                  10,
                ).toLocaleString("es-MX");
                if (endsWithDot) {
                  setPagoDeudaDisplay(`${formattedInt}.`);
                } else if (decPart !== undefined) {
                  setPagoDeudaDisplay(`${formattedInt}.${decPart}`);
                } else {
                  setPagoDeudaDisplay(formattedInt);
                }
                setValue("pagoMensualDeudas", num, { shouldValidate: true });
              } else if (raw === "" || raw === ".") {
                setPagoDeudaDisplay(raw);
                setValue("pagoMensualDeudas", undefined as unknown as number, {
                  shouldValidate: true,
                });
              }
            }}
            onBlur={() => {
              const num = parseFloat(pagoDeudaDisplay.replace(/,/g, ""));
              if (!isNaN(num)) {
                setPagoDeudaDisplay(
                  num.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                );
              }
            }}
            onFocus={() => {
              const num = parseFloat(pagoDeudaDisplay.replace(/,/g, ""));
              if (!isNaN(num)) setPagoDeudaDisplay(num.toLocaleString("es-MX"));
            }}
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
