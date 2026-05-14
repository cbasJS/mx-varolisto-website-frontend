import { describe, expect, it } from 'vitest'
import {
  MAX_COMPROBANTES_INGRESO,
  MAX_SIZE_IMAGEN_BYTES,
  MAX_SIZE_PDF_BYTES,
  PDF_MAX_PAGES_DOMICILIO,
  PDF_MAX_PAGES_IDENTIDAD,
  PDF_MAX_PAGES_INGRESOS,
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

  it('PDF_MAX_PAGES_IDENTIDAD es 2 — INE/pasaporte caben en máximo 2 hojas', () => {
    expect(PDF_MAX_PAGES_IDENTIDAD).toBe(2)
  })

  it('PDF_MAX_PAGES_INGRESOS es 20 — cubre estados de cuenta de banca tradicional (BBVA, Santander, Banorte) de 2–3 meses en un solo PDF', () => {
    expect(PDF_MAX_PAGES_INGRESOS).toBe(20)
  })

  it('PDF_MAX_PAGES_DOMICILIO es 3 — recibo de servicio típico (CFE, Telmex, etc.) cabe en 1–3 hojas', () => {
    expect(PDF_MAX_PAGES_DOMICILIO).toBe(3)
  })
})
