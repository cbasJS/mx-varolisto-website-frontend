// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
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
    useSolicitudStore.setState({ datos: { destinoPrestamo: 'gastos_medicos' } })
    const { result } = renderHook(() => usePaso1(vi.fn()))
    expect(result.current.destino).toBe('gastos_medicos')
  })
})
