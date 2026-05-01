"use client";

import { useId } from "react";
import { Controller, type Control, type FieldValues, type Path, type FieldError } from "react-hook-form";
import { useMobile } from "@/hooks/useMobile";
import { DatePickerInner } from "./DatePickerInner";
import { NativeDateInner } from "./NativeDateInner";

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
  const isMobile = useMobile();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) =>
        isMobile ? (
          <NativeDateInner
            label={label}
            autoId={autoId}
            error={error}
            optional={optional}
            required={required}
            hint={hint}
            maxDate={maxDate}
            minDate={minDate}
            onChange={onChange}
            onBlur={onBlur}
            value={typeof value === "string" ? value : ""}
          />
        ) : (
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
        )
      }
    />
  );
}
