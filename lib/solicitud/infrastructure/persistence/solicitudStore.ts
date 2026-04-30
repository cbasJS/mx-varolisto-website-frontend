import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ArchivoSubido, SolicitudState, SolicitudActions } from "@/lib/solicitud/domain/solicitud/types"
import type { CopomexResponse } from "@/lib/solicitud/infrastructure/colonias/types"
import { generateUUID } from "@/lib/utils"

export type { ArchivoSubido, SolicitudState, SolicitudActions }

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
      setColoniasCache: (cp, data: CopomexResponse[]) =>
        set((s) => ({ coloniasCache: { ...s.coloniasCache, [cp]: data } })),
      inicializarSession: () => {
        if (!get().sessionUuid) {
          set({ sessionUuid: generateUUID() })
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
