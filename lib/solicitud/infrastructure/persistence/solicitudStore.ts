import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  TELEMETRIA_CAMPO_KEY_REGEX,
  TELEMETRIA_CAMPO_MAX_LENGTH,
  TELEMETRIA_EDICIONES_MAX_KEYS,
  TELEMETRIA_EDICIONES_MAX_VALUE,
} from '@varolisto/shared-schemas'
import type {
  ArchivoSubido,
  NumeroPasoTelemetria,
  SolicitudState,
  SolicitudActions,
  TiemposPaso,
} from '@/lib/solicitud/domain/solicitud/types'
import type { CopomexResponse } from '@/lib/solicitud/infrastructure/colonias/types'
import { generateUUID } from '@/lib/utils'

export type { ArchivoSubido, SolicitudState, SolicitudActions, TiemposPaso }

// PII en sessionStorage tiene un horizonte limitado: si la sesión queda
// inactiva más de 2h, descartamos los datos al rehidratar. Reduce la
// ventana en la que un eventual XSS podría exfiltrar datos personales y
// alinea la persistencia al tiempo realista de completar la solicitud.
const PII_TTL_MS = 2 * 60 * 60 * 1000

const PASO_MIN: NumeroPasoTelemetria = 1
const PASO_MAX: NumeroPasoTelemetria = 7

const tiemposPasoIniciales = (): TiemposPaso => ({
  paso1Ms: null,
  paso2Ms: null,
  paso3Ms: null,
  paso4Ms: null,
  paso5Ms: null,
  paso6Ms: null,
  paso7Ms: null,
})

const estadoInicial: SolicitudState = {
  pasoActual: 1,
  datos: {},
  timestampInicio: Date.now(),
  iniciadoEn: null,
  coloniasCache: {},
  sessionUuid: null,
  archivosSubidos: [],
  tipoIdentificacion: null,
  comprobantes: [],
  tiemposPaso: tiemposPasoIniciales(),
  pasoActualEntrada: null,
  pasoEnVuelo: null,
  edicionesPorCampo: {},
  _hasHydrated: false,
}

function esPasoValido(paso: number): paso is NumeroPasoTelemetria {
  return Number.isInteger(paso) && paso >= PASO_MIN && paso <= PASO_MAX
}

export const useSolicitudStore = create<SolicitudState & SolicitudActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...estadoInicial,
        setPaso: (paso) => set({ pasoActual: paso }, false, 'setPaso'),
        guardarPaso: (_, nuevos) =>
          set((state) => ({ datos: { ...state.datos, ...nuevos } }), false, 'guardarPaso'),
        setComprobantes: (archivos) => set({ comprobantes: archivos }, false, 'setComprobantes'),
        setColoniasCache: (cp, data: CopomexResponse[]) =>
          set(
            (s) => ({ coloniasCache: { ...s.coloniasCache, [cp]: data } }),
            false,
            'setColoniasCache',
          ),
        inicializarSession: () => {
          const s = get()
          const patch: Partial<SolicitudState> = {}
          if (!s.sessionUuid) patch.sessionUuid = generateUUID()
          if (!s.iniciadoEn) patch.iniciadoEn = new Date().toISOString()
          if (Object.keys(patch).length > 0) set(patch, false, 'inicializarSession')
        },
        agregarArchivoSubido: (archivo) =>
          set(
            (s) => {
              if (s.archivosSubidos.some((a) => a.clienteId === archivo.clienteId)) {
                return s
              }
              return { archivosSubidos: [...s.archivosSubidos, archivo] }
            },
            false,
            'agregarArchivoSubido',
          ),
        removerArchivoSubido: (clienteId) =>
          set(
            (s) => ({
              archivosSubidos: s.archivosSubidos.filter((a) => a.clienteId !== clienteId),
            }),
            false,
            'removerArchivoSubido',
          ),
        setTipoIdentificacion: (tipo) =>
          set({ tipoIdentificacion: tipo }, false, 'setTipoIdentificacion'),
        resetForm: () =>
          set(
            {
              ...estadoInicial,
              timestampInicio: Date.now(),
              comprobantes: [],
              // El store ya está hidratado en memoria; si dejáramos _hasHydrated en
              // false, FormularioSolicitudInner caería al FormSkeleton porque
              // inicializarSession solo corre al montar y no hay quien revierta el
              // flag. Y un sessionUuid fresco es necesario para que el siguiente
              // intento de envío no se aborte por `if (!sessionUuid) return`.
              _hasHydrated: true,
              sessionUuid: generateUUID(),
              // Telemetría — la reseteamos a estado inicial: la solicitud anterior
              // ya viajó con su captura propia; la siguiente empieza con la cuenta
              // en cero. iniciadoEn vuelve a null para que el próximo mount lo
              // setee fresco.
              iniciadoEn: null,
              tiemposPaso: tiemposPasoIniciales(),
              pasoActualEntrada: null,
              pasoEnVuelo: null,
              edicionesPorCampo: {},
            },
            false,
            'resetForm',
          ),
        setHasHydrated: (value) => set({ _hasHydrated: value }, false, 'setHasHydrated'),
        marcarEntradaPaso: (paso) => {
          if (!esPasoValido(paso)) return
          const s = get()
          const ahora = Date.now()
          const patch: Partial<SolicitudState> = {
            pasoActualEntrada: ahora,
            pasoEnVuelo: paso,
          }

          // Si había un paso abierto, acumulamos su tiempo en tiemposPaso[paso{N}Ms].
          // Usamos `pasoEnVuelo` (no `pasoActual`) porque `setPaso(N)` corre antes
          // que este effect: si nos guiáramos por `pasoActual`, el delta caería
          // siempre sobre el paso al que estamos entrando y `paso1Ms` quedaría
          // en null para siempre.
          if (s.pasoActualEntrada !== null && s.pasoEnVuelo !== null) {
            const delta = Math.max(0, ahora - s.pasoActualEntrada)
            const key = `paso${s.pasoEnVuelo}Ms` as keyof TiemposPaso
            const acumulado = s.tiemposPaso[key] ?? 0
            patch.tiemposPaso = { ...s.tiemposPaso, [key]: acumulado + delta }
          }

          set(patch, false, `marcarEntradaPaso/${paso}`)
        },
        incrementarEdicion: (nombreCampo) => {
          if (typeof nombreCampo !== 'string') return
          if (nombreCampo.length === 0 || nombreCampo.length > TELEMETRIA_CAMPO_MAX_LENGTH) return
          if (!TELEMETRIA_CAMPO_KEY_REGEX.test(nombreCampo)) return

          const ediciones = get().edicionesPorCampo
          const yaExiste = Object.prototype.hasOwnProperty.call(ediciones, nombreCampo)

          // Si la key no existe y ya estamos en el máximo de keys, no agregamos
          // una nueva — el schema rechazaría el payload completo en el backend.
          if (!yaExiste && Object.keys(ediciones).length >= TELEMETRIA_EDICIONES_MAX_KEYS) {
            return
          }

          const actual = ediciones[nombreCampo] ?? 0
          // Clamp al máximo para no exceder el schema.
          const siguiente = Math.min(actual + 1, TELEMETRIA_EDICIONES_MAX_VALUE)
          set(
            { edicionesPorCampo: { ...ediciones, [nombreCampo]: siguiente } },
            false,
            `incrementarEdicion/${nombreCampo}`,
          )
        },
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
        //
        // Tampoco se persiste el bloque de telemetría (`iniciadoEn`,
        // `tiemposPaso`, `pasoActualEntrada`, `edicionesPorCampo`): vive sólo
        // en memoria y viaja en el payload del POST. Si la pestaña muere antes
        // del submit, la captura se pierde — la telemetría es opcional por
        // contrato, no bloquea el envío.
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
          // TTL: si la sesión hidratada tiene PII de hace >2h, la descartamos.
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
    // devtools: habilitado sólo fuera de producción. Conecta con la extensión
    // Redux DevTools (Zustand la soporta nativamente). Permite time-travel,
    // diff de acciones y inspección del state desde el panel del navegador.
    {
      name: 'solicitud-store',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
)
