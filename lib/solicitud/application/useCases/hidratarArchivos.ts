import { apiGet } from "@/lib/solicitud/infrastructure/http/apiClient"
import { generateUUID } from "@/lib/utils"
import type { TipoArchivo } from "@varolisto/shared-schemas/enums"
import type { ArchivoSubido } from "@/lib/solicitud/infrastructure/persistence/solicitudStore"

interface ArchivoStagingRemoto {
  storagePath: string
  tipoArchivo: TipoArchivo | null
  tamanoBytes: number
  mimeType: string
  uploadedAt: string | null
}

export interface HidratarArchivosResult {
  archivos: ArchivoSubido[]
}

export async function hidratarArchivos(
  sessionUuid: string,
): Promise<HidratarArchivosResult> {
  const { archivos } = await apiGet<{ archivos: ArchivoStagingRemoto[] }>(
    `/api/archivos/staging/${sessionUuid}`,
  )

  const mapeados = archivos
    .filter((a) => a.tipoArchivo !== null)
    .map((a) => ({
      clienteId: generateUUID(),
      archivoId: generateUUID(),
      tipoArchivo: a.tipoArchivo!,
      nombreOriginal: a.storagePath.split("/").at(-1) ?? a.storagePath,
      mimeType: a.mimeType,
      tamanoBytes: a.tamanoBytes,
      storagePath: a.storagePath,
    }))

  return { archivos: mapeados }
}
