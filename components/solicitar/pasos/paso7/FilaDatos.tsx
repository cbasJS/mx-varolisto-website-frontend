'use client'

import { cn } from '@/lib/utils'

interface FilaProps {
  label: string
  value?: string | number
  /** Pinta el texto del valor en blanco/azul claro (para card variant prestamo). */
  invertido?: boolean
  /** Pinta el valor en color secondary (verde) — para resaltar el pago mensual. */
  destacado?: boolean
  /** Permite quebrar el valor por cualquier carácter (emails largos en mobile). */
  breakAll?: boolean
}

export function Fila({ label, value, invertido, destacado, breakAll }: FilaProps) {
  if (!value && value !== 0) return null
  return (
    <div className="min-w-0 text-sm">
      <span className={cn('mb-1 block text-xs', invertido ? 'text-blue-200' : 'text-gray-500')}>
        {label}
      </span>
      <span
        className={cn(
          'block font-medium',
          destacado
            ? 'text-lg font-bold text-secondary'
            : invertido
              ? 'text-lg font-bold text-white'
              : 'text-gray-900',
          breakAll && 'break-all',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 mt-3 text-xs font-bold uppercase tracking-wider text-gray-500 first:mt-0">
      {children}
    </p>
  )
}
