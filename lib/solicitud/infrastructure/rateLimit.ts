/**
 * Rate limiting del endpoint publico /api/colonias.
 *
 * /api/colonias es un proxy sin auth hacia COPOMEX, que se cobra por paquete
 * prepagado de llamadas. Sin limite, cualquiera puede iterar el rango de CPs
 * de Mexico (~145k) y quemar la cuota. El Data Cache de 24 h amortigua los CPs
 * repetidos, pero no un barrido.
 *
 * Se apoya en el binding `ratelimit` de Workers (GA desde 2025-09):
 * https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 *
 * Limitaciones conocidas y aceptadas:
 * - El conteo es por datacenter, no global. Un atacante distribuido multiplica
 *   su cuota por el numero de colos que alcance.
 * - La request si invoca al Worker; lo que se evita es la llamada a COPOMEX,
 *   que es el gasto que importa.
 * - La doc desaconseja usar IP como clave y prefiere identificadores estables,
 *   pero en un endpoint publico sin sesion la IP es lo unico disponible.
 */

/** Forma minima del binding. No dependemos de `cloudflare-env.d.ts`: es generado y esta gitignoreado. */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

/** Bucket compartido para trafico sin IP identificable: se limita, no se exenta. */
const CLAVE_SIN_IP = 'ip-desconocida'

export function obtenerClaveCliente(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? CLAVE_SIN_IP
}

/**
 * `true` si la request puede continuar hacia COPOMEX.
 *
 * Falla abierto a proposito: si el binding no esta (ej. `next dev`, que no corre
 * sobre workerd) o si el limiter revienta, preferimos servir el CP a tumbar el
 * formulario. El riesgo es cuota, no integridad de datos.
 */
export async function dentroDelLimite(
  limiter: RateLimiter | undefined,
  request: Request,
): Promise<boolean> {
  if (!limiter) return true

  try {
    const { success } = await limiter.limit({ key: obtenerClaveCliente(request) })
    return success
  } catch {
    return true
  }
}
