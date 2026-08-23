import { describe, it, expect } from 'vitest'
import { getStepDirection, pasoSlideVariants } from './animations'

describe('getStepDirection', () => {
  it('devuelve 1 cuando avanza al siguiente paso', () => {
    expect(getStepDirection(2, 3)).toBe(1)
  })

  it('devuelve -1 cuando regresa al paso anterior', () => {
    expect(getStepDirection(3, 2)).toBe(-1)
  })

  it('devuelve 1 al editar saltando varios pasos hacia atrás (preserva semántica de salto)', () => {
    // Cuando el usuario edita desde Paso 7 a Paso 1, prev > current → -1 (back)
    expect(getStepDirection(7, 1)).toBe(-1)
  })

  it('devuelve 1 por default cuando no hay paso previo', () => {
    expect(getStepDirection(null, 1)).toBe(1)
  })

  it('devuelve 1 cuando el paso no cambió', () => {
    expect(getStepDirection(3, 3)).toBe(1)
  })
})

describe('pasoSlideVariants', () => {
  // Variants funcionales: framer-motion les pasa `direction` desde `custom` al
  // momento del render, así el paso saliente conserva la dirección con la que
  // navegó (no la "nueva" dirección si el usuario invierte rápido).
  const enter = pasoSlideVariants.enter as (d: 1 | -1) => { x: number; opacity: number }
  const exit = pasoSlideVariants.exit as (d: 1 | -1) => { x: number; opacity: number }

  it('center está centrado y visible', () => {
    expect(pasoSlideVariants.center).toMatchObject({ x: 0, opacity: 1 })
  })

  it('avance: el nuevo paso entra desde la derecha y el saliente se va a la izquierda', () => {
    expect(enter(1).x).toBeGreaterThan(0)
    expect(enter(1).opacity).toBe(0)
    expect(exit(1).x).toBeLessThan(0)
    expect(exit(1).opacity).toBe(0)
  })

  it('retroceso: el nuevo paso entra desde la izquierda y el saliente se va a la derecha', () => {
    expect(enter(-1).x).toBeLessThan(0)
    expect(exit(-1).x).toBeGreaterThan(0)
  })
})

describe('pasoTransition', () => {
  it('usa easing simétrico easeInOut con duración cómoda', async () => {
    const { pasoTransition } = await import('./animations')
    expect(pasoTransition).toMatchObject({ ease: 'easeInOut' })
    expect(pasoTransition.duration).toBeGreaterThan(0)
    expect(pasoTransition.duration).toBeLessThanOrEqual(0.4)
  })
})
