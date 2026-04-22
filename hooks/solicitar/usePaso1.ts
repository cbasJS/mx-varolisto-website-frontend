"use client"

import { useEffect, useMemo, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { paso1Schema, type Paso1Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { fetchColonias } from "@/lib/solicitud/utils/fetchColonias"
import { useAutoSave } from "./useAutoSave"

export function usePaso1(onNext: (datos: Paso1Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)
  const coloniasCache = useSolicitudStore((s) => s.coloniasCache)
  const setColoniasCache = useSolicitudStore((s) => s.setColoniasCache)

  const form = useForm<Paso1Data>({
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
  })

  const { register, handleSubmit, setValue, control, watch, formState: { errors, isValid } } = form

  const maxDateNacimiento = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d
  }, [])

  const sexoActual = useWatch({ control, name: "sexo" })
  const codigoPostal = useWatch({ control, name: "codigoPostal" }) ?? ""
  const coloniaActual = useWatch({ control, name: "colonia" }) ?? ""
  const cpValido = /^\d{5}$/.test(codigoPostal)

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
  })

  useEffect(() => {
    if (colonias && colonias.length > 0 && cpValido) {
      setColoniasCache(codigoPostal, colonias)
    }
  }, [colonias, codigoPostal, cpValido, setColoniasCache])

  const prevCpRef = useRef<string>("")

  useEffect(() => {
    if (colonias && colonias.length > 0) {
      setValue("municipio", colonias[0].response.municipio)
      const opciones = colonias.map((c) => c.response.asentamiento)
      if (!opciones.includes(coloniaActual) && prevCpRef.current !== "" && prevCpRef.current !== codigoPostal) {
        setValue("colonia", "")
      }
    }
    prevCpRef.current = codigoPostal
  }, [colonias, setValue, coloniaActual, codigoPostal])

  useAutoSave(watch, 1)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    setValue,
    control,
    errors,
    isValid,
    sexoActual,
    codigoPostal,
    coloniaActual,
    cpValido,
    colonias,
    cargandoCP,
    cpError,
    maxDateNacimiento,
  }
}
