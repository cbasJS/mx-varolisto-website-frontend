'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso2Schema, type Paso2Data } from '@/lib/solicitud/schemas/index'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { calcularCuota, TASA_MENSUAL } from '@/lib/solicitud/utils/calcularCuota'
import { useAutoSave } from './useAutoSave'

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
      destinoPrestamo: datos.destinoPrestamo,
    },
  })

  const monto = watch('montoSolicitado') ?? 5000
  const plazoStr = watch('plazoMeses') ?? '3'
  const plazo = parseInt(plazoStr, 10)
  const destino = watch('destinoPrestamo')
  const cuota = calcularCuota(monto, plazo)

  useAutoSave(watch, 1)

  return {
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    errors,
    isValid,
    monto,
    plazoStr,
    destino,
    cuota,
    TASA_MENSUAL,
  }
}
