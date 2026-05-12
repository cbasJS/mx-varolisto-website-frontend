// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSolicitudStore } from '@/lib/solicitud/store'
import { useTelemetriaCapture } from './useTelemetriaCapture'

function resetStore() {
  useSolicitudStore.setState({
    pasoActual: 1,
    datos: {},
    timestampInicio: Date.now(),
    iniciadoEn: null,
    sessionUuid: null,
    archivosSubidos: [],
    tipoIdentificacion: null,
    comprobantes: [],
    tiemposPaso: {
      paso1Ms: null,
      paso2Ms: null,
      paso3Ms: null,
      paso4Ms: null,
      paso5Ms: null,
      paso6Ms: null,
      paso7Ms: null,
    },
    pasoActualEntrada: null,
    edicionesPorCampo: {},
    _hasHydrated: true,
  } as never)
  sessionStorage.clear()
}

describe('useTelemetriaCapture', () => {
  beforeEach(() => {
    resetStore()
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 844, configurable: true })
    Object.defineProperty(document, 'referrer', { value: '', configurable: true })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('inicializa iniciadoEn y sessionUuid al montar', async () => {
    renderHook(() => useTelemetriaCapture())
    await act(async () => {
      await Promise.resolve()
    })
    const s = useSolicitudStore.getState()
    expect(s.iniciadoEn).toBeTruthy()
    expect(s.sessionUuid).toBeTruthy()
  })

  it('marca la entrada al paso actual cuando hasHydrated=true', async () => {
    useSolicitudStore.setState({ pasoActual: 2, _hasHydrated: true } as never)
    renderHook(() => useTelemetriaCapture())
    await act(async () => {
      await Promise.resolve()
    })
    expect(useSolicitudStore.getState().pasoActualEntrada).not.toBeNull()
  })

  it('al cambiar pasoActual, acumula el tiempo del paso previo', async () => {
    useSolicitudStore.setState({ pasoActual: 2, _hasHydrated: true } as never)
    const { rerender } = renderHook(() => useTelemetriaCapture())
    await act(async () => {
      await Promise.resolve()
    })
    // Simulamos avance al paso 3 — la entrada anterior se acumula en paso2Ms.
    await act(async () => {
      useSolicitudStore.setState({ pasoActual: 3 } as never)
    })
    rerender()
    await act(async () => {
      await Promise.resolve()
    })
    const tiempos = useSolicitudStore.getState().tiemposPaso
    expect(tiempos.paso2Ms).not.toBeNull()
    expect(tiempos.paso2Ms!).toBeGreaterThanOrEqual(0)
  })

  it('getTelemetriaPayload devuelve un bloque listo con dispositivo + tiemposPaso', async () => {
    useSolicitudStore.setState({ pasoActual: 7, _hasHydrated: true } as never)
    const { result } = renderHook(() => useTelemetriaCapture())
    await act(async () => {
      // Esperamos a que las captures async (fingerprint, geo) terminen.
      await new Promise((r) => setTimeout(r, 10))
    })
    const payload = result.current.getTelemetriaPayload()
    expect(payload).not.toBeNull()
    expect(payload?.iniciadoEn).toBeTruthy()
    expect(payload?.dispositivo.viewport.width).toBe(390)
    // tiempoCapturaFormularioMs siempre es número (puede ser 0 si nada se midió).
    expect(typeof payload?.tiempoCapturaFormularioMs).toBe('number')
  })

  it('NO incluye geolocalización cuando el feature flag está apagado', async () => {
    const original = process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
    delete process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
    useSolicitudStore.setState({ pasoActual: 7, _hasHydrated: true } as never)
    const { result } = renderHook(() => useTelemetriaCapture())
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })
    const payload = result.current.getTelemetriaPayload()
    expect(payload?.geolocalizacion).toBeUndefined()
    if (original !== undefined) process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = original
  })
})
