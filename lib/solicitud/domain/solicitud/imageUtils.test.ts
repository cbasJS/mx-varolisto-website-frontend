// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { detectFileType, mimeToKind, type TipoArchivoReal } from './imageUtils'

function buildFile(bytes: number[], filename: string, mimeType = ''): File {
  return new File([new Uint8Array(bytes)], filename, { type: mimeType })
}

describe('detectFileType — magic bytes', () => {
  it('JPG: FF D8 FF', async () => {
    const f = buildFile([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46], 'ine.jpg')
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('jpg')
  })

  it('PNG: 89 50 4E 47', async () => {
    const f = buildFile([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'pasaporte.png')
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('png')
  })

  it('PDF: %PDF (25 50 44 46)', async () => {
    const f = buildFile([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37], 'estado.pdf')
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('pdf')
  })

  it('WEBP: RIFF....WEBP', async () => {
    const f = buildFile(
      [0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50],
      'foto.webp',
    )
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('webp')
  })

  it('HEIC: bytes 4..11 = "ftypheic"', async () => {
    const f = buildFile(
      [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63],
      'iphone.heic',
    )
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('heic')
  })

  it('HEIC: variante "ftypheix"', async () => {
    const f = buildFile(
      [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x78],
      'iphone.heic',
    )
    const kind = await detectFileType(f)
    expect(['heic', 'heif']).toContain(kind)
  })

  it('HEIF: variante "ftypmif1"', async () => {
    const f = buildFile(
      [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x69, 0x66, 0x31],
      'foto.heif',
    )
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('heif')
  })

  it('basura aleatoria → unknown', async () => {
    const f = buildFile([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07], 'archivo.bin')
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('unknown')
  })

  it('archivo vacío → unknown', async () => {
    const f = buildFile([], 'vacio.bin')
    expect(await detectFileType(f)).toBe<TipoArchivoReal>('unknown')
  })
})

describe('mimeToKind — mapeo MIME → tipo real', () => {
  it('image/jpeg y image/jpg → jpg', () => {
    expect(mimeToKind('image/jpeg')).toBe('jpg')
    expect(mimeToKind('image/jpg')).toBe('jpg')
  })

  it('image/png → png', () => {
    expect(mimeToKind('image/png')).toBe('png')
  })

  it('image/webp → webp', () => {
    expect(mimeToKind('image/webp')).toBe('webp')
  })

  it('application/pdf → pdf', () => {
    expect(mimeToKind('application/pdf')).toBe('pdf')
  })

  it('image/heic → heic, image/heif → heif', () => {
    expect(mimeToKind('image/heic')).toBe('heic')
    expect(mimeToKind('image/heif')).toBe('heif')
  })

  it('string vacío o desconocido → unknown', () => {
    expect(mimeToKind('')).toBe('unknown')
    expect(mimeToKind('application/octet-stream')).toBe('unknown')
  })
})
