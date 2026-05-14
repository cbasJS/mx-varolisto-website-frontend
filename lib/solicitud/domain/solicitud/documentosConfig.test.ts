import { describe, expect, it } from 'vitest'
import {
  MAX_COMPROBANTES_INGRESO,
  MAX_SIZE_IMAGEN_BYTES,
  MAX_SIZE_PDF_BYTES,
  PDF_MAX_PAGES_DOMICILIO,
  RESOLUCION_MIN_DOMICILIO_PX,
} from './documentosConfig'

describe('documentosConfig — límites por tipo y contexto', () => {
  it('MAX_COMPROBANTES_INGRESO sigue siendo 3', () => {
    expect(MAX_COMPROBANTES_INGRESO).toBe(3)
  })

  it('MAX_SIZE_IMAGEN_BYTES es 15 MB', () => {
    expect(MAX_SIZE_IMAGEN_BYTES).toBe(15 * 1024 * 1024)
  })

  it('MAX_SIZE_PDF_BYTES es 15 MB (unificado con imagen para no confundir al usuario)', () => {
    expect(MAX_SIZE_PDF_BYTES).toBe(15 * 1024 * 1024)
  })

  it('imagen y PDF comparten el mismo límite máximo', () => {
    expect(MAX_SIZE_PDF_BYTES).toBe(MAX_SIZE_IMAGEN_BYTES)
  })

  it('PDF_MAX_PAGES_DOMICILIO es 5 — cubre 95% de la lista blanca de comprobantes', () => {
    expect(PDF_MAX_PAGES_DOMICILIO).toBe(5)
  })

  it('RESOLUCION_MIN_DOMICILIO_PX es 800 — texto pequeño exige más resolución que INE', () => {
    expect(RESOLUCION_MIN_DOMICILIO_PX).toBe(800)
  })
})
