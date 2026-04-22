"use client"

import { useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso4Schema, type Paso4Data } from "@/lib/solicitud-schema"
import { useSolicitudStore } from "@/lib/solicitud-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FloatingInput,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
  InfoBanner,
} from "../FormUI"
import { cn } from "@/lib/utils"

interface Props {
  onNext: (datos: Paso4Data) => void
  onBack: () => void
}

const RELACIONES = [
  { value: "familiar", label: "Familiar" },
  { value: "trabajo", label: "Trabajo" },
  { value: "amigo", label: "Amigo" },
  { value: "otro", label: "Otro" },
]

function RefCard({
  numero,
  prefix,
  register,
  control,
  errors,
  defaultRelacion,
  setValue,
}: {
  numero: 1 | 2
  prefix: "ref1" | "ref2"
  register: ReturnType<typeof useForm<Paso4Data>>["register"]
  control: ReturnType<typeof useForm<Paso4Data>>["control"]
  errors: ReturnType<typeof useForm<Paso4Data>>["formState"]["errors"]
  defaultRelacion?: string
  setValue: ReturnType<typeof useForm<Paso4Data>>["setValue"]
}) {
  const nombreKey = `${prefix}Nombre` as keyof Paso4Data
  const telefonoKey = `${prefix}Telefono` as keyof Paso4Data
  const relacionKey = `${prefix}Relacion` as keyof Paso4Data
  const emailKey = `${prefix}Email` as keyof Paso4Data

  return (
    <div className="rounded-2xl border-2 border-[#e8e8e8] bg-[#fafafa] p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {numero}
        </div>
        <h3 className="font-headline text-base font-semibold text-[#1a1c1c]">
          Referencia {numero}
        </h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingInput
          label="Nombre completo"
          required
          inputMode="text"
          autoComplete="name"
          error={errors[nombreKey]?.message as string}
          {...register(nombreKey)}
          placeholder=" "
        />
        <FloatingInput
          label="Teléfono"
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          error={errors[telefonoKey]?.message as string}
          {...register(telefonoKey, {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "")
            },
          })}
          placeholder=" "
        />
        <div>
          <Controller
            control={control}
            name={relacionKey}
            render={({ field }) => {
              const hasValue = !!(field.value as string)
              return (
                <div
                  className={cn(
                    "relative rounded-xl border-2 bg-white transition-all duration-200",
                    errors[relacionKey] ? "border-error" : "border-[#e8e8e8] hover:border-[#c8c8c8]"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute left-4 z-10 select-none transition-all duration-200",
                      hasValue
                        ? "top-2 text-[10px] font-semibold uppercase tracking-widest text-[#aaa]"
                        : "top-1/2 -translate-y-1/2 text-sm text-[#aaa]"
                    )}
                  >
                    Relación{" "}
                    <span className="text-error" aria-hidden>*</span>
                  </span>
                  <Select
                    value={field.value as string}
                    onValueChange={field.onChange}
                    defaultValue={defaultRelacion}
                  >
                    <SelectTrigger data-size="" className={cn("!h-[52px] w-full rounded-xl border-0 bg-transparent pl-4 pr-3 text-sm shadow-none focus:ring-0", hasValue ? "pb-2 pt-6" : "py-0")}>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELACIONES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }}
          />
          <FieldError message={errors[relacionKey]?.message as string} />
        </div>
        <FloatingInput
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          optional
          error={errors[emailKey]?.message as string}
          {...register(emailKey)}
          placeholder=" "
        />
      </div>
    </div>
  )
}

export default function Paso4Referencias({ onNext, onBack }: Props) {
  const datos = useSolicitudStore((s) => s.datos)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Paso4Data>({
    resolver: zodResolver(paso4Schema),
    mode: "onChange",
    defaultValues: {
      ref1Nombre: datos.ref1Nombre ?? "",
      ref1Telefono: datos.ref1Telefono ?? "",
      ref1Relacion: datos.ref1Relacion,
      ref1Email: datos.ref1Email ?? "",
      ref2Nombre: datos.ref2Nombre ?? "",
      ref2Telefono: datos.ref2Telefono ?? "",
      ref2Relacion: datos.ref2Relacion,
      ref2Email: datos.ref2Email ?? "",
    },
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        useSolicitudStore.getState().guardarPaso(4, value as Partial<Paso4Data>);
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
        numero={4}
        titulo="Referencias personales"
        subtitulo="Necesitamos dos personas que puedan confirmar tu solicitud."
      />

      <InfoBanner variant="info">
        <strong>Avísales antes de enviar.</strong> Contactaremos a estas
        personas para confirmar tu información. Asegúrate de que estén
        disponibles.
      </InfoBanner>

      <div className="mt-5 space-y-4">
        <RefCard
          numero={1}
          prefix="ref1"
          register={register}
          control={control}
          errors={errors}
          defaultRelacion={datos.ref1Relacion}
          setValue={setValue}
        />
        <RefCard
          numero={2}
          prefix="ref2"
          register={register}
          control={control}
          errors={errors}
          defaultRelacion={datos.ref2Relacion}
          setValue={setValue}
        />
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
