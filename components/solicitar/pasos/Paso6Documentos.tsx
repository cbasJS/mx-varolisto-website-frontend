'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePaso6, type Paso6StoreData, type EstadoUpload } from '@/hooks/solicitar/usePaso6'
import { formatBytes } from '@/lib/solicitud/utils/formatBytes'
import { TIPO_IDENTIFICACION_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import type { TipoIdentificacion } from '@varolisto/shared-schemas/enums'
import { SectionDivider } from '../SectionDivider'
import { StepTitle } from '../StepTitle'
import { InfoBanner } from '../InfoBanner'
import { cn } from '@/lib/utils'

export type { Paso6StoreData }

const OPCIONES_ID: { value: TipoIdentificacion; icono: string }[] = [
  { value: 'ine', icono: 'badge' },
  { value: 'pasaporte', icono: 'travel_luggage_and_bags' },
]

interface Props {
  onNext: (datos: Paso6StoreData) => void
  onBack: () => void
}

function IconoArchivo(_: { mimeType: string }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
      <span
        className="material-symbols-outlined text-sm text-blue-500"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        image
      </span>
    </div>
  )
}

function BadgeEstado({ estado }: { estado: EstadoUpload }) {
  if (estado === 'uploading' || estado === 'pending') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-surface-container-high border-t-primary" />
        <span className="text-xs text-outline">Subiendo…</span>
      </div>
    )
  }
  if (estado === 'deleting') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-surface-container-high border-t-error" />
        <span className="text-xs text-outline">Eliminando…</span>
      </div>
    )
  }
  if (estado === 'uploaded') {
    return (
      <span
        className="material-symbols-outlined text-lg text-secondary"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        check_circle
      </span>
    )
  }
  return null
}

interface ListaEntradasProps {
  entradas: import('@/hooks/solicitar/useUploadArchivo').EntradaUpload[]
  eliminarEntrada: (id: string) => void
  reintentarUpload: (id: string) => void
}

function ListaEntradas({ entradas, eliminarEntrada, reintentarUpload }: ListaEntradasProps) {
  if (entradas.length === 0) return null
  return (
    <ul className="mt-3 space-y-2">
      {entradas.map((entrada) => (
        <li
          key={entrada.clienteId}
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-2.5',
            entrada.estado === 'failed'
              ? 'border-red-200 bg-red-50'
              : entrada.estado === 'uploaded'
                ? 'border-secondary/30'
                : 'border-surface-container-high',
          )}
        >
          <IconoArchivo mimeType={entrada.file.type} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-on-surface">{entrada.file.name}</p>
            <p className="text-xs text-outline">{formatBytes(entrada.file.size)}</p>
            {entrada.estado === 'failed' && entrada.error && (
              <p className="mt-0.5 text-xs font-medium text-error">{entrada.error}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <BadgeEstado estado={entrada.estado} />
            {entrada.estado === 'failed' && (
              <button
                type="button"
                onClick={() => reintentarUpload(entrada.clienteId)}
                className="rounded-lg border border-error/30 px-2 py-1 text-xs font-semibold text-error transition-colors hover:bg-red-50"
              >
                Reintentar
              </button>
            )}
            {entrada.estado !== 'uploading' &&
              entrada.estado !== 'pending' &&
              entrada.estado !== 'deleting' && (
                <button
                  type="button"
                  onClick={() => eliminarEntrada(entrada.clienteId)}
                  className="rounded-lg p-1 text-outline-variant transition-colors hover:bg-red-50 hover:text-error"
                  aria-label={`Eliminar ${entrada.file.name}`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden>
                    close
                  </span>
                </button>
              )}
          </div>
        </li>
      ))}
    </ul>
  )
}

interface DropzoneCardProps {
  label: string
  icono: string
  getRootProps: () => object
  getInputProps: () => object
  isDragActive: boolean
  disabled: boolean
  done: boolean
}

function DropzoneCard({
  label,
  icono,
  getRootProps,
  getInputProps,
  isDragActive,
  disabled,
  done,
}: DropzoneCardProps) {
  const inputProps = getInputProps() as React.InputHTMLAttributes<HTMLInputElement>

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        done && 'border-secondary/50 bg-secondary/5',
        !disabled && !done && isDragActive && 'border-secondary bg-secondary/5 scale-[1.01]',
        !disabled &&
          !done &&
          !isDragActive &&
          'border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-primary/3',
      )}
    >
      <input {...inputProps} />
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-full transition-colors',
            done ? 'bg-secondary/20' : isDragActive ? 'bg-secondary/20' : 'bg-surface-container',
          )}
        >
          <span
            className={cn(
              'material-symbols-outlined text-xl',
              done ? 'text-secondary' : isDragActive ? 'text-secondary' : 'text-outline',
            )}
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            {done ? 'check_circle' : icono}
          </span>
        </div>
        <p className="text-sm font-semibold text-on-surface">{done ? 'Subida exitosa' : label}</p>
        {!done && <p className="text-xs text-outline">JPG, PNG o PDF · Máx. 10 MB</p>}
      </div>
    </div>
  )
}

export default function Paso6Documentos({ onNext, onBack }: Props) {
  const {
    tipoIdentificacion,
    handleChangeTipoIdentificacion,
    isCleaningUp,
    entradasComprobante,
    entradasIne,
    entradasPasaporte,
    archivosSubidos,
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
              label="Frente de tu INE"
              icono="flip_to_front"
              getRootProps={dropzoneIneFrente.getRootProps}
              getInputProps={dropzoneIneFrente.getInputProps}
              isDragActive={dropzoneIneFrente.isDragActive}
              disabled={dropzoneIneFrente.isDisabled}
              done={tiposSubidos.includes('ine_frente')}
            />
            <DropzoneCard
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
        <button
          type="button"
          onClick={() => setSinEstadosCuenta((prev) => !prev)}
          className={cn(
            'mt-3 flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all',
            sinEstadosCuenta
              ? 'border-amber-300 bg-amber-50 text-amber-800'
              : 'border-surface-container-high bg-white text-on-surface-variant hover:border-outline-variant',
          )}
        >
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
              sinEstadosCuenta
                ? 'border-amber-500 bg-amber-500'
                : 'border-outline-variant bg-white',
            )}
            aria-hidden
          >
            {sinEstadosCuenta && (
              <span
                className="material-symbols-outlined text-xs text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            )}
          </span>
          <span className="font-medium leading-snug">
            No cuento con estados de cuenta bancarios
          </span>
        </button>
      )}

      {/* Dropzone comprobante */}
      <div className="mt-4">
        <div
          {...dropzoneComprobante.getRootProps()}
          className={cn(
            'rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
            dropzoneComprobante.isDisabled
              ? 'cursor-not-allowed border-surface-container-high bg-surface-bright opacity-50'
              : 'cursor-pointer',
            !dropzoneComprobante.isDisabled && dropzoneComprobante.isDragActive
              ? 'border-secondary bg-secondary/5 scale-[1.01]'
              : !dropzoneComprobante.isDisabled
                ? 'border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-primary/3'
                : '',
          )}
        >
          <input {...dropzoneComprobante.getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-surface-container">
              <span
                className="material-symbols-outlined text-2xl text-outline"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden
              >
                {dropzoneComprobante.isDragActive ? 'file_download' : 'upload_file'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {dropzoneComprobante.isDragActive
                  ? 'Suelta aquí los archivos'
                  : 'Arrastra o toca para subir'}
              </p>
              <p className="mt-0.5 text-xs text-outline">JPG, PNG o PDF · Máx. 10 MB c/u</p>
            </div>
          </div>
        </div>
      </div>

      <ListaEntradas
        entradas={entradasComprobante}
        eliminarEntrada={eliminarEntrada}
        reintentarUpload={reintentarUpload}
      />

      {/* Aviso duplicados */}
      {duplicadosOmitidos > 0 && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span
            className="material-symbols-outlined mt-0.5 shrink-0 text-base text-amber-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            warning
          </span>
          <p className="flex-1 text-sm text-amber-800">
            {duplicadosOmitidos === 1
              ? 'Un archivo ya estaba en la lista y fue omitido.'
              : `${duplicadosOmitidos} archivos ya estaban en la lista y fueron omitidos.`}
          </p>
          <button
            type="button"
            onClick={() => setDuplicadosOmitidos(0)}
            className="shrink-0 rounded-lg p-0.5 text-amber-400 transition-colors hover:bg-amber-100 hover:text-amber-700"
            aria-label="Cerrar aviso"
          >
            <span className="material-symbols-outlined text-base" aria-hidden>
              close
            </span>
          </button>
        </div>
      )}

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
