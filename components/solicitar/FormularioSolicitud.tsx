'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSolicitudNavigation } from '@/hooks/solicitar/useSolicitudNavigation'
import { useTelemetriaCapture } from '@/lib/solicitud/infrastructure/telemetria'
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
// Paso6Documentos quedó deprecado en Bloque 1 — ver components/solicitar/pasos/paso6/Paso6Documentos.tsx
import Paso7Revision from './pasos/paso7/Paso7Revision'
import { ResumenSolicitud } from './ResumenSolicitud'
import { calcularCuota } from '@/lib/solicitud/utils/calcularCuota'
import { FormCard } from '@/components/wizard/FormCard'
import { StickyMobileCTA } from '@/components/wizard/StickyMobileCTA'
import { WizardActionsProvider, useInlineRevealed } from '@/components/wizard/WizardActionsContext'

// El Navbar es fixed top-0 y no reserva altura; cualquier contenido que arranque
// en y=0 quedaría tapado. NAVBAR_SPACER_PT es el padding-top que reserva su
// altura. Se aplica en el StepperStrip cuando se ve el stepper, o directamente
// al contenedor del form en pasos sin stepper (1 y 6).
const NAVBAR_SPACER_PT = 'pt-[72px]'

interface StepperStripProps {
  pasoActual: number
}

function StepperStrip({ pasoActual }: StepperStripProps) {
  // Solo se renderiza cuando hay stepper visible. En paso 1 (calculadora) y
  // paso 6 (revisión) el strip se omite por completo para que el contenido
  // del form quede pegado al navbar sin colchón intermedio.
  const showStepper = pasoActual > 1 && pasoActual < 6
  if (!showStepper) return null
  return (
    <div data-testid="stepper-strip" className={`bg-white ${NAVBAR_SPACER_PT}`}>
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-3 md:py-6">
          <BarraPasos pasoActual={pasoActual} pasos={pasos} />
        </div>
      </div>
    </div>
  )
}

export default function FormularioSolicitud() {
  return (
    <WizardActionsProvider>
      <FormularioSolicitudInner />
    </WizardActionsProvider>
  )
}

function FormularioSolicitudInner() {
  // Telemetría — Bloque 1.B del scoring v7. El hook se encarga de:
  //   - inicializar sessionUuid + iniciadoEn al montar (reemplaza al
  //     useEffect explícito previo de inicializarSession),
  //   - capturar dispositivo/red/fingerprint/geo,
  //   - hookear marcarEntradaPaso a los cambios de pasoActual.
  // Expone getTelemetriaPayload() que pasamos al submit handler.
  const { getTelemetriaPayload } = useTelemetriaCapture()

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
  } = useSolicitudNavigation({ getTelemetriaPayload })

  // Slot estático donde los pasos 2-5 portalizan sus FormActions: vive afuera
  // del card animado, así los botones no transicionan junto al inner content.
  const [actionsSlot, setActionsSlot] = useState<HTMLDivElement | null>(null)

  // Sentinel al final del contenedor del form. Cuando entra al viewport, el
  // usuario está cerca del fondo del form: ocultamos el sticky y mostramos
  // los CTAs inline en mobile (crossfade fluido). Funciona para los 3
  // escenarios (paso 1, pasos 2-5, paso 6) porque vive después de TODO el
  // contenido del paso, sin importar si los botones inline están en el slot
  // (pasos 2-5) o dentro del form del paso (1 y 6).
  const [sentinelRef, setSentinelRef] = useState<HTMLDivElement | null>(null)
  const { setInlineRevealed } = useInlineRevealed()
  useEffect(() => {
    if (!sentinelRef) {
      setInlineRevealed(false)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInlineRevealed(entry.isIntersecting),
      { rootMargin: '0px 0px -64px 0px' },
    )
    observer.observe(sentinelRef)
    return () => observer.disconnect()
  }, [sentinelRef, setInlineRevealed])

  if (folio) {
    return (
      <div className={NAVBAR_SPACER_PT}>
        <PantallaExito folio={folio} telefono={datos.telefono} />
      </div>
    )
  }

  if (!hasHydrated) {
    return (
      <div className={`${NAVBAR_SPACER_PT} mx-auto max-w-2xl px-4 pb-6 md:pb-10`}>
        <FormCard>
          <FormSkeleton />
        </FormCard>
      </div>
    )
  }

  const showResumen =
    pasoActual >= 2 && pasoActual <= 5 && datos.montoSolicitado != null && datos.plazoMeses != null
  const showChrome = pasoActual >= 2 && pasoActual <= 5
  const hayStepperVisible = pasoActual > 1 && pasoActual < 6

  // Sin stepper, el strip no existe en el DOM: el contenedor reserva el spacer
  // del navbar y deja el contenido pegado al header. Pb mobile alineado al pt
  // para que el espacio hacia el footer global iguale el padding superior; el
  // sticky CTA usa su propio safe-area-inset-bottom y se oculta por sentinel
  // antes de tapar contenido.
  const containerClasses = hayStepperVisible
    ? 'mx-auto max-w-2xl px-4 py-6 pb-6 md:py-10 md:pb-10'
    : `${NAVBAR_SPACER_PT} mx-auto max-w-2xl px-4 pb-6 md:pb-10`

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

      <div className={containerClasses}>
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
            funcionen al cruzar la frontera paso 1↔2 y 5↔6. Las clases de
            chrome (rounded, border, bg) sólo aplican en pasos 2-5. */}
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

        {/* Slot estático para FormActions de los pasos 2-5 (portal). Vive
            afuera del chrome para que los botones no transicionen. */}
        <div ref={setActionsSlot} />

        {/* Sentinel para el IntersectionObserver — marca el final del form.
            Cuando entra al viewport, el sticky se oculta y los inline aparecen
            en mobile. */}
        <div ref={setSentinelRef} aria-hidden className="h-px" />
      </div>

      {/* Sticky CTA mobile-only que reemplaza los botones inline en mobile.
          Lee el estado del paso activo (label, disabled, loading, onBack)
          desde el WizardActionsContext y dispara el submit del form vía
          formId. Aparece al hacer scroll y se oculta al volver arriba. */}
      <StickyMobileCTA />
    </>
  )
}
