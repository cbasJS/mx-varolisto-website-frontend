'use client'

interface FieldErrorProps {
  message?: string
  id?: string
}

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 px-4 text-xs text-error">
      {message}
    </p>
  )
}
