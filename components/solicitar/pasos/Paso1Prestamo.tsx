'use client'

import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Sparkles, ArrowRight, Lock, FileCheck, Clock } from 'lucide-react'
import { usePaso1 } from '@/hooks/solicitar/usePaso1'
import type { Paso2Data } from '@/lib/solicitud/schemas/index'
import { DESTINO_PRESTAMO, PLAZO_MESES } from '@varolisto/shared-schemas/enums'
import { DESTINOS_META } from '@/lib/solicitud/utils/lookup-labels'
import { Slider } from '@/components/ui/slider'
import { FieldError } from '@/components/forms/FieldError'
import { cn } from '@/lib/utils'

interface Props {
  onNext: (datos: Paso2Data) => void
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
  } = usePaso1(onNext)

  // Mobile siempre muestra sólo los primeros 3 destinos por default. Desktop
  // muestra los 9. El botón "Ver más opciones" en mobile permite expandir.
  const MOBILE_COLLAPSE_AT = 3
  // Auto-expandir si el destino rehidratado vive más allá del corte mobile;
  // de lo contrario la opción seleccionada quedaría oculta tras un reload.
  const [showAllDestinos, setShowAllDestinos] = useState(
    () => destino !== undefined && DESTINO_PRESTAMO.indexOf(destino) >= MOBILE_COLLAPSE_AT,
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
          <Sparkles className="size-4" aria-hidden />
          Tu préstamo, directo y rápido
        </span>
        <h1 className="mb-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl">
          ¿Cuánto necesitas?
        </h1>
        <p className="text-sm text-on-surface-variant sm:text-base">
          Mueve el control para elegir el monto y plazo que mejor te funcione.
        </p>
      </div>

      {/* ── Amount Card ──────────────────────────────────────── */}
      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm text-on-surface-variant">Vas a pedir</p>
          <p className="font-headline text-5xl font-bold tracking-tight text-primary sm:text-6xl">
            ${monto.toLocaleString('es-MX')}
          </p>
          <p className="mt-1 text-sm text-outline">pesos</p>
        </div>

        <div className="mb-6">
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
          <div className="flex justify-between text-xs text-outline">
            <span>$2,000</span>
            <span>$20,000</span>
          </div>
          <FieldError message={errors.montoSolicitado?.message} />
        </div>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-on-surface">¿En cuántos meses?</p>
          <div className="grid grid-cols-5 gap-2">
            {PLAZO_MESES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setValue('plazoMeses', m, { shouldValidate: true })}
                className={cn(
                  'rounded-xl border-2 py-3 text-center transition-all active:scale-[0.96]',
                  plazoStr === m
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-200 bg-white text-on-surface-variant hover:border-primary/40',
                )}
              >
                <span className="block text-xl font-bold leading-none">{m}</span>
                <span className="block text-xs opacity-75">meses</span>
              </button>
            ))}
          </div>
          <FieldError message={errors.plazoMeses?.message} />
        </div>

        <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-4">
          <p className="mb-1 text-xs text-on-surface-variant">Pagarías cada mes:</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-3xl font-bold text-on-secondary-container">
              ${cuota.toLocaleString('es-MX')}
            </span>
            <span className="text-sm text-on-surface-variant">/mes</span>
          </div>
          <p className="mt-2 text-xs text-outline">
            * Tasa {(TASA_MENSUAL * 100).toFixed(2)}% mensual. Cuota final sujeta a evaluación.
          </p>
        </div>
      </div>

      {/* ── Destino Card ─────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-on-surface">¿Para qué usarás el dinero?</p>
        <div className="grid grid-cols-3 gap-2">
          {DESTINO_PRESTAMO.map((value, index) => {
            const Icono = DESTINOS_META[value].lucideIcon
            const selected = destino === value
            const hiddenOnMobile = !showAllDestinos && index >= MOBILE_COLLAPSE_AT
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('destinoPrestamo', value, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all active:scale-[0.98]',
                  selected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 bg-white text-on-surface-variant hover:border-primary/40',
                  hiddenOnMobile && 'hidden md:flex',
                )}
              >
                <Icono className="size-5" aria-hidden />
                <span className="text-center text-xs leading-tight">
                  {DESTINOS_META[value].label}
                </span>
              </button>
            )
          })}
        </div>
        {DESTINO_PRESTAMO.length > MOBILE_COLLAPSE_AT && (
          <button
            type="button"
            onClick={() => setShowAllDestinos((v) => !v)}
            className="mt-3 w-full text-sm font-medium text-primary transition-colors hover:text-primary/80 md:hidden"
          >
            {showAllDestinos ? 'Ver menos opciones' : 'Ver más opciones'}
          </button>
        )}
        <FieldError message={errors.destinoPrestamo?.message} />
      </div>

      {/* ── CTA Full-Width ───────────────────────────────────── */}
      <button
        type="submit"
        disabled={!isValid}
        className={cn(
          'mb-6 flex w-full items-center justify-center gap-2 rounded-[12px] py-4 font-medium text-white transition-all active:scale-[0.98]',
          isValid
            ? 'bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90'
            : 'cursor-not-allowed bg-primary opacity-50 shadow-none',
        )}
      >
        <span>Solicitar ahora</span>
        <ArrowRight className="size-5" aria-hidden />
      </button>

      {/* ── Trust Indicators ─────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-5 text-primary" aria-hidden />
          </div>
          <p className="text-xs text-on-surface-variant">Tus datos seguros</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10">
            <FileCheck className="size-5 text-on-secondary-container" aria-hidden />
          </div>
          <p className="text-xs text-on-surface-variant">Sin letra chica</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-50">
            <Clock className="size-5 text-purple-600" aria-hidden />
          </div>
          <p className="text-xs text-on-surface-variant">Respuesta en 24h</p>
        </div>
      </div>

      {/* ── Info Section "Es súper fácil" ────────────────────── */}
      <div className="rounded-xl bg-primary/5 p-4">
        <h3 className="mb-2 text-sm font-medium text-on-surface">Es súper fácil</h3>
        <ol className="space-y-2 text-sm text-on-surface-variant">
          <li className="flex gap-2">
            <span className="font-medium text-primary">1.</span>
            <span>Completa tu solicitud (menos de 5 minutos)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-primary">2.</span>
            <span>Te respondemos en menos de 24 horas</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-primary">3.</span>
            <span>Recibe el dinero directo en tu cuenta</span>
          </li>
        </ol>
      </div>
    </form>
  )
}
