import { describe, expect, it } from 'vitest'
import { mapDropzoneError } from './dropzoneValidation'

describe('mapDropzoneError — mensajes user-facing por código de rechazo', () => {
  it('file-invalid-type sugiere JPG/PNG/PDF', () => {
    expect(mapDropzoneError('file-invalid-type')).toMatch(/JPG|PNG|PDF/i)
  })

  it('file-too-large menciona el límite unificado de 15 MB', () => {
    expect(mapDropzoneError('file-too-large')).toMatch(/15 MB/)
  })

  it('too-many-files explica el cupo en lenguaje claro', () => {
    expect(mapDropzoneError('too-many-files')).toMatch(/máximo|cupo|suficien/i)
  })

  it('código desconocido retorna mensaje genérico', () => {
    expect(mapDropzoneError('codigo-que-no-existe')).toMatch(/no válido|inválido/i)
  })
})
