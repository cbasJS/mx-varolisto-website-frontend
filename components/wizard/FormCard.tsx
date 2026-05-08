'use client'

import type { ReactNode } from 'react'

/**
 * Wrapper visual del contenido de cada paso (excluyendo FormActions, que vive
 * fuera del card como sibling — match Figma). Aporta el rounded-2xl, border y
 * padding del card blanco.
 */
export function FormCard({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="form-card"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="p-6">{children}</div>
    </div>
  )
}
