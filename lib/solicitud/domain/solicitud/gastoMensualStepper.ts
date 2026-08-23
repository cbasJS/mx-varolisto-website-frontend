import { GASTO_MENSUAL_MIN, GASTO_MENSUAL_STEP } from '@varolisto/shared-schemas'

/**
 * Normaliza un gasto al múltiplo de $500 más cercano, sin bajar de cero.
 * Usado por el stepper del Paso 4 (Bloque 1.A) para mantener el campo en
 * incrementos de $500 cuando el usuario teclea un valor arbitrario.
 */
export function normalizarGastoAlStep(valor: number): number {
  const normalizado = Math.round(valor / GASTO_MENSUAL_STEP) * GASTO_MENSUAL_STEP
  return Math.max(normalizado, GASTO_MENSUAL_MIN)
}
