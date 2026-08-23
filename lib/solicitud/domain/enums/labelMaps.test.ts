import { describe, it, expect } from 'vitest'
import {
  DESTINO_LABELS,
  DESTINOS_META,
  ACTIVIDAD_LABELS,
  ACTIVIDADES_META,
  RELACION_LABELS,
  RELACIONES_META,
} from './labelMaps'

describe('DESTINO_LABELS', () => {
  it('cada label coincide con el campo label del meta object correspondiente', () => {
    for (const key of Object.keys(DESTINOS_META) as Array<keyof typeof DESTINOS_META>) {
      expect(DESTINO_LABELS[key]).toBe(DESTINOS_META[key].label)
    }
  })

  it('tiene exactamente las mismas claves que DESTINOS_META', () => {
    expect(Object.keys(DESTINO_LABELS).sort()).toEqual(Object.keys(DESTINOS_META).sort())
  })
})

describe('ACTIVIDAD_LABELS', () => {
  it('cada label coincide con el campo label del meta object correspondiente', () => {
    for (const key of Object.keys(ACTIVIDADES_META) as Array<keyof typeof ACTIVIDADES_META>) {
      expect(ACTIVIDAD_LABELS[key]).toBe(ACTIVIDADES_META[key].label)
    }
  })

  it('tiene exactamente las mismas claves que ACTIVIDADES_META', () => {
    expect(Object.keys(ACTIVIDAD_LABELS).sort()).toEqual(Object.keys(ACTIVIDADES_META).sort())
  })
})

describe('RELACIONES_META', () => {
  it('es el mismo objeto que RELACION_LABELS (ya derivado correctamente)', () => {
    expect(RELACIONES_META).toBe(RELACION_LABELS)
  })
})
