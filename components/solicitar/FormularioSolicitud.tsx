'use client'

import { useEffect } from 'react'
import { useSolicitudNavigation } from '@/hooks/solicitar/useSolicitudNavigation'
import { useBeforeUnloadCleanup } from '@/hooks/solicitar/useBeforeUnloadCleanup'
import { useSolicitudStore } from '@/lib/solicitud/store'
import BarraPasos from './BarraPasos'
import PantallaExito from './PantallaExito'
import Paso1Prestamo from './pasos/Paso1Prestamo'
import Paso2Identidad from './pasos/Paso2Identidad'
import Paso3Domicilio from './pasos/Paso3Domicilio'
import Paso4Economia from './pasos/Paso4Economia'
import Paso5Referencias from './pasos/Paso5Referencias'
import Paso6Documentos from './pasos/paso6/Paso6Documentos'
import Paso7Revision from './pasos/Paso7Revision'

const TRUST_BADGES = [
  { icono: 'lock', texto: 'Datos encriptados' },
  { icono: 'verified_user', texto: '100% seguro' },
  { icono: 'support_agent', texto: 'Soporte en 24h' },
]

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-7 w-48 rounded-xl bg-surface-container" />
      <div className="h-4 w-72 rounded-xl bg-surface-bright" />
      <div className="grid gap-3 sm:grid-cols-3 mt-6">
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
        <div className="h-[52px] rounded-xl bg-surface-bright" />
      </div>
      <div className="mt-6 flex justify-end">
        <div className="h-11 w-32 rounded-xl bg-surface-container" />
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
        {TRUST_BADGES.map(({ icono, texto }) => (
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
