import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ArchivoSubido,
  SolicitudState,
  SolicitudActions,
} from '@/lib/solicitud/domain/solicitud/types'
import type { CopomexResponse } from '@/lib/solicitud/infrastructure/colonias/types'
import { generateUUID } from '@/lib/utils'

export type { ArchivoSubido, SolicitudState, SolicitudActions }

// PII en sessionStorage tiene un horizonte limitado: si la sesión queda
// inactiva más de 24h, descartamos los datos al rehidratar. Reduce la
// ventana en la que un eventual XSS podría exfiltrar datos personales.
const PII_TTL_MS = 24 * 60 * 60 * 1000

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
      guardarPaso: (_, nuevos) => set((state) => ({ datos: { ...state.datos, ...nuevos } })),
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
      resetForm: () => set({ ...estadoInicial, timestampInicio: Date.now(), comprobantes: [] }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'vl-solicitud',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value))
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name)
          }
        },
      },
      // coloniasCache NO se persiste: es un caché de optimización que se
      // rehidrata barato desde /api/colonias (con revalidate 24h del lado del
      // server). Persistirlo aumenta la superficie de PII en sessionStorage
      // sin beneficio claro de UX.
      partialize: (state) =>
        ({
          pasoActual: state.pasoActual,
          datos: state.datos,
          timestampInicio: state.timestampInicio,
          sessionUuid: state.sessionUuid,
          tipoIdentificacion: state.tipoIdentificacion,
        }) as unknown as SolicitudState & SolicitudActions,
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // TTL: si la sesión hidratada tiene PII de hace >24h, la descartamos.
        // Evita que datos personales queden indefinidamente en sessionStorage
        // si el usuario nunca cierra la pestaña o usa "Continue where you left off".
        const edadMs = Date.now() - (state.timestampInicio ?? 0)
        if (edadMs > PII_TTL_MS) {
          state.resetForm()
        }
        state.setHasHydrated(true)
      },
    },
  ),
)
