import { TELEMETRIA_FINGERPRINT_MAX_LENGTH } from '@varolisto/shared-schemas'

/**
 * Calcula un fingerprint estable del dispositivo del cliente.
 *
 * El fingerprint es **opcional** en el contrato de telemetría: si la captura
 * falla (browser bloquea APIs, contexto sin DOM, error inesperado), devuelve
 * `undefined` y el payload se manda sin él. Nunca debe romper el flow.
 *
 * Implementación local (sin librería externa): un hash FNV-1a de 64 bits
 * sobre la concatenación de señales estables:
 * - userAgent
 * - language
 * - timezone (Intl.DateTimeFormat)
 * - hardwareConcurrency
 * - screen.colorDepth + screen.width/height
 * - canvas fingerprint (un dibujo pequeño cuyo bitmap depende de fuentes,
 *   anti-aliasing y GPU del dispositivo)
 *
 * Por qué este enfoque: es ~zero-cost, no agrega dependencias externas
 * (registry inaccesible en este ambiente), y produce un hash determinista
 * por dispositivo sin tracking adicional. La consistencia entre visitas se
 * mantiene porque las señales son intrínsecas al dispositivo, no a cookies
 * ni a sessionStorage. Para producción real, se puede swappear por
 * @fingerprintjs/fingerprintjs OSS sin tocar el contrato — basta cambiar
 * el cuerpo de `calcularFingerprint`.
 */

function fnv1a64Hex(input: string): string {
  // FNV-1a 64-bit usando dos enteros de 32 bits (JavaScript no tiene u64
  // nativo sin BigInt; con BigInt el cómputo es 5x más lento, no vale).
  let hashHigh = 0xcbf2_9ce4 // FNV offset basis high
  let hashLow = 0x8422_3325 // FNV offset basis low
  const primeHigh = 0x0000_0100
  const primeLow = 0x0000_01b3

  for (let i = 0; i < input.length; i++) {
    const codepoint = input.charCodeAt(i)
    hashLow = hashLow ^ codepoint
    // 64-bit multiply broken into 32-bit halves
    const lowLow = hashLow & 0xffff
    const lowHigh = hashLow >>> 16
    const product1 = lowLow * primeLow
    const product2 = lowHigh * primeLow + (product1 >>> 16)
    const product3 = lowLow * primeHigh + (product2 & 0xffff)
    const newLow = ((product3 & 0xffff) << 16) | (product1 & 0xffff)
    const newHigh =
      ((hashHigh * primeLow) | 0) +
      ((lowHigh * primeHigh) | 0) +
      (product2 >>> 16) +
      (product3 >>> 16)
    hashHigh = newHigh >>> 0
    hashLow = newLow >>> 0
  }

  return hashHigh.toString(16).padStart(8, '0') + hashLow.toString(16).padStart(8, '0')
}

function canvasFingerprint(): string {
  if (typeof document === 'undefined') return ''
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    // Texto + emoji para forzar fallback de fuentes; cada GPU/SO renderiza
    // levemente distinto, produciendo bitmaps únicos por dispositivo.
    ctx.textBaseline = 'top'
    ctx.font = '14px "Arial"'
    ctx.fillStyle = '#000666'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#2ECC71'
    ctx.fillText('VaroListo \u{1F4B0}', 4, 17)
    return canvas.toDataURL()
  } catch {
    return ''
  }
}

function señalesEstables(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return ''
  const partes: string[] = []
  const push = (etiqueta: string, fn: () => string | number | undefined) => {
    try {
      const v = fn()
      partes.push(`${etiqueta}=${v ?? ''}`)
    } catch {
      partes.push(`${etiqueta}=`)
    }
  }

  push('ua', () => navigator.userAgent)
  push('lang', () => navigator.language)
  push('tz', () => Intl.DateTimeFormat().resolvedOptions().timeZone)
  push('cores', () => navigator.hardwareConcurrency)
  push('depth', () => screen.colorDepth)
  push('screen', () => `${screen.width}x${screen.height}`)
  push('canvas', () => canvasFingerprint())

  return partes.join('|')
}

/**
 * Devuelve un fingerprint hex de 16 chars (FNV-1a 64-bit) o `undefined` si
 * la captura falla. La firma del retorno es async para dejar abierta una
 * implementación futura con @fingerprintjs/fingerprintjs (cuya API es async).
 */
export async function calcularFingerprint(): Promise<string | undefined> {
  try {
    if (typeof window === 'undefined') return undefined
    const señales = señalesEstables()
    if (!señales) return undefined
    const hash = fnv1a64Hex(señales)
    if (!hash) return undefined
    // Por contrato el schema acepta hasta TELEMETRIA_FINGERPRINT_MAX_LENGTH;
    // nuestro hash siempre cabe (16 chars). Defensivo igual.
    return hash.slice(0, TELEMETRIA_FINGERPRINT_MAX_LENGTH)
  } catch {
    return undefined
  }
}
