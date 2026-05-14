// @vitest-environment happy-dom
import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('./imageUtils', () => ({
  detectFileType: vi.fn(),
  mimeToKind: vi.fn(),
  compressImage: vi.fn(async (f: File) => f),
  getBlurScore: vi.fn(async () => 150),
}))
vi.mock('./pdfUtils', () => ({
  validatePDF: vi.fn(async () => ({ ok: true })),
}))

import { procesarArchivo } from './fileProcessor'
import { detectFileType, mimeToKind, compressImage, getBlurScore } from './imageUtils'
import { validatePDF } from './pdfUtils'

function makeImage(name: string, bytes: number, mime = 'image/jpeg'): File {
  return new File([new Uint8Array(bytes)], name, { type: mime })
}

function makePDF(name: string, bytes: number): File {
  return new File([new Uint8Array(bytes)], name, { type: 'application/pdf' })
}

const mocked = {
  detectFileType: detectFileType as unknown as ReturnType<typeof vi.fn>,
  mimeToKind: mimeToKind as unknown as ReturnType<typeof vi.fn>,
  compressImage: compressImage as unknown as ReturnType<typeof vi.fn>,
  getBlurScore: getBlurScore as unknown as ReturnType<typeof vi.fn>,
  validatePDF: validatePDF as unknown as ReturnType<typeof vi.fn>,
}

beforeEach(() => {
  Object.values(mocked).forEach((m) => m.mockReset())
  // happy path por defecto
  mocked.mimeToKind.mockImplementation((mime: string) => {
    if (mime === 'image/jpeg') return 'jpg'
    if (mime === 'image/png') return 'png'
    if (mime === 'application/pdf') return 'pdf'
    return 'unknown'
  })
  mocked.compressImage.mockImplementation(async (f: File) => f)
  mocked.getBlurScore.mockResolvedValue(150)
  mocked.validatePDF.mockResolvedValue({ ok: true })
})

describe('procesarArchivo — HEIC y MIME spoof', () => {
  it('rechaza HEIC con código heic-no-soportado y mensaje que menciona iPhone', async () => {
    mocked.detectFileType.mockResolvedValue('heic')
    const file = makeImage('foto.jpg', 100_000, 'image/heic')
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('heic-no-soportado')
      expect(result.reason.mensaje).toMatch(/iPhone|HEIC/i)
    }
  })

  it('rechaza HEIF con código heic-no-soportado', async () => {
    mocked.detectFileType.mockResolvedValue('heif')
    const file = makeImage('foto.jpg', 100_000, 'image/heif')
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('heic-no-soportado')
  })

  it('rechaza si el tipo real no concuerda con el MIME declarado (spoof)', async () => {
    mocked.detectFileType.mockResolvedValue('jpg')
    mocked.mimeToKind.mockReturnValue('png')
    const file = makeImage('foto.png', 100_000, 'image/png')
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('mime-spoof')
      expect(result.reason.mensaje).toMatch(/JPG|PNG|PDF|formato/i)
    }
  })

  it('rechaza tipo unknown con código mime-spoof', async () => {
    mocked.detectFileType.mockResolvedValue('unknown')
    mocked.mimeToKind.mockReturnValue('jpg')
    const file = makeImage('foto.jpg', 100_000, 'image/jpeg')
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('mime-spoof')
  })
})

describe('procesarArchivo — pipeline de imagen feliz', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('jpg')
    mocked.mimeToKind.mockReturnValue('jpg')
  })

  it('acepta JPG bien iluminada y devuelve el archivo COMPRIMIDO (no el original)', async () => {
    const original = makeImage('ine.jpg', 5 * 1024 * 1024, 'image/jpeg')
    const comprimido = makeImage('ine.jpg', 500_000, 'image/jpeg')
    mocked.compressImage.mockResolvedValue(comprimido)

    const result = await procesarArchivo(original, 'identidad-ine')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.file).toBe(comprimido)
      expect(result.warnings).toEqual([])
    }
    expect(mocked.compressImage).toHaveBeenCalledWith(original)
  })

  it('flagea blur moderado como warning (no rechazo) y archivo se acepta', async () => {
    mocked.getBlurScore.mockResolvedValue(55) // entre 30 y 80
    const file = makeImage('ine.jpg', 1_000_000)
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0].code).toBe('blur-moderado')
    }
  })

  it('rechaza blur grave (score < 30)', async () => {
    mocked.getBlurScore.mockResolvedValue(15)
    const file = makeImage('ine.jpg', 1_000_000)
    const result = await procesarArchivo(file, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('blur-grave')
  })
})

describe('procesarArchivo — tamaño bruto antes del pipeline', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('jpg')
    mocked.mimeToKind.mockReturnValue('jpg')
  })

  it('rechaza imagen > 15 MB con código tamano-imagen', async () => {
    const grande = makeImage('huge.jpg', 16 * 1024 * 1024)
    const result = await procesarArchivo(grande, 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('tamano-imagen')
  })

  it('rechaza PDF > 15 MB con código tamano-pdf', async () => {
    mocked.detectFileType.mockResolvedValue('pdf')
    mocked.mimeToKind.mockReturnValue('pdf')
    const result = await procesarArchivo(makePDF('huge.pdf', 16 * 1024 * 1024), 'ingresos')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('tamano-pdf')
  })
})

describe('procesarArchivo — PDF (Fase C integra validatePDF)', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('pdf')
    mocked.mimeToKind.mockReturnValue('pdf')
  })

  it('PDF dentro del rango (50 KB–15 MB) y dentro del límite de páginas acepta', async () => {
    const pdf = makePDF('estado.pdf', 2 * 1024 * 1024)
    mocked.validatePDF.mockResolvedValue({ ok: true })
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.file).toBe(pdf)
      expect(result.warnings).toEqual([])
    }
  })

  it('PDF < 50 KB → rechazo con código pdf-muy-pequeno (no llama validatePDF)', async () => {
    const pdf = makePDF('vacio.pdf', 10 * 1024)
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('pdf-muy-pequeno')
    expect(mocked.validatePDF).not.toHaveBeenCalled()
  })

  it('PDF exactamente en 50 KB acepta (umbral estrictamente <)', async () => {
    const pdf = makePDF('borderline.pdf', 50 * 1024)
    mocked.validatePDF.mockResolvedValue({ ok: true })
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(true)
  })

  it('PDF no pasa por el pipeline de imagen (compresión ni blur)', async () => {
    const pdf = makePDF('a.pdf', 100 * 1024)
    mocked.validatePDF.mockResolvedValue({ ok: true })
    const result = await procesarArchivo(pdf, 'identidad-ine')
    expect(result.ok).toBe(true)
    expect(mocked.compressImage).not.toHaveBeenCalled()
    expect(mocked.getBlurScore).not.toHaveBeenCalled()
  })

  it('identidad-ine: pasa maxPages=2 a validatePDF', async () => {
    mocked.validatePDF.mockResolvedValue({ ok: true })
    await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'identidad-ine')
    expect(mocked.validatePDF).toHaveBeenCalledWith(expect.any(File), 2)
  })

  it('identidad-pasaporte: pasa maxPages=2 a validatePDF', async () => {
    mocked.validatePDF.mockResolvedValue({ ok: true })
    await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'identidad-pasaporte')
    expect(mocked.validatePDF).toHaveBeenCalledWith(expect.any(File), 2)
  })

  it('ingresos: pasa maxPages=3 a validatePDF', async () => {
    mocked.validatePDF.mockResolvedValue({ ok: true })
    await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'ingresos')
    expect(mocked.validatePDF).toHaveBeenCalledWith(expect.any(File), 3)
  })

  it('domicilio: pasa maxPages=3 a validatePDF', async () => {
    mocked.validatePDF.mockResolvedValue({ ok: true })
    await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'domicilio')
    expect(mocked.validatePDF).toHaveBeenCalledWith(expect.any(File), 3)
  })

  it('si validatePDF rechaza con pdf-paginas-excedidas, procesarArchivo propaga la razón', async () => {
    mocked.validatePDF.mockResolvedValue({
      ok: false,
      reason: {
        code: 'pdf-paginas-excedidas',
        mensaje: 'Este PDF tiene 5 páginas — máximo 2.',
      },
    })
    const result = await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason.code).toBe('pdf-paginas-excedidas')
      expect(result.reason.mensaje).toMatch(/5/)
    }
  })

  it('si validatePDF rechaza con pdf-password, procesarArchivo propaga la razón', async () => {
    mocked.validatePDF.mockResolvedValue({
      ok: false,
      reason: { code: 'pdf-password', mensaje: 'Este PDF está protegido con contraseña.' },
    })
    const result = await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('pdf-password')
  })

  it('si validatePDF rechaza con pdf-danado, procesarArchivo propaga la razón', async () => {
    mocked.validatePDF.mockResolvedValue({
      ok: false,
      reason: { code: 'pdf-danado', mensaje: 'No pudimos leer este PDF.' },
    })
    const result = await procesarArchivo(makePDF('a.pdf', 100 * 1024), 'ingresos')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('pdf-danado')
  })
})
