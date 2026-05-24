'use client'

import { Plus } from 'lucide-react'
import { usePaso5 } from '@/hooks/solicitar/usePaso5'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { StepTitle } from '@/components/wizard/StepTitle'
import { PasoFormShell } from '@/components/wizard/PasoFormShell'
import { InfoBanner } from '@/components/forms/InfoBanner'
import { SectionDivider } from '@/components/forms/SectionDivider'
import { RefCard } from './RefCard'

interface Props {
  onNext: (datos: Paso5Data) => void
  onBack: () => void
  actionsSlot: HTMLElement | null
}

export default function Paso5Referencias({ onNext, onBack, actionsSlot }: Props) {
  const { handleSubmit, control, errors, isValid, fields, remove, agregarReferencia } =
    usePaso5(onNext)

  return (
    <PasoFormShell
      onSubmit={handleSubmit}
      onBack={onBack}
      disabled={!isValid}
      actionsSlot={actionsSlot}
    >
      <StepTitle
        titulo="Contactos de confianza"
        subtitulo="Personas que puedan confirmar quién eres si las llamamos."
      />

      <InfoBanner variant="info">
        Agrega al menos 1 referencia. Más referencias mejoran tu evaluación.{' '}
        <strong>Coméntales que pueden recibir nuestra llamada o WhatsApp.</strong>
      </InfoBanner>

      {fields.map((field, index) => (
        <div key={field.id}>
          <SectionDivider
            label={index === 0 ? 'Contacto 1 (obligatoria)' : `Contacto ${index + 1}`}
          />
          <RefCard
            index={index}
            control={control}
            errors={errors}
            canRemove={index > 0}
            onRemove={() => remove(index)}
          />
        </div>
      ))}

      <div className="pt-2">
        <button
          type="button"
          onClick={agregarReferencia}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-outline-variant px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="size-4" aria-hidden />
          <span>Agregar referencia</span>
        </button>
      </div>
    </PasoFormShell>
  )
}
