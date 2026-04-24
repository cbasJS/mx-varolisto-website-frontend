"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDropzone } from "react-dropzone"
import { z } from "zod"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { validateClabe, getBancoFromClabe } from "@varolisto/shared-schemas/validators"
import { useAutoSave } from "./useAutoSave"
import { useUploadArchivo } from "./useUploadArchivo"
export type { EstadoUpload } from "./useUploadArchivo"
import {
  COPY_DOCUMENTOS,
  TIPOS_SIN_BANCO,
  COPY_ALTERNATIVOS,
} from "@/lib/solicitud/utils/lookup-labels"

// Schema RHF del Paso 5: solo los inputs que el usuario toca directamente.
// sessionUuid y archivosDeclarados viven en el store global, no en el formulario.
const paso5FormSchema = z.object({
  clabe: z.string().regex(/^\d{18}$/, "CLABE inválida — debe tener 18 dígitos"),
})

type Paso5FormData = z.infer<typeof paso5FormSchema>

export interface Paso5StoreData {
  clabe: string
}

export function usePaso5(onNext: (datos: Paso5StoreData) => void) {
  const datos = useSolicitudStore((s) => s.datos)
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)

  const [clabeValida, setClabeValida] = useState<boolean | null>(null)
  const [nombreBanco, setNombreBanco] = useState("")
  const [sinEstadosCuenta, setSinEstadosCuenta] = useState(false)
  const [duplicadosOmitidos, setDuplicadosOmitidos] = useState(0)

  const {
    entradas,
    agregarArchivos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
  } = useUploadArchivo()

  const copyDocumentos =
    COPY_DOCUMENTOS[datos.tipoActividad ?? ""] ??
    "Al menos 2 documentos que muestren tus ingresos de los últimos 3 meses."

  const puedeOmitirBanco = (TIPOS_SIN_BANCO as readonly string[]).includes(
    datos.tipoActividad ?? ""
  )
  const copyAlternativo = COPY_ALTERNATIVOS[datos.tipoActividad ?? ""] ?? ""

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid: clabeIsValid },
  } = useForm<Paso5FormData>({
    resolver: zodResolver(paso5FormSchema),
    defaultValues: { clabe: datos.clabe ?? "" },
  })

  // Puede avanzar: CLABE válida + ≥1 archivo subido exitosamente + ninguno en vuelo
  const puedeAvanzar =
    clabeIsValid && archivosSubidos.length >= 2 && !hayEnVuelo

  // Máximo 5 archivos en total (subidos + en progreso)
  const totalArchivos = archivosSubidos.length + entradas.filter(
    (e) => e.estado === "pending" || e.estado === "uploading"
  ).length

  const onDrop = useCallback(
    (accepted: File[]) => {
      const yaPresentes = new Set([
        ...archivosSubidos.map((a) => a.nombreOriginal),
        ...entradas.map((e) => e.file.name),
      ])
      const sinDuplicados = accepted.filter((f) => !yaPresentes.has(f.name))
      const omitidos = accepted.length - sinDuplicados.length

      setDuplicadosOmitidos(omitidos)
      if (sinDuplicados.length === 0) return

      const cupo = 5 - totalArchivos
      if (cupo <= 0) return

      agregarArchivos(sinDuplicados.slice(0, cupo))
    },
    [archivosSubidos, entradas, totalArchivos, agregarArchivos]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
    disabled: totalArchivos >= 5,
  })

  useEffect(() => {
    const clabe = datos.clabe ?? ""
    if (/^\d{18}$/.test(clabe)) {
      const valida = validateClabe(clabe)
      setClabeValida(valida)
      setNombreBanco(valida ? getBancoFromClabe(clabe) : "")
    }
  }, [datos.clabe])

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
    handleSubmit: handleSubmit((data) => onNext({ clabe: data.clabe })),
    errors,
    puedeAvanzar,
    entradas,
    archivosSubidos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    totalArchivos,
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
    handleClabeChange,
    handleClabePaste,
    clabeValue,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
  }
}
