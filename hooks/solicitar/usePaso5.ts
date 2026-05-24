'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso5Schema, type Paso5Data, type Referencia } from '@/lib/solicitud/schemas/index'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { useAutoSave } from './useAutoSave'
import { useEdicionesTracking } from '@/lib/solicitud/infrastructure/telemetria'
import { normalizeRegister } from '@/lib/solicitud/utils/normalizeRegister'

// Fila por defecto para una referencia vacía. Se usa tanto al inicializar
// el formulario sin datos previos como al hacer click en "+ Agregar
// referencia". `relacion: undefined` deja el select sin selección hasta
// que el usuario elija — el schema marca `relacion` como requerido y la
// validación atrapará el caso de envío sin elegir.
const referenciaVacia = (): Referencia =>
  ({ nombre: '', telefono: '', relacion: undefined, email: '' }) as unknown as Referencia

export function usePaso5(onNext: (datos: Paso5Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const form = useForm<Paso5Data>({
    resolver: zodResolver(paso5Schema),
    mode: 'onChange',
    defaultValues: {
      // Siempre arrancamos con al menos 1 referencia (la obligatoria). Si
      // la sesión ya tenía referencias capturadas, las hidratamos tal cual.
      referencias:
        datos.referencias && datos.referencias.length > 0 ? datos.referencias : [referenciaVacia()],
    },
  })

  const {
    register: _register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referencias',
  })

  const register = normalizeRegister(_register)

  useAutoSave(watch, 5)
  useEdicionesTracking(watch)

  const agregarReferencia = () => append(referenciaVacia())

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    watch,
    errors,
    isValid,
    fields,
    append,
    remove,
    agregarReferencia,
  }
}
