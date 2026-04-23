"use client";

import { useState } from "react";
import { usePaso6 } from "@/hooks/solicitar/usePaso6";
import { useSolicitudStore } from "@/lib/solicitud-store";
import type { Paso6Data } from "@/lib/solicitud-schema";
import {
  DESTINO_LABELS,
  ACTIVIDAD_LABELS,
  RELACION_LABELS,
  ANTIGUEDAD_LABELS,
  maskClabe,
} from "@/lib/solicitud/utils/lookup-labels";
import { Checkbox } from "@/components/ui/checkbox";
import { StepTitle, FieldError } from "../FormUI";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (datos: Paso6Data) => void;
  onBack: () => void;
  onEditarPaso: (paso: number) => void;
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

export default function Paso6Revision({
  onSubmit,
  onBack,
  onEditarPaso,
}: Props) {
  const datos = useSolicitudStore((s) => s.datos);
  const comprobantes = useSolicitudStore((s) => s.comprobantes);

  const {
    handleSubmit,
    setValue,
    errors,
    privacidad,
    terminos,
    ambosAceptados,
  } = usePaso6(onSubmit);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={6}
        titulo="Revisa tu solicitud"
        subtitulo="Confirma que todo esté correcto antes de enviar."
      />

      <div className="space-y-3 mb-8">
        <SeccionCard
          titulo="Perfil"
          paso={1}
          onEditar={onEditarPaso}
          icono="person"
        >
          <Fila
            label="Nombre"
            value={`${datos.nombre ?? ""} ${datos.apellidoPaterno ?? ""} ${datos.apellidoMaterno ?? ""}`.trim()}
          />
          <Fila label="CURP" value={datos.curp} />
          <Fila label="Correo" value={datos.email} />
          <Fila label="Teléfono" value={datos.telefono} />
          <Fila
            label="Dirección"
            value={
              datos.calle
                ? `${datos.calle} ${datos.numeroExterior ?? ""}, ${datos.colonia ?? ""}, ${datos.municipio ?? ""} CP ${datos.codigoPostal ?? ""}`
                : undefined
            }
          />
        </SeccionCard>

        <SeccionCard
          titulo="Importe"
          paso={2}
          onEditar={onEditarPaso}
          icono="payments"
        >
          <Fila
            label="Monto"
            value={
              datos.montoSolicitado
                ? `$${datos.montoSolicitado.toLocaleString("es-MX")}`
                : undefined
            }
          />
          <Fila
            label="Plazo"
            value={datos.plazoMeses ? `${datos.plazoMeses} meses` : undefined}
          />
          <Fila
            label="Primer crédito"
            value={datos.primerCredito === "si" ? "Sí" : "No"}
          />
          <Fila
            label="Destino"
            value={
              datos.destinoPrestamo
                ? datos.destinoPrestamo === "otro"
                  ? `Otro: ${datos.destinoOtro ?? ""}`
                  : DESTINO_LABELS[datos.destinoPrestamo]
                : undefined
            }
          />
        </SeccionCard>

        <SeccionCard
          titulo="Ingresos"
          paso={3}
          onEditar={onEditarPaso}
          icono="account_balance_wallet"
        >
          <Fila
            label="Actividad"
            value={
              datos.tipoActividad
                ? ACTIVIDAD_LABELS[datos.tipoActividad]
                : undefined
            }
          />
          <Fila
            label="Empleador / Negocio"
            value={datos.nombreEmpleadorNegocio}
          />
          <Fila
            label="Antigüedad"
            value={datos.antiguedad ? ANTIGUEDAD_LABELS[datos.antiguedad] : undefined}
          />
          <Fila
            label="Ingreso mensual"
            value={
              datos.ingresoMensual
                ? `$${datos.ingresoMensual.toLocaleString("es-MX")}`
                : undefined
            }
          />
          <Fila
            label="Tiene deudas"
            value={datos.tieneDeudas === "si" ? "Sí" : "No"}
          />
        </SeccionCard>

        <SeccionCard
          titulo="Referencias"
          paso={4}
          onEditar={onEditarPaso}
          icono="group"
        >
          <SubLabel>Referencia 1</SubLabel>
          <Fila label="Nombre" value={datos.ref1Nombre} />
          <Fila label="Teléfono" value={datos.ref1Telefono} />
          <Fila
            label="Relación"
            value={
              datos.ref1Relacion
                ? RELACION_LABELS[datos.ref1Relacion]
                : undefined
            }
          />
          {datos.ref1Email && <Fila label="Correo" value={datos.ref1Email} />}
          <SubLabel>Referencia 2</SubLabel>
          <Fila label="Nombre" value={datos.ref2Nombre} />
          <Fila label="Teléfono" value={datos.ref2Telefono} />
          <Fila
            label="Relación"
            value={
              datos.ref2Relacion
                ? RELACION_LABELS[datos.ref2Relacion]
                : undefined
            }
          />
          {datos.ref2Email && <Fila label="Correo" value={datos.ref2Email} />}
        </SeccionCard>

        <SeccionCard
          titulo="Documentos y CLABE"
          paso={5}
          onEditar={onEditarPaso}
          icono="folder_open"
        >
          <Fila
            label="Comprobantes"
            value={`${comprobantes.length} archivo${comprobantes.length !== 1 ? "s" : ""}`}
          />
          <Fila
            label="CLABE"
            value={datos.clabe ? maskClabe(datos.clabe) : undefined}
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
          className="flex items-center gap-1.5 rounded-xl border-2 border-[#e8e8e8] bg-white px-6 py-3 text-sm font-semibold text-[#454652] transition-all hover:border-[#c8c8c8] hover:bg-[#fafafa] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            arrow_back
          </span>
          Atrás
        </button>
        <button
          type="submit"
          disabled={!ambosAceptados}
          className="flex items-center gap-2 rounded-xl bg-secondary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:bg-secondary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            send
          </span>
          Enviar solicitud
        </button>
      </div>
    </form>
  );
}
