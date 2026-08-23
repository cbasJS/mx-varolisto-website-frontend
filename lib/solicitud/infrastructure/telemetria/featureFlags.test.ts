import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { geolocalizacionHabilitada } from './featureFlags'

const ORIGINAL = process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED

describe('geolocalizacionHabilitada', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
  })
  afterEach(() => {
    if (ORIGINAL === undefined) {
      delete process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED
    } else {
      process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = ORIGINAL
    }
  })

  it('devuelve false cuando la flag no está definida (default seguro)', () => {
    expect(geolocalizacionHabilitada()).toBe(false)
  })

  it('devuelve false cuando la flag es "false"', () => {
    process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = 'false'
    expect(geolocalizacionHabilitada()).toBe(false)
  })

  it('devuelve true sólo con valores explícitamente truthy', () => {
    for (const v of ['true', '1', 'on', 'yes', 'TRUE', 'True']) {
      process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = v
      expect(geolocalizacionHabilitada()).toBe(true)
    }
  })

  it('devuelve false con strings ambiguos', () => {
    for (const v of ['', '0', 'no', 'off', 'maybe']) {
      process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED = v
      expect(geolocalizacionHabilitada()).toBe(false)
    }
  })
})
