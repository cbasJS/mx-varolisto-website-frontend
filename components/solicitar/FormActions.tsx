"use client";

import { cn } from "@/lib/utils";

interface FormActionsProps {
  onBack?: () => void;
  submitLabel?: string;
  isFirst?: boolean;
  disabled?: boolean;
}

export function FormActions({
  onBack,
  submitLabel = "Continuar",
  isFirst,
  disabled,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "mt-8 flex gap-3",
        isFirst ? "justify-end" : "justify-between",
      )}
    >
      {!isFirst && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border-2 border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-[#454652] transition-all hover:border-[#c8c8c8] hover:bg-[#fafafa] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            arrow_back
          </span>
          Atrás
        </button>
      )}
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition-all",
          disabled
            ? "cursor-not-allowed bg-[#c8c8c8] shadow-none"
            : "bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98]",
        )}
      >
        {submitLabel}
        <span className="material-symbols-outlined text-sm" aria-hidden>
          arrow_forward
        </span>
      </button>
    </div>
  );
}
