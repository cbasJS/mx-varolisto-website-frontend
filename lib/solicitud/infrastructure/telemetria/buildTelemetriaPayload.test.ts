import { describe, it, expect } from 'vitest'
import { buildTelemetriaPayload, type BuildTelemetriaInput } from './buildTelemetriaPayload'
import { telemetriaSolicitudSchema } from '@varolisto/shared-schemas/form'

const dispositivoOK = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0',
  viewport: { width: 390, height: 844 },
  idioma: 'es-MX',
  zonaHoraria: 'America/Mexico_City',
  plataforma: 'MacIntel',
}

// Tiempos representativos: 4m30s total, paso 1 (12s landing), pasos 2-6
// medidos individuales, paso 7 pendiente porque el usuario está enviando.
const tiemposBase = {
  paso1Ms: 12_000,
  paso2Ms: 45_000,
  paso3Ms: 60_000,
  paso4Ms: 30_000,
  paso5Ms: 25_000,
  paso6Ms: 50_000,
  paso7Ms: null,
}

const inputBase: BuildTelemetriaInput = {
  iniciadoEn: '2026-05-12T10:00:00.000Z',
  enviadoEn: '2026-05-12T10:04:30.000Z',
  tiemposPaso: tiemposBase,
  edicionesPorCampo: { nombre: 1, curp: 2 },
  dispositivo: dispositivoOK,
  red: { referrer: 'https://www.google.com/' },
  fingerprint: 'abc123def456deadbeef',
  geolocalizacion: null,
  msPasoActualEnVuelo: { paso: 7, ms: 8_000 },
}

describe('buildTelemetriaPayload', () => {
  it('devuelve null si iniciadoEn está ausente — el bloque no viaja', () => {
    expect(buildTelemetriaPayload({ ...inputBase, iniciadoEn: null })).toBeNull()
  })

  it('devuelve null si dispositivo es null — el bloque no viaja', () => {
    expect(buildTelemetriaPayload({ ...inputBase, dispositivo: null })).toBeNull()
  })

  it('calcula duracionTotalMs = enviadoEn - iniciadoEn', () => {
    const tel = buildTelemetriaPayload(inputBase)!
    expect(tel.duracionTotalMs).toBe(4 * 60 * 1000 + 30 * 1000)
  })

  it('aplica msPasoActualEnVuelo al paso correspondiente antes de sumar', () => {
    const tel = buildTelemetriaPayload(inputBase)!
    expect(tel.tiemposPaso.paso7Ms).toBe(8_000)
  })

  it('tiempoCapturaFormularioMs es la suma exacta de pasos 2-6 cuando los 5 están medidos', () => {
    const tel = buildTelemetriaPayload(inputBase)!
    const suma = 45_000 + 60_000 + 30_000 + 25_000 + 50_000
    expect(tel.tiempoCapturaFormularioMs).toBe(suma)
    // El payload debe pasar la validación del schema (refine de equality).
    expect(() => telemetriaSolicitudSchema.parse(tel)).not.toThrow()
  })

  it('omite red, fingerprint y geolocalización cuando no hay datos', () => {
    const tel = buildTelemetriaPayload({
      ...inputBase,
      red: {},
      fingerprint: null,
      geolocalizacion: null,
    })!
    expect(tel.red).toBeUndefined()
    expect(tel.fingerprint).toBeUndefined()
    expect(tel.geolocalizacion).toBeUndefined()
    expect(() => telemetriaSolicitudSchema.parse(tel)).not.toThrow()
  })

  it('incluye geolocalización cuando el feature flag la entregó', () => {
    const geo = {
      lat: 19.4326,
      lon: -99.1332,
      precisionMetros: 50,
      capturadaEn: '2026-05-12T10:00:05.000Z',
    }
    const tel = buildTelemetriaPayload({ ...inputBase, geolocalizacion: geo })!
    expect(tel.geolocalizacion).toEqual(geo)
    expect(() => telemetriaSolicitudSchema.parse(tel)).not.toThrow()
  })

  it('cuando algún paso 2-6 es null, tiempoCapturaFormularioMs suma sólo los medidos (refine skipped)', () => {
    const tiemposParciales = {
      ...tiemposBase,
      paso3Ms: null, // no medido
      paso5Ms: null,
    }
    const tel = buildTelemetriaPayload({
      ...inputBase,
      tiemposPaso: tiemposParciales,
    })!
    expect(tel.tiempoCapturaFormularioMs).toBe(45_000 + 30_000 + 50_000)
    // El schema permite asimetría cuando hay nulls.
    expect(() => telemetriaSolicitudSchema.parse(tel)).not.toThrow()
  })

  it('clampa duracionTotalMs a 0 si por reloj corrido enviadoEn es anterior a iniciadoEn', () => {
    const tel = buildTelemetriaPayload({
      ...inputBase,
      iniciadoEn: '2026-05-12T10:00:00.000Z',
      enviadoEn: '2026-05-12T09:59:00.000Z',
    })
    // El cliente puede tener reloj desincronizado o el usuario puede haber
    // ajustado la hora manualmente; nunca debemos mandar un negativo.
    expect(tel?.duracionTotalMs).toBe(0)
  })

  it('msPasoActualEnVuelo se suma al acumulado existente del mismo paso', () => {
    const tiemposConPaso7Previo = {
      ...tiemposBase,
      paso7Ms: 5_000, // el usuario ya había estado 5s en revisión antes
    }
    const tel = buildTelemetriaPayload({
      ...inputBase,
      tiemposPaso: tiemposConPaso7Previo,
      msPasoActualEnVuelo: { paso: 7, ms: 3_000 },
    })!
    expect(tel.tiemposPaso.paso7Ms).toBe(8_000)
  })
})
