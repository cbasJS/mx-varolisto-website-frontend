import { describe, it, expect } from 'vitest'
import { ApiError, esErrorDeValidacion, esErrorDeConflicto } from './apiErrors'
import { clasificarError } from '@/lib/solicitud/application/useCases/submitSolicitud'

describe('ApiError', () => {
  it('construye con status y mensaje', () => {
    const err = new ApiError({ status: 422, mensaje: 'Datos inválidos' })
    expect(err.status).toBe(422)
    expect(err.mensaje).toBe('Datos inválidos')
    expect(err.message).toBe('Datos inválidos')
    expect(err.name).toBe('ApiError')
  })

  it('usa mensaje genérico cuando no se proporciona mensaje', () => {
    const err = new ApiError({ status: 500 })
    expect(err.message).toBe('Error HTTP 500')
  })

  it('conserva detalles de validación por campo', () => {
    const detalles = { curp: ['Formato inválido'], email: ['Requerido'] }
    const err = new ApiError({ status: 422, detalles })
    expect(err.detalles).toEqual(detalles)
  })

  it('es instancia de Error', () => {
    const err = new ApiError({ status: 409 })
    expect(err instanceof Error).toBe(true)
  })
})

describe('esErrorDeValidacion', () => {
  it('devuelve true para ApiError con status 422', () => {
    expect(esErrorDeValidacion(new ApiError({ status: 422 }))).toBe(true)
  })

  it('devuelve false para ApiError con status distinto a 422', () => {
    expect(esErrorDeValidacion(new ApiError({ status: 409 }))).toBe(false)
    expect(esErrorDeValidacion(new ApiError({ status: 500 }))).toBe(false)
  })

  it('devuelve false para errores que no son ApiError', () => {
    expect(esErrorDeValidacion(new Error('genérico'))).toBe(false)
    expect(esErrorDeValidacion(null)).toBe(false)
    expect(esErrorDeValidacion('string error')).toBe(false)
  })
})

describe('esErrorDeConflicto', () => {
  it('devuelve true para ApiError con status 409', () => {
    expect(esErrorDeConflicto(new ApiError({ status: 409 }))).toBe(true)
  })

  it('devuelve false para ApiError con status distinto a 409', () => {
    expect(esErrorDeConflicto(new ApiError({ status: 422 }))).toBe(false)
    expect(esErrorDeConflicto(new ApiError({ status: 500 }))).toBe(false)
  })

  it('devuelve false para errores que no son ApiError', () => {
    expect(esErrorDeConflicto(new Error('genérico'))).toBe(false)
    expect(esErrorDeConflicto(undefined)).toBe(false)
  })
})

describe('clasificarError', () => {
  it('clasifica 409 como conflicto (folio duplicado)', () => {
    const resultado = clasificarError(new ApiError({ status: 409 }))
    expect(resultado).toEqual({ tipo: 'conflicto' })
  })

  it('clasifica 422 como validacion e incluye detalles por campo', () => {
    const detalles = { curp: ['Formato inválido'] }
    const resultado = clasificarError(new ApiError({ status: 422, detalles }))
    expect(resultado).toEqual({ tipo: 'validacion', detalles })
  })

  it('clasifica 422 sin detalles como validacion con detalles undefined', () => {
    const resultado = clasificarError(new ApiError({ status: 422 }))
    expect(resultado).toEqual({ tipo: 'validacion', detalles: undefined })
  })

  it('clasifica status 0 como error de red (sin conexión)', () => {
    const resultado = clasificarError(new ApiError({ status: 0 }))
    expect(resultado).toEqual({ tipo: 'red' })
  })

  it('clasifica ApiError con status desconocido como desconocido con mensaje', () => {
    const resultado = clasificarError(
      new ApiError({ status: 503, mensaje: 'Servicio no disponible' }),
    )
    expect(resultado).toEqual({ tipo: 'desconocido', mensaje: 'Servicio no disponible' })
  })

  it('clasifica error genérico de JS como desconocido sin mensaje', () => {
    const resultado = clasificarError(new Error('algo falló'))
    expect(resultado).toEqual({ tipo: 'desconocido', mensaje: undefined })
  })

  it('clasifica valor no-Error como desconocido', () => {
    const resultado = clasificarError('timeout')
    expect(resultado).toEqual({ tipo: 'desconocido', mensaje: undefined })
  })
})
