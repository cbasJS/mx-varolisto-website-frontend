import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SolicitudCompleta } from "./solicitud-schema"

interface SolicitudState {
  pasoActual: number
  datos: Partial<SolicitudCompleta>
  timestampInicio: number
  // comprobantes no persiste (File no es serializable)
  comprobantes: File[]
  _hasHydrated: boolean
}

interface SolicitudActions {
  setPaso: (paso: number) => void
  guardarPaso: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setComprobantes: (archivos: File[]) => void
  resetForm: () => void
  setHasHydrated: (value: boolean) => void
}

const estadoInicial: SolicitudState = {
  pasoActual: 1,
  datos: {},
  timestampInicio: Date.now(),
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
        }) as unknown as SolicitudState & SolicitudActions,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
