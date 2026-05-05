import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError } from './apiErrors'
import { apiGet, apiPost, apiDelete, DEFAULT_TIMEOUT_MS, SHORT_TIMEOUT_MS } from './apiClient'

// En NODE_ENV=test el ambiente se resuelve a "sandbox"
const BASE = 'https://api-sandbox.varolisto.mx'

function mockFetchOk(body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
  })
}

function mockFetchError(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => body,
  })
}

describe('apiClient — constantes exportadas', () => {
  it('DEFAULT_TIMEOUT_MS es 30 segundos', () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(30_000)
  })

  it('SHORT_TIMEOUT_MS es 10 segundos', () => {
    expect(SHORT_TIMEOUT_MS).toBe(10_000)
  })
})

describe('apiGet', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('resuelve con el JSON del backend cuando responde 200', async () => {
    vi.stubGlobal('fetch', mockFetchOk({ folio: 'VAR-001' }))

    const resultado = await apiGet<{ folio: string }>('/api/solicitudes/VAR-001')

    expect(resultado).toEqual({ folio: 'VAR-001' })
  })

  it('construye la URL combinando baseUrl y el path recibido', async () => {
    const fetchMock = mockFetchOk({})
    vi.stubGlobal('fetch', fetchMock)

    await apiGet('/api/solicitudes/VAR-001')

    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE}/api/solicitudes/VAR-001`)
  })

  it('usa método GET', async () => {
    const fetchMock = mockFetchOk({})
    vi.stubGlobal('fetch', fetchMock)

    await apiGet('/api/solicitudes/VAR-001')

    expect(fetchMock.mock.calls[0][1].method).toBe('GET')
  })

  it('NO incluye body en la request (GET no debe enviar cuerpo)', async () => {
    const fetchMock = mockFetchOk({})
    vi.stubGlobal('fetch', fetchMock)

    await apiGet('/api/solicitudes/VAR-001')

    const opciones = fetchMock.mock.calls[0][1]
    expect(opciones.body).toBeUndefined()
  })

  it('lanza ApiError con status 0 cuando no hay conexión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiGet('/api/solicitudes/VAR-001')).rejects.toMatchObject({ status: 0 })
  })

  it('lanza ApiError con status 0 y code "network" en error de red', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiGet('/api/solicitudes/VAR-001')).rejects.toMatchObject({
      status: 0,
      code: 'network',
    })
  })

  it('lanza ApiError con el status HTTP cuando el backend responde con error', async () => {
    vi.stubGlobal('fetch', mockFetchError(404, { error: 'not_found', mensaje: 'No encontrado' }))

    await expect(apiGet('/api/solicitudes/VAR-001')).rejects.toMatchObject({
      status: 404,
      code: 'not_found',
      mensaje: 'No encontrado',
    })
  })

  it('lanza ApiError con detalles de validación cuando el backend responde 422', async () => {
    const detalles = { curp: ['Formato inválido'] }
    vi.stubGlobal(
      'fetch',
      mockFetchError(422, { error: 'validation', mensaje: 'Datos inválidos', detalles }),
    )

    await expect(apiGet('/api/solicitudes')).rejects.toMatchObject({ status: 422, detalles })
  })

  it('lanza ApiError sin mensaje personalizado cuando el body de error no es JSON válido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new SyntaxError('not JSON')
        },
      }),
    )

    const err = await apiGet('/api/test').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(500)
  })
})

describe('apiPost', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('resuelve con el JSON del backend cuando responde 200', async () => {
    vi.stubGlobal('fetch', mockFetchOk({ folio: 'VAR-123' }))

    const resultado = await apiPost<{ nombre: string }, { folio: string }>('/api/solicitudes', {
      nombre: 'Juan Pérez',
    })

    expect(resultado).toEqual({ folio: 'VAR-123' })
  })

  it('serializa el body como JSON en la request', async () => {
    const fetchMock = mockFetchOk({})
    vi.stubGlobal('fetch', fetchMock)

    await apiPost('/api/solicitudes', { nombre: 'Juan Pérez', monto: 5000 })

    const bodyEnviado = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(bodyEnviado).toEqual({ nombre: 'Juan Pérez', monto: 5000 })
  })

  it('usa método POST', async () => {
    const fetchMock = mockFetchOk({})
    vi.stubGlobal('fetch', fetchMock)

    await apiPost('/api/solicitudes', {})

    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
  })

  it('lanza ApiError con status 409 en conflicto (folio duplicado)', async () => {
    vi.stubGlobal('fetch', mockFetchError(409, { error: 'conflict', mensaje: 'Folio duplicado' }))

    await expect(apiPost('/api/solicitudes', {})).rejects.toMatchObject({ status: 409 })
  })
})

describe('apiDelete', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('usa método DELETE y serializa el body', async () => {
    const fetchMock = mockFetchOk({ deleted: true })
    vi.stubGlobal('fetch', fetchMock)

    await apiDelete('/api/archivos/staging', { storagePath: 'staging/abc/ine.jpg' })

    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE')
    const bodyEnviado = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(bodyEnviado.storagePath).toBe('staging/abc/ine.jpg')
  })
})
