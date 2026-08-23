'use client'

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center gap-4 py-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}
