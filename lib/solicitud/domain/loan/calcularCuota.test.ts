import { describe, it, expect } from 'vitest'
import { calcularCuota, TASA_MENSUAL } from './calcularCuota'

// Los plazos válidos del producto son: 2, 3, 4, 5, 6 meses
// El hook usePaso1 convierte el string enum ("2"..."6") a número antes de llamar aquí

describe('calcularCuota — plazos del producto (2–6 meses)', () => {
  it('calcula correctamente para $5,000 a 2 meses', () => {
    expect(calcularCuota(5000, 2)).toBe(2675)
  })

  it('calcula correctamente para $5,000 a 3 meses', () => {
    expect(calcularCuota(5000, 3)).toBe(1824)
  })

  it('calcula correctamente para $5,000 a 4 meses', () => {
    expect(calcularCuota(5000, 4)).toBe(1398)
  })

  it('calcula correctamente para $5,000 a 5 meses', () => {
    expect(calcularCuota(5000, 5)).toBe(1143)
  })

  it('calcula correctamente para $5,000 a 6 meses', () => {
    expect(calcularCuota(5000, 6)).toBe(974)
  })
})

describe('calcularCuota — propiedades de la fórmula', () => {
  it('devuelve un número entero (sin decimales)', () => {
    expect(Number.isInteger(calcularCuota(5000, 3))).toBe(true)
    expect(Number.isInteger(calcularCuota(7777, 5))).toBe(true)
  })

  it('cuota aumenta cuando el monto aumenta (mismo plazo)', () => {
    expect(calcularCuota(10000, 3)).toBeGreaterThan(calcularCuota(5000, 3))
  })

  it('cuota disminuye cuando el plazo aumenta (mismo monto)', () => {
    expect(calcularCuota(5000, 6)).toBeLessThan(calcularCuota(5000, 2))
  })

  it('expone la tasa mensual como constante', () => {
    expect(TASA_MENSUAL).toBe(0.0464)
  })
})
