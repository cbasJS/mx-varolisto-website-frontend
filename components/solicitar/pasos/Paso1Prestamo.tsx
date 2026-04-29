"use client";

import { usePaso1 } from "@/hooks/solicitar/usePaso1";
import type { Paso2Data } from "@/lib/solicitud-schema";
import { DESTINO_PRESTAMO, PLAZO_MESES } from "@varolisto/shared-schemas/enums";
import { DESTINOS_META } from "@/lib/solicitud/utils/lookup-labels";
import { Slider } from "@/components/ui/slider";
import { Controller } from "react-hook-form";
import {
  PillOption,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
} from "../FormUI";
import { cn } from "@/lib/utils";

interface Props {
  onNext: (datos: Paso2Data) => void;
}

export default function Paso1Prestamo({ onNext }: Props) {
  const {
    handleSubmit,
    control,
    setValue,
    errors,
    isValid,
    monto,
    plazoStr,
    destino,
    cuota,
    TASA_MENSUAL,
  } = usePaso1(onNext);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={1}
        titulo="¿Cuánto necesitas?"
        subtitulo="Mueve el control para elegir el monto y plazo que mejor te funcione."
      />

      {/* ── Monto ────────────────────────────────────────────── */}
      <div className="mb-8">
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
          {PLAZO_MESES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() =>
                setValue("plazoMeses", m, { shouldValidate: true })
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
            Cuota referencial Perfil A
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

      <SectionDivider label="¿Para qué usarás el dinero?" />

      {/* ── Destino ──────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DESTINO_PRESTAMO.map((value) => (
            <PillOption
              key={value}
              selected={destino === value}
              onClick={() =>
                setValue("destinoPrestamo", value, { shouldValidate: true })
              }
              icon={DESTINOS_META[value].icono}
              fullWidth
            >
              {DESTINOS_META[value].label}
            </PillOption>
          ))}
        </div>
        <FieldError message={errors.destinoPrestamo?.message} />
      </div>

      <FormActions submitLabel="Continuar" isFirst disabled={!isValid} />
    </form>
  );
}
