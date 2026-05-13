// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@fingerprintjs/fingerprintjs', () => {
  let visitorId = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'
  let shouldThrowOnLoad = false
  let shouldThrowOnGet = false
  return {
    default: {
      load: vi.fn(async () => {
        if (shouldThrowOnLoad) throw new Error('load failed')
        return {
          get: vi.fn(async () => {
            if (shouldThrowOnGet) throw new Error('get failed')
            return { visitorId }
          }),
        }
      }),
      __setVisitorId: (id: string) => {
        visitorId = id
      },
      __setShouldThrowOnLoad: (v: boolean) => {
        shouldThrowOnLoad = v
      },
      __setShouldThrowOnGet: (v: boolean) => {
        shouldThrowOnGet = v
      },
    },
  }
})

import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { _resetAgenteParaTests, calcularFingerprint } from './captureFingerprint'

type MockedFP = typeof FingerprintJS & {
  __setVisitorId: (id: string) => void
  __setShouldThrowOnLoad: (v: boolean) => void
  __setShouldThrowOnGet: (v: boolean) => void
}

beforeEach(() => {
  _resetAgenteParaTests()
  vi.clearAllMocks()
  ;(FingerprintJS as MockedFP).__setVisitorId('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4')
  ;(FingerprintJS as MockedFP).__setShouldThrowOnLoad(false)
  ;(FingerprintJS as MockedFP).__setShouldThrowOnGet(false)
})

describe('calcularFingerprint', () => {
  it('devuelve el visitorId hex de FingerprintJS en un entorno con DOM', async () => {
    const fp = await calcularFingerprint()
    expect(fp).toBe('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4')
    expect(fp).toMatch(/^[0-9a-f]+$/)
  })

  it('es estable entre llamadas en el mismo entorno (mismo visitorId)', async () => {
    const a = await calcularFingerprint()
    const b = await calcularFingerprint()
    expect(a).toBe(b)
  })

  it('reusa el agente cargado entre invocaciones (no recarga la lib en cada llamada)', async () => {
    await calcularFingerprint()
    await calcularFingerprint()
    expect(FingerprintJS.load).toHaveBeenCalledTimes(1)
  })

  it('propaga visitorIds distintos cuando FingerprintJS produce hashes distintos', async () => {
    ;(FingerprintJS as MockedFP).__setVisitorId('1111111111111111')
    _resetAgenteParaTests()
    const fp1 = await calcularFingerprint()
    ;(FingerprintJS as MockedFP).__setVisitorId('2222222222222222')
    _resetAgenteParaTests()
    const fp2 = await calcularFingerprint()
    expect(fp1).toBe('1111111111111111')
    expect(fp2).toBe('2222222222222222')
  })

  it('devuelve undefined si FingerprintJS.load() lanza', async () => {
    ;(FingerprintJS as MockedFP).__setShouldThrowOnLoad(true)
    _resetAgenteParaTests()
    const fp = await calcularFingerprint()
    expect(fp).toBeUndefined()
  })

  it('devuelve undefined si agent.get() lanza', async () => {
    ;(FingerprintJS as MockedFP).__setShouldThrowOnGet(true)
    _resetAgenteParaTests()
    const fp = await calcularFingerprint()
    expect(fp).toBeUndefined()
  })

  it('trunca el visitorId si excede TELEMETRIA_FINGERPRINT_MAX_LENGTH', async () => {
    ;(FingerprintJS as MockedFP).__setVisitorId('a'.repeat(200))
    _resetAgenteParaTests()
    const fp = await calcularFingerprint()
    expect(fp?.length).toBeLessThanOrEqual(128)
  })

  describe('switch de debug NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL', () => {
    // Las constantes NEXT_PUBLIC_* se centralizan en apiConfig.ts como
    // top-level const, así que se capturan al cargar el módulo. Para que
    // vi.stubEnv tenga efecto hay que limpiar el cache de módulos y re-
    // importar el SUT por test.
    afterEach(() => {
      vi.unstubAllEnvs()
      vi.resetModules()
    })

    it('devuelve undefined sin invocar FingerprintJS.load cuando el flag = "1" en entorno no-prod', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENV', 'local')
      vi.stubEnv('NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL', '1')
      vi.resetModules()
      const FingerprintJSMock = (await import('@fingerprintjs/fingerprintjs')).default
      const { calcularFingerprint, _resetAgenteParaTests } = await import('./captureFingerprint')
      _resetAgenteParaTests()
      const fp = await calcularFingerprint()
      expect(fp).toBeUndefined()
      expect(FingerprintJSMock.load).not.toHaveBeenCalled()
    })

    it('ignora el flag en builds de produccion (no se puede activar desde NEXT_PUBLIC en prod)', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL', '1')
      vi.resetModules()
      const FingerprintJSMock = (await import('@fingerprintjs/fingerprintjs')).default
      const { calcularFingerprint, _resetAgenteParaTests } = await import('./captureFingerprint')
      _resetAgenteParaTests()
      const fp = await calcularFingerprint()
      expect(fp).toBe('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4')
      expect(FingerprintJSMock.load).toHaveBeenCalledTimes(1)
    })

    it('no se activa si el flag esta ausente o vale algo distinto de "1"', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENV', 'local')
      vi.stubEnv('NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL', '0')
      vi.resetModules()
      const { calcularFingerprint, _resetAgenteParaTests } = await import('./captureFingerprint')
      _resetAgenteParaTests()
      const fp = await calcularFingerprint()
      expect(fp).toBe('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4')
    })
  })
})
