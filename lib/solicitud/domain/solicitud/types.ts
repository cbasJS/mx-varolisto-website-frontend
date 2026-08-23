import type { SolicitudCompleta } from '@/lib/solicitud/domain/solicitud/schemas'
import type { CopomexResponse } from '@/lib/solicitud/infrastructure/colonias/types'
import type { TipoArchivo, TipoIdentificacion } from '@varolisto/shared-schemas/enums'

/**
 * Tipo de un archivo subido al staging.
 *
 * Vive aquí (no en el store del formulario público) porque el formulario
 * de Bloque 1 ya no captura documentos. Se conserva tipado para reutilización
 * en la futura página standalone de carga (Bloque 3) y por los casos de uso
 * todavía vivos (`useUploadArchivo`, `uploadFile`, `cleanupStagingFiles`).
 */
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
 * En Bloque 1 el wizard quedó en 6 pasos (1=landing, 2=identidad, 3=domicilio,
 * 4=economía, 5=referencias, 6=revisión). `paso7Ms` se conserva sólo para
 * mantener compatibilidad con el contrato de shared-schemas (que aún declara
 * 7 buckets para la siguiente fase de docs en línea). Siempre viaja en `null`
 * desde este formulario. Se removerá del contrato cuando shared-schemas bumpe
 * el schema en una versión futura.
 *
 * Distinción entre `tiemposPaso.paso{N}Ms` (todos los buckets del contrato) y
 * la suma de pasos 2-5 + 6 (`tiempoCapturaFormularioMs`) se hace en
 * buildPayload: paso 1 (landing) y paso 6 (revisión) miden conversión/
 * decisión, no esfuerzo de llenado puro. El scoring anti-fraude del Bloque
 * 2C consume `tiempoCapturaFormularioMs`.
 */
export interface TiemposPaso {
  paso1Ms: number | null
  paso2Ms: number | null
  paso3Ms: number | null
  paso4Ms: number | null
  paso5Ms: number | null
  paso6Ms: number | null
  /** Legacy del flujo previo (docs en línea). Siempre `null` desde el
   * formulario de Bloque 1; se mantiene para el contrato de shared-schemas. */
  paso7Ms: number | null
}

export type NumeroPasoTelemetria = 1 | 2 | 3 | 4 | 5 | 6

export interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  // ISO timestamp del primer mount del formulario en esta sesión.
  iniciadoEn: string | null
  coloniasCache: Record<string, CopomexResponse[]>
  sessionUuid: string | null
  // Bloque 1: el wizard ya no escribe los siguientes 3 campos —
  // el paso de documentos quedó desconectado. Se conservan en el state
  // para que `Paso6Documentos` (componente preservado para reuso futuro
  // como página standalone) compile contra el mismo store.
  archivosSubidos: ArchivoSubido[]
  tipoIdentificacion: TipoIdentificacion | null
  comprobantes: File[]
  // Telemetría — no persistida en sessionStorage.
  tiemposPaso: TiemposPaso
  pasoActualEntrada: number | null
  // Paso actualmente "abierto" para la captura de tiempo. Se mantiene
  // separado de `pasoActual` porque `setPaso(N)` cambia `pasoActual` ANTES
  // de que `marcarEntradaPaso(N)` se ejecute en el effect: si usáramos
  // `pasoActual` para identificar al saliente, el delta se acumularía
  // siempre en el paso al que entramos en lugar del que dejamos —
  // dejando `paso1Ms` siempre en null.
  pasoEnVuelo: NumeroPasoTelemetria | null
  edicionesPorCampo: Record<string, number>
  _hasHydrated: boolean
}

export interface SolicitudActions {
  setPaso: (paso: number) => void
  guardarPaso: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setColoniasCache: (cp: string, data: CopomexResponse[]) => void
  inicializarSession: () => void
  resetForm: () => void
  setHasHydrated: (value: boolean) => void
  // Acciones del paso de documentos deprecado (preservadas para Paso6Documentos
  // standalone). El wizard del formulario público ya no las invoca.
  setComprobantes: (archivos: File[]) => void
  agregarArchivoSubido: (archivo: ArchivoSubido) => void
  removerArchivoSubido: (clienteId: string) => void
  setTipoIdentificacion: (tipo: TipoIdentificacion | null) => void
  // Telemetría — captura pasiva del formulario público (Bloque 1.B).
  marcarEntradaPaso: (paso: NumeroPasoTelemetria) => void
  incrementarEdicion: (nombreCampo: string) => void
}
