"use client"

import { usePaso5 } from "@/hooks/solicitar/usePaso5"
import type { Paso5Data } from "@/lib/solicitud-schema"
import { formatBytes } from "@/lib/solicitud/utils/formatBytes"
import {
  FloatingInput,
  SectionDivider,
  StepTitle,
  FormActions,
  FieldError,
  InfoBanner,
} from "../FormUI"
import { cn } from "@/lib/utils"

interface Props {
  onNext: (datos: Paso5Data) => void
  onBack: () => void
}

export default function Paso5Documentos({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    archivos,
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
    eliminarArchivo,
    handleClabeChange,
    handleClabePaste,
    clabeValue,
    duplicadosOmitidos,
    setDuplicadosOmitidos,
  } = usePaso5(onNext)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={5}
        titulo="Documentos y cuenta"
        subtitulo="Necesitamos comprobar tus ingresos y dónde depositar."
      />

      {/* Sección documentos */}
      {sinEstadosCuenta && puedeOmitirBanco ? (
        <InfoBanner variant="warning">
          {copyAlternativo}
        </InfoBanner>
      ) : (
        <InfoBanner variant="info">
          {copyDocumentos}
        </InfoBanner>
      )}

      {/* Toggle — solo visible para tipos sin obligación de banco */}
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
              sinEstadosCuenta ? "border-amber-500 bg-amber-500" : "border-[#c8c8c8] bg-white"
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
            "cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
            isDragActive
              ? "border-secondary bg-secondary/5 scale-[1.01]"
              : archivos.length > 0
              ? "border-primary/30 bg-primary/3 hover:border-primary/50"
              : "border-[#ddd] bg-[#fafafa] hover:border-primary/40 hover:bg-primary/3"
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
                {isDragActive
                  ? "Suelta aquí los archivos"
                  : "Arrastra o haz clic para subir"}
              </p>
              <p className="mt-0.5 text-xs text-[#aaa]">
                JPG, PNG, PDF · Máx. 10 MB · Mínimo 2 · Hasta 5
              </p>
            </div>
          </div>
        </div>

        {/* Lista de archivos */}
        {archivos.length > 0 && (
          <ul className="mt-3 space-y-2">
            {archivos.map((archivo, i) => (
              <li
                key={`${archivo.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border-2 border-[#e8e8e8] bg-white px-4 py-2.5"
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    archivo.type === "application/pdf"
                      ? "bg-red-50"
                      : "bg-blue-50"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-sm",
                      archivo.type === "application/pdf"
                        ? "text-red-500"
                        : "text-blue-500"
                    )}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden
                  >
                    {archivo.type === "application/pdf" ? "picture_as_pdf" : "image"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1a1c1c]">
                    {archivo.name}
                  </p>
                  <p className="text-xs text-[#aaa]">{formatBytes(archivo.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarArchivo(i)}
                  className="shrink-0 rounded-lg p-1 text-[#ccc] transition-colors hover:bg-red-50 hover:text-error"
                  aria-label={`Eliminar ${archivo.name}`}
                >
                  <span className="material-symbols-outlined text-base" aria-hidden>
                    close
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

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
              <span className="material-symbols-outlined text-base" aria-hidden>close</span>
            </button>
          </div>
        )}

        <FieldError message={errors.comprobantes?.message as string} />
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

        {/* Feedback CLABE */}
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
              <p className="text-sm font-semibold text-[#006e1c]">
                CLABE válida
              </p>
              <p className="text-xs text-[#006e1c]/70">{nombreBanco}</p>
            </div>
          </div>
        )}
        {clabeValida === false && (
          <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5">
            <p className="text-sm font-medium text-error">
              CLABE inválida — verifica que no sea el número de tu tarjeta.
            </p>
          </div>
        )}
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
