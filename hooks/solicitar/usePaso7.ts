'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso7Schema, type Paso7Data } from '@/lib/solicitud/schemas/index'

export function usePaso7(onSubmit: (datos: Paso7Data) => void) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Paso7Data>({
    resolver: zodResolver(paso7Schema),
    defaultValues: { aceptaPrivacidad: undefined, aceptaTerminos: undefined },
  })

  const privacidad = watch('aceptaPrivacidad')
  const terminos = watch('aceptaTerminos')
  const ambosAceptados = privacidad === true && terminos === true

  return {
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    errors,
    privacidad,
    terminos,
    ambosAceptados,
  }
}
