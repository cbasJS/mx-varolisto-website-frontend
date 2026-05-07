'use client'

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-surface-container-high" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-outline-variant">
        {label}
      </span>
      <div className="h-px flex-1 bg-surface-container-high" />
    </div>
  )
}
