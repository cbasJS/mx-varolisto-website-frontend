'use client'

import { usePaso5 } from '@/hooks/solicitar/usePaso5'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { StepTitle } from '../../StepTitle'
import { FormActions } from '../../FormActions'
import { InfoBanner } from '../../InfoBanner'
import { RefCard } from './RefCard'

interface Props {
  onNext: (datos: Paso5Data) => void
  onBack: () => void
}

export default function Paso5Referencias({ onNext, onBack }: Props) {
  const { register, handleSubmit, control, errors, isValid } = usePaso5(onNext)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={5}
        titulo="Referencias personales"
        subtitulo="Necesitamos dos personas que puedan confirmar tu solicitud."
      />

      <InfoBanner variant="info">
        <strong>Avísales antes de enviar.</strong> Contactaremos a estas personas para confirmar tu
        información. Asegúrate de que estén disponibles.
      </InfoBanner>

      <div className="mt-5 space-y-4">
        <RefCard numero={1} prefix="ref1" register={register} control={control} errors={errors} />
        <RefCard numero={2} prefix="ref2" register={register} control={control} errors={errors} />
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
