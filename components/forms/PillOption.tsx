'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PillOptionProps {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  /**
   * Icono opcional. Soporta dos formatos:
   * - LucideIcon (preferido en el rediseño)
   * - string (material-symbols, legacy — para compatibilidad con callers no migrados)
   */
  icon?: LucideIcon | string
  className?: string
  fullWidth?: boolean
}

function isLucideIcon(icon: LucideIcon | string): icon is LucideIcon {
  return typeof icon === 'function' || typeof icon === 'object'
}

export function PillOption({
  selected,
  onClick,
  children,
  icon,
  className,
  fullWidth,
}: PillOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center gap-2 rounded-full border-2 px-4 py-3 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98]',
        fullWidth && 'w-full',
        selected
          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
          : 'border-gray-200 bg-white text-on-surface-variant hover:border-primary/40',
        className,
      )}
    >
      {icon &&
        (isLucideIcon(icon) ? (
          (() => {
            const Icono = icon
            return (
              <Icono
                className={cn('size-5 shrink-0', selected ? 'text-secondary' : 'text-gray-400')}
                aria-hidden
              />
            )
          })()
        ) : (
          <span
            className={cn(
              'material-symbols-outlined text-base shrink-0',
              selected ? 'text-white' : 'text-outline',
            )}
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            {icon}
          </span>
        ))}
      <span className="text-left leading-snug">{children}</span>
    </button>
  )
}
