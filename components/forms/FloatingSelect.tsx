'use client'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldError } from './FieldError'

interface FloatingSelectOption {
  value: string
  label: string
}

interface FloatingSelectProps {
  label: string
  required?: boolean
  value: string | undefined
  onValueChange: (value: string) => void
  onOpenChange?: (open: boolean) => void
  options: FloatingSelectOption[]
  error?: string
  isOpen?: boolean
  disabled?: boolean
}

/**
 * Select estilo Figma: label uppercase ABOVE el trigger, trigger rounded-full
 * border-2. Conservamos el nombre del archivo (antes era floating label).
 */
export function FloatingSelect({
  label,
  required,
  value,
  onValueChange,
  onOpenChange,
  options,
  error,
  isOpen,
  disabled,
}: FloatingSelectProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden>
            *
          </span>
        )}
      </p>
      <Select
        value={value}
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        <SelectTrigger
          data-size=""
          className={cn(
            'h-auto w-full rounded-full border-2 bg-white px-4 py-3 text-sm shadow-none transition-colors duration-200 focus:ring-0 data-[size=sm]:h-auto data-[size=default]:h-auto',
            error
              ? 'border-error'
              : isOpen
                ? 'border-primary'
                : 'border-gray-200 hover:border-outline-variant',
            disabled && 'opacity-50',
          )}
        >
          <SelectValue placeholder="Selecciona…" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </div>
  )
}
