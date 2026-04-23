"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso4Schema, type Paso4Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { useAutoSave } from "./useAutoSave"
import { normalizeRegister } from "@/lib/solicitud/utils/normalizeRegister"

export function usePaso4(onNext: (datos: Paso4Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const { register: _register, handleSubmit, control, setValue, watch, formState: { errors, isValid } } =
    useForm<Paso4Data>({
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

  const register = normalizeRegister(_register)

  useAutoSave(watch, 4)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    watch,
    errors,
    isValid,
  }
}
