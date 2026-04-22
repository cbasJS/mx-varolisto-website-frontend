"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { paso1Schema, type Paso1Data } from "@/lib/solicitud-schema";
import { useSolicitudStore } from "@/lib/solicitud-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FloatingInput,
  DatePickerInput,
  PillOption,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
} from "../FormUI";
import { cn } from "@/lib/utils";
import type { CopomexResponse } from "@/app/api/colonias/route";

interface Props {
  onNext: (datos: Paso1Data) => void;
}

async function fetchColonias(cp: string): Promise<CopomexResponse[]> {
  const res = await fetch(`/api/colonias?cp=${cp}`);
  if (!res.ok) throw new Error("CP no encontrado");
  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0)
    throw new Error("CP no encontrado");
  return data as CopomexResponse[];
}

const SEXO_OPTS = [
  { value: "M", label: "Hombre", icono: "man" },
  { value: "F", label: "Mujer", icono: "woman" },
  { value: "ND", label: "Prefiero no decir", icono: "person" },
];

export default function Paso1DatosPersonales({ onNext }: Props) {
  const datos = useSolicitudStore((s) => s.datos)
  const coloniasCache = useSolicitudStore((s) => s.coloniasCache)
  const setColoniasCache = useSolicitudStore((s) => s.setColoniasCache);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<Paso1Data>({
    resolver: zodResolver(paso1Schema),
    mode: "onTouched",
    defaultValues: {
      nombre: datos.nombre ?? "",
      apellidoPaterno: datos.apellidoPaterno ?? "",
      apellidoMaterno: datos.apellidoMaterno ?? "",
      sexo: datos.sexo,
      fechaNacimiento: datos.fechaNacimiento ?? "",
      curp: datos.curp ?? "",
      email: datos.email ?? "",
      telefono: datos.telefono ?? "",
      codigoPostal: datos.codigoPostal ?? "",
      colonia: datos.colonia ?? "",
      municipio: datos.municipio ?? "",
      calle: datos.calle ?? "",
      numeroExterior: datos.numeroExterior ?? "",
      numeroInterior: datos.numeroInterior ?? "",
    },
  });

  const maxDateNacimiento = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
  }, []);

  const sexoActual = useWatch({ control, name: "sexo" });
  const codigoPostal = useWatch({ control, name: "codigoPostal" }) ?? "";
  const coloniaActual = useWatch({ control, name: "colonia" }) ?? "";
  const cpValido = /^\d{5}$/.test(codigoPostal);
  const {
    data: colonias,
    isLoading: cargandoCP,
    isError: cpError,
  } = useQuery({
    queryKey: ["cp", codigoPostal],
    queryFn: () => fetchColonias(codigoPostal),
    enabled: cpValido,
    retry: false,
    initialData: coloniasCache[codigoPostal],
    initialDataUpdatedAt: 0,
    staleTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (colonias && colonias.length > 0 && cpValido) {
      setColoniasCache(codigoPostal, colonias);
    }
  }, [colonias, codigoPostal, cpValido, setColoniasCache]);

  const prevCpRef = useRef<string>("");

  useEffect(() => {
    if (colonias && colonias.length > 0) {
      setValue("municipio", colonias[0].response.municipio);
      const opciones = colonias.map((c) => c.response.asentamiento);
      // Solo limpiar la colonia si el usuario cambió el CP manualmente
      // (no al cargar los datos guardados con el mismo CP)
      if (!opciones.includes(coloniaActual) && prevCpRef.current !== "" && prevCpRef.current !== codigoPostal) {
        setValue("colonia", "");
      }
    }
    prevCpRef.current = codigoPostal;
  }, [colonias, setValue, coloniaActual, codigoPostal]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        useSolicitudStore
          .getState()
          .guardarPaso(1, value as Partial<Paso1Data>);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <StepTitle
        numero={1}
        titulo="Cuéntanos sobre ti"
        subtitulo="Necesitamos algunos datos para personalizar tu oferta."
      />

      {/* Nombre */}
      <div className="grid gap-3 sm:grid-cols-3">
        <FloatingInput
          label="Nombre(s)"
          required
          error={errors.nombre?.message}
          {...register("nombre")}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido paterno"
          required
          error={errors.apellidoPaterno?.message}
          {...register("apellidoPaterno")}
          placeholder=" "
        />
        <FloatingInput
          label="Apellido materno"
          required
          error={errors.apellidoMaterno?.message}
          {...register("apellidoMaterno")}
          placeholder=" "
        />
      </div>

      <SectionDivider label="Información personal" />

      {/* Sexo — pill cards */}
      <div className="mb-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Sexo{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SEXO_OPTS.map(({ value, label, icono }) => (
            <PillOption
              key={value}
              selected={sexoActual === value}
              onClick={() =>
                setValue("sexo", value as "M" | "F" | "ND", {
                  shouldValidate: true,
                })
              }
              icon={icono}
            >
              {label}
            </PillOption>
          ))}
        </div>
        <FieldError message={errors.sexo?.message} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DatePickerInput<Paso1Data>
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          control={control}
          error={errors.fechaNacimiento}
          maxDate={maxDateNacimiento}
          required
          showYearDropdown
          showMonthDropdown
        />
        <FloatingInput
          label="CURP"
          required
          error={errors.curp?.message}
          {...register("curp", { setValueAs: (v: string) => v.toUpperCase() })}
          placeholder=" "
          maxLength={18}
          className="uppercase"
          hint="18 caracteres en mayúsculas"
        />
        <FloatingInput
          label="Correo electrónico"
          type="email"
          optional
          error={errors.email?.message}
          {...register("email")}
          placeholder=" "
        />
        <FloatingInput
          label="Teléfono celular"
          type="tel"
          required
          error={errors.telefono?.message}
          {...register("telefono")}
          placeholder=" "
          maxLength={10}
          hint="10 dígitos sin guiones ni espacios"
        />
      </div>

      <SectionDivider label="Dirección" />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* CP */}
        <div>
          <FloatingInput
            label="Código postal"
            required
            error={errors.codigoPostal?.message}
            {...register("codigoPostal")}
            placeholder=" "
            maxLength={5}
            inputMode="numeric"
          />
          {cpValido && cpError && (
            <p className="mt-1.5 text-xs text-error">
              Código postal no encontrado
            </p>
          )}
        </div>

        {/* Colonia */}
        <div>
          {cargandoCP ? (
            <div className="h-[52px] animate-pulse rounded-xl bg-[#f5f5f7]" />
          ) : (
            <div
              className={cn(
                "relative rounded-xl border-2 bg-white transition-all duration-200",
                errors.colonia
                  ? "border-error"
                  : "border-[#e8e8e8] hover:border-[#c8c8c8]",
                (!cpValido || !colonias) && "opacity-50",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                  coloniaActual
                    ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                    : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]",
                )}
              >
                Colonia{" "}
                <span className="text-error" aria-hidden>
                  *
                </span>
              </span>
              <Select
                disabled={!cpValido || !colonias}
                value={coloniaActual}
                onValueChange={(val) =>
                  setValue("colonia", val, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="colonia"
                  aria-invalid={!!errors.colonia}
                  data-size=""
                  className={cn(
                    "!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0",
                    coloniaActual ? "pb-2 pt-6" : "py-0",
                  )}
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {colonias?.map((item) => (
                    <SelectItem
                      key={item.response.asentamiento}
                      value={item.response.asentamiento}
                    >
                      {item.response.asentamiento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {!errors.colonia && !coloniaActual && cpValido && colonias && (
            <p className="mt-1.5 text-xs text-[#999]">Selecciona tu colonia</p>
          )}
          {!errors.colonia && !cpValido && (
            <p className="mt-1.5 text-xs text-[#999]">Ingresa tu CP primero</p>
          )}
          <FieldError message={errors.colonia?.message} />
        </div>

        {/* Municipio (read-only) */}
        <FloatingInput
          label="Municipio / Alcaldía"
          {...register("municipio")}
          readOnly
          placeholder=" "
          className="cursor-default text-[#aaa]"
          hint="Se llena automáticamente con tu CP"
        />

        <FloatingInput
          label="Calle"
          required
          error={errors.calle?.message}
          {...register("calle")}
          placeholder=" "
        />
        <FloatingInput
          label="Número exterior"
          required
          error={errors.numeroExterior?.message}
          {...register("numeroExterior")}
          placeholder=" "
        />
        <FloatingInput
          label="Número interior"
          optional
          {...register("numeroInterior")}
          placeholder=" "
        />
      </div>

      <FormActions submitLabel="Continuar" isFirst disabled={!isValid} />
    </form>
  );
}
