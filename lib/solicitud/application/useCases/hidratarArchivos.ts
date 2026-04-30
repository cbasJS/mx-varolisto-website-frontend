import { apiGet } from "@/lib/solicitud/infrastructure/http/apiClient"
import { apiRoutes } from "@/lib/solicitud/infrastructure/config/apiConfig"
import { generateUUID } from "@/lib/utils"
import type { ArchivoSubido } from "@/lib/solicitud/domain/solicitud/types"
import type { ArchivoStagingRemoto } from "@/lib/solicitud/infrastructure/http/types"

export interface HidratarArchivosResult {
  archivos: ArchivoSubido[]
}

export async function hidratarArchivos(
  sessionUuid: string,
): Promise<HidratarArchivosResult> {
  const { archivos } = await apiGet<{ archivos: ArchivoStagingRemoto[] }>(
    apiRoutes.archivoStaging(sessionUuid),
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
