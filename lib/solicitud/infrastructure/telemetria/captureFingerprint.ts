import FingerprintJS, { type Agent } from '@fingerprintjs/fingerprintjs'
import { TELEMETRIA_FINGERPRINT_MAX_LENGTH } from '@varolisto/shared-schemas'

/**
 * Calcula un fingerprint estable del dispositivo del cliente usando la
 * libreria OSS @fingerprintjs/fingerprintjs (MIT, v4 community).
 *
 * El fingerprint es **opcional** en el contrato de telemetria: si la captura
 * falla (browser bloquea APIs, contexto sin DOM, error inesperado), devuelve
 * `undefined` y el payload se manda sin el. Nunca debe romper el flow.
 *
 * La libreria computa un visitorId hex estable a partir de >40 senales del
 * navegador (canvas, audio context, fuentes instaladas, hardware concurrency,
 * codecs, etc.). El visitorId es consistente entre visitas del mismo
 * dispositivo y unico (con alta probabilidad) entre dispositivos distintos.
 */

let agentePromise: Promise<Agent> | null = null

function obtenerAgente(): Promise<Agent> {
  if (!agentePromise) {
    agentePromise = FingerprintJS.load()
  }
  return agentePromise
}

export function _resetAgenteParaTests(): void {
  agentePromise = null
}

export async function calcularFingerprint(): Promise<string | undefined> {
  try {
    if (typeof window === 'undefined') return undefined
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL === '1'
    ) {
      throw new Error('forced via NEXT_PUBLIC_FORCE_FINGERPRINT_FAIL')
    }
    const agente = await obtenerAgente()
    const resultado = await agente.get()
    const visitorId = resultado.visitorId
    if (!visitorId) return undefined
    return visitorId.slice(0, TELEMETRIA_FINGERPRINT_MAX_LENGTH)
  } catch {
    return undefined
  }
}
