'use client'

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
  const { register, handleSubmit, control, errors, isValid } = usePaso5(onNext)

  return (
    <PasoFormShell
      onSubmit={handleSubmit}
      onBack={onBack}
      disabled={!isValid}
      actionsSlot={actionsSlot}
    >
      <StepTitle
        titulo="Dos contactos de confianza"
        subtitulo="Personas que puedan confirmar quién eres si las llamamos."
      />

      <InfoBanner variant="info">
        <strong>Coméntales que pueden recibir nuestra llamada o WhatsApp.</strong> Sólo es para
        validar quién eres — no se les pide nada más.
      </InfoBanner>

      <div>
        <SectionDivider label="Contacto 1" />
        <RefCard prefix="ref1" register={register} control={control} errors={errors} />
      </div>
      <div>
        <SectionDivider label="Contacto 2" />
        <RefCard prefix="ref2" register={register} control={control} errors={errors} />
      </div>
    </PasoFormShell>
  )
}
