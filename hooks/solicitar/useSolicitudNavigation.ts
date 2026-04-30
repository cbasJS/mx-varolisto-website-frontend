"use client"

import { useState, useEffect } from "react"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { useSetSubmitting } from "@/lib/solicitud/submitting-context"
import { submitSolicitud, clasificarError } from "@/lib/solicitud/application/useCases/submitSolicitud"
import { guardarYAvanzar } from "@/lib/solicitud/application/useCases/guardarPaso"
import type { ErrorSubmit } from "@/lib/solicitud/application/useCases/submitSolicitud"
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso7Data,
} from "@/lib/solicitud/schemas/index"
import type { Paso6StoreData } from "@/hooks/solicitar/usePaso6"

export type { ErrorSubmit }

type PasoData = Partial<
  Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso6StoreData & Paso7Data
>

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

  const setSubmittingContext = useSetSubmitting()

  const [folio, setFolio] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState<ErrorSubmit | null>(null)

  const setEnviandoSync = (v: boolean) => {
    setEnviando(v)
    setSubmittingContext(v)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pasoActual])

  const handleNext = (paso: number, nuevos: PasoData) => {
    guardarYAvanzar({ paso, datos: nuevos, guardarPasoFn: guardarPaso, setPasoFn: setPaso })
  }

  const handleBack = () => setPaso(pasoActual - 1)

  const handleEditarPaso = (paso: number) => setPaso(paso)

  const limpiarErrorSubmit = () => setErrorSubmit(null)

  const handleConflictoConfirmado = () => {
    resetForm()
    setErrorSubmit(null)
  }

  const handleSubmit = async (paso7Data: Paso7Data) => {
    if (!sessionUuid || enviando) return

    guardarPaso(7, paso7Data)
    setEnviandoSync(true)
    setErrorSubmit(null)

    try {
      const { folio } = await submitSolicitud({
        datos,
        sessionUuid,
        tipoIdentificacion: tipoIdentificacion!,
        archivosSubidos,
        paso7Data,
      })
      resetForm()
      setFolio(folio)
      window.scrollTo(0, 0)
    } catch (err) {
      setErrorSubmit(clasificarError(err))
    } finally {
      setEnviandoSync(false)
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
