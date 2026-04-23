"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso3Schema, type Paso3Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import {
  initCurrencyDisplay,
  formatCurrencyOnChange,
  formatCurrencyOnBlur,
  formatCurrencyOnFocus,
} from "@/lib/solicitud/utils/formatCurrency"
import { useAutoSave } from "./useAutoSave"
import { normalizeRegister } from "@/lib/solicitud/utils/normalizeRegister"

export function usePaso3(onNext: (datos: Paso3Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const { register: _register, handleSubmit, control, watch, setValue, formState: { errors, isValid } } =
    useForm<Paso3Data>({
      resolver: zodResolver(paso3Schema),
      defaultValues: {
        tipoActividad: datos.tipoActividad,
        nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? "",
        antiguedad: datos.antiguedad,
        ingresoMensual: datos.ingresoMensual,
        tieneDeudas: datos.tieneDeudas,
        cantidadDeudas: datos.cantidadDeudas,
        montoTotalDeudas: datos.montoTotalDeudas,
        pagoMensualDeudas: datos.pagoMensualDeudas,
      },
    })

  const register = normalizeRegister(_register)

  const [ingresoDisplay, setIngresoDisplay] = useState<string>(
    initCurrencyDisplay(datos.ingresoMensual)
  )
  const [pagoDeudaDisplay, setPagoDeudaDisplay] = useState<string>(
    initCurrencyDisplay(datos.pagoMensualDeudas)
  )
  const [antiguedadOpen, setAntiguedadOpen] = useState(false)
  const [montoTotalOpen, setMontoTotalOpen] = useState(false)

  const tipoActividad = watch("tipoActividad")
  const tieneDeudas = watch("tieneDeudas")
  const cantidadDeudas = watch("cantidadDeudas")
  const antiguedadActual = watch("antiguedad")
  const montoTotalDeudasActual = watch("montoTotalDeudas")

  const labelEmpleador =
    tipoActividad === "negocio_propio"
      ? "Nombre de tu negocio"
      : tipoActividad === "independiente"
        ? "Actividad principal"
        : "Empresa / Empleador"

  const ingresoHandlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { display, num } = formatCurrencyOnChange(e.target.value)
      setIngresoDisplay(display)
      setValue("ingresoMensual", num as number, { shouldValidate: true })
    },
    onBlur: () => setIngresoDisplay(formatCurrencyOnBlur(ingresoDisplay)),
    onFocus: () => setIngresoDisplay(formatCurrencyOnFocus(ingresoDisplay)),
  }

  const pagoDeudaHandlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { display, num } = formatCurrencyOnChange(e.target.value)
      setPagoDeudaDisplay(display)
      setValue("pagoMensualDeudas", num as number, { shouldValidate: true })
    },
    onBlur: () => setPagoDeudaDisplay(formatCurrencyOnBlur(pagoDeudaDisplay)),
    onFocus: () => setPagoDeudaDisplay(formatCurrencyOnFocus(pagoDeudaDisplay)),
  }

  useAutoSave(watch, 3)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    errors,
    isValid,
    tipoActividad,
    tieneDeudas,
    cantidadDeudas,
    antiguedadActual,
    antiguedadOpen,
    setAntiguedadOpen,
    montoTotalDeudasActual,
    montoTotalOpen,
    setMontoTotalOpen,
    labelEmpleador,
    ingresoDisplay,
    ingresoHandlers,
    pagoDeudaDisplay,
    pagoDeudaHandlers,
  }
}
