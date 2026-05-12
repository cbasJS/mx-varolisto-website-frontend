'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paso4Schema, type Paso4Data } from '@/lib/solicitud/schemas/index'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { GASTO_MENSUAL_MIN, GASTO_MENSUAL_STEP } from '@varolisto/shared-schemas'
import { normalizarGastoAlStep } from '@/lib/solicitud/domain/solicitud/gastoMensualStepper'
import {
  initCurrencyDisplay,
  formatCurrencyOnChange,
  formatCurrencyOnBlur,
  formatCurrencyOnFocus,
} from '@/lib/solicitud/utils/formatCurrency'
import { useAutoSave } from './useAutoSave'
import { normalizeRegister } from '@/lib/solicitud/utils/normalizeRegister'

export function usePaso4(onNext: (datos: Paso4Data) => void) {
  const datos = useSolicitudStore((s) => s.datos)

  const {
    register: _register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<Paso4Data>({
    resolver: zodResolver(paso4Schema),
    defaultValues: {
      tipoActividad: datos.tipoActividad,
      nombreEmpleadorNegocio: datos.nombreEmpleadorNegocio ?? '',
      antiguedad: datos.antiguedad,
      estadoCivil: datos.estadoCivil,
      dependientesEconomicos: datos.dependientesEconomicos,
      ingresoMensual: datos.ingresoMensual,
      gastoMensual: datos.gastoMensual,
      // Bloque 1.A — la UI ya no muestra "Otros compromisos". Hardcodeamos
      // estos campos del contrato viejo para que el schema (que aún los
      // exige) valide. buildPayload también los hardcodea (defense in depth).
      tieneDeudas: 'no',
      cantidadDeudas: 'sin_deudas',
      montoTotalDeudas: undefined,
      pagoMensualDeudas: undefined,
    },
  })

  const register = normalizeRegister(_register)

  const [ingresoDisplay, setIngresoDisplay] = useState<string>(
    initCurrencyDisplay(datos.ingresoMensual),
  )
  const [gastoDisplay, setGastoDisplay] = useState<string>(initCurrencyDisplay(datos.gastoMensual))
  const [antiguedadOpen, setAntiguedadOpen] = useState(false)
  const [estadoCivilOpen, setEstadoCivilOpen] = useState(false)
  const [dependientesOpen, setDependientesOpen] = useState(false)

  const tipoActividad = watch('tipoActividad')
  const antiguedadActual = watch('antiguedad')
  const estadoCivilActual = watch('estadoCivil')
  const dependientesActual = watch('dependientesEconomicos')
  const gastoMensualActual = watch('gastoMensual')

  const labelEmpleador =
    tipoActividad === 'negocio_propio'
      ? 'Nombre de tu negocio'
      : tipoActividad === 'independiente'
        ? 'Actividad principal'
        : 'Empresa / Empleador'

  const ingresoHandlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { display, num } = formatCurrencyOnChange(e.target.value)
      setIngresoDisplay(display)
      setValue('ingresoMensual', num as number, { shouldValidate: true })
      // El refine cruzado de paso4Schema asigna el error a path ['gastoMensual'].
      // RHF, al hacer shouldValidate sobre 'ingresoMensual', solo aplica errores
      // de ese path al formState — el cruzado quedaría invisible. Forzamos la
      // revalidación de gastoMensual para que el mensaje sí aparezca.
      void trigger('gastoMensual')
    },
    onBlur: () => setIngresoDisplay(formatCurrencyOnBlur(ingresoDisplay)),
    onFocus: () => setIngresoDisplay(formatCurrencyOnFocus(ingresoDisplay)),
  }

  const setGastoMensual = (num: number) => {
    setGastoDisplay(initCurrencyDisplay(num))
    setValue('gastoMensual', num, { shouldValidate: true, shouldDirty: true })
  }

  const gastoHandlers = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { display, num } = formatCurrencyOnChange(e.target.value)
      setGastoDisplay(display)
      setValue('gastoMensual', num as number, { shouldValidate: true })
    },
    onBlur: () => {
      // Normaliza al múltiplo de $500 más cercano al perder el foco.
      const sinFormato = parseFloat(gastoDisplay.replace(/,/g, ''))
      if (!isNaN(sinFormato)) {
        const normalizado = normalizarGastoAlStep(sinFormato)
        setGastoMensual(normalizado)
      } else {
        setGastoDisplay(formatCurrencyOnBlur(gastoDisplay))
      }
    },
    onFocus: () => setGastoDisplay(formatCurrencyOnFocus(gastoDisplay)),
  }

  const incrementarGasto = () => {
    const base =
      typeof gastoMensualActual === 'number' && !isNaN(gastoMensualActual)
        ? gastoMensualActual
        : GASTO_MENSUAL_MIN
    setGastoMensual(normalizarGastoAlStep(base + GASTO_MENSUAL_STEP))
  }

  const decrementarGasto = () => {
    const base =
      typeof gastoMensualActual === 'number' && !isNaN(gastoMensualActual)
        ? gastoMensualActual
        : GASTO_MENSUAL_MIN
    setGastoMensual(normalizarGastoAlStep(base - GASTO_MENSUAL_STEP))
  }

  const puedeDecrementarGasto =
    typeof gastoMensualActual === 'number' && gastoMensualActual > GASTO_MENSUAL_MIN

  useAutoSave(watch, 4)

  return {
    register,
    handleSubmit: handleSubmit(onNext),
    control,
    setValue,
    errors,
    isValid,
    tipoActividad,
    antiguedadActual,
    antiguedadOpen,
    setAntiguedadOpen,
    estadoCivilActual,
    estadoCivilOpen,
    setEstadoCivilOpen,
    dependientesActual,
    dependientesOpen,
    setDependientesOpen,
    labelEmpleador,
    ingresoDisplay,
    ingresoHandlers,
    gastoDisplay,
    gastoHandlers,
    incrementarGasto,
    decrementarGasto,
    puedeDecrementarGasto,
  }
}
