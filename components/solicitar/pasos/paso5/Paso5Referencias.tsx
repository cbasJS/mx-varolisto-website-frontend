'use client'

import { usePaso5 } from '@/hooks/solicitar/usePaso5'
import type { Paso5Data } from '@/lib/solicitud/schemas/index'
import { StepTitle } from '@/components/wizard/StepTitle'
import { FormActions } from '@/components/wizard/FormActions'
import { FormCard } from '@/components/wizard/FormCard'
import { InfoBanner } from '@/components/forms/InfoBanner'
import { SectionDivider } from '@/components/forms/SectionDivider'
import { RefCard } from './RefCard'
import { pasos } from '@/content/solicitar'

interface Props {
  onNext: (datos: Paso5Data) => void
  onBack: () => void
}

export default function Paso5Referencias({ onNext, onBack }: Props) {
  const { register, handleSubmit, control, errors, isValid } = usePaso5(onNext)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormCard>
        <StepTitle
          numero={5}
          total={pasos.length}
          titulo="Referencias personales"
          subtitulo="Necesitamos dos personas que puedan confirmar tu solicitud."
        />

        <InfoBanner variant="info">
          <strong>Avísales antes de enviar.</strong> Contactaremos a estas personas para confirmar
          tu información. Asegúrate de que estén disponibles.
        </InfoBanner>

        <div>
          <SectionDivider label="Primer contacto" />
          <RefCard prefix="ref1" register={register} control={control} errors={errors} />
        </div>
        <div>
          <SectionDivider label="Segundo contacto" />
          <RefCard prefix="ref2" register={register} control={control} errors={errors} />
        </div>
      </FormCard>

      <FormActions onBack={onBack} submitLabel="Siguiente" disabled={!isValid} />
    </form>
  )
}
