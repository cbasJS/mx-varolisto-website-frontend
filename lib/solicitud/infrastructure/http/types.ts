import type { TipoArchivo } from "@varolisto/shared-schemas/enums"

export interface UploadUrlRequest {
  sessionUuid: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
}

export interface UploadUrlResponse {
  uploadUrl: string
  storagePath: string
  archivoId: string
  expiresIn: number
}

export interface EliminarStagingRequest {
  sessionUuid: string
  storagePath: string
  motivo: "user_action" | "tipo_identificacion_changed"
}

export interface EliminarStagingResponse {
  deleted: boolean
}

export interface ArchivoStagingRemoto {
  storagePath: string
  tipoArchivo: TipoArchivo | null
  tamanoBytes: number
  mimeType: string
  uploadedAt: string | null
}
