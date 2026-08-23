import { describe, it, expect } from 'vitest'
import { normalizarGastoAlStep } from './gastoMensualStepper'

// Bloque 1.A: el stepper del Paso 4 captura gastoMensual en incrementos de
// $500. Cuando el usuario teclea un valor libre (ej. $7,275), al perder el
// foco se normaliza al múltiplo de $500 más cercano. Nunca baja de $0.

describe('normalizarGastoAlStep', () => {
  it('preserva valores que ya son múltiplos exactos de 500', () => {
    expect(normalizarGastoAlStep(0)).toBe(0)
    expect(normalizarGastoAlStep(500)).toBe(500)
    expect(normalizarGastoAlStep(8500)).toBe(8500)
    expect(normalizarGastoAlStep(15500)).toBe(15500)
  })

  it('redondea al múltiplo de 500 más cercano hacia abajo cuando es < 250', () => {
    expect(normalizarGastoAlStep(249)).toBe(0)
    expect(normalizarGastoAlStep(8249)).toBe(8000)
  })

  it('redondea al múltiplo de 500 más cercano hacia arriba en el empate (n+250)', () => {
    expect(normalizarGastoAlStep(250)).toBe(500)
    expect(normalizarGastoAlStep(750)).toBe(1000)
    expect(normalizarGastoAlStep(8250)).toBe(8500)
  })

  it('redondea hacia arriba cuando es > n+250', () => {
    expect(normalizarGastoAlStep(749)).toBe(500)
    expect(normalizarGastoAlStep(8499)).toBe(8500)
  })

  it('clamp en cero — nunca devuelve valores negativos', () => {
    expect(normalizarGastoAlStep(-1)).toBe(0)
    expect(normalizarGastoAlStep(-100)).toBe(0)
    expect(normalizarGastoAlStep(-500)).toBe(0)
    expect(normalizarGastoAlStep(-1234)).toBe(0)
  })

  it('redondea decimales partiendo del valor crudo (no trunca antes)', () => {
    // 7,250.40 cae arriba del punto medio → 7,500
    expect(normalizarGastoAlStep(7250.4)).toBe(7500)
    // 7,249.99 cae abajo del punto medio → 7,000
    expect(normalizarGastoAlStep(7249.99)).toBe(7000)
  })
})
