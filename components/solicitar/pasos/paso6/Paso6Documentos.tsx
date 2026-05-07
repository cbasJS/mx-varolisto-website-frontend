'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePaso6, type Paso6StoreData } from '@/hooks/solicitar/usePaso6'
import { TIPO_IDENTIFICACION_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import type { TipoIdentificacion } from '@varolisto/shared-schemas/enums'
import { SectionDivider } from '@/components/forms/SectionDivider'
import { StepTitle } from '../../StepTitle'
import { InfoBanner } from '@/components/forms/InfoBanner'
import { cn } from '@/lib/utils'
import { ListaEntradas } from './ListaEntradas'
import { DropzoneCard } from './DropzoneCard'
import { ToggleSinEstadosCuenta } from './ToggleSinEstadosCuenta'
import { AvisoDuplicados } from './AvisoDuplicados'

export type { Paso6StoreData }

const OPCIONES_ID: { value: TipoIdentificacion; icono: string }[] = [
  { value: 'ine', icono: 'badge' },
  { value: 'pasaporte', icono: 'travel_luggage_and_bags' },
]

interface Props {
  onNext: (datos: Paso6StoreData) => void
  onBack: () => void
}

export default function Paso6Documentos({ onNext, onBack }: Props) {
  const {
    tipoIdentificacion,
    handleChangeTipoIdentificacion,
    isCleaningUp,
    entradasComprobante,
    entradasIne,
    entradasPasaporte,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    puedeAvanzar,
    idCompleta,
    tieneComprobante,
    minComprobantes,
    comprobantesSubidosYa,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    dropzoneComprobante,
    dropzoneIneFrente,
    dropzoneIneReverso,
    dropzonePasaporte,
    tiposSubidos,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
    errorEliminacion,
    setErrorEliminacion,
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
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={6}
        titulo="Documentos"
        subtitulo="Sube tu identificación y comprobante de ingresos."
      />

      {/* ── Tipo de identificación ───────────────────────────── */}
      <div className="mb-6">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-outline">
          Tipo de identificación oficial{' '}
          <span className="text-error" aria-hidden>
            *
          </span>
        </p>
        <div className="flex gap-3">
          {OPCIONES_ID.map(({ value, icono }) => (
            <button
              key={value}
              type="button"
              disabled={isCleaningUp}
              onClick={() => handleChangeTipoIdentificacion(value)}
              className={cn(
                'flex flex-1 items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]',
                isCleaningUp && 'cursor-not-allowed opacity-60',
                tipoIdentificacion === value
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-surface-container-high bg-white text-on-surface-variant hover:border-primary/40',
              )}
            >
              {isCleaningUp && tipoIdentificacion === value ? (
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span
                  className={cn(
                    'material-symbols-outlined text-base',
                    tipoIdentificacion === value ? 'text-secondary' : 'text-outline',
                  )}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden
                >
                  {icono}
                </span>
              )}
              {TIPO_IDENTIFICACION_LABELS[value]}
            </button>
          ))}
        </div>
        {isCleaningUp && (
          <p className="mt-2 text-xs text-outline">Eliminando documentos anteriores…</p>
        )}
      </div>

      {/* ── Dropzones de identificación ─────────────────────── */}
      {tipoIdentificacion === 'ine' && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-outline">
            Fotografía de tu INE / IFE
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <DropzoneCard
              variant="id"
              label="Frente de tu INE"
              icono="flip_to_front"
              getRootProps={dropzoneIneFrente.getRootProps}
              getInputProps={dropzoneIneFrente.getInputProps}
              isDragActive={dropzoneIneFrente.isDragActive}
              disabled={dropzoneIneFrente.isDisabled}
              done={tiposSubidos.includes('ine_frente')}
            />
            <DropzoneCard
              variant="id"
              label="Reverso de tu INE"
              icono="flip_to_back"
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-outline">
            Fotografía de tu pasaporte
          </p>
          <DropzoneCard
            variant="id"
            label="Página principal del pasaporte"
            icono="travel_luggage_and_bags"
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
          variant="comprobante"
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

      <AvisoDuplicados cantidad={duplicadosOmitidos} onDismiss={() => setDuplicadosOmitidos(0)} />

      {/* Botones */}
      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border-2 border-surface-container-high bg-white px-6 py-3 text-sm font-semibold text-on-surface-variant transition-all hover:border-outline-variant hover:bg-surface-bright active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            arrow_back
          </span>
          Atrás
        </button>
        <button
          type="submit"
          disabled={!puedeAvanzar}
          title={
            hayEnVuelo
              ? 'Espera a que terminen de subir los archivos'
              : !tipoIdentificacion
                ? 'Selecciona un tipo de identificación'
                : !idCompleta
                  ? 'Sube tu identificación completa'
                  : !tieneComprobante
                    ? `Sube al menos ${minComprobantes} comprobante${minComprobantes > 1 ? 's' : ''} de ingresos (${comprobantesSubidosYa}/${minComprobantes})`
                    : undefined
          }
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Continuar
          <span className="material-symbols-outlined text-sm" aria-hidden>
            arrow_forward
          </span>
        </button>
      </div>
    </form>
  )
}
