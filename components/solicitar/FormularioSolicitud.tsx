'use client'

import { useEffect } from 'react'
import { useSolicitudNavigation } from '@/hooks/solicitar/useSolicitudNavigation'
import { useBeforeUnloadCleanup } from '@/hooks/solicitar/useBeforeUnloadCleanup'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { trustBadges } from '@/content/solicitar'
import BarraPasos from './BarraPasos'
import PantallaExito from './PantallaExito'
import { FormSkeleton } from './FormSkeleton'
import Paso1Prestamo from './pasos/Paso1Prestamo'
import Paso2Identidad from './pasos/Paso2Identidad'
import Paso3Domicilio from './pasos/paso3/Paso3Domicilio'
import Paso4Economia from './pasos/paso4/Paso4Economia'
import Paso5Referencias from './pasos/paso5/Paso5Referencias'
import Paso6Documentos from './pasos/paso6/Paso6Documentos'
import Paso7Revision from './pasos/paso7/Paso7Revision'

export default function FormularioSolicitud() {
  const inicializarSession = useSolicitudStore((s) => s.inicializarSession)

  useEffect(() => {
    inicializarSession()
  }, [inicializarSession])

  const {
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
  } = useSolicitudNavigation()

  useBeforeUnloadCleanup(enviando)

  if (folio) {
    return <PantallaExito folio={folio} telefono={datos.telefono} />
  }

  if (!hasHydrated) {
    return (
      <div>
        <BarraPasos pasoActual={1} />
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
      <BarraPasos pasoActual={pasoActual} />

      <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/10 border-t-4 border-t-secondary">
        <div className="p-6 md:p-10">
          {pasoActual === 1 && <Paso1Prestamo onNext={(d) => handleNext(1, d)} />}
          {pasoActual === 2 && (
            <Paso2Identidad onNext={(d) => handleNext(2, d)} onBack={handleBack} />
          )}
          {pasoActual === 3 && (
            <Paso3Domicilio onNext={(d) => handleNext(3, d)} onBack={handleBack} />
          )}
          {pasoActual === 4 && (
            <Paso4Economia onNext={(d) => handleNext(4, d)} onBack={handleBack} />
          )}
          {pasoActual === 5 && (
            <Paso5Referencias onNext={(d) => handleNext(5, d)} onBack={handleBack} />
          )}
          {pasoActual === 6 && (
            <Paso6Documentos onNext={(d) => handleNext(6, d)} onBack={handleBack} />
          )}
          {pasoActual === 7 && (
            <Paso7Revision
              onSubmit={handleSubmit}
              onBack={handleBack}
              onEditarPaso={handleEditarPaso}
              enviando={enviando}
              errorSubmit={errorSubmit}
              onLimpiarError={limpiarErrorSubmit}
              onConflictoConfirmado={handleConflictoConfirmado}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-center">
        {trustBadges.map(({ icono, texto }) => (
          <div key={texto} className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary/30" aria-hidden>
              {icono}
            </span>
            <span className="text-xs text-primary/40">{texto}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
