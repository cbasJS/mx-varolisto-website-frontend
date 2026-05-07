'use client'

export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-7 w-48 rounded-xl bg-surface-container" />
      <div className="h-4 w-72 rounded-xl bg-surface-bright" />
      <div className="grid gap-3 sm:grid-cols-3 mt-6">
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-11 w-32 rounded-xl bg-surface-container" />
      </div>
    </div>
  )
}
