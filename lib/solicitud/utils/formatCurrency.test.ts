import { describe, it, expect } from 'vitest'
import {
  initCurrencyDisplay,
  formatCurrencyOnChange,
  formatCurrencyOnBlur,
  formatCurrencyOnFocus,
} from './formatCurrency'

// formatCurrency se usa en Paso 4 para dos campos:
//   - ingresoMensual: mín $1,000 (sin máximo)
//   - pagoMensualDeudas: mín $0 (opcional)

describe('initCurrencyDisplay', () => {
  it('formatea el ingreso mínimo válido ($1,000) al cargar del store', () => {
    expect(initCurrencyDisplay(1000)).toBe('1,000.00')
  })

  it('formatea un ingreso mensual representativo ($8,500)', () => {
    expect(initCurrencyDisplay(8500)).toBe('8,500.00')
  })

  it('formatea un pago de deuda con centavos ($1,250.50)', () => {
    expect(initCurrencyDisplay(1250.5)).toBe('1,250.50')
  })

  it('devuelve string vacío para undefined (campo aún no capturado)', () => {
    expect(initCurrencyDisplay(undefined)).toBe('')
  })
})

describe('formatCurrencyOnChange — ingreso mensual', () => {
  it('formatea $8,500 al escribir sin decimales', () => {
    const { display, num } = formatCurrencyOnChange('8500')
    expect(display).toBe('8,500')
    expect(num).toBe(8500)
  })

  it('preserva el punto mientras el usuario empieza a escribir centavos ($8,500.)', () => {
    const { display, num } = formatCurrencyOnChange('8500.')
    expect(display).toBe('8,500.')
    expect(num).toBe(8500)
  })

  it('preserva decimales parciales al escribir ($8,500.5)', () => {
    const { display, num } = formatCurrencyOnChange('8500.5')
    expect(display).toBe('8,500.5')
    expect(num).toBe(8500.5)
  })

  it('devuelve vacío y num undefined cuando el campo está vacío', () => {
    const { display, num } = formatCurrencyOnChange('')
    expect(display).toBe('')
    expect(num).toBeUndefined()
  })

  it("devuelve punto y num undefined si el usuario escribe solo '.'", () => {
    const { display, num } = formatCurrencyOnChange('.')
    expect(display).toBe('.')
    expect(num).toBeUndefined()
  })

  it('ignora letras y caracteres no numéricos', () => {
    const { num } = formatCurrencyOnChange('abc')
    expect(num).toBeUndefined()
  })

  it('formatea el ingreso mínimo requerido ($1,000)', () => {
    const { display, num } = formatCurrencyOnChange('1000')
    expect(display).toBe('1,000')
    expect(num).toBe(1000)
  })

  it('formatea pago de deuda de $0 (sin deudas en pago)', () => {
    const { display, num } = formatCurrencyOnChange('0')
    expect(display).toBe('0')
    expect(num).toBe(0)
  })
})

describe('formatCurrencyOnBlur — al salir del campo', () => {
  it('agrega .00 al perder foco en ingreso entero ($8,500)', () => {
    expect(formatCurrencyOnBlur('8,500')).toBe('8,500.00')
  })

  it('completa a 2 decimales al perder foco ($8,500.5 → $8,500.50)', () => {
    expect(formatCurrencyOnBlur('8,500.5')).toBe('8,500.50')
  })

  it('formatea el ingreso mínimo al perder foco ($1,000)', () => {
    expect(formatCurrencyOnBlur('1,000')).toBe('1,000.00')
  })

  it('devuelve string vacío sin cambios si el campo está vacío', () => {
    expect(formatCurrencyOnBlur('')).toBe('')
  })
})

describe('formatCurrencyOnFocus — al entrar al campo', () => {
  it('quita .00 para edición cómoda ($8,500.00 → $8,500)', () => {
    expect(formatCurrencyOnFocus('8,500.00')).toBe('8,500')
  })

  it('quita decimales parciales al enfocar ($8,500.50 → $8,500.5)', () => {
    expect(formatCurrencyOnFocus('8,500.50')).toBe('8,500.5')
  })

  it('devuelve string vacío sin cambios si el campo está vacío', () => {
    expect(formatCurrencyOnFocus('')).toBe('')
  })
})
