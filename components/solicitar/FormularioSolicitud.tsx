"use client"

import { useState } from "react"
import { useSolicitudStore } from "@/lib/solicitud-store"
import { generateFolio } from "@/lib/generar-folio"
import BarraPasos from "./BarraPasos"
import PantallaExito from "./PantallaExito"
import Paso1DatosPersonales from "./pasos/Paso1DatosPersonales"
import Paso2Solicitud from "./pasos/Paso2Solicitud"
import Paso3SituacionEconomica from "./pasos/Paso3SituacionEconomica"
import Paso4Referencias from "./pasos/Paso4Referencias"
import Paso5Documentos from "./pasos/Paso5Documentos"
import Paso6Revision from "./pasos/Paso6Revision"
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso6Data,
} from "@/lib/solicitud-schema"

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-7 w-48 rounded-xl bg-[#f0f0f0]" />
      <div className="h-4 w-72 rounded-xl bg-[#f5f5f7]" />
      <div className="grid gap-3 sm:grid-cols-3 mt-6">
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
        <div className="h-[52px] rounded-xl bg-[#f5f5f7]" />
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-11 w-32 rounded-xl bg-[#f0f0f0]" />
      </div>
    </div>
  )
}

export default function FormularioSolicitud() {
  const pasoActual = useSolicitudStore((s) => s.pasoActual)
  const setPaso = useSolicitudStore((s) => s.setPaso)
  const guardarPaso = useSolicitudStore((s) => s.guardarPaso)
  const datos = useSolicitudStore((s) => s.datos)
  const comprobantes = useSolicitudStore((s) => s.comprobantes)
  const hasHydrated = useSolicitudStore((s) => s._hasHydrated)

  const [folio, setFolio] = useState<string | null>(null)

  const handleNext = (
    paso: number,
    nuevos: Partial<
      Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso6Data
    >
  ) => {
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

  if (folio) {
    return <PantallaExito folio={folio} telefono={datos.telefono} />
  }

  if (!hasHydrated) {
    return (
      <div>
        <BarraPasos pasoActual={pasoActual} />
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/10 border-t-4 border-t-secondary">
          <div className="p-6 md:p-10">
            <FormSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stepper — vive sobre la banda navy */}
      <BarraPasos pasoActual={pasoActual} />

      {/* Tarjeta principal — borde superior verde sólido como acento */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/10 border-t-4 border-t-secondary">

        <div className="p-6 md:p-10">
          {pasoActual === 1 && (
            <Paso1DatosPersonales onNext={(d) => handleNext(1, d)} />
          )}
          {pasoActual === 2 && (
            <Paso2Solicitud onNext={(d) => handleNext(2, d)} onBack={handleBack} />
          )}
          {pasoActual === 3 && (
            <Paso3SituacionEconomica
              onNext={(d) => handleNext(3, d)}
              onBack={handleBack}
            />
          )}
          {pasoActual === 4 && (
            <Paso4Referencias onNext={(d) => handleNext(4, d)} onBack={handleBack} />
          )}
          {pasoActual === 5 && (
            <Paso5Documentos onNext={(d) => handleNext(5, d)} onBack={handleBack} />
          )}
          {pasoActual === 6 && (
            <Paso6Revision
              onSubmit={handleSubmit}
              onBack={handleBack}
              onEditarPaso={handleEditarPaso}
            />
          )}
        </div>
      </div>

      {/* Footer de confianza */}
      <div className="mt-6 flex items-center justify-center gap-6 text-center">
        {[
          { icono: "lock", texto: "Datos encriptados" },
          { icono: "verified_user", texto: "100% seguro" },
          { icono: "support_agent", texto: "Soporte en 24h" },
        ].map(({ icono, texto }) => (
          <div key={texto} className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-sm text-primary/30"
              aria-hidden
            >
              {icono}
            </span>
            <span className="text-xs text-primary/40">{texto}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
