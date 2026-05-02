import { describe, it, expect } from 'vitest'
import { formatBytes } from './formatBytes'

describe('formatBytes', () => {
  it('muestra bytes cuando es menor a 1024', () => {
    expect(formatBytes(500)).toBe('500 B')
  })

  it('muestra bytes en el límite inferior (0)', () => {
    expect(formatBytes(0)).toBe('0 B')
  })

  it('muestra bytes justo antes del umbral KB (1023)', () => {
    expect(formatBytes(1023)).toBe('1023 B')
  })

  it('muestra KB a partir de 1024 bytes', () => {
    expect(formatBytes(1024)).toBe('1 KB')
  })

  it('muestra KB sin decimales (redondeado)', () => {
    expect(formatBytes(1536)).toBe('2 KB') // 1.5 KB → redondea a 2
  })

  it('muestra KB justo antes del umbral MB (1048575)', () => {
    expect(formatBytes(1048575)).toBe('1024 KB')
  })

  it('muestra MB a partir de 1048576 bytes (1 MB exacto)', () => {
    expect(formatBytes(1048576)).toBe('1.0 MB')
  })

  it('muestra MB con un decimal para archivos grandes', () => {
    expect(formatBytes(2621440)).toBe('2.5 MB') // 2.5 MB exacto
  })

  it('muestra MB para tamaño típico de INE escaneada (300 KB)', () => {
    expect(formatBytes(307200)).toBe('300 KB')
  })

  it('muestra MB para tamaño típico de PDF de nómina (1.2 MB)', () => {
    expect(formatBytes(1258291)).toBe('1.2 MB')
  })
})
