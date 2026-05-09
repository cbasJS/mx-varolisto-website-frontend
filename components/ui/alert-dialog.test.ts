import { describe, expect, it } from 'vitest'
import { ACTION_VARIANTS } from './alert-dialog-variants'

describe('AlertDialog ACTION_VARIANTS', () => {
  it('expone la variante outline-destructive para acciones destructivas de baja prominencia', () => {
    expect(ACTION_VARIANTS).toHaveProperty('outline-destructive')
  })

  it('outline-destructive usa borde + texto rojo, sin fondo rojo filled', () => {
    const v = ACTION_VARIANTS['outline-destructive']
    expect(v).toMatch(/border/)
    expect(v).toMatch(/text-\[#(b91c1c|dc2626)\]/)
    expect(v).not.toMatch(/bg-\[#dc2626\]/)
    expect(v).not.toMatch(/bg-\[#b91c1c\]/)
  })

  it('mantiene primary como variante filled del color de marca', () => {
    expect(ACTION_VARIANTS.primary).toMatch(/bg-primary/)
    expect(ACTION_VARIANTS.primary).toMatch(/text-white/)
  })
})
