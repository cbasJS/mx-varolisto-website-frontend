"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { useUploadArchivo } from "./useUploadArchivo"
export type { EstadoUpload } from "./useUploadArchivo"
import type { TipoArchivo, TipoIdentificacion } from "@varolisto/shared-schemas/enums"
import {
  COPY_DOCUMENTOS,
  MIN_COMPROBANTES,
  TIPOS_SIN_BANCO,
  COPY_ALTERNATIVOS,
} from "@/lib/solicitud/utils/lookup-labels"

export interface Paso6StoreData {
  tipoIdentificacion: TipoIdentificacion
}

export function usePaso6(onNext: (datos: Paso6StoreData) => void) {
  const datos = useSolicitudStore((s) => s.datos)
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const tipoIdentificacion = useSolicitudStore((s) => s.tipoIdentificacion)
  const setTipoIdentificacion = useSolicitudStore((s) => s.setTipoIdentificacion)

  const [sinEstadosCuenta, setSinEstadosCuenta] = useState(false)
  const [duplicadosOmitidos, setDuplicadosOmitidos] = useState(0)
  const [isCleaningUp, setIsCleaningUp] = useState(false)

  const {
    entradas,
    agregarArchivos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    errorEliminacion,
    setErrorEliminacion,
  } = useUploadArchivo()

  const copyDocumentos =
    COPY_DOCUMENTOS[datos.tipoActividad ?? ""] ??
    "Sube al menos 2 comprobantes de ingresos de los últimos 3 meses."

  const puedeOmitirBanco = (TIPOS_SIN_BANCO as readonly string[]).includes(
    datos.tipoActividad ?? ""
  )
  const copyAlternativo = COPY_ALTERNATIVOS[datos.tipoActividad ?? ""] ?? ""

  const tiposIdRequeridos: TipoArchivo[] =
    tipoIdentificacion === "ine"
      ? ["ine_frente", "ine_reverso"]
      : tipoIdentificacion === "pasaporte"
        ? ["pasaporte_principal"]
        : []

  const minComprobantes = MIN_COMPROBANTES[datos.tipoActividad ?? ""] ?? 2

  const tiposSubidos = archivosSubidos.map((a) => a.tipoArchivo)
  const idCompleta = tiposIdRequeridos.every((t) => tiposSubidos.includes(t))
  const comprobantesSubidosYa = tiposSubidos.filter((t) => t === "comprobante_ingreso").length
  const tieneComprobante = comprobantesSubidosYa >= minComprobantes

  const puedeAvanzar =
    !!tipoIdentificacion && idCompleta && tieneComprobante && !hayEnVuelo && !isCleaningUp

  const totalArchivos = archivosSubidos.length + entradas.filter(
    (e) => e.estado === "pending" || e.estado === "uploading"
  ).length

  const MAX_COMPROBANTES = 3
  const comprobantesSubidos = archivosSubidos.filter(
    (a) => a.tipoArchivo === "comprobante_ingreso"
  ).length
  const comprobantesEnVuelo = entradas.filter(
    (e) =>
      e.tipoArchivo === "comprobante_ingreso" &&
      (e.estado === "pending" || e.estado === "uploading")
  ).length
  const totalComprobantes = comprobantesSubidos + comprobantesEnVuelo

  // Cleanup al cambiar tipo de identificación — elimina del bucket los archivos del tipo anterior
  const handleChangeTipoIdentificacion = useCallback(
    async (tipo: TipoIdentificacion) => {
      if (tipo === tipoIdentificacion || isCleaningUp) return

      const tiposAEliminar =
        tipo === "pasaporte"
          ? archivosSubidos.filter(
              (a) => a.tipoArchivo === "ine_frente" || a.tipoArchivo === "ine_reverso"
            )
          : archivosSubidos.filter((a) => a.tipoArchivo === "pasaporte_principal")

      if (tiposAEliminar.length > 0) {
        setIsCleaningUp(true)
        try {
          for (const archivo of tiposAEliminar) {
            await eliminarEntrada(archivo.clienteId, "tipo_identificacion_changed")
          }
        } finally {
          setIsCleaningUp(false)
        }
      }

      setTipoIdentificacion(tipo)
    },
    [tipoIdentificacion, isCleaningUp, archivosSubidos, eliminarEntrada, setTipoIdentificacion]
  )

  const agregarConTipo = useCallback(
    (files: File[], tipo: TipoArchivo) => {
      const yaPresentes = new Set([
        ...archivosSubidos.map((a) => a.nombreOriginal),
        ...entradas.map((e) => e.file.name),
      ])
      const sinDuplicados = files.filter((f) => !yaPresentes.has(f.name))
      const omitidos = files.length - sinDuplicados.length
      setDuplicadosOmitidos(omitidos)
      if (sinDuplicados.length === 0) return
      const cupoGlobal = 7 - totalArchivos
      const cupoTipo =
        tipo === "comprobante_ingreso" ? MAX_COMPROBANTES - totalComprobantes : cupoGlobal
      const cupo = Math.min(cupoGlobal, cupoTipo)
      if (cupo <= 0) return
      agregarArchivos(sinDuplicados.slice(0, cupo), tipo)
    },
    [archivosSubidos, entradas, totalArchivos, totalComprobantes, agregarArchivos]
  )

  const disabledComprobante = totalComprobantes >= MAX_COMPROBANTES
  const disabledIneFrente = tiposSubidos.includes("ine_frente") || totalArchivos >= 7
  const disabledIneReverso = tiposSubidos.includes("ine_reverso") || totalArchivos >= 7
  const disabledPasaporte = tiposSubidos.includes("pasaporte_principal") || totalArchivos >= 7

  const onDropComprobante = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, "comprobante_ingreso"),
    [agregarConTipo]
  )
  const dropzoneComprobante = useDropzone({
    onDrop: onDropComprobante,
    accept: { "image/jpeg": [], "image/png": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 4,
    disabled: disabledComprobante,
  })

  const onDropIneFrente = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, "ine_frente"),
    [agregarConTipo]
  )
  const dropzoneIneFrente = useDropzone({
    onDrop: onDropIneFrente,
    accept: { "image/jpeg": [], "image/png": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: disabledIneFrente,
  })

  const onDropIneReverso = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, "ine_reverso"),
    [agregarConTipo]
  )
  const dropzoneIneReverso = useDropzone({
    onDrop: onDropIneReverso,
    accept: { "image/jpeg": [], "image/png": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: disabledIneReverso,
  })

  const onDropPasaporte = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, "pasaporte_principal"),
    [agregarConTipo]
  )
  const dropzonePasaporte = useDropzone({
    onDrop: onDropPasaporte,
    accept: { "image/jpeg": [], "image/png": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: disabledPasaporte,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!puedeAvanzar || !tipoIdentificacion) return
    onNext({ tipoIdentificacion })
  }

  const entradasComprobante = entradas.filter((e) => e.tipoArchivo === "comprobante_ingreso")
  const entradasIne = entradas.filter(
    (e) => e.tipoArchivo === "ine_frente" || e.tipoArchivo === "ine_reverso"
  )
  const entradasPasaporte = entradas.filter((e) => e.tipoArchivo === "pasaporte_principal")

  return {
    tipoIdentificacion,
    handleChangeTipoIdentificacion,
    isCleaningUp,
    entradas,
    entradasComprobante,
    entradasIne,
    entradasPasaporte,
    archivosSubidos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    totalArchivos,
    puedeAvanzar,
    idCompleta,
    tieneComprobante,
    minComprobantes,
    comprobantesSubidosYa,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    dropzoneComprobante: { ...dropzoneComprobante, isDisabled: disabledComprobante },
    dropzoneIneFrente: { ...dropzoneIneFrente, isDisabled: disabledIneFrente },
    dropzoneIneReverso: { ...dropzoneIneReverso, isDisabled: disabledIneReverso },
    dropzonePasaporte: { ...dropzonePasaporte, isDisabled: disabledPasaporte },
    tiposSubidos,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
    errorEliminacion,
    setErrorEliminacion,
    handleSubmit,
  }
}
