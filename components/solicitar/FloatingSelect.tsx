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
      <div
        className={cn(
          'relative rounded-xl border-2 bg-white transition-all duration-200',
          error
            ? 'border-error'
            : isOpen
              ? 'border-primary shadow-sm shadow-primary/10'
              : 'border-surface-container-high hover:border-outline-variant',
          disabled && 'opacity-50',
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute left-4 z-10 select-none transition-all duration-200',
            value
              ? 'top-2 text-[10px] font-semibold uppercase tracking-widest text-outline'
              : 'top-1/2 -translate-y-1/2 text-sm text-outline',
          )}
        >
          {label}{' '}
          {required && (
            <span className="text-error" aria-hidden>
              *
            </span>
          )}
        </span>
        <Select
          value={value}
          onValueChange={onValueChange}
          onOpenChange={onOpenChange}
          disabled={disabled}
        >
          <SelectTrigger
            data-size=""
            className={cn(
              '!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0',
              value ? 'pb-2 pt-6' : 'py-0',
            )}
          >
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FieldError message={error} />
    </div>
  )
}
