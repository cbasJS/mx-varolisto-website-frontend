"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { paso3Schema, type Paso3Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { fetchColonias, ColoniaServiceError } from "@/lib/solicitud/infrastructure/colonias/coloniaRepository"
import { COLONIAS_STALE_TIME_MS } from "@/lib/config"
import { useAutoSave } from "./useAutoSave"
import { normalizeRegister } from "@/lib/solicitud/utils/normalizeRegister"

export function usePaso3(onNext: (datos: Paso3Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)
  const coloniasCache = useSolicitudStore((s) => s.coloniasCache)
  const setColoniasCache = useSolicitudStore((s) => s.setColoniasCache)

  const form = useForm<Paso3Data>({
    resolver: zodResolver(paso3Schema),
    mode: "onTouched",
    defaultValues: {
      codigoPostal: datos.codigoPostal ?? "",
      colonia: datos.colonia ?? "",
      municipio: datos.municipio ?? "",
      estado: datos.estado ?? "",
      ciudad: datos.ciudad ?? undefined,
      calle: datos.calle ?? "",
      numeroExterior: datos.numeroExterior ?? "",
      numeroInterior: datos.numeroInterior ?? undefined,
      aniosViviendo: datos.aniosViviendo,
      tipoVivienda: datos.tipoVivienda,
    },
  })

  const { register: _register, handleSubmit, setValue, control, watch, formState: { errors, isValid } } = form
  const register = normalizeRegister(_register)

  const codigoPostal = useWatch({ control, name: "codigoPostal" }) ?? ""
  const coloniaActual = useWatch({ control, name: "colonia" }) ?? ""
  const aniosViviendoActual = useWatch({ control, name: "aniosViviendo" })
  const tipoViviendaActual = useWatch({ control, name: "tipoVivienda" })
  const cpValido = /^\d{5}$/.test(codigoPostal)
  const codigoPostalValue = codigoPostal

  const [aniosViviendoOpen, setAniosViviendoOpen] = useState(false)
  const [tipoViviendaOpen, setTipoViviendaOpen] = useState(false)

  const {
    data: colonias,
    isLoading: cargandoCP,
    isError: cpError,
    error: cpErrorObj,
  } = useQuery({
    queryKey: ["cp", codigoPostal],
    queryFn: () => fetchColonias(codigoPostal),
    enabled: cpValido,
    retry: false,
    initialData: coloniasCache[codigoPostal],
    initialDataUpdatedAt: coloniasCache[codigoPostal] ? Date.now() : 0,
    staleTime: COLONIAS_STALE_TIME_MS,
  })

  const cpServiceError = cpErrorObj instanceof ColoniaServiceError ? cpErrorObj.message : null

  useEffect(() => {
    if (colonias && colonias.length > 0 && cpValido) {
      setColoniasCache(codigoPostal, colonias)
    }
  }, [colonias, codigoPostal, cpValido, setColoniasCache])

  const prevCpRef = useRef<string>("")

  useEffect(() => {
    if (colonias && colonias.length > 0) {
      const first = colonias[0].response
      setValue("municipio", first.municipio)
      setValue("estado", first.estado)
      setValue("ciudad", first.ciudad?.trim() || first.municipio)
      const opciones = colonias.map((c) => c.response.asentamiento)
      // Only reset colonia on CP change; preserve other fields
      if (!opciones.includes(coloniaActual) && prevCpRef.current !== "" && prevCpRef.current !== codigoPostal) {
        setValue("colonia", "")
      }
    }
    prevCpRef.current = codigoPostal
  }, [colonias, setValue, coloniaActual, codigoPostal])

  useAutoSave(watch, 3)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    setValue,
    control,
    errors,
    isValid,
    coloniaActual,
    codigoPostalValue,
    cpValido,
    colonias,
    cargandoCP,
    cpError,
    cpServiceError,
    aniosViviendoActual,
    tipoViviendaActual,
    aniosViviendoOpen,
    setAniosViviendoOpen,
    tipoViviendaOpen,
    setTipoViviendaOpen,
  }
}
