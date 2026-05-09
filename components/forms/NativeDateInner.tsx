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

  const maxAttr = maxDate ? dateToYYYYMMDD(maxDate) : undefined
  const minAttr = minDate ? dateToYYYYMMDD(minDate) : undefined

  return (
    <div>
      <label
        htmlFor={autoId}
        className="mb-2 flex items-center text-xs font-medium uppercase tracking-wider text-on-surface-variant"
      >
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden>
              *
            </span>
          )}
          {optional && (
            <span className="ml-1 normal-case tracking-normal opacity-60">(opcional)</span>
          )}
        </span>
      </label>
      <div
        onClick={() => inputRef.current?.showPicker?.()}
        className={cn(
          'relative flex items-center rounded-full border-2 bg-white px-4 py-3 transition-colors duration-200',
          focused
            ? 'border-primary'
            : error
              ? 'border-error'
              : 'border-gray-200 hover:border-outline-variant',
        )}
      >
        <span
          className={cn(
            'w-full text-sm leading-normal',
            hasValue ? 'text-on-surface' : 'text-outline-variant',
          )}
        >
          {hasValue ? formatDDMMYYYY(value) : ''}
        </span>
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
          className="absolute inset-0 h-full w-full cursor-pointer text-base opacity-0 md:text-sm"
          aria-invalid={!!error}
          aria-describedby={error ? `${autoId}-error` : undefined}
        />
      </div>
      <FieldError message={error?.message} id={error?.message ? `${autoId}-error` : undefined} />
      {!error && hint && <p className="mt-1.5 text-xs text-outline">{hint}</p>}
    </div>
  )
}
