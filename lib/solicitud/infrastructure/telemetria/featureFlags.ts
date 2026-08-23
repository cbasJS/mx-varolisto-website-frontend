/**
 * Feature flags de la captura de telemetría (Bloque 1.B).
 *
 * Las flags se leen de variables NEXT_PUBLIC_* que se inlinean en el bundle
 * del cliente. No se usa `process.env` dinámicamente: Next.js lo reemplaza
 * en build time, por lo que la lectura es estática y segura para el cliente.
 */

const TRUTHY = new Set(['true', '1', 'on', 'yes'])

function esFlagActivo(valor: string | undefined): boolean {
  if (!valor) return false
  return TRUTHY.has(valor.trim().toLowerCase())
}

/**
 * Captura de geolocalización del dispositivo.
 *
 * Por default está apagada. Sólo se enciende cuando el aviso de privacidad
 * ya se actualizó (decisión del CEO, fuera de los PRs de implementación).
 */
export function geolocalizacionHabilitada(): boolean {
  return esFlagActivo(process.env.NEXT_PUBLIC_TELEMETRIA_GEO_ENABLED)
}
