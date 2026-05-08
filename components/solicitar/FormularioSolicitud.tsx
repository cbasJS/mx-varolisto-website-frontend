'use client'

import { useEffect } from 'react'
import { useSolicitudNavigation } from '@/hooks/solicitar/useSolicitudNavigation'
import { useBeforeUnloadCleanup } from '@/hooks/solicitar/useBeforeUnloadCleanup'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { pasos } from '@/content/solicitar'
import BarraPasos from '@/components/wizard/BarraPasos'
import PantallaExito from './PantallaExito'
import { FormSkeleton } from '@/components/forms/FormSkeleton'
import Paso1Prestamo from './pasos/Paso1Prestamo'
import Paso2Identidad from './pasos/Paso2Identidad'
import Paso3Domicilio from './pasos/paso3/Paso3Domicilio'
import Paso4Economia from './pasos/paso4/Paso4Economia'
import Paso5Referencias from './pasos/paso5/Paso5Referencias'
import Paso6Documentos from './pasos/paso6/Paso6Documentos'
import Paso7Revision from './pasos/paso7/Paso7Revision'
import { ResumenSolicitud } from './ResumenSolicitud'
import { calcularCuota } from '@/lib/solicitud/utils/calcularCuota'

interface StepperStripProps {
  pasoActual: number
}

function StepperStrip({ pasoActual }: StepperStripProps) {
  // Franja blanca que cubre desde el top de la página (debajo del Navbar fijo)
  // hasta el final del stepper. El pt-[72px] = NAVBAR_HEIGHT.
  return (
    <div data-testid="stepper-strip" className="bg-white pt-[72px]">
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-3 md:py-6">
          <BarraPasos pasoActual={pasoActual} pasos={pasos} />
        </div>
      </div>
    </div>
  )
}

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
      <>
        <StepperStrip pasoActual={1} />
        <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 md:p-10">
              <FormSkeleton />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <StepperStrip pasoActual={pasoActual} />

      <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        {pasoActual === 1 ? (
          <Paso1Prestamo onNext={(d) => handleNext(1, d)} />
        ) : (
          <>
            {datos.montoSolicitado != null && datos.plazoMeses != null && (
              <ResumenSolicitud
                monto={datos.montoSolicitado}
                plazoMeses={datos.plazoMeses}
                cuota={calcularCuota(datos.montoSolicitado, parseInt(datos.plazoMeses, 10))}
                onCambiar={() => handleEditarPaso(1)}
              />
            )}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-6 md:p-10">
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
          </>
        )}
      </div>
    </>
  )
}
