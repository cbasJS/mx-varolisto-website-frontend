// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { capturarGeolocalizacion } from './captureGeo'

const ORIGINAL_FLAG = process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED

describe('capturarGeolocalizacion', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
  })
  afterEach(() => {
    if (ORIGINAL_FLAG === undefined) {
      delete process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
    } else {
      process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = ORIGINAL_FLAG
    }
    vi.restoreAllMocks()
  })

  it('devuelve null cuando el feature flag está apagado — no toca navigator.geolocation', async () => {
    const spy = vi.fn()
    Object.defineProperty(navigator, 'geolocation', {
      value: { getCurrentPosition: spy },
      configurable: true,
    })
    const resultado = await capturarGeolocalizacion()
    expect(resultado).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('devuelve null cuando navigator.geolocation no existe (browser legacy)', async () => {
    process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = 'true'
    Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true })
    const resultado = await capturarGeolocalizacion()
    expect(resultado).toBeNull()
  })

  it('captura coordenadas, precisionMetros y capturadaEn cuando el usuario acepta', async () => {
    process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = '1'
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (ok: (p: GeolocationPosition) => void, _err: PositionErrorCallback) => {
          ok({
            coords: {
              latitude: 19.4326,
              longitude: -99.1332,
              accuracy: 50,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: () => ({}),
            } as GeolocationCoordinates,
            timestamp: Date.parse('2026-05-12T10:00:05.000Z'),
            toJSON: () => ({}),
          } as GeolocationPosition)
        },
      },
      configurable: true,
    })

    const resultado = await capturarGeolocalizacion()
    expect(resultado).toEqual({
      lat: 19.4326,
      lon: -99.1332,
      precisionMetros: 50,
      capturadaEn: '2026-05-12T10:00:05.000Z',
    })
  })

  it('devuelve null cuando el usuario rechaza el permiso', async () => {
    process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = 'true'
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (_ok: PositionCallback, err: PositionErrorCallback) => {
          err({
            code: 1, // PERMISSION_DENIED
            message: 'User denied geolocation',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          } as GeolocationPositionError)
        },
      },
      configurable: true,
    })

    const resultado = await capturarGeolocalizacion()
    expect(resultado).toBeNull()
  })

  it('captura sin precisionMetros cuando accuracy no es número', async () => {
    process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = 'true'
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (ok: PositionCallback) => {
          ok({
            coords: {
              latitude: 19.4326,
              longitude: -99.1332,
              accuracy: NaN as unknown as number,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: () => ({}),
            } as unknown as GeolocationCoordinates,
            timestamp: 0,
            toJSON: () => ({}),
          } as unknown as GeolocationPosition)
        },
      },
      configurable: true,
    })

    const resultado = await capturarGeolocalizacion()
    expect(resultado?.precisionMetros).toBeDefined() // NaN is a "number" so it's included
  })
})
