import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SolicitudCompleta } from "./schemas/index"
import type { CopomexResponse } from "./types"
import type { TipoArchivo, TipoIdentificacion } from "@varolisto/shared-schemas/enums"

export interface ArchivoSubido {
  clienteId: string
  tipoArchivo: TipoArchivo
  nombreOriginal: string
  mimeType: string
  tamanoBytes: number
  storagePath: string
  archivoId: string
}

export interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  coloniasCache: Record<string, CopomexResponse[]>
  sessionUuid: string | null
  archivosSubidos: ArchivoSubido[]
  tipoIdentificacion: TipoIdentificacion | null
  // comprobantes no persiste (File no es serializable)
  comprobantes: File[]
  _hasHydrated: boolean
}

export interface SolicitudActions {
  setPaso: (paso: number) => void
  guardarPaso: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setComprobantes: (archivos: File[]) => void
  setColoniasCache: (cp: string, data: CopomexResponse[]) => void
  inicializarSession: () => void
  agregarArchivoSubido: (archivo: ArchivoSubido) => void
  removerArchivoSubido: (clienteId: string) => void
  setTipoIdentificacion: (tipo: TipoIdentificacion) => void
  resetForm: () => void
  setHasHydrated: (value: boolean) => void
}

const estadoInicial: SolicitudState = {
  pasoActual: 1,
  datos: {},
  timestampInicio: Date.now(),
  coloniasCache: {},
  sessionUuid: null,
  archivosSubidos: [],
  tipoIdentificacion: null,
  comprobantes: [],
  _hasHydrated: false,
}

export const useSolicitudStore = create<SolicitudState & SolicitudActions>()(
  persist(
    (set, get) => ({
      ...estadoInicial,
      setPaso: (paso) => set({ pasoActual: paso }),
      guardarPaso: (_, nuevos) =>
        set((state) => ({ datos: { ...state.datos, ...nuevos } })),
      setComprobantes: (archivos) => set({ comprobantes: archivos }),
      setColoniasCache: (cp, data) =>
        set((s) => ({ coloniasCache: { ...s.coloniasCache, [cp]: data } })),
      inicializarSession: () => {
        if (!get().sessionUuid) {
          set({ sessionUuid: crypto.randomUUID() })
        }
      },
      agregarArchivoSubido: (archivo) =>
        set((s) => {
          if (s.archivosSubidos.some((a) => a.clienteId === archivo.clienteId)) {
            return s
          }
          return { archivosSubidos: [...s.archivosSubidos, archivo] }
        }),
      removerArchivoSubido: (clienteId) =>
        set((s) => ({
          archivosSubidos: s.archivosSubidos.filter((a) => a.clienteId !== clienteId),
        })),
      setTipoIdentificacion: (tipo) => set({ tipoIdentificacion: tipo }),
      resetForm: () =>
        set({ ...estadoInicial, timestampInicio: Date.now(), comprobantes: [] }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "vl-solicitud",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(name, JSON.stringify(value))
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(name)
          }
        },
      },
      partialize: (state) =>
        ({
          pasoActual: state.pasoActual,
          datos: state.datos,
          timestampInicio: state.timestampInicio,
          coloniasCache: state.coloniasCache,
          sessionUuid: state.sessionUuid,
          tipoIdentificacion: state.tipoIdentificacion,
        }) as unknown as SolicitudState & SolicitudActions,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
