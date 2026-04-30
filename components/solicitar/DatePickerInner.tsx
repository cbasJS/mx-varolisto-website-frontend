"use client";

import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { type FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { yyyymmddToDate, dateToYYYYMMDD } from "@/lib/solicitud/utils/dateUtils";

registerLocale("es", es);

interface DatePickerInnerProps {
  label: string;
  autoId: string;
  error?: FieldError;
  optional?: boolean;
  required?: boolean;
  hint?: string;
  maxDate?: Date;
  minDate?: Date;
  showYearDropdown: boolean;
  showMonthDropdown: boolean;
  onChange: (val: string) => void;
  value: string;
}

export function DatePickerInner({
  label,
  autoId,
  error,
  optional,
  required,
  hint,
  maxDate,
  minDate,
  showYearDropdown,
  showMonthDropdown,
  onChange,
  value,
}: DatePickerInnerProps) {
  const [focused, setFocused] = useState(false);
  const selectedDate = yyyymmddToDate(value);
  const hasValue = selectedDate !== null;
  const lifted = focused || hasValue;

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
        <DatePicker
            id={autoId}
            selected={selectedDate}
            onChange={(date: Date | Date[] | null) =>
              onChange(date instanceof Date ? dateToYYYYMMDD(date) : "")
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            maxDate={maxDate}
            minDate={minDate}
            showYearDropdown={showYearDropdown}
            showMonthDropdown={showMonthDropdown}
            dropdownMode="select"
            scrollableYearDropdown
            yearDropdownItemNumber={80}
            popperPlacement="bottom-start"
            showPopperArrow={false}
            portalId="datepicker-portal"
            placeholderText=" "
            className="w-full cursor-pointer bg-transparent pb-2 pt-6 pl-4 pr-4 text-base md:text-sm text-on-surface outline-none"
            wrapperClassName="w-full"
            autoComplete="off"
            aria-invalid={error ? "true" : "false"}
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
