'use client'

import React, { useRef, useState } from 'react'
import { type FieldError as RHFFieldError } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { dateToYYYYMMDD, formatDDMMYYYY } from '@/lib/solicitud/utils/dateUtils'
import { FieldError } from './FieldError'

interface NativeDateInnerProps {
  label: string
  autoId: string
  error?: RHFFieldError
  optional?: boolean
  required?: boolean
  hint?: string
  maxDate?: Date
  minDate?: Date
  onChange: (val: string) => void
  onBlur: () => void
  value: string
}

export function NativeDateInner({
  label,
  autoId,
  error,
  optional,
  required,
  hint,
  maxDate,
  minDate,
  onChange,
  onBlur,
  value,
}: NativeDateInnerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const hasValue = !!value
  const lifted = focused || hasValue

  const maxAttr = maxDate ? dateToYYYYMMDD(maxDate) : undefined
  const minAttr = minDate ? dateToYYYYMMDD(minDate) : undefined

  return (
    <div className="group relative">
      <div
        onClick={() => inputRef.current?.showPicker?.()}
        className={cn(
          'relative min-h-[60px] rounded-xl border-2 bg-white transition-all duration-200',
          focused
            ? 'border-primary shadow-sm shadow-primary/10'
            : error
              ? 'border-error'
              : 'border-surface-container-high hover:border-outline-variant',
        )}
      >
        <label
          htmlFor={autoId}
          className={cn(
            'pointer-events-none absolute left-4 z-10 transition-all duration-200 select-none',
            lifted
              ? 'top-2 text-[10px] font-semibold uppercase tracking-widest'
              : 'top-1/2 -translate-y-1/2 text-sm',
            focused ? 'text-primary' : error ? 'text-error' : 'text-outline',
          )}
        >
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden>
              *
            </span>
          )}
          {optional && (
            <span className="ml-1 normal-case tracking-normal opacity-60">(opcional)</span>
          )}
        </label>
        <div className="w-full pb-2 pt-6 pl-4 pr-4 text-base leading-normal text-on-surface">
          {hasValue ? formatDDMMYYYY(value) : ' '}
        </div>
        <input
          ref={inputRef}
          id={autoId}
          type="date"
          value={value}
          max={maxAttr}
          min={minAttr}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur()
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-invalid={!!error}
          aria-describedby={error ? `${autoId}-error` : undefined}
        />
      </div>
      <FieldError message={error?.message} id={error?.message ? `${autoId}-error` : undefined} />
      {!error && hint && <p className="mt-1.5 text-xs text-outline">{hint}</p>}
    </div>
  )
}
