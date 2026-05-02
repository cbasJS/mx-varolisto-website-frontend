'use client'

import { cn } from '@/lib/utils'
import { pasos as PASOS } from '@/content/solicitar'

interface BarraPasosProps {
  pasoActual: number
}

export default function BarraPasos({ pasoActual }: BarraPasosProps) {
  const progreso = Math.round(((pasoActual - 1) / (PASOS.length - 1)) * 100)

  return (
    <>
      {/* ── Mobile: barra minimalista ──────────────────────────────── */}
      <div className="mb-6 md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Paso {pasoActual} de {PASOS.length}
          </span>
          <span className="text-xs font-bold text-secondary">{PASOS[pasoActual - 1].etiqueta}</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/10">
          <div
            className="h-1 rounded-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* ── Desktop: pills horizontales ────────────────────────────── */}
      <div className="mb-8 hidden md:block px-4">
        <div className="flex items-center">
          {PASOS.map((paso, i) => {
            const completado = paso.numero < pasoActual
            const actual = paso.numero === pasoActual
            const pendiente = paso.numero > pasoActual

            return (
              <div key={paso.numero} className="flex flex-1 items-center">
                {/* Nodo */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'relative flex size-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                      completado && 'bg-secondary text-white shadow-lg shadow-secondary/30',
                      actual && 'bg-white text-primary shadow-xl ring-4 ring-white/20',
                      pendiente && 'bg-white/10 text-white/40',
                    )}
                  >
                    {completado ? (
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'material-symbols-outlined text-sm',
                          actual ? 'text-primary' : 'text-white/40',
                        )}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {paso.icono}
                      </span>
                    )}
                    {actual && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-1.5 text-[9px] font-semibold tracking-wide transition-colors',
                      actual ? 'text-white' : completado ? 'text-secondary' : 'text-white/30',
                    )}
                  >
                    {paso.etiqueta}
                  </span>
                </div>

                {/* Línea conectora */}
                {i < PASOS.length - 1 && (
                  <div className="relative mx-1 h-px flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-secondary transition-all duration-500 ease-out"
                      style={{ width: completado ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
