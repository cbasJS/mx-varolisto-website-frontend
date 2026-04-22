import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SolicitudCompleta } from "./schemas/index"
import type { CopomexResponse } from "./types"

export interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  coloniasCache: Record<string, CopomexResponse[]>
  // comprobantes no persiste (File no es serializable)
  comprobantes: File[]
  _hasHydrated: boolean
}

export interface SolicitudActions {
  setPaso: (paso: number) => void
  guardarPaso: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setComprobantes: (archivos: File[]) => void
  setColoniasCache: (cp: string, data: CopomexResponse[]) => void
  resetForm: () => void
  setHasHydrated: (value: boolean) => void
}

const estadoInicial: SolicitudState = {
  pasoActual: 1,
  datos: {},
  timestampInicio: Date.now(),
  coloniasCache: {},
  comprobantes: [],
  _hasHydrated: false,
}

export const useSolicitudStore = create<SolicitudState & SolicitudActions>()(
  persist(
    (set) => ({
      ...estadoInicial,
      setPaso: (paso) => set({ pasoActual: paso }),
      guardarPaso: (_, nuevos) =>
        set((state) => ({ datos: { ...state.datos, ...nuevos } })),
      setComprobantes: (archivos) => set({ comprobantes: archivos }),
      setColoniasCache: (cp, data) =>
        set((s) => ({ coloniasCache: { ...s.coloniasCache, [cp]: data } })),
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
      // Excluir comprobantes de la persistencia
      partialize: (state) =>
        ({
          pasoActual: state.pasoActual,
          datos: state.datos,
          timestampInicio: state.timestampInicio,
          coloniasCache: state.coloniasCache,
        }) as unknown as SolicitudState & SolicitudActions,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
