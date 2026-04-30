import { apiPost } from "@/lib/solicitud/infrastructure/http/apiClient"
import {
  ApiError,
  esErrorDeConflicto,
  esErrorDeValidacion,
} from "@/lib/solicitud/infrastructure/http/apiErrors"
import { buildPayload } from "@/lib/solicitud/domain/solicitud/buildPayload"
import type { CrearSolicitudResponse } from "@varolisto/shared-schemas/api"
import type { TipoIdentificacion } from "@varolisto/shared-schemas/enums"
import type { ArchivoSubido } from "@/lib/solicitud/infrastructure/persistence/solicitudStore"
import type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso7Data,
} from "@/lib/solicitud/domain/solicitud/schemas"

type DatosSolicitud = Partial<
  Paso1Data & Paso2Data & Paso3Data & Paso4Data & Paso5Data & Paso7Data
>

export type ErrorSubmit =
  | { tipo: "conflicto" }
  | { tipo: "validacion"; detalles?: Record<string, string[]> }
  | { tipo: "red" }
  | { tipo: "desconocido"; mensaje?: string }

export interface SubmitSolicitudInput {
  datos: DatosSolicitud
  sessionUuid: string
  tipoIdentificacion: TipoIdentificacion
  archivosSubidos: ArchivoSubido[]
  paso7Data: Paso7Data
}

export interface SubmitSolicitudResult {
  folio: string
}

export async function submitSolicitud(
  input: SubmitSolicitudInput,
): Promise<SubmitSolicitudResult> {
  const payload = buildPayload(input)

  const response = await apiPost<ReturnType<typeof buildPayload>, CrearSolicitudResponse>(
    "/api/solicitudes",
    payload,
    { timeoutMs: 30_000 },
  )

  return { folio: response.folio }
}

export function clasificarError(err: unknown): ErrorSubmit {
  if (esErrorDeConflicto(err)) return { tipo: "conflicto" }
  if (esErrorDeValidacion(err))
    return { tipo: "validacion", detalles: (err as ApiError).detalles }
  if (err instanceof ApiError && err.status === 0) return { tipo: "red" }
  return { tipo: "desconocido", mensaje: err instanceof ApiError ? err.mensaje : undefined }
}
