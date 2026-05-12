import { geolocalizacionHabilitada } from './featureFlags'

/**
 * Captura de geolocalización del dispositivo en el momento de iniciar el
 * formulario. **Detrás de un feature flag apagado por default**: sólo se
 * encenderá cuando el aviso de privacidad esté actualizado (decisión del
 * CEO, fuera de los PRs de implementación).
 *
 * Si el flag está apagado, esta función no llama a la API del browser —
 * no se le pide permiso al usuario, ni siquiera implícitamente. Si el
 * flag está encendido y el usuario rechaza el permiso o la API falla,
 * devuelve `null` (no es señal de fraude — la propuesta v7 lo trata como
 * dato faltante).
 */

const GEO_TIMEOUT_MS = 5_000

export interface GeolocalizacionSnapshot {
  lat: number
  lon: number
  precisionMetros?: number
  capturadaEn: string
}

export async function capturarGeolocalizacion(): Promise<GeolocalizacionSnapshot | null> {
  if (!geolocalizacionHabilitada()) return null
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null

  return new Promise<GeolocalizacionSnapshot | null>((resolve) => {
    let settled = false
    const finish = (valor: GeolocalizacionSnapshot | null) => {
      if (settled) return
      settled = true
      resolve(valor)
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          finish({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            ...(typeof position.coords.accuracy === 'number'
              ? { precisionMetros: position.coords.accuracy }
              : {}),
            capturadaEn: new Date(position.timestamp ?? Date.now()).toISOString(),
          })
        },
        // Cualquier error (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT)
        // resuelve a null sin ruido. La telemetría es opcional.
        () => finish(null),
        {
          enableHighAccuracy: false,
          timeout: GEO_TIMEOUT_MS,
          maximumAge: 60_000,
        },
      )
    } catch {
      finish(null)
    }
  })
}
