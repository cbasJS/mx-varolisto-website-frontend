import { describe, expect, it } from 'vitest'
import { ACTION_VARIANTS } from './alert-dialog-variants'
import { MEDIA_TONE, type AlertDialogMediaTone } from './alert-dialog-media-tone'

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

describe('AlertDialogMedia MEDIA_TONE', () => {
  const tones: AlertDialogMediaTone[] = ['default', 'destructive', 'warning']

  for (const tone of tones) {
    it(`expone tono ${tone}`, () => {
      expect(MEDIA_TONE).toHaveProperty(tone)
      expect(MEDIA_TONE[tone]).toBeTypeOf('string')
      expect(MEDIA_TONE[tone].length).toBeGreaterThan(0)
    })
  }

  it('default usa el navy primario (consistente con look anterior)', () => {
    expect(MEDIA_TONE.default).toMatch(/text-primary/)
    expect(MEDIA_TONE.default).toMatch(/bg-primary/)
  })

  it('destructive usa la paleta roja del sistema (rojo claro fondo, rojo oscuro texto)', () => {
    expect(MEDIA_TONE.destructive).toMatch(/bg-\[#fee2e2\]/)
    expect(MEDIA_TONE.destructive).toMatch(/text-\[#b91c1c\]/)
  })

  it('warning usa la paleta ámbar consistente con AvisoDuplicados', () => {
    expect(MEDIA_TONE.warning).toMatch(/bg-amber-/)
    expect(MEDIA_TONE.warning).toMatch(/text-amber-/)
  })
})
