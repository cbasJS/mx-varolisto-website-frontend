import type { TelemetriaSolicitud } from '@varolisto/shared-schemas/form'
import type { TiemposPaso } from '@/lib/solicitud/domain/solicitud/types'
import { sumarTiempoCapturaFormulario } from '@/lib/solicitud/domain/solicitud/buildPayload'
import type { DispositivoSnapshot, RedSnapshot } from './captureDevice'
import type { GeolocalizacionSnapshot } from './captureGeo'

export interface BuildTelemetriaInput {
  iniciadoEn: string | null
  enviadoEn: string
  tiemposPaso: TiemposPaso
  edicionesPorCampo: Record<string, number>
  dispositivo: DispositivoSnapshot | null
  red: RedSnapshot
  fingerprint: string | null | undefined
  geolocalizacion: GeolocalizacionSnapshot | null
  /** ms transcurridos en el paso actual al momento del submit; se suma al
   * acumulado existente del paso 7 para no perder el tiempo de revisión. */
  msPasoActualEnVuelo?: { paso: 1 | 2 | 3 | 4 | 5 | 6 | 7; ms: number } | null
}

/**
 * Ensambla el bloque `telemetria` final que viaja en el POST /api/solicitudes.
 *
 * Devuelve `null` cuando faltan los mínimos requeridos por el schema:
 * `iniciadoEn` (timestamp ISO inicial) o `dispositivo`. En ese caso la
 * solicitud se manda sin el bloque — la telemetría es opcional por contrato.
 *
 * Función pura — testeable sin React ni navigator.
 */
export function buildTelemetriaPayload({
  iniciadoEn,
  enviadoEn,
  tiemposPaso,
  edicionesPorCampo,
  dispositivo,
  red,
  fingerprint,
  geolocalizacion,
  msPasoActualEnVuelo,
}: BuildTelemetriaInput): TelemetriaSolicitud | null {
  if (!iniciadoEn || !dispositivo) return null

  const duracionTotalMs = Math.max(0, Date.parse(enviadoEn) - Date.parse(iniciadoEn))

  // Aplicamos el delta del paso actual antes de calcular el tiempo de
  // captura. Sin esto, el paso 7 (revisión + submit) siempre llegaría con
  // null porque el usuario nunca "sale" hacia otro paso antes de enviar.
  let tiemposFinales = tiemposPaso
  if (msPasoActualEnVuelo) {
    const { paso, ms } = msPasoActualEnVuelo
    const key = `paso${paso}Ms` as keyof TiemposPaso
    const acumulado = tiemposFinales[key] ?? 0
    tiemposFinales = { ...tiemposFinales, [key]: acumulado + Math.max(0, ms) }
  }

  const tiempoCapturaFormularioMs = sumarTiempoCapturaFormulario(tiemposFinales)

  const payload: TelemetriaSolicitud = {
    iniciadoEn,
    enviadoEn,
    duracionTotalMs,
    tiemposPaso: tiemposFinales,
    tiempoCapturaFormularioMs,
    edicionesPorCampo,
    dispositivo,
    ...(red.referrer ? { red } : {}),
    ...(fingerprint ? { fingerprint } : {}),
    ...(geolocalizacion ? { geolocalizacion } : {}),
  }

  return payload
}
