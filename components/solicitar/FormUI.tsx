"use client";

/**
 * FormUI — Primitivas de UI compartidas para el formulario de solicitud.
 * Diseño premium: inputs con floating label, pill selectors, section headers.
 */

import React, { useState, useId, forwardRef } from "react";
import { cn } from "@/lib/utils";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type FieldError,
} from "react-hook-form";

registerLocale("es", es);

// ─── FloatingInput ────────────────────────────────────────────────────────────
// Input con label flotante que sube al hacer focus o cuando tiene valor.

interface FloatingInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  function FloatingInput(
    {
      label,
      error,
      hint,
      optional,
      required,
      suffix,
      prefix,
      className,
      id,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) {
    const [focused, setFocused] = useState(false);
    const autoId = useId();
    const inputId = id ?? autoId;
    const hasValue = !!(props.value || props.defaultValue);
    const lifted = focused || hasValue || !!props.placeholder;

    return (
      <div className="group relative">
        <div
          className={cn(
            "relative flex items-center overflow-hidden rounded-xl border-2 bg-white transition-all duration-200",
            focused
              ? "border-primary shadow-sm shadow-primary/10"
              : error
                ? "border-error"
                : "border-[#e8e8e8] hover:border-[#c8c8c8]",
          )}
        >
          {prefix && (
            <span className="pointer-events-none ml-4 shrink-0 text-sm text-[#999]">
              {prefix}
            </span>
          )}
          <div className="relative flex-1">
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-4 transition-all duration-200 select-none",
                lifted
                  ? "top-2 text-[10px] font-semibold uppercase tracking-widest"
                  : "top-1/2 -translate-y-1/2 text-sm",
                focused ? "text-primary" : error ? "text-error" : "text-[#aaa]",
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
            <input
              ref={ref}
              id={inputId}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              className={cn(
                "w-full bg-transparent pb-2 pt-6 text-sm text-[#1a1c1c] outline-none placeholder:text-transparent",
                prefix ? "pl-1" : "pl-4",
                suffix ? "pr-2" : "pr-4",
                className,
              )}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
          </div>
          {suffix && (
            <span className="pointer-events-none mr-4 shrink-0 text-xs font-medium text-[#999]">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs text-error"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden>
              error
            </span>
            {error}
          </p>
        )}
        {!error && hint && <p className="mt-1.5 text-xs text-[#999]">{hint}</p>}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

// ─── PillOption ───────────────────────────────────────────────────────────────
// Botón tipo "pill card" seleccionable — reemplaza radio/checkbox visuales.

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
          : "border-[#e8e8e8] bg-white text-[#454652] hover:border-[#c8c8c8] hover:bg-[#fafafa]",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "material-symbols-outlined text-base shrink-0",
            selected ? "text-secondary" : "text-[#aaa]",
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

// ─── SectionDivider ───────────────────────────────────────────────────────────

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

// ─── StepTitle ────────────────────────────────────────────────────────────────

export function StepTitle({
  numero,
  titulo,
  subtitulo,
}: {
  numero: number;
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {numero}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Paso {numero} de 6
        </span>
      </div>
      <h2 className="font-headline text-2xl font-bold text-[#1a1c1c]">
        {titulo}
      </h2>
      {subtitulo && <p className="mt-1 text-sm text-[#767683]">{subtitulo}</p>}
    </div>
  );
}

// ─── FormActions ──────────────────────────────────────────────────────────────

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

// ─── DatePickerInput ──────────────────────────────────────────────────────────
// Input de fecha con react-datepicker y floating label, integrado con react-hook-form.

interface DatePickerInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  optional?: boolean;
  required?: boolean;
  hint?: string;
  maxDate?: Date;
  minDate?: Date;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
}

function dateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function yyyymmddToDate(str: string): Date | null {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, mo, d] = str.split("-").map(Number);
  return new Date(y, mo - 1, d);
}

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

function DatePickerInner({
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
          "relative flex items-center overflow-hidden rounded-xl border-2 bg-white transition-all duration-200",
          focused
            ? "border-primary shadow-sm shadow-primary/10"
            : error
              ? "border-error"
              : "border-[#e8e8e8] hover:border-[#c8c8c8]",
        )}
      >
        <div className="relative flex-1">
          <label
            htmlFor={autoId}
            className={cn(
              "pointer-events-none absolute left-4 z-10 transition-all duration-200 select-none",
              lifted
                ? "top-2 text-[10px] font-semibold uppercase tracking-widest"
                : "top-1/2 -translate-y-1/2 text-sm",
              focused ? "text-primary" : error ? "text-error" : "text-[#aaa]",
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
            className="w-full cursor-pointer bg-transparent pb-2 pt-6 pl-4 pr-4 text-sm text-[#1a1c1c] outline-none"
            wrapperClassName="w-full"
            autoComplete="off"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${autoId}-error` : undefined}
          />
        </div>
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
      {!error && hint && <p className="mt-1.5 text-xs text-[#999]">{hint}</p>}
    </div>
  );
}

export function DatePickerInput<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  error,
  optional,
  required,
  hint,
  maxDate,
  minDate,
  showYearDropdown = false,
  showMonthDropdown = false,
}: DatePickerInputProps<TFieldValues>) {
  const autoId = useId();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePickerInner
          label={label}
          autoId={autoId}
          error={error}
          optional={optional}
          required={required}
          hint={hint}
          maxDate={maxDate}
          minDate={minDate}
          showYearDropdown={showYearDropdown}
          showMonthDropdown={showMonthDropdown}
          onChange={onChange}
          value={typeof value === "string" ? value : ""}
        />
      )}
    />
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-error">
      <span className="material-symbols-outlined text-sm" aria-hidden>
        error
      </span>
      {message}
    </p>
  );
}

// ─── InfoBanner ───────────────────────────────────────────────────────────────

export function InfoBanner({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning";
}) {
  const styles = {
    info: "bg-primary/5 border-primary/20 text-primary",
    success: "bg-secondary/10 border-secondary/30 text-[#006e1c]",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };
  const icons = { info: "info", success: "check_circle", warning: "warning" };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        styles[variant],
      )}
    >
      <span
        className="material-symbols-outlined mt-0.5 shrink-0 text-base"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        {icons[variant]}
      </span>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
