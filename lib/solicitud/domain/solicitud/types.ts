import type { SolicitudCompleta } from "@/lib/solicitud/domain/solicitud/schemas"
import type { CopomexResponse } from "@/lib/solicitud/infrastructure/colonias/types"
import type { TipoArchivo, TipoIdentificacion } from "@varolisto/shared-schemas/enums"

export interface ArchivoSubido {
  clienteId: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
  storagePath: string
  archivoId: string
}

export interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  coloniasCache: Record<string, CopomexResponse[]>
  sessionUuid: string | null
  archivosSubidos: ArchivoSubido[]
  tipoIdentificacion: TipoIdentificacion | null
  comprobantes: File[]
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
}
