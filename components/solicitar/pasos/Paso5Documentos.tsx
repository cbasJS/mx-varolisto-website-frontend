"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { paso5Schema, type Paso5Data } from "@/lib/solicitud-schema"
import { useSolicitudStore } from "@/lib/solicitud-store"
import { validateClabe, getBancoFromClabe } from "@/lib/clabe-validator"
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const COPY_DOCUMENTOS: Record<string, string> = {
  empleado_formal:
    "CFDI de nómina más reciente, o al menos 2 recibos de nómina / estados de cuenta de los últimos 3 meses.",
  negocio_propio:
    "Al menos 2 estados de cuenta con depósitos de los últimos 3 meses. También puedes incluir recibos de proveedores o fotos de tu negocio.",
  empleado_informal:
    "Al menos 2 estados de cuenta con depósitos de los últimos 3 meses.",
  independiente:
    "Estados de cuenta de los últimos 3 meses o comprobantes de depósitos por honorarios.",
}

export default function Paso5Documentos({ onNext, onBack }: Props) {
  const datos = useSolicitudStore((s) => s.datos)
  const comprobantesStore = useSolicitudStore((s) => s.comprobantes)
  const setComprobantes = useSolicitudStore((s) => s.setComprobantes)

  const [archivos, setArchivos] = useState<File[]>(comprobantesStore)
  const [clabeValida, setClabeValida] = useState<boolean | null>(null)
  const [nombreBanco, setNombreBanco] = useState("")

  const copyDocumentos =
    COPY_DOCUMENTOS[datos.tipoActividad ?? ""] ??
    "Al menos 2 documentos que muestren tus ingresos de los últimos 3 meses."

  const TIPOS_SIN_BANCO = ["negocio_propio", "empleado_informal", "otro"]
  const puedeOmitirBanco = TIPOS_SIN_BANCO.includes(datos.tipoActividad ?? "")

  const COPY_ALTERNATIVOS: Record<string, string> = {
    negocio_propio:
      "Puedes subir fotos de tu negocio o mercancía, notas de venta, facturas a proveedores, comprobantes de pago a distribuidores, o cualquier documento que muestre la actividad de tu negocio.",
    empleado_informal:
      "Puedes subir una carta de tu empleador, fotos de recibos de pago en efectivo, notas de venta en las que aparezca tu nombre, o cualquier otro comprobante de tus ingresos.",
    otro:
      "Puedes subir cualquier documento que muestre tus ingresos: recibos de pago, transferencias, capturas de depósitos, notas de venta, o fotos de tu actividad económica.",
  }

  const [sinEstadosCuenta, setSinEstadosCuenta] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Paso5Data>({
    resolver: zodResolver(paso5Schema),
    defaultValues: { comprobantes: comprobantesStore, clabe: datos.clabe ?? "" },
  })

  const onDrop = useCallback(
    (accepted: File[]) => {
      const nuevos = [...archivos, ...accepted].slice(0, 5)
      setArchivos(nuevos)
      setComprobantes(nuevos)
      setValue("comprobantes", nuevos, { shouldValidate: true })
    },
    [archivos, setComprobantes, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const subscription = watch((value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        useSolicitudStore.getState().guardarPaso(5, value as Partial<Paso5Data>);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watch]);

  // Restaurar estado de validación CLABE al montar si ya hay un valor guardado
  useEffect(() => {
    const clabe = datos.clabe ?? ""
    if (/^\d{18}$/.test(clabe)) {
      const valida = validateClabe(clabe)
      setClabeValida(valida)
      setNombreBanco(valida ? getBancoFromClabe(clabe) : "")
    }
  }, [datos.clabe])

  const eliminarArchivo = (index: number) => {
    const nuevos = archivos.filter((_, i) => i !== index)
    setArchivos(nuevos)
    setComprobantes(nuevos)
    setValue("comprobantes", nuevos, { shouldValidate: true })
  }


  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <StepTitle
        numero={5}
        titulo="Documentos y cuenta"
        subtitulo="Necesitamos comprobar tus ingresos y dónde depositar."
      />

      {/* Sección documentos */}
      {sinEstadosCuenta && puedeOmitirBanco ? (
        <InfoBanner variant="warning">
          {COPY_ALTERNATIVOS[datos.tipoActividad ?? ""]}
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
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 18)
            setValue("clabe", val, { shouldValidate: val.length === 18 })
            if (val.length === 18) {
              const valida = validateClabe(val)
              setClabeValida(valida)
              setNombreBanco(valida ? getBancoFromClabe(val) : "")
            } else {
              setClabeValida(null)
              setNombreBanco("")
            }
          }}
          placeholder=" "
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
