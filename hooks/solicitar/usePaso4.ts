"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso4Schema, type Paso4Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import {
  initCurrencyDisplay,
  formatCurrencyOnChange,
  formatCurrencyOnBlur,
  formatCurrencyOnFocus,
} from "@/lib/solicitud/utils/formatCurrency"
import { useAutoSave } from "./useAutoSave"
import { normalizeRegister } from "@/lib/solicitud/utils/normalizeRegister"

export function usePaso4(onNext: (datos: Paso4Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const { register: _register, handleSubmit, control, watch, setValue, formState: { errors, isValid } } =
    useForm<Paso4Data>({
      resolver: zodResolver(paso4Schema),
      defaultValues: {
        tipoActividad: datos.tipoActividad,
        nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? "",
        antiguedad: datos.antiguedad,
        estadoCivil: datos.estadoCivil,
        dependientesEconomicos: datos.dependientesEconomicos,
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
  const [estadoCivilOpen, setEstadoCivilOpen] = useState(false)
  const [dependientesOpen, setDependientesOpen] = useState(false)
  const [montoTotalOpen, setMontoTotalOpen] = useState(false)

  const tipoActividad = watch("tipoActividad")
  const tieneDeudas = watch("tieneDeudas")
  const cantidadDeudas = watch("cantidadDeudas")
  const antiguedadActual = watch("antiguedad")
  const estadoCivilActual = watch("estadoCivil")
  const dependientesActual = watch("dependientesEconomicos")
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

  useAutoSave(watch, 4)

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
    estadoCivilActual,
    estadoCivilOpen,
    setEstadoCivilOpen,
    dependientesActual,
    dependientesOpen,
    setDependientesOpen,
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
