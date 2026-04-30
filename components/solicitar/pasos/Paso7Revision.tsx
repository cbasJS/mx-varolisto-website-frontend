"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePaso7 } from "@/hooks/solicitar/usePaso7";
import { useSolicitudStore } from "@/lib/solicitud/store";
import type { Paso7Data } from "@/lib/solicitud-schema";
import type { ErrorSubmit } from "@/hooks/solicitar/useSolicitudNavigation";
import {
  DESTINO_LABELS,
  ACTIVIDAD_LABELS,
  RELACION_LABELS,
  ANTIGUEDAD_LABELS,
  ANIOS_VIVIENDO_LABELS,
  TIPO_VIVIENDA_LABELS,
  ESTADO_CIVIL_LABELS,
  DEPENDIENTES_LABELS,
  TIPO_IDENTIFICACION_LABELS,
} from "@/lib/solicitud/utils/lookup-labels";
import { WHATSAPP_URL } from "@/lib/config";
import { Checkbox } from "@/components/ui/checkbox";
import { StepTitle } from "../StepTitle";
import { FieldError } from "../FieldError";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (datos: Paso7Data) => void;
  onBack: () => void;
  onEditarPaso: (paso: number) => void;
  enviando: boolean;
  errorSubmit: ErrorSubmit | null;
  onLimpiarError: () => void;
  onConflictoConfirmado: () => void;
}

function SeccionCard({
  titulo,
  paso,
  onEditar,
  children,
  icono,
}: {
  titulo: string;
  paso: number;
  onEditar: (paso: number) => void;
  children: React.ReactNode;
  icono: string;
}) {
  const [abierto, setAbierto] = useState(true);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#e8e8e8] bg-white">
      <div className="flex w-full items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setAbierto((p) => !p)}
          className="flex flex-1 items-center gap-3 text-left transition-colors hover:opacity-70"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
            <span
              className="material-symbols-outlined text-sm text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              {icono}
            </span>
          </div>
          <span className="flex-1 text-sm font-semibold text-[#1a1c1c]">
            {titulo}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onEditar(paso)}
          className="rounded-lg border border-[#e8e8e8] px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setAbierto((p) => !p)}
          className="transition-colors hover:opacity-70"
          aria-label={abierto ? "Colapsar sección" : "Expandir sección"}
        >
          <span
            className={cn(
              "material-symbols-outlined text-base text-[#aaa] transition-transform duration-200",
              abierto && "rotate-180",
            )}
            aria-hidden
          >
            expand_more
          </span>
        </button>
      </div>
      {abierto && (
        <div className="border-t border-[#f0f0f0] px-5 py-4">{children}</div>
      )}
    </div>
  );
}

function Fila({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-[#aaa]">{label}</span>
      <span className="text-right font-medium text-[#1a1c1c]">{value}</span>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#aaa] first:mt-0">
      {children}
    </p>
  );
}

function ModalConflicto({ onConfirmado }: { onConfirmado: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100">
          <span
            className="material-symbols-outlined text-2xl text-amber-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            warning
          </span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-[#1a1c1c]">
          Solicitud activa existente
        </h2>
        <p className="mb-6 text-sm text-[#454652] leading-relaxed">
          Ya existe una solicitud activa con estos datos. Si necesitas ayuda,
          escríbenos por{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2"
          >
            WhatsApp
          </a>{" "}
          con tu teléfono o CURP.
        </p>
        <button
          type="button"
          onClick={onConfirmado}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default function Paso7Revision({
  onSubmit,
  onBack,
  onEditarPaso,
  enviando,
  errorSubmit,
  onLimpiarError,
  onConflictoConfirmado,
}: Props) {
  const datos = useSolicitudStore((s) => s.datos);
  const archivosSubidos = useSolicitudStore((s) => s.archivosSubidos);
  const tipoIdentificacion = useSolicitudStore((s) => s.tipoIdentificacion);

  const {
    handleSubmit,
    setValue,
    errors,
    privacidad,
    terminos,
    ambosAceptados,
  } = usePaso7(onSubmit);

  useEffect(() => {
    if (errorSubmit?.tipo === "red") {
      toast.error("Algo salió mal al enviar. Revisa tu conexión e inténtalo de nuevo.", {
        onDismiss: onLimpiarError,
        onAutoClose: onLimpiarError,
      })
    } else if (errorSubmit?.tipo === "desconocido") {
      toast.error(
        errorSubmit.mensaje ?? "Ocurrió un error inesperado. Inténtalo de nuevo.",
        { onDismiss: onLimpiarError, onAutoClose: onLimpiarError }
      )
    }
  }, [errorSubmit]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {errorSubmit?.tipo === "conflicto" && (
        <ModalConflicto onConfirmado={onConflictoConfirmado} />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <StepTitle
          numero={7}
          titulo="Revisa tu solicitud"
          subtitulo="Confirma que todo esté correcto antes de enviar."
        />

        <div className="space-y-3 mb-8">
          {/* Paso 1 — Préstamo */}
          <SeccionCard titulo="Préstamo deseado" paso={1} onEditar={onEditarPaso} icono="payments">
            <Fila
              label="Monto"
              value={datos.montoSolicitado ? `$${datos.montoSolicitado.toLocaleString("es-MX")}` : undefined}
            />
            <Fila label="Plazo" value={datos.plazoMeses ? `${datos.plazoMeses} meses` : undefined} />
            <Fila
              label="Destino"
              value={datos.destinoPrestamo ? DESTINO_LABELS[datos.destinoPrestamo] : undefined}
            />
          </SeccionCard>

          {/* Paso 2 — Identidad */}
          <SeccionCard titulo="Identidad" paso={2} onEditar={onEditarPaso} icono="person">
            <Fila
              label="Nombre"
              value={`${datos.nombre ?? ""} ${datos.apellidoPaterno ?? ""} ${datos.apellidoMaterno ?? ""}`.trim()}
            />
            <Fila label="CURP" value={datos.curp} />
            <Fila label="Correo" value={datos.email} />
            <Fila label="Teléfono" value={datos.telefono} />
          </SeccionCard>

          {/* Paso 3 — Domicilio */}
          <SeccionCard titulo="Domicilio" paso={3} onEditar={onEditarPaso} icono="home">
            <Fila
              label="Dirección"
              value={
                datos.calle
                  ? `${datos.calle} ${datos.numeroExterior ?? ""}${datos.numeroInterior ? " Int. " + datos.numeroInterior : ""}, ${datos.colonia ?? ""}, ${datos.municipio ?? ""} CP ${datos.codigoPostal ?? ""}`
                  : undefined
              }
            />
            <Fila
              label="Tiempo viviendo"
              value={datos.aniosViviendo ? ANIOS_VIVIENDO_LABELS[datos.aniosViviendo] : undefined}
            />
            <Fila
              label="Tipo de vivienda"
              value={datos.tipoVivienda ? TIPO_VIVIENDA_LABELS[datos.tipoVivienda] : undefined}
            />
          </SeccionCard>

          {/* Paso 4 — Economía */}
          <SeccionCard titulo="Situación económica" paso={4} onEditar={onEditarPaso} icono="account_balance_wallet">
            <Fila label="Actividad" value={datos.tipoActividad ? ACTIVIDAD_LABELS[datos.tipoActividad] : undefined} />
            <Fila label="Empleador / Negocio" value={datos.nombreEmpleadorNegocio} />
            <Fila label="Antigüedad" value={datos.antiguedad ? ANTIGUEDAD_LABELS[datos.antiguedad] : undefined} />
            <Fila label="Estado civil" value={datos.estadoCivil ? ESTADO_CIVIL_LABELS[datos.estadoCivil] : undefined} />
            <Fila
              label="Dependientes"
              value={datos.dependientesEconomicos ? DEPENDIENTES_LABELS[datos.dependientesEconomicos] : undefined}
            />
            <Fila
              label="Ingreso mensual"
              value={datos.ingresoMensual ? `$${datos.ingresoMensual.toLocaleString("es-MX")}` : undefined}
            />
            <Fila label="Tiene deudas" value={datos.tieneDeudas === "si" ? "Sí" : "No"} />
          </SeccionCard>

          {/* Paso 5 — Referencias */}
          <SeccionCard titulo="Referencias" paso={5} onEditar={onEditarPaso} icono="group">
            <SubLabel>Referencia 1</SubLabel>
            <Fila label="Nombre" value={datos.ref1Nombre} />
            <Fila label="Teléfono" value={datos.ref1Telefono} />
            <Fila label="Relación" value={datos.ref1Relacion ? RELACION_LABELS[datos.ref1Relacion] : undefined} />
            {datos.ref1Email && <Fila label="Correo" value={datos.ref1Email} />}
            <SubLabel>Referencia 2</SubLabel>
            <Fila label="Nombre" value={datos.ref2Nombre} />
            <Fila label="Teléfono" value={datos.ref2Telefono} />
            <Fila label="Relación" value={datos.ref2Relacion ? RELACION_LABELS[datos.ref2Relacion] : undefined} />
            {datos.ref2Email && <Fila label="Correo" value={datos.ref2Email} />}
          </SeccionCard>

          {/* Paso 6 — Documentos */}
          <SeccionCard titulo="Documentos" paso={6} onEditar={onEditarPaso} icono="folder_open">
            <Fila
              label="Identificación"
              value={tipoIdentificacion ? TIPO_IDENTIFICACION_LABELS[tipoIdentificacion] : undefined}
            />
            <Fila
              label="Archivos subidos"
              value={`${archivosSubidos.length} archivo${archivosSubidos.length !== 1 ? "s" : ""}`}
            />
          </SeccionCard>
        </div>

        {/* Consentimientos */}
        <div className="mb-8 space-y-3 rounded-2xl border-2 border-[#e8e8e8] bg-[#fafafa] p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#aaa]">
            Acepto los términos
          </p>

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              id="aceptaPrivacidad"
              checked={privacidad === true}
              onCheckedChange={(checked) =>
                setValue(
                  "aceptaPrivacidad",
                  checked === true ? true : (undefined as unknown as true),
                  { shouldValidate: true },
                )
              }
              className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm text-[#454652] leading-relaxed">
              He leído y acepto el{" "}
              <a
                href="/aviso-de-privacidad-integral"
                target="_blank"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Aviso de Privacidad
              </a>
              .
            </span>
          </label>
          <FieldError message={errors.aceptaPrivacidad?.message} />

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              id="aceptaTerminos"
              checked={terminos === true}
              onCheckedChange={(checked) =>
                setValue(
                  "aceptaTerminos",
                  checked === true ? true : (undefined as unknown as true),
                  { shouldValidate: true },
                )
              }
              className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm text-[#454652] leading-relaxed">
              He leído y acepto los{" "}
              <a
                href="/terminos-condiciones"
                target="_blank"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Términos y Condiciones
              </a>
              .
            </span>
          </label>
          <FieldError message={errors.aceptaTerminos?.message} />
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={enviando}
            className="flex items-center gap-1.5 rounded-xl border-2 border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-[#454652] transition-all hover:border-[#c8c8c8] hover:bg-[#fafafa] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden>arrow_back</span>
            Atrás
          </button>
          <button
            type="submit"
            disabled={!ambosAceptados || enviando}
            className="flex items-center gap-2 rounded-xl bg-secondary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:bg-secondary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {enviando ? (
              <>
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Enviando…
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden
                >
                  send
                </span>
                Enviar solicitud
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
