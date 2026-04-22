export const TASA_MENSUAL = 0.0464

export function calcularCuota(monto: number, plazo: number): number {
  return Math.round(
    (monto * TASA_MENSUAL * Math.pow(1 + TASA_MENSUAL, plazo)) /
      (Math.pow(1 + TASA_MENSUAL, plazo) - 1),
  )
}
