'use client'

import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso1Schema, type Paso1Data } from '@/lib/solicitud/schemas/index'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { useAutoSave } from './useAutoSave'
import { normalizeRegister } from '@/lib/solicitud/utils/normalizeRegister'

export function usePaso2(onNext: (datos: Paso1Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const form = useForm<Paso1Data>({
    resolver: zodResolver(paso1Schema),
    mode: 'onTouched',
    defaultValues: {
      nombre: datos.nombre ?? '',
      apellidoPaterno: datos.apellidoPaterno ?? '',
      apellidoMaterno: datos.apellidoMaterno ?? '',
      sexo: datos.sexo,
      fechaNacimiento: datos.fechaNacimiento ?? '',
      curp: datos.curp ?? '',
      email: datos.email ?? '',
      rfc: datos.rfc ?? undefined,
      telefono: datos.telefono ?? '',
    },
  })

  const {
    register: _register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = form
  const register = normalizeRegister(_register)

  const maxDateNacimiento = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d
  }, [])

  const minDateNacimiento = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 100)
    return d
  }, [])

  const sexoActual = useWatch({ control, name: 'sexo' })
  const telefonoValue = useWatch({ control, name: 'telefono' }) ?? ''
  const curpValue = useWatch({ control, name: 'curp' }) ?? ''

  useAutoSave(watch, 2)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    setValue,
    control,
    errors,
    isValid,
    sexoActual,
    telefonoValue,
    curpValue,
    maxDateNacimiento,
    minDateNacimiento,
  }
}
