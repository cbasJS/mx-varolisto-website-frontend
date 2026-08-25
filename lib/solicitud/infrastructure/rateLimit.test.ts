import { describe, expect, it, vi } from 'vitest'
import { dentroDelLimite, obtenerClaveCliente, type RateLimiter } from './rateLimit'

function requestCon(headers: Record<string, string>): Request {
  return new Request('https://varolisto.mx/api/colonias?cp=01000', { headers })
}

function limiterQueResponde(success: boolean): RateLimiter {
  return { limit: vi.fn().mockResolvedValue({ success }) }
}

describe('obtenerClaveCliente', () => {
  it('usa la IP real del visitante que inyecta Cloudflare', () => {
    const request = requestCon({ 'cf-connecting-ip': '187.190.1.25' })

    expect(obtenerClaveCliente(request)).toBe('187.190.1.25')
  })

  it('agrupa en un solo bucket el trafico sin IP identificable', () => {
    const request = requestCon({})

    expect(obtenerClaveCliente(request)).toBe('ip-desconocida')
  })
})

describe('dentroDelLimite', () => {
  it('deja pasar la request y consume una unidad de la cuota de esa IP', async () => {
    const limiter = limiterQueResponde(true)
    const request = requestCon({ 'cf-connecting-ip': '187.190.1.25' })

    await expect(dentroDelLimite(limiter, request)).resolves.toBe(true)
    expect(limiter.limit).toHaveBeenCalledWith({ key: '187.190.1.25' })
  })

  it('bloquea la request cuando la IP agoto su cuota', async () => {
    const limiter = limiterQueResponde(false)

    await expect(dentroDelLimite(limiter, requestCon({}))).resolves.toBe(false)
  })

  it('deja pasar si el binding no existe (next dev sin workerd)', async () => {
    await expect(dentroDelLimite(undefined, requestCon({}))).resolves.toBe(true)
  })

  it('deja pasar si el limiter falla: nunca debe tumbar el endpoint', async () => {
    const limiter: RateLimiter = { limit: vi.fn().mockRejectedValue(new Error('boom')) }

    await expect(dentroDelLimite(limiter, requestCon({}))).resolves.toBe(true)
  })
})
