"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso6Schema, type Paso6Data } from "@/lib/solicitud/schemas/index"

export function usePaso6(onSubmit: (datos: Paso6Data) => void) {
  const { handleSubmit, setValue, watch, formState: { errors } } =
    useForm<Paso6Data>({
      resolver: zodResolver(paso6Schema),
      defaultValues: { aceptaPrivacidad: undefined, aceptaTerminos: undefined },
    })

  const privacidad = watch("aceptaPrivacidad")
  const terminos = watch("aceptaTerminos")
  const ambosAceptados = privacidad === true && terminos === true

  return {
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    privacidad,
    terminos,
    ambosAceptados,
  }
}
