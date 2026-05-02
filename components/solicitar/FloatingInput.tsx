'use client'

import React, { useState, useId, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  required?: boolean
  suffix?: React.ReactNode
  prefix?: React.ReactNode
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  function FloatingInput(
    {
      label,
      error,
      hint,
      optional,
      required,
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
    const hasValue = !!(props.value || props.defaultValue)
    const lifted = focused || hasValue || !!props.placeholder

    return (
      <div className="group relative">
        <div
          className={cn(
            'relative flex items-center overflow-hidden rounded-xl border-2 bg-white transition-all duration-200',
            focused
              ? 'border-primary shadow-sm shadow-primary/10'
              : error
                ? 'border-error'
                : 'border-surface-container-high hover:border-outline-variant',
          )}
        >
          {prefix && (
            <span className="pointer-events-none ml-4 shrink-0 text-sm text-outline">{prefix}</span>
          )}
          <div className="relative flex-1">
            <label
              htmlFor={inputId}
              className={cn(
                'pointer-events-none absolute left-4 transition-all duration-200 select-none',
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
                'w-full bg-transparent pb-2 pt-6 text-base md:text-sm text-on-surface outline-none placeholder:text-transparent',
                prefix ? 'pl-1' : 'pl-4',
                suffix ? 'pr-2' : 'pr-4',
                className,
              )}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
          </div>
          {suffix && (
            <span className="pointer-events-none mr-4 shrink-0 text-xs font-medium text-outline">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-error">
            <span className="material-symbols-outlined text-sm" aria-hidden>
              error
            </span>
            {error}
          </p>
        )}
        {!error && hint && <p className="mt-1.5 text-xs text-outline">{hint}</p>}
      </div>
    )
  },
)
FloatingInput.displayName = 'FloatingInput'
