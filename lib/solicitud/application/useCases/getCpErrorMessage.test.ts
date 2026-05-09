import { describe, it, expect } from 'vitest'

import { ColoniaNotFoundError, ColoniaServiceError } from './getColonias'
import {
  CP_NOT_FOUND_MESSAGE,
  CP_SERVICE_ERROR_MESSAGE,
  getCpErrorMessage,
} from './getCpErrorMessage'

describe('getCpErrorMessage', () => {
  it('devuelve el mensaje de "no encontrado" para ColoniaNotFoundError', () => {
    const error = new ColoniaNotFoundError('CP no encontrado')
    expect(getCpErrorMessage(error)).toBe(CP_NOT_FOUND_MESSAGE)
  })

  it('devuelve el mensaje de "problema de servicio" para ColoniaServiceError', () => {
    const error = new ColoniaServiceError('500')
    expect(getCpErrorMessage(error)).toBe(CP_SERVICE_ERROR_MESSAGE)
  })

  it('devuelve null cuando no hay error', () => {
    expect(getCpErrorMessage(null)).toBeNull()
    expect(getCpErrorMessage(undefined)).toBeNull()
  })

  it('cae en el mensaje de servicio para errores desconocidos (fallback seguro)', () => {
    expect(getCpErrorMessage(new Error('boom'))).toBe(CP_SERVICE_ERROR_MESSAGE)
  })

  it('los dos mensajes son textos distintos no vacíos', () => {
    expect(CP_NOT_FOUND_MESSAGE).toBeTruthy()
    expect(CP_SERVICE_ERROR_MESSAGE).toBeTruthy()
    expect(CP_NOT_FOUND_MESSAGE).not.toBe(CP_SERVICE_ERROR_MESSAGE)
  })
})
