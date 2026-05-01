// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { usePaso6 } from "./usePaso6"
import { useSolicitudStore } from "@/lib/solicitud/store"

// Archivos representativos ya subidos a staging (hidratados desde sessionStorage)
// CP 06600 = Col. Juárez, Cuauhtémoc, Ciudad de México
const ARCHIVO_INE_FRENTE = {
  clienteId: "cliente-uuid-ine-frente-001",
  tipoArchivo: "ine_frente" as const,
  nombreOriginal: "ine_frente.jpg",
  mimeType: "image/jpeg",
  tamanoBytes: 248_320,
  storagePath: "staging/session-06600/ine_frente.jpg",
  archivoId: "arch-uuid-ine-001",
}

const ARCHIVO_COMPROBANTE = {
  clienteId: "cliente-uuid-comp-001",
  tipoArchivo: "comprobante_ingreso" as const,
  nombreOriginal: "recibo_nomina_enero.jpg",
  mimeType: "image/jpeg",
  tamanoBytes: 183_040,
  storagePath: "staging/session-06600/recibo_nomina_enero.jpg",
  archivoId: "arch-uuid-comp-001",
}

vi.mock("@/lib/solicitud/application/useCases/hidratarArchivos", () => ({
  hidratarArchivos: vi.fn().mockResolvedValue({ archivos: [] }),
}))

vi.mock("@/lib/solicitud/application/useCases/uploadFile", () => ({
  solicitarUploadUrl: vi.fn(),
  eliminarArchivoStaging: vi.fn().mockResolvedValue(undefined),
}))

describe("usePaso6 — hidratación desde sessionStorage", () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      archivosSubidos: [],
      sessionUuid: "session-06600-abc",
      tipoIdentificacion: "ine",
      datos: { tipoActividad: "empleado" },
    })
  })

  it("cuando el store ya tiene archivos al montar (rehydrated desde sessionStorage), las entradas se sincronizan al mapa", async () => {
    // Simula el caso donde sessionStorage ya hidró el store antes del montaje del hook
    useSolicitudStore.setState({
      archivosSubidos: [ARCHIVO_INE_FRENTE, ARCHIVO_COMPROBANTE],
    })

    const { result } = renderHook(() => usePaso6(vi.fn()))

    // Las entradas deben reflejar los archivos del store (sincronización desde sessionStorage)
    await waitFor(() => {
      expect(result.current.entradas.length).toBe(2)
    })

    const clienteIds = result.current.entradas.map((e) => e.clienteId)
    expect(clienteIds).toContain(ARCHIVO_INE_FRENTE.clienteId)
    expect(clienteIds).toContain(ARCHIVO_COMPROBANTE.clienteId)
  })

  it("cuando el store empieza vacío, las entradas también arrancan vacías", () => {
    const { result } = renderHook(() => usePaso6(vi.fn()))

    expect(result.current.entradas).toHaveLength(0)
  })
})
