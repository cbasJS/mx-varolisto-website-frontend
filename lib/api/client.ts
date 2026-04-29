import { ApiError } from "./errors"

const DEFAULT_TIMEOUT_MS = 30_000

async function apiFetch<TReq, TRes>(
  method: string,
  path: string,
  body: TReq,
  options?: { timeoutMs?: number },
): Promise<TRes> {
  const controller = new AbortController()
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const timerId = setTimeout(() => controller.abort(), timeoutMs)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL no está configurado")

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    throw new ApiError({ status: 0, code: "network", mensaje: "Error de red o tiempo de espera agotado" })
  } finally {
    clearTimeout(timerId)
  }

  if (response.ok) {
    return response.json() as Promise<TRes>
  }

  let errorBody: { error?: string; mensaje?: string; detalles?: Record<string, string[]> } = {}
  try {
    errorBody = await response.json()
  } catch {
    // Si el cuerpo no es JSON, dejamos el objeto vacío
  }

  throw new ApiError({
    status: response.status,
    code: errorBody.error,
    mensaje: errorBody.mensaje,
    detalles: errorBody.detalles,
  })
}

export async function apiPost<TReq, TRes>(
  path: string,
  body: TReq,
  options?: { timeoutMs?: number },
): Promise<TRes> {
  return apiFetch("POST", path, body, options)
}

export async function apiDelete<TReq, TRes>(
  path: string,
  body: TReq,
  options?: { timeoutMs?: number },
): Promise<TRes> {
  return apiFetch("DELETE", path, body, options)
}

export async function apiGet<TRes>(
  path: string,
  options?: { timeoutMs?: number },
): Promise<TRes> {
  const controller = new AbortController()
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const timerId = setTimeout(() => controller.abort(), timeoutMs)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL no está configurado")

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    })
  } catch {
    throw new ApiError({ status: 0, code: "network", mensaje: "Error de red o tiempo de espera agotado" })
  } finally {
    clearTimeout(timerId)
  }

  if (response.ok) {
    return response.json() as Promise<TRes>
  }

  let errorBody: { error?: string; mensaje?: string; detalles?: Record<string, string[]> } = {}
  try {
    errorBody = await response.json()
  } catch {
    // Si el cuerpo no es JSON, dejamos el objeto vacío
  }

  throw new ApiError({
    status: response.status,
    code: errorBody.error,
    mensaje: errorBody.mensaje,
    detalles: errorBody.detalles,
  })
}
