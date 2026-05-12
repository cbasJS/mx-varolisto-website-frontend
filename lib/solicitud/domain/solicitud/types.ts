import type { SolicitudCompleta } from '@/lib/solicitud/domain/solicitud/schemas'
import type { CopomexResponse } from '@/lib/solicitud/infrastructure/colonias/types'
import type { TipoArchivo, TipoIdentificacion } from '@varolisto/shared-schemas/enums'

export interface ArchivoSubido {
  clienteId: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
  storagePath: string
  archivoId: string
}

/**
 * Telemetría pasiva del formulario público (Bloque 1.B del scoring v7).
 *
 * Vive sólo en memoria — no se persiste en sessionStorage. La razón:
 * 1) los tiempos por paso pueden contaminar entre sesiones (cliente que
 *    abandona y vuelve días después), 2) reduce la PII expuesta a un eventual
 *    XSS. Si la pestaña muere antes del submit, la telemetría se pierde y la
 *    solicitud se manda sin ella — es opcional por contrato.
 *
 * Distinción entre `tiemposPaso.paso{N}Ms` (todos los 7 del wizard) y la
 * suma de pasos 2-6 (`tiempoCapturaFormularioMs`) se hace en buildPayload:
 * pasos 1 y 7 (landing + revisión) miden conversión/decisión, no esfuerzo
 * de llenado. El scoring anti-fraude del Bloque 2C consume sólo pasos 2-6.
 */
export interface TiemposPaso {
  paso1Ms: number | null
  paso2Ms: number | null
  paso3Ms: number | null
  paso4Ms: number | null
  paso5Ms: number | null
  paso6Ms: number | null
  paso7Ms: number | null
}

export type NumeroPasoTelemetria = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  // ISO timestamp del primer mount del formulario en esta sesión.
  iniciadoEn: string | null
  coloniasCache: Record<string, CopomexResponse[]>
  sessionUuid: string | null
  archivosSubidos: ArchivoSubido[]
  tipoIdentificacion: TipoIdentificacion | null
  comprobantes: File[]
  // Telemetría — no persistida en sessionStorage.
  tiemposPaso: TiemposPaso
  pasoActualEntrada: number | null
  edicionesPorCampo: Record<string, number>
  _hasHydrated: boolean
}

export interface SolicitudActions {
  setPaso: (paso: number) => void
  guardarPaso: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setComprobantes: (archivos: File[]) => void
  setColoniasCache: (cp: string, data: CopomexResponse[]) => void
  inicializarSession: () => void
  agregarArchivoSubido: (archivo: ArchivoSubido) => void
  removerArchivoSubido: (clienteId: string) => void
  setTipoIdentificacion: (tipo: TipoIdentificacion) => void
  resetForm: () => void
  setHasHydrated: (value: boolean) => void
  // Telemetría — captura pasiva del formulario público (Bloque 1.B).
  marcarEntradaPaso: (paso: NumeroPasoTelemetria) => void
  incrementarEdicion: (nombreCampo: string) => void
}
