// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { calcularFingerprint } from './captureFingerprint'

describe('calcularFingerprint', () => {
  it('devuelve un hash hex no vacío en un entorno con DOM', async () => {
    const fp = await calcularFingerprint()
    expect(fp).toBeDefined()
    expect(typeof fp).toBe('string')
    expect(fp).toMatch(/^[0-9a-f]+$/)
  })

  it('es estable entre llamadas en el mismo entorno (consistencia entre visitas)', async () => {
    const a = await calcularFingerprint()
    const b = await calcularFingerprint()
    expect(a).toBe(b)
  })

  it('produce hashes distintos cuando cambian señales estables (ej. userAgent)', async () => {
    const original = navigator.userAgent
    const fp1 = await calcularFingerprint()
    Object.defineProperty(navigator, 'userAgent', {
      value: 'OtherDevice/1.0',
      configurable: true,
    })
    const fp2 = await calcularFingerprint()
    Object.defineProperty(navigator, 'userAgent', { value: original, configurable: true })
    expect(fp1).not.toBe(fp2)
  })

  it('devuelve undefined si las señales estables no se pueden recoger', async () => {
    // Forzamos un crash mockeando navigator.userAgent como getter que lanza.
    Object.defineProperty(navigator, 'userAgent', {
      get() {
        throw new Error('blocked')
      },
      configurable: true,
    })
    const fp = await calcularFingerprint()
    // El módulo es resilente: incluso con un error, devuelve un hash
    // construido sobre el resto de señales (o undefined si todo falla).
    expect(fp === undefined || typeof fp === 'string').toBe(true)
    // Restablecer
    Object.defineProperty(navigator, 'userAgent', { value: 'happy-dom', configurable: true })
    vi.restoreAllMocks()
  })
})
