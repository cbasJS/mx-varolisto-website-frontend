// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePaso1 } from './usePaso1'
import { useSolicitudStore } from '@/lib/solicitud/store'

describe('usePaso1 — defaults', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      datos: {},
      pasoActual: 1,
      archivosSubidos: [],
      tipoIdentificacion: null,
      sessionUuid: 'session-06600-abc',
    })
  })

  it("preselecciona 'liquidar_deuda' cuando el store no tiene destinoPrestamo", () => {
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.destino).toBe('liquidar_deuda')
  })

  it('respeta destinoPrestamo previo del store', () => {
    useSolicitudStore.setState({ datos: { destinoPrestamo: 'gasto_medico' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.destino).toBe('gasto_medico')
  })
})

describe('usePaso1 — plazosDisponibles', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      datos: {},
      pasoActual: 1,
      archivosSubidos: [],
      tipoIdentificacion: null,
      sessionUuid: 'session-06600-abc',
    })
  })

  it("expone plazosDisponibles ['2','3','4'] para un monto de $5,000", () => {
    useSolicitudStore.setState({ datos: { montoSolicitado: 5000, plazoMeses: '3' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.plazosDisponibles).toEqual(['2', '3', '4'])
  })

  it("expone plazosDisponibles ['2','3'] para un monto de $3,000", () => {
    useSolicitudStore.setState({ datos: { montoSolicitado: 3000, plazoMeses: '3' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.plazosDisponibles).toEqual(['2', '3'])
  })

  it("expone plazosDisponibles ['2','3','4','5','6'] para un monto de $15,000", () => {
    useSolicitudStore.setState({ datos: { montoSolicitado: 15000, plazoMeses: '6' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.plazosDisponibles).toEqual(['2', '3', '4', '5', '6'])
  })

  it('auto-ajusta plazoMeses al máximo disponible cuando el monto baja y el plazo actual queda fuera de rango', () => {
    // Arranca con monto alto y plazo 6 (válido para 15000).
    useSolicitudStore.setState({ datos: { montoSolicitado: 15000, plazoMeses: '6' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.plazoStr).toBe('6')

    // Bajamos el monto a 3000 → plazos válidos ['2','3'] → 6 ya no está en rango.
    act(() => {
      result.current.setValue('montoSolicitado', 3000, { shouldValidate: true })
    })

    // El efecto debe re-ajustar a getPlazoMaximo(3000) = '3'.
    expect(result.current.plazoStr).toBe('3')
    expect(result.current.plazosDisponibles).toEqual(['2', '3'])
  })

  it('NO modifica plazoMeses cuando el plazo actual sigue dentro de los plazos disponibles', () => {
    useSolicitudStore.setState({ datos: { montoSolicitado: 15000, plazoMeses: '3' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.plazoStr).toBe('3')

    // Bajamos a 5000 → plazos válidos ['2','3','4'] → '3' sigue siendo válido.
    act(() => {
      result.current.setValue('montoSolicitado', 5000, { shouldValidate: true })
    })

    expect(result.current.plazoStr).toBe('3')
    expect(result.current.plazosDisponibles).toEqual(['2', '3', '4'])
  })
})
