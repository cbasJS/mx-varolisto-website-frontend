"use client"

import { useState } from "react"
import { useSolicitudStore } from "@/lib/solicitud/store"
import { generateFolio } from "@/lib/generar-folio"
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso6Data,
} from "@/lib/solicitud/schemas/index"

type PasoData = Partial<
  Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso6Data
>

export function useSolicitudNavigation() {
  const pasoActual = useSolicitudStore((s) => s.pasoActual)
  const setPaso = useSolicitudStore((s) => s.setPaso)
  const guardarPaso = useSolicitudStore((s) => s.guardarPaso)
  const datos = useSolicitudStore((s) => s.datos)
  const comprobantes = useSolicitudStore((s) => s.comprobantes)
  const hasHydrated = useSolicitudStore((s) => s._hasHydrated)

  const [folio, setFolio] = useState<string | null>(null)

  const handleNext = (paso: number, nuevos: PasoData) => {
    guardarPaso(paso, nuevos)
    setPaso(paso + 1)
  }

  const handleBack = () => setPaso(pasoActual - 1)

  const handleEditarPaso = (paso: number) => setPaso(paso)

  const handleSubmit = (paso6Data: Paso6Data) => {
    guardarPaso(6, paso6Data)
    const folioGenerado = generateFolio()
    const payload = {
      ...datos,
      ...paso6Data,
      comprobantes: comprobantes.map((f) => ({
        nombre: f.name,
        tamano: f.size,
        tipo: f.type,
      })),
      folio: folioGenerado,
      timestampEnvio: new Date().toISOString(),
    }
    console.log("Payload solicitud:", payload)
    setFolio(folioGenerado)
  }

  return {
    pasoActual,
    folio,
    hasHydrated,
    datos,
    handleNext,
    handleBack,
    handleEditarPaso,
    handleSubmit,
  }
}
