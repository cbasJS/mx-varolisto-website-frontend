import { describe, expect, it } from 'vitest'
import {
  MAX_COMPROBANTES_INGRESO,
  MAX_SIZE_IMAGEN_BYTES,
  MAX_SIZE_PDF_BYTES,
  MIN_SIZE_PDF_BYTES,
  PDF_MAX_PAGES_COMPROBANTE,
  PDF_MAX_PAGES_IDENTIDAD,
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

  it('MIN_SIZE_PDF_BYTES es 50 KB — PDFs más chicos suelen estar vacíos o dañados', () => {
    expect(MIN_SIZE_PDF_BYTES).toBe(50 * 1024)
  })

  it('PDF_MAX_PAGES_IDENTIDAD es 2 — INE/pasaporte caben en máximo 2 hojas', () => {
    expect(PDF_MAX_PAGES_IDENTIDAD).toBe(2)
  })

  it('PDF_MAX_PAGES_COMPROBANTE es 3 — recibo de servicio típico ≤ 3 hojas', () => {
    expect(PDF_MAX_PAGES_COMPROBANTE).toBe(3)
  })
})
