import { describe, expect, it } from 'vitest'
import {
  validarTamanoPorTipo,
  mapDropzoneError,
  FILE_ERROR_IMAGEN_TOO_LARGE,
  FILE_ERROR_PDF_TOO_LARGE,
} from './dropzoneValidation'
import { MAX_SIZE_IMAGEN_BYTES, MAX_SIZE_PDF_BYTES } from './documentosConfig'

function makeFile(bytes: number, type: string, name = 'archivo'): File {
  return new File([new Uint8Array(bytes)], name, { type })
}

describe('validarTamanoPorTipo — límites por contexto', () => {
  it('acepta imagen JPEG de 14 MB (debajo de 15 MB)', () => {
    const f = makeFile(14 * 1024 * 1024, 'image/jpeg', 'ine.jpg')
    expect(validarTamanoPorTipo(f)).toBeNull()
  })

  it('rechaza imagen JPEG de 16 MB con código imagen-too-large', () => {
    const f = makeFile(16 * 1024 * 1024, 'image/jpeg', 'ine.jpg')
    const error = validarTamanoPorTipo(f)
    expect(error).not.toBeNull()
    expect(error?.code).toBe(FILE_ERROR_IMAGEN_TOO_LARGE)
  })

  it('rechaza imagen PNG arriba de 15 MB con código imagen-too-large', () => {
    const f = makeFile(MAX_SIZE_IMAGEN_BYTES + 1, 'image/png', 'pasaporte.png')
    expect(validarTamanoPorTipo(f)?.code).toBe(FILE_ERROR_IMAGEN_TOO_LARGE)
  })

  it('acepta PDF de 7 MB (debajo de 8 MB)', () => {
    const f = makeFile(7 * 1024 * 1024, 'application/pdf', 'estado_cuenta.pdf')
    expect(validarTamanoPorTipo(f)).toBeNull()
  })

  it('rechaza PDF de 9 MB con código pdf-too-large', () => {
    const f = makeFile(9 * 1024 * 1024, 'application/pdf', 'estado_cuenta.pdf')
    const error = validarTamanoPorTipo(f)
    expect(error?.code).toBe(FILE_ERROR_PDF_TOO_LARGE)
  })

  it('rechaza PDF justo por encima de MAX_SIZE_PDF_BYTES', () => {
    const f = makeFile(MAX_SIZE_PDF_BYTES + 1, 'application/pdf')
    expect(validarTamanoPorTipo(f)?.code).toBe(FILE_ERROR_PDF_TOO_LARGE)
  })

  it('PDF entre 8 y 15 MB se rechaza como pdf-too-large (no como imagen)', () => {
    const f = makeFile(10 * 1024 * 1024, 'application/pdf')
    expect(validarTamanoPorTipo(f)?.code).toBe(FILE_ERROR_PDF_TOO_LARGE)
  })
})

describe('mapDropzoneError — mensajes user-facing por código de rechazo', () => {
  it('file-invalid-type sugiere JPG/PNG/PDF', () => {
    expect(mapDropzoneError('file-invalid-type')).toMatch(/JPG|PNG|PDF/i)
  })

  it('imagen-too-large menciona 15 MB', () => {
    expect(mapDropzoneError(FILE_ERROR_IMAGEN_TOO_LARGE)).toMatch(/15 MB/)
  })

  it('pdf-too-large menciona 8 MB', () => {
    expect(mapDropzoneError(FILE_ERROR_PDF_TOO_LARGE)).toMatch(/8 MB/)
  })

  it('too-many-files explica el cupo en lenguaje claro', () => {
    expect(mapDropzoneError('too-many-files')).toMatch(/máximo|cupo|suficien/i)
  })

  it('código desconocido retorna mensaje genérico', () => {
    expect(mapDropzoneError('codigo-que-no-existe')).toMatch(/no válido|inválido/i)
  })
})
