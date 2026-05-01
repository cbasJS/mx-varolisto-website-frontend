import { describe, it, expect, vi, beforeEach } from "vitest"
import { ApiError } from "@/lib/solicitud/infrastructure/http/apiErrors"

// Módulo aún no existe — debe fallar en rojo
import { solicitarUploadUrl, eliminarArchivoStaging } from "./uploadFile"

// Datos representativos del negocio:
// - sessionUuid de una sesión activa de solicitud
// - INE como tipo de identificación (más común entre solicitantes)
// - PDF de comprobante de ingresos, ~250 KB (dentro del límite del producto)
const SESSION_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
const STORAGE_PATH_INE = "staging/a1b2c3d4-e5f6-7890-abcd-ef1234567890/ine_frente.jpg"
const ARCHIVO_INE = {
  sessionUuid: SESSION_UUID,
  tipoArchivo: "ine_frente" as const,
  nombreOriginal: "ine_frente.jpg",
  mimeType: "image/jpeg",
  tamanoBytes: 248_320, // ~242 KB
}

describe("solicitarUploadUrl", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("resuelve con uploadUrl, storagePath y archivoId cuando el backend responde OK", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        uploadUrl: "https://storage.varolisto.mx/presigned/abc123",
        storagePath: STORAGE_PATH_INE,
        archivoId: "arch-uuid-001",
        expiresIn: 300,
      }),
    }))

    const resultado = await solicitarUploadUrl(ARCHIVO_INE)

    expect(resultado.uploadUrl).toBe("https://storage.varolisto.mx/presigned/abc123")
    expect(resultado.storagePath).toBe(STORAGE_PATH_INE)
    expect(resultado.archivoId).toBe("arch-uuid-001")
  })

  it("incluye el sessionUuid del solicitante en el request al backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        uploadUrl: "https://storage.varolisto.mx/presigned/abc123",
        storagePath: STORAGE_PATH_INE,
        archivoId: "arch-uuid-001",
        expiresIn: 300,
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await solicitarUploadUrl(ARCHIVO_INE)

    const bodyEnviado = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(bodyEnviado.sessionUuid).toBe(SESSION_UUID)
    expect(bodyEnviado.tipoArchivo).toBe("ine_frente")
    expect(bodyEnviado.mimeType).toBe("image/jpeg")
  })

  it("lanza ApiError con status 422 cuando el archivo no cumple requisitos del backend", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ mensaje: "Formato de archivo no permitido" }),
    }))

    await expect(solicitarUploadUrl(ARCHIVO_INE)).rejects.toBeInstanceOf(ApiError)
    await expect(solicitarUploadUrl(ARCHIVO_INE)).rejects.toMatchObject({ status: 422 })
  })

  it("lanza ApiError con status 0 cuando no hay conexión al solicitar URL de subida", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))

    await expect(solicitarUploadUrl(ARCHIVO_INE)).rejects.toMatchObject({ status: 0 })
  })
})

describe("eliminarArchivoStaging", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  it("elimina el archivo de staging en el primer intento cuando el backend responde OK", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ deleted: true }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const promesa = eliminarArchivoStaging(SESSION_UUID, STORAGE_PATH_INE, "user_action")
    await vi.runAllTimersAsync()
    await promesa

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("reintenta una vez con backoff de 500ms cuando el primer intento falla", async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ deleted: true }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const promesa = eliminarArchivoStaging(SESSION_UUID, STORAGE_PATH_INE, "user_action")
    await vi.runAllTimersAsync()
    await promesa

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("lanza error cuando ambos intentos fallan (sin conexión persistente)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"))
    vi.stubGlobal("fetch", fetchMock)

    const promesa = eliminarArchivoStaging(SESSION_UUID, STORAGE_PATH_INE, "user_action")
    // Adjuntamos el handler antes de correr los timers para evitar unhandled rejection
    const assertion = expect(promesa).rejects.toThrow()
    await vi.runAllTimersAsync()
    await assertion

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("acepta motivo tipo_identificacion_changed al cambiar INE por pasaporte", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ deleted: true }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const promesa = eliminarArchivoStaging(SESSION_UUID, STORAGE_PATH_INE, "tipo_identificacion_changed")
    await vi.runAllTimersAsync()
    await promesa

    const bodyEnviado = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(bodyEnviado.motivo).toBe("tipo_identificacion_changed")
    expect(bodyEnviado.sessionUuid).toBe(SESSION_UUID)
    expect(bodyEnviado.storagePath).toBe(STORAGE_PATH_INE)
  })
})
