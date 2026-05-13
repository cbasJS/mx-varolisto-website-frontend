// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { capturarDispositivo, capturarRed } from './captureDevice'
import {
  TELEMETRIA_LOCALE_MAX_LENGTH,
  TELEMETRIA_PLATAFORMA_MAX_LENGTH,
  TELEMETRIA_REFERRER_MAX_LENGTH,
  TELEMETRIA_TIMEZONE_MAX_LENGTH,
  TELEMETRIA_USER_AGENT_MAX_LENGTH,
} from '@varolisto/shared-schemas'

describe('capturarDispositivo', () => {
  let originalReferrer: PropertyDescriptor | undefined

  beforeEach(() => {
    // happy-dom expone navigator.userAgent / language / window.innerWidth.
    // No los toqueteamos para los tests "happy": leemos lo que el ambiente
    // ya tiene y validamos que no rompa.
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 844, configurable: true })
  })

  afterEach(() => {
    if (originalReferrer) {
      Object.defineProperty(document, 'referrer', originalReferrer)
      originalReferrer = undefined
    }
    vi.restoreAllMocks()
  })

  it('captura userAgent, viewport, idioma y zonaHoraria desde el navegador', () => {
    const snap = capturarDispositivo()
    expect(typeof snap.userAgent).toBe('string')
    expect(snap.viewport.width).toBe(390)
    expect(snap.viewport.height).toBe(844)
    expect(typeof snap.idioma).toBe('string')
    // happy-dom expone una zonaHoraria del entorno; lo importante es que sea string.
    expect(typeof snap.zonaHoraria).toBe('string')
  })

  it('clampea el userAgent a TELEMETRIA_USER_AGENT_MAX_LENGTH', () => {
    const uaLargo = 'Mozilla'.padEnd(TELEMETRIA_USER_AGENT_MAX_LENGTH + 50, 'x')
    Object.defineProperty(navigator, 'userAgent', { value: uaLargo, configurable: true })
    const snap = capturarDispositivo()
    expect(snap.userAgent.length).toBe(TELEMETRIA_USER_AGENT_MAX_LENGTH)
  })

  it('captura plataforma desde userAgentData cuando está disponible (preferido sobre navigator.platform)', () => {
    Object.defineProperty(navigator, 'userAgentData', {
      value: { platform: 'macOS' },
      configurable: true,
    })
    const snap = capturarDispositivo()
    expect(snap.plataforma).toBe('macOS')
  })

  it('hace fallback a navigator.platform cuando userAgentData no existe', () => {
    Object.defineProperty(navigator, 'userAgentData', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true })
    const snap = capturarDispositivo()
    expect(snap.plataforma).toBe('MacIntel')
  })

  it('omite plataforma cuando ninguna fuente la expone (string vacío)', () => {
    Object.defineProperty(navigator, 'userAgentData', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'platform', { value: '', configurable: true })
    const snap = capturarDispositivo()
    expect(snap.plataforma).toBeUndefined()
  })

  it('clampea plataforma a TELEMETRIA_PLATAFORMA_MAX_LENGTH', () => {
    const plataformaLarga = 'plataforma'.padEnd(TELEMETRIA_PLATAFORMA_MAX_LENGTH + 20, 'y')
    Object.defineProperty(navigator, 'userAgentData', {
      value: { platform: plataformaLarga },
      configurable: true,
    })
    const snap = capturarDispositivo()
    expect(snap.plataforma!.length).toBe(TELEMETRIA_PLATAFORMA_MAX_LENGTH)
  })

  it('no lanza cuando Intl.DateTimeFormat falla — devuelve string vacío en zonaHoraria', () => {
    const origIntl = Intl.DateTimeFormat
    vi.stubGlobal(
      'Intl',
      Object.assign({}, Intl, {
        DateTimeFormat: () => {
          throw new Error('no soportado')
        },
      }),
    )
    expect(() => capturarDispositivo()).not.toThrow()
    const snap = capturarDispositivo()
    expect(snap.zonaHoraria).toBe('')
    vi.stubGlobal('Intl', Object.assign({}, Intl, { DateTimeFormat: origIntl }))
  })

  it('clampea idioma y zonaHoraria a sus max', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'es-MX'.padEnd(TELEMETRIA_LOCALE_MAX_LENGTH + 10, 'z'),
      configurable: true,
    })
    const snap = capturarDispositivo()
    expect(snap.idioma.length).toBeLessThanOrEqual(TELEMETRIA_LOCALE_MAX_LENGTH)
    expect(snap.zonaHoraria.length).toBeLessThanOrEqual(TELEMETRIA_TIMEZONE_MAX_LENGTH)
  })
})

describe('capturarRed', () => {
  it('devuelve {} cuando document.referrer está vacío (entrada directa)', () => {
    Object.defineProperty(document, 'referrer', { value: '', configurable: true })
    expect(capturarRed()).toEqual({})
  })

  it('captura referrer y lo clampea al max del schema', () => {
    const referrerLargo = `https://example.com/`.padEnd(TELEMETRIA_REFERRER_MAX_LENGTH + 50, 'a')
    Object.defineProperty(document, 'referrer', { value: referrerLargo, configurable: true })
    const snap = capturarRed()
    expect(snap.referrer).toBeDefined()
    expect(snap.referrer!.length).toBe(TELEMETRIA_REFERRER_MAX_LENGTH)
  })

  it('captura un referrer corto sin tocarlo', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.google.com/',
      configurable: true,
    })
    expect(capturarRed()).toEqual({ referrer: 'https://www.google.com/' })
  })
})
