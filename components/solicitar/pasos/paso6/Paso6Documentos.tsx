'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Contact, Briefcase, Home, type LucideIcon } from 'lucide-react'
import { usePaso6, type Paso6StoreData } from '@/hooks/solicitar/usePaso6'
import { TIPO_IDENTIFICACION_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import type { TipoIdentificacion } from '@varolisto/shared-schemas/enums'
import { SectionDivider } from '@/components/forms/SectionDivider'
import { StepTitle } from '@/components/wizard/StepTitle'
import { PasoFormShell } from '@/components/wizard/PasoFormShell'
import { InfoBanner } from '@/components/forms/InfoBanner'
import { cn } from '@/lib/utils'
import { ListaEntradas } from './ListaEntradas'
import { DropzoneCard } from './DropzoneCard'
import { ToggleSinEstadosCuenta } from './ToggleSinEstadosCuenta'
import { AvisoDuplicados } from './AvisoDuplicados'
import { DialogoErroresArchivo } from './DialogoErroresArchivo'
import { AvisoWarningsArchivo } from './AvisoWarningsArchivo'

export type { Paso6StoreData }

const OPCIONES_ID: { value: TipoIdentificacion; lucideIcon: LucideIcon }[] = [
  { value: 'ine', lucideIcon: Contact },
  { value: 'pasaporte', lucideIcon: Briefcase },
]

interface Props {
  onNext: (datos: Paso6StoreData) => void
  onBack: () => void
  actionsSlot: HTMLElement | null
}

export default function Paso6Documentos({ onNext, onBack, actionsSlot }: Props) {
  const {
    tipoIdentificacion,
    handleChangeTipoIdentificacion,
    isCleaningUp,
    entradasComprobante,
    entradasIne,
    entradasPasaporte,
    entradasDomicilio,
    eliminarEntrada,
    reintentarUpload,
    puedeAvanzar,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    dropzoneComprobante,
    dropzoneIneFrente,
    dropzoneIneReverso,
    dropzonePasaporte,
    dropzoneDomicilio,
    tiposSubidos,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
    errorEliminacion,
    setErrorEliminacion,
    dialogoErrores,
    cerrarDialogoErrores,
    warningsArchivos,
    descartarWarnings,
    handleSubmit,
  } = usePaso6(onNext)

  useEffect(() => {
    if (!errorEliminacion) return
    toast.error(errorEliminacion, {
      onDismiss: () => setErrorEliminacion(null),
      onAutoClose: () => setErrorEliminacion(null),
    })
  }, [errorEliminacion, setErrorEliminacion])

  return (
    <PasoFormShell
      onSubmit={handleSubmit}
      onBack={onBack}
      disabled={!puedeAvanzar}
      actionsSlot={actionsSlot}
    >
      <StepTitle
        titulo="Sube tus documentos"
        subtitulo="Tus documentos para verificar identidad, ingresos y domicilio. Te toma menos de 1 minuto."
      />

      {/* ── Tipo de identificación ───────────────────────────── */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          ¿Con qué te identificas?{' '}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPCIONES_ID.map(({ value, lucideIcon: Icono }) => {
            const selected = tipoIdentificacion === value
            return (
              <button
                key={value}
                type="button"
                disabled={isCleaningUp}
                onClick={() => handleChangeTipoIdentificacion(value)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-sm font-bold transition-all active:scale-[0.98]',
                  isCleaningUp && 'cursor-not-allowed opacity-60',
                  selected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                )}
              >
                {isCleaningUp && selected ? (
                  <span className="inline-block size-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Icono
                    className={cn('size-6 shrink-0', selected ? 'text-secondary' : 'text-gray-500')}
                    aria-hidden
                  />
                )}
                {TIPO_IDENTIFICACION_LABELS[value]}
              </button>
            )
          })}
        </div>
        {isCleaningUp && (
          <p className="mt-2 text-xs text-outline">Limpiando los archivos del tipo anterior…</p>
        )}
      </div>

      {/* ── Dropzones de identificación ─────────────────────── */}
      {tipoIdentificacion === 'ine' && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Foto de tu INE — ambos lados
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <DropzoneCard
              variant="id-ine"
              label="Frente de tu INE"
              getRootProps={dropzoneIneFrente.getRootProps}
              getInputProps={dropzoneIneFrente.getInputProps}
              isDragActive={dropzoneIneFrente.isDragActive}
              disabled={dropzoneIneFrente.isDisabled}
              done={tiposSubidos.includes('ine_frente')}
            />
            <DropzoneCard
              variant="id-ine"
              label="Reverso de tu INE"
              getRootProps={dropzoneIneReverso.getRootProps}
              getInputProps={dropzoneIneReverso.getInputProps}
              isDragActive={dropzoneIneReverso.isDragActive}
              disabled={dropzoneIneReverso.isDisabled ?? false}
              done={tiposSubidos.includes('ine_reverso')}
            />
          </div>
          <ListaEntradas
            entradas={entradasIne}
            eliminarEntrada={eliminarEntrada}
            reintentarUpload={reintentarUpload}
          />
        </div>
      )}

      {tipoIdentificacion === 'pasaporte' && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Foto de tu pasaporte
          </p>
          <DropzoneCard
            variant="id-pasaporte"
            label="Hoja con tu foto"
            getRootProps={dropzonePasaporte.getRootProps}
            getInputProps={dropzonePasaporte.getInputProps}
            isDragActive={dropzonePasaporte.isDragActive}
            disabled={dropzonePasaporte.isDisabled ?? false}
            done={tiposSubidos.includes('pasaporte_principal')}
          />
          <ListaEntradas
            entradas={entradasPasaporte}
            eliminarEntrada={eliminarEntrada}
            reintentarUpload={reintentarUpload}
          />
        </div>
      )}

      <SectionDivider label="Comprobante de ingresos" />

      {/* Copy contextual */}
      {sinEstadosCuenta && puedeOmitirBanco ? (
        <InfoBanner variant="warning">{copyAlternativo}</InfoBanner>
      ) : (
        <InfoBanner variant="info">{copyDocumentos}</InfoBanner>
      )}

      {puedeOmitirBanco && (
        <ToggleSinEstadosCuenta
          checked={sinEstadosCuenta}
          onToggle={() => setSinEstadosCuenta((prev) => !prev)}
        />
      )}

      {/* Dropzone comprobante */}
      <div className="mt-4">
        <DropzoneCard
          variant="comprobante-ingreso"
          getRootProps={dropzoneComprobante.getRootProps}
          getInputProps={dropzoneComprobante.getInputProps}
          isDragActive={dropzoneComprobante.isDragActive}
          disabled={dropzoneComprobante.isDisabled}
        />
      </div>

      <ListaEntradas
        entradas={entradasComprobante}
        eliminarEntrada={eliminarEntrada}
        reintentarUpload={reintentarUpload}
      />

      <SectionDivider label="Comprobante de domicilio" />

      <InfoBanner variant="info">
        Recibo de luz, agua o teléfono <strong>a tu nombre</strong>, con menos de 3 meses. La
        dirección debe coincidir con la que ingresaste.
      </InfoBanner>

      <div className="mt-4">
        <DropzoneCard
          variant="comprobante-domicilio"
          label="Comprobante de domicilio"
          icon={Home}
          getRootProps={dropzoneDomicilio.getRootProps}
          getInputProps={dropzoneDomicilio.getInputProps}
          isDragActive={dropzoneDomicilio.isDragActive}
          disabled={dropzoneDomicilio.isDisabled ?? false}
          done={tiposSubidos.includes('comprobante_domicilio')}
        />
      </div>

      <ListaEntradas
        entradas={entradasDomicilio}
        eliminarEntrada={eliminarEntrada}
        reintentarUpload={reintentarUpload}
      />

      <AvisoDuplicados cantidad={duplicadosOmitidos} onDismiss={() => setDuplicadosOmitidos(0)} />

      <AvisoWarningsArchivo items={warningsArchivos} onDismiss={descartarWarnings} />

      <DialogoErroresArchivo
        open={dialogoErrores?.open ?? false}
        onClose={cerrarDialogoErrores}
        items={dialogoErrores?.items ?? []}
      />
    </PasoFormShell>
  )
}
