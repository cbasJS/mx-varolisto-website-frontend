"use client";

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#e8e8e8]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#bbb]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#e8e8e8]" />
    </div>
  );
}
