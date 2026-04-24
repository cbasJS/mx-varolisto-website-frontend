"use client"

import { useState } from "react"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { apiPost, ApiError, esErrorDeConflicto, esErrorDeValidacion } from "@/lib/api"
import type { CrearSolicitudRequest, CrearSolicitudResponse } from "@varolisto/shared-schemas/api"
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso6Data,
} from "@/lib/solicitud/schemas/index"
import type { Paso5StoreData } from "@/hooks/solicitar/usePaso5"

type PasoData = Partial<
  Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5StoreData & Paso6Data
>

export type ErrorSubmit =
  | { tipo: "conflicto" }
  | { tipo: "validacion"; detalles?: Record<string, string[]> }
  | { tipo: "red" }
  | { tipo: "desconocido"; mensaje?: string }

export function useSolicitudNavigation() {
  const pasoActual = useSolicitudStore((s) => s.pasoActual)
  const setPaso = useSolicitudStore((s) => s.setPaso)
  const guardarPaso = useSolicitudStore((s) => s.guardarPaso)
  const datos = useSolicitudStore((s) => s.datos)
  const hasHydrated = useSolicitudStore((s) => s._hasHydrated)
  const sessionUuid = useSolicitudStore((s) => s.sessionUuid)
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos)
  const resetForm = useSolicitudStore((s) => s.resetForm)

  const [folio, setFolio] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState<ErrorSubmit | null>(null)

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const handleNext = (paso: number, nuevos: PasoData) => {
    guardarPaso(paso, nuevos)
    setPaso(paso + 1)
    scrollTop()
  }

  const handleBack = () => {
    setPaso(pasoActual - 1)
    scrollTop()
  }

  const handleEditarPaso = (paso: number) => {
    setPaso(paso)
    scrollTop()
  }

  const limpiarErrorSubmit = () => setErrorSubmit(null)

  const handleConflictoConfirmado = () => {
    // 409: limpiar store y error. El usuario arranca desde cero.
    resetForm()
    setErrorSubmit(null)
  }

  const handleSubmit = async (paso6Data: Paso6Data) => {
    if (!sessionUuid) return
    if (enviando) return

    guardarPaso(6, paso6Data)
    setEnviando(true)
    setErrorSubmit(null)

    const payload: CrearSolicitudRequest = {
      // Paso 1 — datos personales
      nombre: datos.nombre ?? "",
      apellidoPaterno: datos.apellidoPaterno ?? "",
      apellidoMaterno: datos.apellidoMaterno ?? "",
      sexo: datos.sexo!,
      fechaNacimiento: datos.fechaNacimiento ?? "",
      curp: datos.curp ?? "",
      email: datos.email ?? "",
      rfc: datos.rfc,
      telefono: datos.telefono ?? "",
      codigoPostal: datos.codigoPostal ?? "",
      colonia: datos.colonia ?? "",
      municipio: datos.municipio ?? "",
      calle: datos.calle ?? "",
      numeroExterior: datos.numeroExterior ?? "",
      numeroInterior: datos.numeroInterior,
      // Paso 2 — solicitud
      montoSolicitado: datos.montoSolicitado!,
      plazoMeses: datos.plazoMeses!,
      primerCredito: datos.primerCredito!,
      destinoPrestamo: datos.destinoPrestamo!,
      destinoOtro: datos.destinoOtro,
      // Paso 3 — situación económica
      tipoActividad: datos.tipoActividad!,
      nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? "",
      antiguedad: datos.antiguedad!,
      ingresoMensual: datos.ingresoMensual!,
      tieneDeudas: datos.tieneDeudas!,
      cantidadDeudas: datos.cantidadDeudas,
      montoTotalDeudas: datos.montoTotalDeudas,
      pagoMensualDeudas: datos.pagoMensualDeudas,
      // Paso 4 — referencias
      ref1Nombre: datos.ref1Nombre ?? "",
      ref1Telefono: datos.ref1Telefono ?? "",
      ref1Relacion: datos.ref1Relacion!,
      ref1Email: datos.ref1Email,
      ref2Nombre: datos.ref2Nombre ?? "",
      ref2Telefono: datos.ref2Telefono ?? "",
      ref2Relacion: datos.ref2Relacion!,
      ref2Email: datos.ref2Email,
      // Paso 5 — documentos y CLABE
      sessionUuid,
      archivosDeclarados: archivosSubidos.map((a) => ({
        tipoArchivo: a.tipoArchivo,
        nombreOriginal: a.nombreOriginal,
        mimeType: a.mimeType,
        tamanoBytes: a.tamanoBytes,
      })),
      clabe: datos.clabe ?? "",
      // Paso 6 — consentimientos
      aceptaPrivacidad: paso6Data.aceptaPrivacidad,
      aceptaTerminos: paso6Data.aceptaTerminos,
    }

    try {
      const response = await apiPost<CrearSolicitudRequest, CrearSolicitudResponse>(
        "/api/solicitudes",
        payload,
        { timeoutMs: 30_000 }
      )
      // 201: limpiar store y mostrar pantalla de éxito
      resetForm()
      setFolio(response.folio)
      scrollTop()
    } catch (err) {
      if (esErrorDeConflicto(err)) {
        // 409: el modal maneja el resetForm() al confirmar
        setErrorSubmit({ tipo: "conflicto" })
      } else if (esErrorDeValidacion(err)) {
        // 422: mantener store intacto
        setErrorSubmit({
          tipo: "validacion",
          detalles: (err as ApiError).detalles,
        })
      } else if (err instanceof ApiError && err.status === 0) {
        // red / timeout: mantener store intacto
        setErrorSubmit({ tipo: "red" })
      } else {
        // 500+: mantener store intacto
        const mensaje = err instanceof ApiError ? err.mensaje : undefined
        setErrorSubmit({ tipo: "desconocido", mensaje })
      }
    } finally {
      setEnviando(false)
    }
  }

  return {
    pasoActual,
    folio,
    hasHydrated,
    datos,
    enviando,
    errorSubmit,
    limpiarErrorSubmit,
    handleConflictoConfirmado,
    handleNext,
    handleBack,
    handleEditarPaso,
    handleSubmit,
  }
}
