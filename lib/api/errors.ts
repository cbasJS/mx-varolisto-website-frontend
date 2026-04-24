export interface ApiErrorPayload {
  status: number
  code?: string
  mensaje?: string
  detalles?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly mensaje?: string
  readonly detalles?: Record<string, string[]>

  constructor(payload: ApiErrorPayload) {
    super(payload.mensaje ?? `Error HTTP ${payload.status}`)
    this.name = "ApiError"
    this.status = payload.status
    this.code = payload.code
    this.mensaje = payload.mensaje
    this.detalles = payload.detalles
  }
}

export function esErrorDeValidacion(e: unknown): e is ApiError {
  return e instanceof ApiError && e.status === 422
}

export function esErrorDeConflicto(e: unknown): e is ApiError {
  return e instanceof ApiError && e.status === 409
}

export function esErrorDeRed(e: unknown): e is ApiError {
  return e instanceof ApiError && e.status === 0
}
