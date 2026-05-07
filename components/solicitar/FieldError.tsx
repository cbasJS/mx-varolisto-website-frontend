'use client'

interface FieldErrorProps {
  message?: string
  id?: string
}

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs text-error">
      <span className="material-symbols-outlined text-sm" aria-hidden>
        error
      </span>
      {message}
    </p>
  )
}
