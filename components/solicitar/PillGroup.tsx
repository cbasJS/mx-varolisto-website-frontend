'use client'

import React from 'react'
import { FieldError } from './FieldError'

interface PillGroupProps {
  label: string
  required?: boolean
  error?: string
  className?: string
  pillsClassName?: string
  children: React.ReactNode
}

export function PillGroup({
  label,
  required,
  error,
  className,
  pillsClassName = 'flex flex-wrap gap-2',
  children,
}: PillGroupProps) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-outline">
        {label}
        {required && (
          <>
            {' '}
            <span className="text-error" aria-hidden>
              *
            </span>
          </>
        )}
      </p>
      <div className={pillsClassName}>{children}</div>
      <FieldError message={error} />
    </div>
  )
}
