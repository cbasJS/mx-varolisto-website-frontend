'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSolicitudNavigation } from '@/hooks/solicitar/useSolicitudNavigation'
import { useBeforeUnloadCleanup } from '@/hooks/solicitar/useBeforeUnloadCleanup'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { pasoSlideVariants, pasoTransition } from '@/lib/animations'
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
import { FormCard } from '@/components/wizard/FormCard'

interface StepperStripProps {
  pasoActual: number
}

function StepperStrip({ pasoActual }: StepperStripProps) {
  // Franja blanca que cubre desde el top de la página (debajo del Navbar fijo)
  // hasta el final del stepper. El pt-[72px] = NAVBAR_HEIGHT.
  // Paso 1 (calculadora) y paso 7 (revisión) son landings → no renderizan
  // stepper. El strip queda como pad blanco detrás del Navbar transparente.
  const showStepper = pasoActual > 1 && pasoActual < 7
  return (
    <div data-testid="stepper-strip" className="bg-white pt-[72px]">
      {showStepper && (
        <div className="border-b border-gray-200">
          <div className="mx-auto max-w-4xl px-4 py-3 md:py-6">
            <BarraPasos pasoActual={pasoActual} pasos={pasos} />
          </div>
        </div>
      )}
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
    direction,
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

  // Slot estático donde los pasos 2-6 portalizan sus FormActions: vive afuera
  // del card animado, así los botones no transicionan junto al inner content.
  const [actionsSlot, setActionsSlot] = useState<HTMLDivElement | null>(null)

  if (folio) {
    return (
      <>
        <StepperStrip pasoActual={1} />
        <PantallaExito folio={folio} telefono={datos.telefono} />
      </>
    )
  }

  if (!hasHydrated) {
    return (
      <>
        <StepperStrip pasoActual={1} />
        <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
          <FormCard>
            <FormSkeleton />
          </FormCard>
        </div>
      </>
    )
  }

  const showResumen =
    pasoActual >= 2 && pasoActual <= 6 && datos.montoSolicitado != null && datos.plazoMeses != null
  const showChrome = pasoActual >= 2 && pasoActual <= 6

  // Sólo el motion.div anima — el chrome (FormCard) y el slot de FormActions
  // viven afuera del AnimatePresence en el orquestador, así sólo los hijos del
  // chrome (el inner content del paso) transicionan.
  const animatedSlot = (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pasoActual}
        data-testid="paso-motion-wrapper"
        data-paso={pasoActual}
        custom={direction}
        variants={pasoSlideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pasoTransition}
      >
        {pasoActual === 1 && <Paso1Prestamo onNext={(d) => handleNext(1, d)} />}
        {pasoActual === 2 && (
          <Paso2Identidad
            onNext={(d) => handleNext(2, d)}
            onBack={handleBack}
            actionsSlot={actionsSlot}
          />
        )}
        {pasoActual === 3 && (
          <Paso3Domicilio
            onNext={(d) => handleNext(3, d)}
            onBack={handleBack}
            actionsSlot={actionsSlot}
          />
        )}
        {pasoActual === 4 && (
          <Paso4Economia
            onNext={(d) => handleNext(4, d)}
            onBack={handleBack}
            actionsSlot={actionsSlot}
          />
        )}
        {pasoActual === 5 && (
          <Paso5Referencias
            onNext={(d) => handleNext(5, d)}
            onBack={handleBack}
            actionsSlot={actionsSlot}
          />
        )}
        {pasoActual === 6 && (
          <Paso6Documentos
            onNext={(d) => handleNext(6, d)}
            onBack={handleBack}
            actionsSlot={actionsSlot}
          />
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
      </motion.div>
    </AnimatePresence>
  )

  return (
    <>
      <StepperStrip pasoActual={pasoActual} />

      <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        {/* Resumen — estático, fuera del AnimatePresence */}
        {showResumen && (
          <ResumenSolicitud
            monto={datos.montoSolicitado!}
            plazoMeses={datos.plazoMeses!}
            cuota={calcularCuota(datos.montoSolicitado!, parseInt(datos.plazoMeses!, 10))}
            onCambiar={() => handleEditarPaso(1)}
          />
        )}

        {/* Chrome wrapper — siempre presente para que el AnimatePresence
            mantenga una posición estable en el árbol y el exit/enter
            funcionen al cruzar la frontera paso 1↔2 y 6↔7. Las clases de
            chrome (rounded, border, bg) sólo aplican en pasos 2-6. */}
        <div
          data-testid={showChrome ? 'form-card' : undefined}
          className={
            showChrome
              ? 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'
              : 'overflow-hidden'
          }
        >
          <div className={showChrome ? 'overflow-hidden p-6' : 'overflow-hidden'}>
            {animatedSlot}
          </div>
        </div>

        {/* Slot estático para FormActions de los pasos 2-6 (portal). Vive
            afuera del chrome para que los botones no transicionen. */}
        <div ref={setActionsSlot} />
      </div>
    </>
  )
}
