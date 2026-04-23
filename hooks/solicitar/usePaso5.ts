"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDropzone } from "react-dropzone"
import { paso5Schema, type Paso5Data } from "@/lib/solicitud/schemas/index"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { validateClabe, getBancoFromClabe } from "@varolisto/shared-schemas/validators"
import { useAutoSave } from "./useAutoSave"
import {
  COPY_DOCUMENTOS,
  TIPOS_SIN_BANCO,
  COPY_ALTERNATIVOS,
} from "@/lib/solicitud/utils/lookup-labels"

export function usePaso5(onNext: (datos: Paso5Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)
  const comprobantesStore = useSolicitudStore((s) => s.comprobantes)
  const setComprobantes = useSolicitudStore((s) => s.setComprobantes)

  const [archivos, setArchivos] = useState<File[]>(comprobantesStore)
  const [clabeValida, setClabeValida] = useState<boolean | null>(null)
  const [nombreBanco, setNombreBanco] = useState("")
  const [sinEstadosCuenta, setSinEstadosCuenta] = useState(false)
  const [duplicadosOmitidos, setDuplicadosOmitidos] = useState(0)

  const copyDocumentos =
    COPY_DOCUMENTOS[datos.tipoActividad ?? ""] ??
    "Al menos 2 documentos que muestren tus ingresos de los últimos 3 meses."

  const puedeOmitirBanco = (TIPOS_SIN_BANCO as readonly string[]).includes(datos.tipoActividad ?? "")
  const copyAlternativo = COPY_ALTERNATIVOS[datos.tipoActividad ?? ""] ?? ""

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } =
    useForm<Paso5Data>({
      resolver: zodResolver(paso5Schema),
      defaultValues: { comprobantes: comprobantesStore.map(f => f.name), clabe: datos.clabe ?? "" },
    })

  const onDrop = useCallback(
    (accepted: File[]) => {
      const existingKeys = new Set(archivos.map((f) => `${f.name}-${f.size}`))
      const sinDuplicados = accepted.filter((f) => !existingKeys.has(`${f.name}-${f.size}`))
      const omitidos = accepted.length - sinDuplicados.length

      setDuplicadosOmitidos(omitidos)

      if (sinDuplicados.length === 0) return

      const nuevos = [...archivos, ...sinDuplicados].slice(0, 5)
      setArchivos(nuevos)
      setComprobantes(nuevos)
      setValue("comprobantes", nuevos.map(f => f.name), { shouldValidate: true })
    },
    [archivos, setComprobantes, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  useEffect(() => {
    const clabe = datos.clabe ?? ""
    if (/^\d{18}$/.test(clabe)) {
      const valida = validateClabe(clabe)
      setClabeValida(valida)
      setNombreBanco(valida ? getBancoFromClabe(clabe) : "")
    }
  }, [datos.clabe])

  const eliminarArchivo = (index: number) => {
    const nuevos = archivos.filter((_, i) => i !== index)
    setArchivos(nuevos)
    setComprobantes(nuevos)
    setValue("comprobantes", nuevos.map(f => f.name), { shouldValidate: true })
  }

  const handleClabeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 18)
    setValue("clabe", val, { shouldValidate: val.length === 18 })
    if (val.length === 18) {
      const valida = validateClabe(val)
      setClabeValida(valida)
      setNombreBanco(valida ? getBancoFromClabe(val) : "")
    } else {
      setClabeValida(null)
      setNombreBanco("")
    }
  }

  const handleClabePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const val = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 18)
    setValue("clabe", val, { shouldValidate: val.length === 18 })
    if (val.length === 18) {
      const valida = validateClabe(val)
      setClabeValida(valida)
      setNombreBanco(valida ? getBancoFromClabe(val) : "")
    } else {
      setClabeValida(null)
      setNombreBanco("")
    }
  }

  useAutoSave(watch, 5)

  const clabeValue = watch("clabe") ?? ""

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    setValue,
    errors,
    isValid,
    archivos,
    clabeValida,
    nombreBanco,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    getRootProps,
    getInputProps,
    isDragActive,
    eliminarArchivo,
    handleClabeChange,
    handleClabePaste,
    clabeValue,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
  }
}
