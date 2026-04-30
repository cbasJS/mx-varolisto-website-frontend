"use client";

import React, { useState } from "react";
import { type FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { dateToYYYYMMDD, formatDDMMYYYY } from "@/lib/solicitud/utils/dateUtils";

interface NativeDateInnerProps {
  label: string;
  autoId: string;
  error?: FieldError;
  optional?: boolean;
  required?: boolean;
  hint?: string;
  maxDate?: Date;
  minDate?: Date;
  onChange: (val: string) => void;
  value: string;
}

export function NativeDateInner({
  label,
  autoId,
  error,
  optional,
  required,
  hint,
  maxDate,
  minDate,
  onChange,
  value,
}: NativeDateInnerProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;
  const lifted = focused || hasValue;

  const maxAttr = maxDate ? dateToYYYYMMDD(maxDate) : undefined;
  const minAttr = minDate ? dateToYYYYMMDD(minDate) : undefined;

  return (
    <div className="group relative">
      <div
        className={cn(
          "relative rounded-xl border-2 bg-white transition-all duration-200",
          focused
            ? "border-primary shadow-sm shadow-primary/10"
            : error
              ? "border-error"
              : "border-surface-container-high hover:border-outline-variant",
        )}
      >
        <label
          htmlFor={autoId}
          className={cn(
            "pointer-events-none absolute left-4 z-10 transition-all duration-200 select-none",
            lifted
              ? "top-2 text-[10px] font-semibold uppercase tracking-widest"
              : "top-1/2 -translate-y-1/2 text-sm",
            focused ? "text-primary" : error ? "text-error" : "text-outline",
          )}
        >
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden>
              *
            </span>
          )}
          {optional && (
            <span className="ml-1 normal-case tracking-normal opacity-60">
              (opcional)
            </span>
          )}
        </label>
        <div className="w-full pb-2 pt-6 pl-4 pr-4 text-base text-on-surface">
          {hasValue ? formatDDMMYYYY(value) : " "}
        </div>
        <input
          id={autoId}
          type="date"
          value={value}
          max={maxAttr}
          min={minAttr}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-invalid={!!error}
          aria-describedby={error ? `${autoId}-error` : undefined}
        />
      </div>
      {error?.message && (
        <p
          id={`${autoId}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs text-error"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            error
          </span>
          {error.message}
        </p>
      )}
      {!error && hint && <p className="mt-1.5 text-xs text-outline">{hint}</p>}
    </div>
  );
}
