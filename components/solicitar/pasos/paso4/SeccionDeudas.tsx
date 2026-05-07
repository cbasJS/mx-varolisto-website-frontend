'use client'

import { CANTIDAD_DEUDAS, MONTO_TOTAL_DEUDAS } from '@varolisto/shared-schemas/enums'
import { CANTIDAD_DEUDAS_META, MONTO_TOTAL_DEUDAS_META } from '@/lib/solicitud/utils/lookup-labels'
import { FloatingSelect } from '@/components/forms/FloatingSelect'
import { FloatingInput } from '@/components/forms/FloatingInput'
import { FieldError } from '@/components/forms/FieldError'
import { cn } from '@/lib/utils'

type CantidadDeudas = (typeof CANTIDAD_DEUDAS)[number]
type MontoTotalDeudas = (typeof MONTO_TOTAL_DEUDAS)[number]

type PagoHandlers = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onBlur' | 'onFocus'
>

interface SeccionDeudasProps {
  cantidadDeudas: CantidadDeudas | undefined
  onCantidadChange: (v: CantidadDeudas) => void
  errorCantidad?: string

  montoTotalDeudas: MontoTotalDeudas | undefined
  onMontoTotalChange: (v: MontoTotalDeudas) => void
  montoTotalOpen: boolean
  onMontoTotalOpenChange: (open: boolean) => void
  errorMontoTotal?: string

  pagoDisplay: string
  pagoHandlers: PagoHandlers
  errorPago?: string
}

export function SeccionDeudas({
  cantidadDeudas,
  onCantidadChange,
  errorCantidad,
  montoTotalDeudas,
  onMontoTotalChange,
  montoTotalOpen,
  onMontoTotalOpenChange,
  errorMontoTotal,
  pagoDisplay,
  pagoHandlers,
  errorPago,
}: SeccionDeudasProps) {
  return (
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
              onClick={() => onCantidadChange(value)}
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
        <FieldError message={errorCantidad} />
      </div>

      <FloatingSelect
        label="Monto total de deudas"
        required
        value={montoTotalDeudas}
        onValueChange={(val) => onMontoTotalChange(val as MontoTotalDeudas)}
        onOpenChange={onMontoTotalOpenChange}
        isOpen={montoTotalOpen}
        options={MONTO_TOTAL_DEUDAS.map((v) => ({
          value: v,
          label: MONTO_TOTAL_DEUDAS_META[v],
        }))}
        error={errorMontoTotal}
      />

      {/* Pago mensual */}
      <FloatingInput
        label="Pago mensual de deudas"
        required
        type="text"
        inputMode="numeric"
        prefix="$"
        error={errorPago}
        value={pagoDisplay}
        onChange={pagoHandlers.onChange}
        onBlur={pagoHandlers.onBlur}
        onFocus={pagoHandlers.onFocus}
        placeholder=" "
      />
    </div>
  )
}
