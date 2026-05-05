import {
  apiPost,
  apiDelete,
  DEFAULT_TIMEOUT_MS,
  SHORT_TIMEOUT_MS,
} from '@/lib/solicitud/infrastructure/http/apiClient'
import { apiRoutes } from '@/lib/solicitud/infrastructure/config/apiConfig'
import type { TipoArchivo } from '@varolisto/shared-schemas/enums'
import type {
  UploadUrlRequest,
  UploadUrlResponse,
  EliminarStagingRequest,
  EliminarStagingResponse,
} from '@/lib/solicitud/infrastructure/http/types'

export interface SolicitarUploadUrlInput {
  sessionUuid: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
}

export interface SolicitarUploadUrlResult {
  uploadUrl: string
  storagePath: string
  archivoId: string
}

export async function solicitarUploadUrl(
  input: SolicitarUploadUrlInput,
): Promise<SolicitarUploadUrlResult> {
  const response = await apiPost<UploadUrlRequest, UploadUrlResponse>(
    apiRoutes.archivoUpload,
    input,
    { timeoutMs: DEFAULT_TIMEOUT_MS },
  )
  return {
    uploadUrl: response.uploadUrl,
    storagePath: response.storagePath,
    archivoId: response.archivoId,
  }
}

export async function eliminarArchivoStaging(
  sessionUuid: string,
  storagePath: string,
  motivo: 'user_action' | 'tipo_identificacion_changed',
): Promise<void> {
  const req: EliminarStagingRequest = { sessionUuid, storagePath, motivo }
  try {
    await apiDelete<EliminarStagingRequest, EliminarStagingResponse>(apiRoutes.archivoDelete, req, {
      timeoutMs: SHORT_TIMEOUT_MS,
    })
  } catch {
    await new Promise((r) => setTimeout(r, 500))
    await apiDelete<EliminarStagingRequest, EliminarStagingResponse>(apiRoutes.archivoDelete, req, {
      timeoutMs: SHORT_TIMEOUT_MS,
    })
  }
}
