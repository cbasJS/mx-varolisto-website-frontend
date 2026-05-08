'use client'

import React, { useState, useId, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { FieldError } from './FieldError'

interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  required?: boolean
  /** Renderizado a la derecha del label (típicamente contadores como "0/18"). */
  labelSuffix?: React.ReactNode
  /** Renderizado dentro del input, a la izquierda (e.g. "$" o icono). */
  prefix?: React.ReactNode
  /** Renderizado dentro del input, a la derecha (e.g. "MXN"). */
  suffix?: React.ReactNode
}

/**
 * Input estilo Figma: label uppercase ABOVE el input, wrapper rounded-full
 * border-2. (Antes era floating label; conservamos el nombre del archivo
 * para no romper imports.)
 */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  function FloatingInput(
    {
      label,
      error,
      hint,
      optional,
      required,
      labelSuffix,
      suffix,
      prefix,
      className,
      id,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false)
    const autoId = useId()
    const inputId = id ?? autoId
    const isDisabled = props.disabled

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-on-surface-variant"
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
          {labelSuffix && <span className="normal-case tracking-normal">{labelSuffix}</span>}
        </label>
        <div
          className={cn(
            'flex items-center rounded-full border-2 bg-white px-4 py-3 transition-colors duration-200',
            focused
              ? 'border-primary'
              : error
                ? 'border-error'
                : 'border-gray-200 hover:border-outline-variant',
            isDisabled && 'cursor-not-allowed bg-gray-50 opacity-70',
          )}
        >
          {prefix && <span className="mr-2 shrink-0 text-sm text-outline">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => {
              setFocused(true)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              onBlur?.(e)
            }}
            className={cn(
              'w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-outline-variant',
              className,
            )}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {suffix && <span className="ml-2 shrink-0 text-xs text-outline">{suffix}</span>}
        </div>
        <FieldError message={error} id={error ? `${inputId}-error` : undefined} />
        {!error && hint && <p className="mt-1.5 text-xs text-outline">{hint}</p>}
      </div>
    )
  },
)
FloatingInput.displayName = 'FloatingInput'
