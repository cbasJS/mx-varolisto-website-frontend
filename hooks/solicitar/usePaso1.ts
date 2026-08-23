'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso2Schema, type Paso2Data } from '@/lib/solicitud/schemas/index'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { calcularCuota, TASA_MENSUAL } from '@/lib/solicitud/utils/calcularCuota'
import { getPlazoMaximo, getPlazosDisponibles } from '@varolisto/shared-schemas/domain'
import { useAutoSave } from './useAutoSave'
import { useEdicionesTracking } from '@/lib/solicitud/infrastructure/telemetria'

export function usePaso1(onNext: (datos: Paso2Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Paso2Data>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      montoSolicitado: datos.montoSolicitado ?? 5000,
      plazoMeses: datos.plazoMeses ?? '3',
      destinoPrestamo: datos.destinoPrestamo ?? 'liquidar_deuda',
    },
  })

  const monto = watch('montoSolicitado') ?? 5000
  const plazoStr = watch('plazoMeses') ?? '3'
  const plazo = parseInt(plazoStr, 10)
  const destino = watch('destinoPrestamo')
  const cuota = calcularCuota(monto, plazo)
  const plazosDisponibles = getPlazosDisponibles(monto)

  // Si el monto cambia y el plazo actualmente seleccionado ya no está dentro
  // de los plazos disponibles para ese monto, lo re-ajustamos al máximo
  // permitido. Esto evita estados inválidos del form al mover el slider de
  // monto hacia abajo.
  useEffect(() => {
    if (!plazosDisponibles.includes(plazoStr)) {
      setValue('plazoMeses', getPlazoMaximo(monto), { shouldValidate: true })
    }
  }, [monto, plazoStr, plazosDisponibles, setValue])

  useAutoSave(watch, 1)
  useEdicionesTracking(watch)

  return {
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    errors,
    isValid,
    monto,
    plazoStr,
    plazosDisponibles,
    destino,
    cuota,
    TASA_MENSUAL,
  }
}
