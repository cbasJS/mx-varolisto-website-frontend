// @vitest-environment happy-dom
import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('./imageUtils', () => ({
  detectFileType: vi.fn(),
  mimeToKind: vi.fn(),
  compressImage: vi.fn(async (f: File) => f),
  getImageDimensions: vi.fn(async () => ({ width: 1200, height: 900 })),
  getBlurScore: vi.fn(async () => 150),
}))

import { procesarArchivo } from './fileProcessor'
import {
  detectFileType,
  mimeToKind,
  compressImage,
  getImageDimensions,
  getBlurScore,
} from './imageUtils'

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
  getImageDimensions: getImageDimensions as unknown as ReturnType<typeof vi.fn>,
  getBlurScore: getBlurScore as unknown as ReturnType<typeof vi.fn>,
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
  mocked.getImageDimensions.mockResolvedValue({ width: 1200, height: 900 })
  mocked.getBlurScore.mockResolvedValue(150)
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

describe('procesarArchivo — resolución mínima por contexto', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('jpg')
    mocked.mimeToKind.mockReturnValue('jpg')
  })

  it('identidad-ine: 799 px de lado corto → rechazo (Textract pide >=25 px/char y a 800 px tenemos margen)', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 799, height: 1200 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('resolucion-baja')
  })

  it('identidad-ine: 800 px de lado corto → aceptado', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 800, height: 1200 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(true)
  })

  it('identidad-pasaporte: 700 px de lado corto → rechazo (mismo umbral que INE)', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 700, height: 1000 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'identidad-pasaporte')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('resolucion-baja')
  })

  it('domicilio: 700 px de lado corto → rechazo (mínimo 800)', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 700, height: 1200 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'domicilio')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('resolucion-baja')
  })

  it('domicilio: 800 px de lado corto → aceptado', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 800, height: 1200 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'domicilio')
    expect(result.ok).toBe(true)
  })
})

describe('procesarArchivo — aspect ratio extremo (franjas recortadas)', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('jpg')
    mocked.mimeToKind.mockReturnValue('jpg')
  })

  it('imagen con ratio > 3 → rechazo con código aspecto-extremo', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 4000, height: 800 }) // ratio = 5
    const result = await procesarArchivo(makeImage('strip.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('aspecto-extremo')
  })

  it('imagen apilada vertical extrema (height/width > 3) también rechaza', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 800, height: 4000 }) // ratio = 5
    const result = await procesarArchivo(makeImage('strip.jpg', 100_000), 'domicilio')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('aspecto-extremo')
  })

  it('imagen 4:3 (ratio 1.33) acepta sin warning', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 1200, height: 900 })
    const result = await procesarArchivo(makeImage('ine.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(true)
  })

  it('imagen 16:9 (ratio 1.78) acepta sin warning', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 1600, height: 900 })
    const result = await procesarArchivo(makeImage('ine.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(true)
  })

  it('imagen justo en ratio 3.0 acepta (umbral estrictamente >)', async () => {
    mocked.getImageDimensions.mockResolvedValue({ width: 2400, height: 800 })
    const result = await procesarArchivo(makeImage('a.jpg', 100_000), 'identidad-ine')
    expect(result.ok).toBe(true)
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

describe('procesarArchivo — PDF (Fase B; conteo de páginas llega en Fase C)', () => {
  beforeEach(() => {
    mocked.detectFileType.mockResolvedValue('pdf')
    mocked.mimeToKind.mockReturnValue('pdf')
  })

  it('PDF dentro del rango (50 KB–15 MB) acepta sin warnings ni rechazo', async () => {
    const pdf = makePDF('estado.pdf', 2 * 1024 * 1024)
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.file).toBe(pdf)
      expect(result.warnings).toEqual([])
    }
    expect(mocked.compressImage).not.toHaveBeenCalled()
  })

  it('PDF < 50 KB → rechazo con código pdf-muy-pequeno (típicamente vacío o dañado)', async () => {
    const pdf = makePDF('vacio.pdf', 10 * 1024) // 10 KB
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason.code).toBe('pdf-muy-pequeno')
  })

  it('PDF exactamente en 50 KB acepta (umbral estrictamente <)', async () => {
    const pdf = makePDF('borderline.pdf', 50 * 1024)
    const result = await procesarArchivo(pdf, 'ingresos')
    expect(result.ok).toBe(true)
  })

  it('PDF no pasa por el check de aspect ratio (no tiene resolución intrínseca)', async () => {
    // Si pasara por aspect ratio, fallaría porque mock default es 1200x900 (ratio 1.33, OK)
    // pero el punto es que ni se invoca getImageDimensions para PDF
    const pdf = makePDF('a.pdf', 100 * 1024)
    const result = await procesarArchivo(pdf, 'identidad-ine')
    expect(result.ok).toBe(true)
    expect(mocked.getImageDimensions).not.toHaveBeenCalled()
    expect(mocked.getBlurScore).not.toHaveBeenCalled()
  })
})
