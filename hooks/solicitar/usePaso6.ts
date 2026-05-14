'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { useUploadArchivo } from './useUploadArchivo'
export type { EstadoUpload } from './useUploadArchivo'
import type { TipoArchivo, TipoIdentificacion } from '@varolisto/shared-schemas/enums'
import { ACCEPTED_MIME_TYPES } from '@varolisto/shared-schemas/form'
import {
  COPY_DOCUMENTOS,
  MIN_COMPROBANTES,
  TIPOS_SIN_BANCO,
  COPY_ALTERNATIVOS,
} from '@/lib/solicitud/utils/lookup-labels'
import {
  MAX_COMPROBANTES_INGRESO,
  MAX_SIZE_IMAGEN_BYTES,
} from '@/lib/solicitud/domain/solicitud/documentosConfig'
import {
  validarTamanoPorTipo,
  mapDropzoneError,
} from '@/lib/solicitud/domain/solicitud/dropzoneValidation'
import type { DialogoErroresArchivoItem } from '@/components/solicitar/pasos/paso6/DialogoErroresArchivo'
import type { WarningArchivoItem } from '@/components/solicitar/pasos/paso6/AvisoWarningsArchivo'

const dropzoneAccept = Object.fromEntries(ACCEPTED_MIME_TYPES.map((mime) => [mime, [] as string[]]))

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
  const [dialogoErrores, setDialogoErrores] = useState<{
    open: boolean
    items: DialogoErroresArchivoItem[]
  } | null>(null)
  const [warningsArchivos, setWarningsArchivos] = useState<WarningArchivoItem[]>([])

  const onDropRejected = useCallback((rejected: FileRejection[]) => {
    if (rejected.length === 0) return
    const items: DialogoErroresArchivoItem[] = rejected.map(({ file, errors }) => ({
      filename: file.name,
      reason: mapDropzoneError(errors[0]?.code ?? 'unknown'),
    }))
    setDialogoErrores({ open: true, items })
  }, [])

  const cerrarDialogoErrores = useCallback(() => setDialogoErrores(null), [])
  const descartarWarnings = useCallback(() => setWarningsArchivos([]), [])

  const {
    entradas,
    agregarArchivos,
    eliminarEntrada,
    reintentarUpload,
    hidratarEntradas,
    hayEnVuelo,
    errorEliminacion,
    setErrorEliminacion,
  } = useUploadArchivo()

  // Sincroniza archivos del store al mapa de entradas cuando ya hay archivos
  // al montar (caso: el usuario regresa al paso 6 desde otro paso dentro de
  // la misma sesión). Tras un refresh archivosSubidos siempre arranca vacío
  // por diseño: no se persiste en sessionStorage y los huérfanos del bucket
  // se limpian en beforeunload, así que no hay nada que hidratar.
  useEffect(() => {
    if (archivosSubidos.length === 0) return
    hidratarEntradas(archivosSubidos)
  }, [archivosSubidos, hidratarEntradas])

  const copyDocumentos =
    COPY_DOCUMENTOS[datos.tipoActividad ?? ''] ??
    'Sube al menos 2 comprobantes de ingresos de los últimos 3 meses.'

  const puedeOmitirBanco = (TIPOS_SIN_BANCO as readonly string[]).includes(
    datos.tipoActividad ?? '',
  )
  const copyAlternativo = COPY_ALTERNATIVOS[datos.tipoActividad ?? ''] ?? ''

  const tiposIdRequeridos: TipoArchivo[] =
    tipoIdentificacion === 'ine'
      ? ['ine_frente', 'ine_reverso']
      : tipoIdentificacion === 'pasaporte'
        ? ['pasaporte_principal']
        : []

  const minComprobantes = MIN_COMPROBANTES

  const tiposSubidos = archivosSubidos.map((a) => a.tipoArchivo)
  const idCompleta = tiposIdRequeridos.every((t) => tiposSubidos.includes(t))
  const comprobantesSubidosYa = tiposSubidos.filter((t) => t === 'comprobante_ingreso').length
  const tieneComprobante = comprobantesSubidosYa >= minComprobantes
  const tieneDomicilio = tiposSubidos.includes('comprobante_domicilio')

  const puedeAvanzar =
    !!tipoIdentificacion &&
    idCompleta &&
    tieneComprobante &&
    tieneDomicilio &&
    !hayEnVuelo &&
    !isCleaningUp

  const totalArchivos =
    archivosSubidos.length +
    entradas.filter((e) => e.estado === 'pending' || e.estado === 'uploading').length

  const comprobantesSubidos = archivosSubidos.filter(
    (a) => a.tipoArchivo === 'comprobante_ingreso',
  ).length
  const comprobantesEnVuelo = entradas.filter(
    (e) =>
      e.tipoArchivo === 'comprobante_ingreso' &&
      (e.estado === 'pending' || e.estado === 'uploading'),
  ).length
  const totalComprobantes = comprobantesSubidos + comprobantesEnVuelo

  // Cleanup al cambiar tipo de identificación — elimina del bucket los archivos del tipo anterior
  const handleChangeTipoIdentificacion = useCallback(
    async (tipo: TipoIdentificacion) => {
      if (tipo === tipoIdentificacion || isCleaningUp) return

      const tiposAEliminar =
        tipo === 'pasaporte'
          ? archivosSubidos.filter(
              (a) => a.tipoArchivo === 'ine_frente' || a.tipoArchivo === 'ine_reverso',
            )
          : archivosSubidos.filter((a) => a.tipoArchivo === 'pasaporte_principal')

      if (tiposAEliminar.length > 0) {
        setIsCleaningUp(true)
        try {
          for (const archivo of tiposAEliminar) {
            await eliminarEntrada(archivo.clienteId, 'tipo_identificacion_changed')
          }
        } finally {
          setIsCleaningUp(false)
        }
      }

      setTipoIdentificacion(tipo)
    },
    [tipoIdentificacion, isCleaningUp, archivosSubidos, eliminarEntrada, setTipoIdentificacion],
  )

  const agregarConTipo = useCallback(
    (files: File[], tipo: TipoArchivo) => {
      const yaPresentes = new Set([
        ...archivosSubidos.filter((a) => a.tipoArchivo === tipo).map((a) => a.nombreOriginal),
        ...entradas.filter((e) => e.tipoArchivo === tipo).map((e) => e.file.name),
      ])
      const sinDuplicados = files.filter((f) => !yaPresentes.has(f.name))
      const omitidos = files.length - sinDuplicados.length
      setDuplicadosOmitidos(omitidos)
      if (sinDuplicados.length === 0) return
      const cupoGlobal = 7 - totalArchivos
      const cupoTipo =
        tipo === 'comprobante_ingreso' ? MAX_COMPROBANTES_INGRESO - totalComprobantes : cupoGlobal
      const cupo = Math.min(cupoGlobal, cupoTipo)
      if (cupo <= 0) return
      agregarArchivos(sinDuplicados.slice(0, cupo), tipo)
    },
    [archivosSubidos, entradas, totalArchivos, totalComprobantes, agregarArchivos],
  )

  const ineFrenteEnVuelo = entradas.some(
    (e) => e.tipoArchivo === 'ine_frente' && (e.estado === 'pending' || e.estado === 'uploading'),
  )
  const ineReversoEnVuelo = entradas.some(
    (e) => e.tipoArchivo === 'ine_reverso' && (e.estado === 'pending' || e.estado === 'uploading'),
  )
  const pasaporteEnVuelo = entradas.some(
    (e) =>
      e.tipoArchivo === 'pasaporte_principal' &&
      (e.estado === 'pending' || e.estado === 'uploading'),
  )
  const domicilioEnVuelo = entradas.some(
    (e) =>
      e.tipoArchivo === 'comprobante_domicilio' &&
      (e.estado === 'pending' || e.estado === 'uploading'),
  )

  const disabledComprobante =
    totalComprobantes >= MAX_COMPROBANTES_INGRESO || comprobantesEnVuelo > 0
  const disabledIneFrente =
    tiposSubidos.includes('ine_frente') || ineFrenteEnVuelo || totalArchivos >= 7
  const disabledIneReverso =
    tiposSubidos.includes('ine_reverso') || ineReversoEnVuelo || totalArchivos >= 7
  const disabledPasaporte =
    tiposSubidos.includes('pasaporte_principal') || pasaporteEnVuelo || totalArchivos >= 7
  const disabledDomicilio =
    tiposSubidos.includes('comprobante_domicilio') || domicilioEnVuelo || totalArchivos >= 7

  const onDropComprobante = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, 'comprobante_ingreso'),
    [agregarConTipo],
  )
  const dropzoneComprobante = useDropzone({
    onDrop: onDropComprobante,
    onDropRejected,
    validator: validarTamanoPorTipo,
    accept: dropzoneAccept,
    maxSize: MAX_SIZE_IMAGEN_BYTES,
    maxFiles: 4,
    disabled: disabledComprobante,
  })

  const onDropIneFrente = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, 'ine_frente'),
    [agregarConTipo],
  )
  const dropzoneIneFrente = useDropzone({
    onDrop: onDropIneFrente,
    onDropRejected,
    validator: validarTamanoPorTipo,
    accept: dropzoneAccept,
    maxSize: MAX_SIZE_IMAGEN_BYTES,
    maxFiles: 1,
    disabled: disabledIneFrente,
  })

  const onDropIneReverso = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, 'ine_reverso'),
    [agregarConTipo],
  )
  const dropzoneIneReverso = useDropzone({
    onDrop: onDropIneReverso,
    onDropRejected,
    validator: validarTamanoPorTipo,
    accept: dropzoneAccept,
    maxSize: MAX_SIZE_IMAGEN_BYTES,
    maxFiles: 1,
    disabled: disabledIneReverso,
  })

  const onDropPasaporte = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, 'pasaporte_principal'),
    [agregarConTipo],
  )
  const dropzonePasaporte = useDropzone({
    onDrop: onDropPasaporte,
    onDropRejected,
    validator: validarTamanoPorTipo,
    accept: dropzoneAccept,
    maxSize: MAX_SIZE_IMAGEN_BYTES,
    maxFiles: 1,
    disabled: disabledPasaporte,
  })

  const onDropDomicilio = useCallback(
    (accepted: File[]) => agregarConTipo(accepted, 'comprobante_domicilio'),
    [agregarConTipo],
  )
  const dropzoneDomicilio = useDropzone({
    onDrop: onDropDomicilio,
    onDropRejected,
    validator: validarTamanoPorTipo,
    accept: dropzoneAccept,
    maxSize: MAX_SIZE_IMAGEN_BYTES,
    maxFiles: 1,
    disabled: disabledDomicilio,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!puedeAvanzar || !tipoIdentificacion) return
    onNext({ tipoIdentificacion })
  }

  const entradasComprobante = entradas.filter((e) => e.tipoArchivo === 'comprobante_ingreso')
  const entradasIne = entradas.filter(
    (e) => e.tipoArchivo === 'ine_frente' || e.tipoArchivo === 'ine_reverso',
  )
  const entradasPasaporte = entradas.filter((e) => e.tipoArchivo === 'pasaporte_principal')
  const entradasDomicilio = entradas.filter((e) => e.tipoArchivo === 'comprobante_domicilio')

  return {
    tipoIdentificacion,
    handleChangeTipoIdentificacion,
    isCleaningUp,
    entradas,
    entradasComprobante,
    entradasIne,
    entradasPasaporte,
    entradasDomicilio,
    archivosSubidos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    totalArchivos,
    puedeAvanzar,
    idCompleta,
    tieneComprobante,
    tieneDomicilio,
    minComprobantes,
    comprobantesSubidosYa,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    dropzoneComprobante: {
      ...dropzoneComprobante,
      isDisabled: disabledComprobante,
      onDropRejected,
    },
    dropzoneIneFrente: {
      ...dropzoneIneFrente,
      isDisabled: disabledIneFrente,
      onDropRejected,
    },
    dropzoneIneReverso: {
      ...dropzoneIneReverso,
      isDisabled: disabledIneReverso,
      onDropRejected,
    },
    dropzonePasaporte: {
      ...dropzonePasaporte,
      isDisabled: disabledPasaporte,
      onDropRejected,
    },
    dropzoneDomicilio: {
      ...dropzoneDomicilio,
      isDisabled: disabledDomicilio,
      onDropRejected,
    },
    tiposSubidos,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
    errorEliminacion,
    setErrorEliminacion,
    dialogoErrores,
    cerrarDialogoErrores,
    warningsArchivos,
    descartarWarnings,
    handleSubmit,
  }
}
