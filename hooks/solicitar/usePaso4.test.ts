// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { usePaso4 } from './usePaso4'
import { useSolicitudStore } from '@/lib/solicitud/store'

// Resto de campos válidos del paso 4 para que el .refine() cruzado del schema
// (gastoMensual <= ingresoMensual) llegue a evaluarse — Zod cortocircuita si
// la validación base del z.object falla.
const datosBase = {
  tipoActividad: 'empleado_formal' as const,
  nombreEmpleadorNegocio: 'Mi Empresa SA',
  antiguedad: 'mas_2' as const,
  estadoCivil: 'soltero' as const,
  dependientesEconomicos: 'ninguno' as const,
}

const evt = (value: string) =>
  ({ target: { value } }) as unknown as React.ChangeEvent<HTMLInputElement>

describe('usePaso4 — validación cruzada gasto vs ingreso', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      datos: { ...datosBase },
      pasoActual: 4,
      sessionUuid: 'session-06600-abc',
    })
  })

  it('expone errors.gastoMensual cuando el gasto excede al ingreso, aun si el ingreso se ingresa DESPUÉS del gasto', async () => {
    const { result } = renderHook(() => usePaso4(vi.fn()))

    // 1) Usuario llena gasto primero (ej. $10,000 mensual).
    act(() => {
      result.current.gastoHandlers.onChange(evt('10000'))
    })

    // 2) Usuario llena ingreso después y resulta menor que el gasto ($5,000).
    act(() => {
      result.current.ingresoHandlers.onChange(evt('5000'))
    })

    // El refine cruzado del schema (path: ['gastoMensual']) debe propagarse al
    // formState para que el FieldError pueda renderizar el mensaje. Sin esto,
    // el botón Continuar queda disabled (isValid=false) pero el usuario no ve
    // explicación.
    await waitFor(() => {
      expect(result.current.errors.gastoMensual?.message).toBe(
        'Tus gastos mensuales no pueden superar tus ingresos',
      )
    })
  })

  it('expone errors.gastoMensual cuando el gasto excede al ingreso en el orden inverso (ingreso primero, gasto después)', async () => {
    const { result } = renderHook(() => usePaso4(vi.fn()))

    act(() => {
      result.current.ingresoHandlers.onChange(evt('5000'))
    })

    act(() => {
      result.current.gastoHandlers.onChange(evt('10000'))
    })

    await waitFor(() => {
      expect(result.current.errors.gastoMensual?.message).toBe(
        'Tus gastos mensuales no pueden superar tus ingresos',
      )
    })
  })

  it('limpia errors.gastoMensual cuando el usuario corrige el ingreso para que sea mayor que el gasto', async () => {
    const { result } = renderHook(() => usePaso4(vi.fn()))

    act(() => {
      result.current.gastoHandlers.onChange(evt('10000'))
    })
    act(() => {
      result.current.ingresoHandlers.onChange(evt('5000'))
    })

    await waitFor(() => {
      expect(result.current.errors.gastoMensual?.message).toBe(
        'Tus gastos mensuales no pueden superar tus ingresos',
      )
    })

    // Usuario sube su ingreso a $15,000 — ahora gasto $10,000 <= ingreso $15,000.
    act(() => {
      result.current.ingresoHandlers.onChange(evt('15000'))
    })

    await waitFor(() => {
      expect(result.current.errors.gastoMensual).toBeUndefined()
    })
  })
})
