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
  Paso5Data,
  Paso7Data,
} from "@/lib/solicitud/schemas/index"
import type { Paso6StoreData } from "@/hooks/solicitar/usePaso6"

type PasoData = Partial<
  Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso6StoreData & Paso7Data
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
  const tipoIdentificacion = useSolicitudStore((s) => s.tipoIdentificacion)
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
    resetForm()
    setErrorSubmit(null)
  }

  const handleSubmit = async (paso7Data: Paso7Data) => {
    if (!sessionUuid) return
    if (enviando) return

    guardarPaso(7, paso7Data)
    setEnviando(true)
    setErrorSubmit(null)

    const payload: CrearSolicitudRequest = {
      // Paso 2 (UI) — identidad (schema paso1)
      nombre: datos.nombre ?? "",
      apellidoPaterno: datos.apellidoPaterno ?? "",
      apellidoMaterno: datos.apellidoMaterno ?? "",
      sexo: datos.sexo!,
      fechaNacimiento: datos.fechaNacimiento ?? "",
      curp: datos.curp ?? "",
      email: datos.email ?? "",
      rfc: datos.rfc,
      telefono: datos.telefono ?? "",
      // Paso 3 (UI) — domicilio (schema paso3)
      codigoPostal: datos.codigoPostal ?? "",
      colonia: datos.colonia ?? "",
      municipio: datos.municipio ?? "",
      estado: datos.estado ?? "",
      ciudad: datos.ciudad ?? undefined,
      calle: datos.calle ?? "",
      numeroExterior: datos.numeroExterior ?? "",
      numeroInterior: datos.numeroInterior,
      aniosViviendo: datos.aniosViviendo!,
      tipoVivienda: datos.tipoVivienda!,
      // Paso 1 (UI) — préstamo (schema paso2)
      montoSolicitado: datos.montoSolicitado!,
      plazoMeses: datos.plazoMeses!,
      destinoPrestamo: datos.destinoPrestamo!,
      // Paso 4 (UI) — economía (schema paso4)
      tipoActividad: datos.tipoActividad!,
      nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? "",
      antiguedad: datos.antiguedad!,
      estadoCivil: datos.estadoCivil!,
      dependientesEconomicos: datos.dependientesEconomicos!,
      ingresoMensual: datos.ingresoMensual!,
      tieneDeudas: datos.tieneDeudas!,
      cantidadDeudas: datos.cantidadDeudas,
      montoTotalDeudas: datos.montoTotalDeudas,
      pagoMensualDeudas: datos.pagoMensualDeudas,
      // Paso 5 (UI) — referencias (schema paso5)
      ref1Nombre: datos.ref1Nombre ?? "",
      ref1Telefono: datos.ref1Telefono ?? "",
      ref1Relacion: datos.ref1Relacion!,
      ref1Email: datos.ref1Email,
      ref2Nombre: datos.ref2Nombre ?? "",
      ref2Telefono: datos.ref2Telefono ?? "",
      ref2Relacion: datos.ref2Relacion!,
      ref2Email: datos.ref2Email,
      // Paso 6 (UI) — documentos (schema paso6)
      sessionUuid,
      tipoIdentificacion: tipoIdentificacion!,
      archivosDeclarados: archivosSubidos.map((a) => ({
        tipoArchivo: a.tipoArchivo,
        nombreOriginal: a.nombreOriginal,
        mimeType: a.mimeType,
        tamanoBytes: a.tamanoBytes,
      })),
      // Paso 7 (UI) — consentimientos (schema paso7)
      aceptaPrivacidad: paso7Data.aceptaPrivacidad,
      aceptaTerminos: paso7Data.aceptaTerminos,
    }

    try {
      const response = await apiPost<CrearSolicitudRequest, CrearSolicitudResponse>(
        "/api/solicitudes",
        payload,
        { timeoutMs: 30_000 }
      )
      resetForm()
      setFolio(response.folio)
      scrollTop()
    } catch (err) {
      if (esErrorDeConflicto(err)) {
        setErrorSubmit({ tipo: "conflicto" })
      } else if (esErrorDeValidacion(err)) {
        setErrorSubmit({
          tipo: "validacion",
          detalles: (err as ApiError).detalles,
        })
      } else if (err instanceof ApiError && err.status === 0) {
        setErrorSubmit({ tipo: "red" })
      } else {
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
