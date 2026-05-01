// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useUploadArchivo } from "./useUploadArchivo"
import { useSolicitudStore } from "@/lib/solicitud/store"

// Archivo de INE representativo ya subido a staging en una sesión anterior
// (simulación del escenario de hidratación: el solicitante regresa a la pestaña
// con archivos ya cargados desde sessionStorage)
const ARCHIVO_INE_SUBIDO = {
  clienteId: "cliente-uuid-ine-001",
  tipoArchivo: "ine_frente" as const,
  nombreOriginal: "ine_frente.jpg",
  mimeType: "image/jpeg",
  tamanoBytes: 248_320,
  storagePath: "staging/session-abc/ine_frente.jpg",
  archivoId: "arch-uuid-001",
}

describe("useUploadArchivo — inicialización de entradas", () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      archivosSubidos: [],
      sessionUuid: "session-abc-123",
    })
    vi.restoreAllMocks()
  })

  it("arranca con entradas vacías aunque el store ya tenga archivos al montar", () => {
    // Precondición: store tiene un archivo antes del montaje del hook
    useSolicitudStore.setState({ archivosSubidos: [ARCHIVO_INE_SUBIDO] })

    const { result } = renderHook(() => useUploadArchivo())

    // El mapa debe arrancar vacío — hidratarEntradas es el mecanismo
    // correcto para poblarlo después de la hidratación del store
    expect(result.current.entradas).toHaveLength(0)
  })

  it("hidratarEntradas puebla el mapa correctamente después del montaje", () => {
    const { result } = renderHook(() => useUploadArchivo())

    act(() => {
      result.current.hidratarEntradas([ARCHIVO_INE_SUBIDO])
    })

    expect(result.current.entradas).toHaveLength(1)
    expect(result.current.entradas[0].clienteId).toBe(ARCHIVO_INE_SUBIDO.clienteId)
    expect(result.current.entradas[0].estado).toBe("uploaded")
    expect(result.current.entradas[0].tipoArchivo).toBe("ine_frente")
  })

  it("hidratarEntradas no duplica archivos si se llama dos veces con el mismo clienteId", () => {
    const { result } = renderHook(() => useUploadArchivo())

    act(() => {
      result.current.hidratarEntradas([ARCHIVO_INE_SUBIDO])
      result.current.hidratarEntradas([ARCHIVO_INE_SUBIDO])
    })

    expect(result.current.entradas).toHaveLength(1)
  })
})
