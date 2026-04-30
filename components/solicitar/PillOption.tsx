"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PillOptionProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  fullWidth?: boolean;
}

export function PillOption({
  selected,
  onClick,
  children,
  icon,
  className,
  fullWidth,
}: PillOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98]",
        fullWidth && "w-full",
        selected
          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
          : "border-surface-container-high bg-white text-on-surface-variant hover:border-outline-variant hover:bg-surface-bright",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "material-symbols-outlined text-base shrink-0",
            selected ? "text-secondary" : "text-outline",
          )}
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="text-left leading-snug">{children}</span>
    </button>
  );
}
