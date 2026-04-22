"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { paso2Schema, type Paso2Data } from "@/lib/solicitud-schema";
import { useSolicitudStore } from "@/lib/solicitud-store";
import { Slider } from "@/components/ui/slider";
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
  onNext: (datos: Paso2Data) => void;
  onBack: () => void;
}

const DESTINOS = [
  { value: "liquidar_deuda", label: "Liquidar una deuda", icono: "sync_alt" },
  { value: "capital_trabajo", label: "Capital de trabajo", icono: "store" },
  { value: "gasto_medico", label: "Gasto médico", icono: "local_hospital" },
  { value: "equipo_trabajo", label: "Equipo de trabajo", icono: "build" },
  {
    value: "mejora_hogar",
    label: "Mejora del hogar",
    icono: "home_repair_service",
  },
  { value: "educacion", label: "Educación", icono: "school" },
  {
    value: "gasto_familiar",
    label: "Gasto familiar",
    icono: "family_restroom",
  },
  { value: "viaje_evento", label: "Viaje o evento", icono: "flight" },
  { value: "otro", label: "Otro", icono: "more_horiz" },
];

const PLAZOS = ["2", "3", "4", "5", "6"];

const TASA_MENSUAL = 0.0464;

function calcularCuota(monto: number, plazo: number): number {
  return Math.round(
    (monto * TASA_MENSUAL * Math.pow(1 + TASA_MENSUAL, plazo)) /
      (Math.pow(1 + TASA_MENSUAL, plazo) - 1),
  );
}

export default function Paso2Solicitud({ onNext, onBack }: Props) {
  const datos = useSolicitudStore((s) => s.datos);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Paso2Data>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      montoSolicitado: datos.montoSolicitado ?? 5000,
      plazoMeses: datos.plazoMeses ?? "3",
      primerCredito: datos.primerCredito,
      destinoPrestamo: datos.destinoPrestamo,
      destinoOtro: datos.destinoOtro ?? "",
    },
  });

  const monto = watch("montoSolicitado") ?? 5000;
  const plazoStr = watch("plazoMeses") ?? "3";
  const plazo = parseInt(plazoStr, 10);
  const destino = watch("destinoPrestamo");
  const primerCredito = watch("primerCredito");
  const cuota = calcularCuota(monto, plazo);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        useSolicitudStore.getState().guardarPaso(2, value as Partial<Paso2Data>);
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
        numero={2}
        titulo="¿Cuánto necesitas?"
        subtitulo="Mueve el control para elegir el monto y plazo que mejor te funcione."
      />

      {/* ── Monto ────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Monto grande */}
        <div className="mb-5 rounded-2xl bg-primary p-5 text-white">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-white/50">
            Monto solicitado
          </p>
          <p className="font-headline text-5xl font-bold tracking-tight">
            ${monto.toLocaleString("es-MX")}
          </p>
          <p className="mt-1 text-sm text-white/60">pesos mexicanos</p>
        </div>

        <Controller
          control={control}
          name="montoSolicitado"
          render={({ field }) => (
            <Slider
              min={2000}
              max={20000}
              step={500}
              value={[field.value ?? 5000]}
              onValueChange={([val]) => field.onChange(val)}
              className="mb-2"
            />
          )}
        />
        <div className="flex justify-between text-xs font-medium text-[#aaa]">
          <span>$2,000</span>
          <span>$20,000</span>
        </div>
        <FieldError message={errors.montoSolicitado?.message} />
      </div>

      {/* ── Plazo ────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Plazo de pago{" "}
          <span className="text-error" aria-hidden>*</span>
        </p>
        <div className="flex gap-2">
          {PLAZOS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() =>
                setValue("plazoMeses", m as Paso2Data["plazoMeses"], {
                  shouldValidate: true,
                })
              }
              className={cn(
                "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all active:scale-[0.96]",
                plazoStr === m
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-[#e8e8e8] bg-white text-[#454652] hover:border-primary/40",
              )}
            >
              {m}
              <span className="block text-[10px] font-normal opacity-70">
                meses
              </span>
            </button>
          ))}
        </div>
        <FieldError message={errors.plazoMeses?.message} />
      </div>

      {/* ── Estimación cuota ─────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border-2 border-secondary/30 bg-secondary/5 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#767683]">
            Cuota referencial
          </p>
          <p className="font-headline text-3xl font-bold text-primary">
            ${cuota.toLocaleString("es-MX")}
            <span className="text-base font-normal text-[#767683]">/mes</span>
          </p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary/10">
          <span
            className="material-symbols-outlined text-xl text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            calculate
          </span>
        </div>
      </div>
      <p className="mb-6 text-xs text-[#aaa]">
        * Tasa {(TASA_MENSUAL * 100).toFixed(2)}% mensual. Cuota final sujeta a
        evaluación.
      </p>

      <SectionDivider label="Información adicional" />

      {/* ── ¿Primer crédito? ─────────────────────────────────── */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          ¿Es tu primer crédito con VaroListo?{" "}
          <span className="text-error" aria-hidden>*</span>
        </p>
        <div className="flex gap-3">
          {[
            { value: "si", label: "Sí, es mi primero", icono: "star" },
            { value: "no", label: "Ya he tenido uno", icono: "repeat" },
          ].map(({ value, label, icono }) => (
            <PillOption
              key={value}
              selected={primerCredito === value}
              onClick={() =>
                setValue("primerCredito", value as "si" | "no", {
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
        <FieldError message={errors.primerCredito?.message} />
      </div>

      {/* ── Destino ──────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          ¿Para qué usarás el dinero?{" "}
          <span className="text-error" aria-hidden>*</span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DESTINOS.map(({ value, label, icono }) => (
            <PillOption
              key={value}
              selected={destino === value}
              onClick={() =>
                setValue(
                  "destinoPrestamo",
                  value as Paso2Data["destinoPrestamo"],
                  { shouldValidate: true },
                )
              }
              icon={icono}
              fullWidth
            >
              {label}
            </PillOption>
          ))}
        </div>
        <FieldError message={errors.destinoPrestamo?.message} />
      </div>

      {destino === "otro" && (
        <div className="mb-6">
          <FloatingInput
            label="¿Cuál es el destino?"
            required
            error={errors.destinoOtro?.message}
            {...register("destinoOtro")}
            placeholder=" "
          />
        </div>
      )}

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  );
}
