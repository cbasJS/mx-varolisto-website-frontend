"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso2Schema, type Paso2Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { calcularCuota, TASA_MENSUAL } from "@/lib/solicitud/utils/calcularCuota"
import { useAutoSave } from "./useAutoSave"
import { normalizeRegister } from "@/lib/solicitud/utils/normalizeRegister"

export function usePaso2(onNext: (datos: Paso2Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const { register: _register, handleSubmit, control, watch, setValue, formState: { errors, isValid } } =
    useForm<Paso2Data>({
      resolver: zodResolver(paso2Schema),
      defaultValues: {
        montoSolicitado: datos.montoSolicitado ?? 5000,
        plazoMeses: datos.plazoMeses ?? "3",
        primerCredito: datos.primerCredito,
        destinoPrestamo: datos.destinoPrestamo,
        destinoOtro: datos.destinoOtro ?? "",
      },
    })

  const register = normalizeRegister(_register)

  const monto = watch("montoSolicitado") ?? 5000
  const plazoStr = watch("plazoMeses") ?? "3"
  const plazo = parseInt(plazoStr, 10)
  const destino = watch("destinoPrestamo")
  const primerCredito = watch("primerCredito")
  const cuota = calcularCuota(monto, plazo)

  useAutoSave(watch, 2)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    errors,
    isValid,
    monto,
    plazoStr,
    destino,
    primerCredito,
    cuota,
    TASA_MENSUAL,
  }
}
