import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const getCloudflareContext = vi.fn()
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext }))

const { GET } = await import('./route')

const COLONIAS_COPOMEX = [{ response: { asentamiento: 'Centro' } }]

function requestCon(cp: string, ip = '187.190.1.25'): NextRequest {
  return new NextRequest(`https://varolisto.mx/api/colonias?cp=${cp}`, {
    headers: { 'cf-connecting-ip': ip },
  })
}

/** Deja el binding en el contexto de Cloudflare con la respuesta que se le indique. */
function conCuota(disponible: boolean): { limit: ReturnType<typeof vi.fn> } {
  const limiter = { limit: vi.fn().mockResolvedValue({ success: disponible }) }
  getCloudflareContext.mockReturnValue({ env: { RATE_LIMITER_COLONIAS: limiter } })
  return limiter
}

beforeEach(() => {
  process.env.COPOMEX_TOKEN = 'token-de-prueba'
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(COLONIAS_COPOMEX), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('GET /api/colonias — rate limiting', () => {
  it('responde 429 cuando la IP agoto su cuota', async () => {
    conCuota(false)

    const response = await GET(requestCon('01000'))

    expect(response.status).toBe(429)
  })

  it('NO gasta una llamada del paquete COPOMEX cuando bloquea', async () => {
    conCuota(false)

    await GET(requestCon('01000'))

    expect(fetch).not.toHaveBeenCalled()
  })

  it('consulta COPOMEX normalmente cuando hay cuota', async () => {
    conCuota(true)

    const response = await GET(requestCon('01000'))

    expect(response.status).toBe(200)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('limita por IP del visitante, no por una clave global', async () => {
    const limiter = conCuota(true)

    await GET(requestCon('01000', '201.140.9.3'))

    expect(limiter.limit).toHaveBeenCalledWith({ key: '201.140.9.3' })
  })

  it('rechaza un CP invalido sin consumir cuota: no cuesta nada servirlo', async () => {
    const limiter = conCuota(true)

    const response = await GET(requestCon('abc'))

    expect(response.status).toBe(400)
    expect(limiter.limit).not.toHaveBeenCalled()
  })
})
