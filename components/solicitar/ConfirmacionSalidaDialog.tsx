"use client"

import { AlertDialog, AlertDialogOverlay, AlertDialogPortal } from "@/components/ui/alert-dialog"
import { salidaCopy } from "@/content/solicitar"

interface Props {
  open: boolean
  variante: "submitting" | "archivos" | "datos"
  onQuedarme: () => void
  onSalir: () => void
}

export default function ConfirmacionSalidaDialog({ open, variante, onQuedarme, onSalir }: Props) {
  const { titulo, descripcion } = salidaCopy[variante]

  return (
    <AlertDialog open={open}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-[1px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#000e8a] via-primary to-[#00044a] shadow-[0_32px_80px_rgba(0,6,102,0.45)] ring-1 ring-white/10">

            <div
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary/20 blur-3xl"
            />

            <div className="relative px-6 pb-6 pt-6">

              {/* Título */}
              <h2 className="font-headline text-[22px] font-extrabold leading-tight tracking-tight text-white mb-2">
                {titulo}
              </h2>

              {/* Descripción */}
              <p className="font-body text-sm leading-relaxed text-white/65 mb-6">
                {descripcion}
              </p>

              {/* Separador */}
              <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Botones */}
              <div className="flex flex-col gap-3">
                {/* CTA principal — verde */}
                <button
                  onClick={onQuedarme}
                  className="group relative w-full overflow-hidden rounded-2xl bg-secondary px-5 py-3.5 font-headline text-[15px] font-bold text-primary shadow-[0_4px_20px_rgba(46,204,113,0.35)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(46,204,113,0.55)] hover:brightness-105 active:scale-[0.98]"
                >
                  {/* Shimmer */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative">{salidaCopy.botonQuedarme}</span>
                </button>

                {/* Acción secundaria — ghost */}
                <button
                  onClick={onSalir}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-headline text-[14px] font-medium text-white/55 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white/80 active:scale-[0.98]"
                >
                  {salidaCopy.botonSalir}
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlertDialogPortal>
    </AlertDialog>
  )
}
