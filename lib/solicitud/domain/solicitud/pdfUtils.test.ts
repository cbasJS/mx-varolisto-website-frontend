// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'

const getDocumentMock = vi.fn()

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: getDocumentMock,
}))

import { validatePDF } from './pdfUtils'

function makePDFFile(bytes: number, filename = 'a.pdf'): File {
  return new File([new Uint8Array(bytes)], filename, { type: 'application/pdf' })
}

function mockGetDocumentResolveWith(numPages: number) {
  getDocumentMock.mockReturnValue({
    promise: Promise.resolve({ numPages }),
  })
}

function mockGetDocumentRejectWith(name: string, message = name) {
  const err = new Error(message)
  ;(err as Error & { name: string }).name = name
  getDocumentMock.mockReturnValue({
    promise: Promise.reject(err),
  })
}

beforeEach(() => {
  getDocumentMock.mockReset()
})

describe('validatePDF — conteo de páginas', () => {
  it('PDF con N páginas dentro del límite → ok', async () => {
    mockGetDocumentResolveWith(2)
    const result = await validatePDF(makePDFFile(100_000), 2)
    expect(result.ok).toBe(true)
  })

  it('PDF con N páginas igual al límite → ok', async () => {
    mockGetDocumentResolveWith(3)
    const result = await validatePDF(makePDFFile(100_000), 3)
    expect(result.ok).toBe(true)
  })

  it('PDF con N páginas excede límite → rechazo pdf-paginas-excedidas', async () => {
    mockGetDocumentResolveWith(5)
    const result = await validatePDF(makePDFFile(100_000), 3)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('pdf-paginas-excedidas')
      expect(result.reason.mensaje).toMatch(/5/)
      expect(result.reason.mensaje).toMatch(/3/)
    }
  })

  it('mensaje contexto-aware: usa "hoja necesaria" cuando maxPages=1 (no plural genérico)', async () => {
    mockGetDocumentResolveWith(2)
    const result = await validatePDF(makePDFFile(100_000), 1)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.mensaje).toMatch(/hoja necesaria|sola hoja|única página/i)
    }
  })
})

describe('validatePDF — manejo de errores', () => {
  it('PasswordException → rechazo pdf-password con mensaje sobre proteccion', async () => {
    mockGetDocumentRejectWith('PasswordException')
    const result = await validatePDF(makePDFFile(100_000), 3)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('pdf-password')
      expect(result.reason.mensaje).toMatch(/contraseña|protección|protegido/i)
    }
  })

  it('error genérico (PDF dañado) → rechazo pdf-danado', async () => {
    mockGetDocumentRejectWith('InvalidPDFException', 'PDF malformed')
    const result = await validatePDF(makePDFFile(100_000), 3)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('pdf-danado')
    }
  })

  it('error sin nombre conocido → rechazo pdf-danado (fallback)', async () => {
    mockGetDocumentRejectWith('UnknownError', 'algo se rompió')
    const result = await validatePDF(makePDFFile(100_000), 3)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('pdf-danado')
  })
})
