'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePaso3 } from '@/hooks/solicitar/usePaso3'
import type { Paso3Data } from '@/lib/solicitud/schemas/index'
import { ANIOS_VIVIENDO, TIPO_VIVIENDA } from '@varolisto/shared-schemas/enums'
import { ANIOS_VIVIENDO_LABELS, TIPO_VIVIENDA_LABELS } from '@/lib/solicitud/utils/lookup-labels'
import { FloatingInput } from '../../FloatingInput'
import { FloatingSelect } from '../../FloatingSelect'
import { SectionDivider } from '../../SectionDivider'
import { StepTitle } from '../../StepTitle'
import { FormActions } from '../../FormActions'
import { CamposCP } from './CamposCP'

interface Props {
  onNext: (datos: Paso3Data) => void
  onBack: () => void
}

export default function Paso3Domicilio({ onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isValid,
    coloniaActual,
    codigoPostalValue,
    cpValido,
    colonias,
    cargandoCP,
    cpError,
    cpServiceError,
    aniosViviendoActual,
    tipoViviendaActual,
    aniosViviendoOpen,
    setAniosViviendoOpen,
    tipoViviendaOpen,
    setTipoViviendaOpen,
  } = usePaso3(onNext)

  useEffect(() => {
    if (cpServiceError) {
      toast.error(cpServiceError)
    }
  }, [cpServiceError])

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepTitle
        numero={3}
        titulo="Tu domicilio"
        subtitulo="Usamos tu código postal para encontrar tu colonia automáticamente."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* CP */}
        <div>
          <FloatingInput
            label="Código postal"
            required
            error={errors.codigoPostal?.message}
            {...register('codigoPostal')}
            placeholder=" "
            maxLength={5}
            inputMode="numeric"
            suffix={
              <span className="tabular-nums text-xs text-outline">
                {codigoPostalValue.length}/5
              </span>
            }
          />
          {cpValido && cpError && (
            <p className="mt-1.5 text-xs text-error">Código postal no encontrado</p>
          )}
        </div>

        {cpValido && !cpError && (
          <CamposCP
            cargandoCP={cargandoCP}
            colonias={colonias}
            coloniaActual={coloniaActual}
            errors={errors}
            setValue={setValue}
            register={register}
          />
        )}

        <FloatingInput
          label="Calle"
          required
          error={errors.calle?.message}
          {...register('calle')}
          placeholder=" "
        />
        <FloatingInput
          label="Número exterior"
          required
          error={errors.numeroExterior?.message}
          {...register('numeroExterior')}
          placeholder=" "
        />
        <FloatingInput
          label="Número interior"
          optional
          {...register('numeroInterior')}
          placeholder=" "
        />
      </div>

      <SectionDivider label="Situación de vivienda" />

      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingSelect
          label="Tiempo viviendo aquí"
          required
          value={aniosViviendoActual}
          onValueChange={(val) =>
            setValue('aniosViviendo', val as (typeof ANIOS_VIVIENDO)[number], {
              shouldValidate: true,
            })
          }
          onOpenChange={setAniosViviendoOpen}
          isOpen={aniosViviendoOpen}
          options={ANIOS_VIVIENDO.map((v) => ({ value: v, label: ANIOS_VIVIENDO_LABELS[v] }))}
          error={errors.aniosViviendo?.message}
        />
        <FloatingSelect
          label="Tipo de vivienda"
          required
          value={tipoViviendaActual}
          onValueChange={(val) =>
            setValue('tipoVivienda', val as (typeof TIPO_VIVIENDA)[number], {
              shouldValidate: true,
            })
          }
          onOpenChange={setTipoViviendaOpen}
          isOpen={tipoViviendaOpen}
          options={TIPO_VIVIENDA.map((v) => ({ value: v, label: TIPO_VIVIENDA_LABELS[v] }))}
          error={errors.tipoVivienda?.message}
        />
      </div>

      <FormActions onBack={onBack} submitLabel="Continuar" disabled={!isValid} />
    </form>
  )
}
