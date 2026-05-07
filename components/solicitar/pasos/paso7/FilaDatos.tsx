'use client'

export function Fila({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-outline">{label}</span>
      <span className="text-right font-medium text-on-surface">{value}</span>
    </div>
  )
}

export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 mt-3 text-[10px] font-bold uppercase tracking-widest text-outline first:mt-0">
      {children}
    </p>
  )
}
