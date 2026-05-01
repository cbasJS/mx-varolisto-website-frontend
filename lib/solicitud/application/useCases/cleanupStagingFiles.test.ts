import { describe, it, expect, vi, beforeEach } from "vitest"

// Módulo aún no existe — debe fallar en rojo
import { enviarBeaconCleanup } from "./cleanupStagingFiles"

// Datos representativos del negocio:
// - sesión activa con INE frente ya subida a staging
// - solicitante cierra la pestaña antes de completar el formulario
const SESSION_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
const STORAGE_PATH_INE = "staging/a1b2c3d4-e5f6-7890-abcd-ef1234567890/ine_frente.jpg"

describe("enviarBeaconCleanup", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("llama sendBeacon con los datos del archivo de staging", () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { sendBeacon: sendBeaconMock })

    enviarBeaconCleanup({ sessionUuid: SESSION_UUID, storagePath: STORAGE_PATH_INE })

    expect(sendBeaconMock).toHaveBeenCalledTimes(1)

    const [url, blob] = sendBeaconMock.mock.calls[0] as [string, Blob]
    expect(url).toContain("/api/archivos/staging/beacon-cleanup")
    expect(blob).toBeInstanceOf(Blob)
  })

  it("serializa sessionUuid, storagePath y motivo beforeunload en el blob", async () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { sendBeacon: sendBeaconMock })

    enviarBeaconCleanup({ sessionUuid: SESSION_UUID, storagePath: STORAGE_PATH_INE })

    const [, blob] = sendBeaconMock.mock.calls[0] as [string, Blob]
    const texto = await blob.text()
    const payload = JSON.parse(texto)

    expect(payload.sessionUuid).toBe(SESSION_UUID)
    expect(payload.storagePath).toBe(STORAGE_PATH_INE)
    expect(payload.motivo).toBe("beforeunload")
  })

  it("envía el blob como text/plain para evitar preflight CORS", () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { sendBeacon: sendBeaconMock })

    enviarBeaconCleanup({ sessionUuid: SESSION_UUID, storagePath: STORAGE_PATH_INE })

    const [, blob] = sendBeaconMock.mock.calls[0] as [string, Blob]
    expect(blob.type).toBe("text/plain")
  })

  it("usa la URL absoluta del backend (no una ruta relativa)", () => {
    const sendBeaconMock = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { sendBeacon: sendBeaconMock })

    enviarBeaconCleanup({ sessionUuid: SESSION_UUID, storagePath: STORAGE_PATH_INE })

    const [url] = sendBeaconMock.mock.calls[0] as [string, Blob]
    expect(url).toMatch(/^https?:\/\//)
  })
})
