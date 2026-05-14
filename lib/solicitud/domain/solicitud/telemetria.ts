import type { TipoArchivo } from '@varolisto/shared-schemas/enums'
import type { ContextoProcesamiento, RazonRechazo, WarningProcesamiento } from './fileProcessor'

export interface ProcesamientoEvent {
  tipo: TipoArchivo | 'drop-rejected'
  contexto?: ContextoProcesamiento
  ok: boolean
  code: RazonRechazo['code'] | string | null
  dt: number
  warnings?: WarningProcesamiento['code'][]
}

export function logProcesamiento(event: ProcesamientoEvent): void {
  if (process.env.NODE_ENV === 'production') return
  // Sink temporal: en dev se imprime para ajustar umbrales. La conexión real
  // hacia analytics/Sentry se conectará cuando exista el endpoint dedicado.
  console.debug('[paso6][procesamiento]', event)
}
