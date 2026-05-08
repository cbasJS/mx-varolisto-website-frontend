'use client'

import { Pencil, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SeccionCardProps {
  titulo: string
  paso: number
  onEditar: (paso: number) => void
  children: React.ReactNode
  icono: LucideIcon
  /** Variante "prestamo" pinta el card con gradient navy + texto blanco. */
  variant?: 'default' | 'prestamo'
}

export function SeccionCard({
  titulo,
  paso,
  onEditar,
  children,
  icono: Icono,
  variant = 'default',
}: SeccionCardProps) {
  const isPrestamo = variant === 'prestamo'
  const IconActual = isPrestamo ? Sparkles : Icono

  return (
    <div
      className={cn(
        'rounded-3xl p-5 shadow-sm',
        isPrestamo
          ? 'border border-primary/80 bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg'
          : 'border border-gray-200 bg-white',
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-full',
              isPrestamo ? 'bg-white/20' : 'bg-blue-50',
            )}
          >
            <IconActual
              className={cn('size-4', isPrestamo ? 'text-white' : 'text-primary')}
              aria-hidden
            />
          </div>
          <h3 className={cn('font-bold', isPrestamo ? 'text-white' : 'text-gray-900')}>{titulo}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEditar(paso)}
          aria-label={`Editar ${titulo}`}
          className={cn(
            'rounded-full p-2 transition-colors',
            isPrestamo ? 'text-white hover:bg-white/20' : 'text-primary hover:bg-blue-50',
          )}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      </div>
      {children}
    </div>
  )
}
