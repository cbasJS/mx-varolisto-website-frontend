"use client"

import { useEffect } from "react"
import { AiOutlineFileDone } from "react-icons/ai"
import { useSolicitudStore } from "@/lib/solicitud/store"
import Link from "next/link"
import { exitoCopy as copy } from "@/content/solicitar"

interface Props {
  folio: string
  telefono?: string
}

export default function PantallaExito({ folio, telefono }: Props) {
  const resetForm = useSolicitudStore((s) => s.resetForm)

  useEffect(() => {
    resetForm()
  }, [resetForm])

  return (
    <div className="flex flex-col items-center py-10 text-center">
      {/* Anillo animado de éxito */}
      <div className="relative mb-8">
        {/* Anillos decorativos */}
        <div className="absolute inset-0 -m-4 rounded-full border-2 border-secondary/20 animate-ping" />
        <div className="absolute inset-0 -m-2 rounded-full border border-secondary/10" />
        <div className="relative flex size-24 items-center justify-center rounded-full bg-secondary shadow-2xl shadow-secondary/30">
          <AiOutlineFileDone className="text-4xl text-white" aria-hidden />
        </div>
      </div>

      <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#aaa]">
        {copy.etiquetaRecibida}
      </p>
      <h1 className="mb-2 font-headline text-4xl font-bold text-[#1a1c1c] tracking-tight">
        {copy.titulo}
      </h1>
      <p className="mb-8 text-base text-[#767683]">
        {copy.subtitulo}
      </p>

      {/* Tarjeta de folio */}
      <div className="mb-6 w-full max-w-sm rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary/50">
          {copy.labelFolio}
        </p>
        <p className="font-headline text-3xl font-bold tracking-widest text-primary">
          {folio}
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-white border border-[#e8e8e8] p-3 text-left">
          <span
            className="material-symbols-outlined mt-0.5 shrink-0 text-base text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            bookmark
          </span>
          <p className="text-xs text-[#454652] leading-relaxed">
            {copy.avisoFolio}
          </p>
        </div>
      </div>

      {/* Mensaje de contacto */}
      <div className="mb-8 w-full max-w-sm rounded-2xl border-2 border-[#e8e8e8] bg-white p-5 text-left">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-lg text-[#25D366]"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden
          >
            chat
          </span>
          <span className="text-sm font-bold text-[#1a1c1c]">{copy.labelProximosPasos}</span>
        </div>
        <p className="text-sm text-[#454652] leading-relaxed">
          {copy.mensajeContacto(telefono)}
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl border-2 border-[#e8e8e8] bg-white px-8 py-3 text-sm font-semibold text-[#454652] shadow-sm transition-all hover:border-[#c8c8c8] hover:bg-[#fafafa] active:scale-[0.98]"
      >
        <span className="material-symbols-outlined text-sm" aria-hidden>
          home
        </span>
        {copy.botonInicio}
      </Link>
    </div>
  )
}
