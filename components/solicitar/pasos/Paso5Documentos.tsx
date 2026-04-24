"use client"

import { usePaso5, type Paso5StoreData, type EstadoUpload } from "@/hooks/solicitar/usePaso5"
import { formatBytes } from "@/lib/solicitud/utils/formatBytes"
import {
  FloatingInput,
  SectionDivider,
  StepTitle,
  InfoBanner,
} from "../FormUI"
import { cn } from "@/lib/utils"

// Re-export para que FormularioSolicitud pueda tipar el prop onNext
export type { Paso5StoreData }

interface Props {
  onNext: (datos: Paso5StoreData) => void
  onBack: () => void
}

function IconoArchivo({ mimeType }: { mimeType: string }) {
  const esPdf = mimeType === "application/pdf"
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        esPdf ? "bg-red-50" : "bg-blue-50"
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined text-sm",
          esPdf ? "text-red-500" : "text-blue-500"
        )}
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        {esPdf ? "picture_as_pdf" : "image"}
      </span>
    </div>
  )
}

function BadgeEstado({ estado }: { estado: EstadoUpload }) {
  if (estado === "uploading" || estado === "pending") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-[#e8e8e8] border-t-primary" />
        <span className="text-xs text-[#aaa]">Subiendo…</span>
      </div>
    )
  }
  if (estado === "uploaded") {
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

export default function Paso5Documentos({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    errors,
    puedeAvanzar,
    entradas,
    archivosSubidos,
    eliminarEntrada,
    reintentarUpload,
    hayEnVuelo,
    totalArchivos,
    clabeValida,
    nombreBanco,
    sinEstadosCuenta,
    setSinEstadosCuenta,
    copyDocumentos,
    puedeOmitirBanco,
    copyAlternativo,
    getRootProps,
    getInputProps,
    isDragActive,
    handleClabeChange,
    handleClabePaste,
    clabeValue,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
  } = usePaso5(onNext)

  const dropzoneDeshabilitada = totalArchivos >= 5

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={5}
        titulo="Documentos y cuenta"
        subtitulo="Necesitamos comprobar tus ingresos y dónde depositar."
      />

      {/* Banner informativo */}
      {sinEstadosCuenta && puedeOmitirBanco ? (
        <InfoBanner variant="warning">{copyAlternativo}</InfoBanner>
      ) : (
        <InfoBanner variant="info">{copyDocumentos}</InfoBanner>
      )}

      {/* Toggle sin estados de cuenta */}
      {puedeOmitirBanco && (
        <button
          type="button"
          onClick={() => setSinEstadosCuenta((prev) => !prev)}
          className={cn(
            "mt-3 flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all",
            sinEstadosCuenta
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-[#e8e8e8] bg-white text-[#454652] hover:border-[#c8c8c8]"
          )}
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
              sinEstadosCuenta
                ? "border-amber-500 bg-amber-500"
                : "border-[#c8c8c8] bg-white"
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

      <div className="mt-4 mb-2">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
            dropzoneDeshabilitada
              ? "cursor-not-allowed border-[#e8e8e8] bg-[#f5f5f7] opacity-50"
              : "cursor-pointer",
            !dropzoneDeshabilitada && isDragActive
              ? "border-secondary bg-secondary/5 scale-[1.01]"
              : !dropzoneDeshabilitada && archivosSubidos.length > 0
              ? "border-primary/30 bg-primary/3 hover:border-primary/50"
              : !dropzoneDeshabilitada &&
                "border-[#ddd] bg-[#fafafa] hover:border-primary/40 hover:bg-primary/3"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-full transition-colors",
                isDragActive ? "bg-secondary/20" : "bg-[#f0f0f0]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-2xl",
                  isDragActive ? "text-secondary" : "text-[#aaa]"
                )}
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden
              >
                {isDragActive ? "file_download" : "upload_file"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1c1c]">
                {dropzoneDeshabilitada
                  ? "Límite de 5 archivos alcanzado"
                  : isDragActive
                  ? "Suelta aquí los archivos"
                  : "Arrastra o haz clic para subir"}
              </p>
              <p className="mt-0.5 text-xs text-[#aaa]">
                JPG, PNG, PDF · Máx. 10 MB · Hasta 5 archivos
              </p>
            </div>
          </div>
        </div>

        {/* Lista de archivos con estados */}
        {entradas.length > 0 && (
          <ul className="mt-3 space-y-2">
            {entradas.map((entrada) => (
              <li
                key={entrada.clienteId}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-2.5",
                  entrada.estado === "failed"
                    ? "border-red-200 bg-red-50"
                    : entrada.estado === "uploaded"
                    ? "border-secondary/30"
                    : "border-[#e8e8e8]"
                )}
              >
                <IconoArchivo mimeType={entrada.file.type} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1a1c1c]">
                    {entrada.file.name}
                  </p>
                  <p className="text-xs text-[#aaa]">
                    {formatBytes(entrada.file.size)}
                  </p>
                  {entrada.estado === "failed" && entrada.error && (
                    <p className="mt-0.5 text-xs font-medium text-error">
                      {entrada.error}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <BadgeEstado estado={entrada.estado} />

                  {entrada.estado === "failed" && (
                    <button
                      type="button"
                      onClick={() => reintentarUpload(entrada.clienteId)}
                      className="rounded-lg border border-error/30 px-2 py-1 text-xs font-semibold text-error transition-colors hover:bg-red-50"
                    >
                      Reintentar
                    </button>
                  )}

                  {entrada.estado !== "uploading" &&
                    entrada.estado !== "pending" && (
                      <button
                        type="button"
                        onClick={() => eliminarEntrada(entrada.clienteId)}
                        className="rounded-lg p-1 text-[#ccc] transition-colors hover:bg-red-50 hover:text-error"
                        aria-label={`Eliminar ${entrada.file.name}`}
                      >
                        <span
                          className="material-symbols-outlined text-base"
                          aria-hidden
                        >
                          close
                        </span>
                      </button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Aviso de duplicados omitidos */}
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
                ? "Un archivo ya estaba en la lista y fue omitido."
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

        {/* Aviso límite de archivos */}
        {dropzoneDeshabilitada && (
          <p className="mt-2 text-xs text-[#aaa]">
            Límite de 5 archivos alcanzado. Elimina uno para agregar otro.
          </p>
        )}
      </div>

      <SectionDivider label="Datos bancarios" />

      {/* CLABE */}
      <div>
        <FloatingInput
          label="CLABE interbancaria"
          required
          type="text"
          inputMode="numeric"
          maxLength={18}
          error={errors.clabe?.message}
          hint="18 dígitos — no es el número de tu tarjeta"
          {...register("clabe")}
          onChange={handleClabeChange}
          onPaste={handleClabePaste}
          placeholder=" "
          suffix={
            <span className="tabular-nums text-xs text-[#aaa]">
              {clabeValue.length}/18
            </span>
          }
        />

        {clabeValida === true && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/30 px-4 py-2.5">
            <span
              className="material-symbols-outlined text-base text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              account_balance
            </span>
            <div>
              <p className="text-sm font-semibold text-[#006e1c]">CLABE válida</p>
              <p className="text-xs text-[#006e1c]/70">{nombreBanco}</p>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border-2 border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-[#454652] transition-all hover:border-[#c8c8c8] hover:bg-[#fafafa] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            arrow_back
          </span>
          Atrás
        </button>

        <div className="relative">
          <button
            type="submit"
            disabled={!puedeAvanzar}
            title={
              hayEnVuelo
                ? "Espera a que terminen de subir los archivos"
                : archivosSubidos.length < 2
                ? "Sube al menos 2 archivos para continuar"
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
      </div>
    </form>
  )
}
