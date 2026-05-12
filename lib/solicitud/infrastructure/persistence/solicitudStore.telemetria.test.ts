// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { useSolicitudStore } from './solicitudStore'

const estadoInicial = () => ({
  pasoActual: 1,
  datos: {},
  timestampInicio: Date.now(),
  iniciadoEn: null,
  sessionUuid: null,
  archivosSubidos: [],
  tipoIdentificacion: null,
  comprobantes: [],
  tiemposPaso: {
    paso1Ms: null,
    paso2Ms: null,
    paso3Ms: null,
    paso4Ms: null,
    paso5Ms: null,
    paso6Ms: null,
    paso7Ms: null,
  },
  pasoActualEntrada: null,
  edicionesPorCampo: {},
  _hasHydrated: false,
})

// La telemetría no se persiste en sessionStorage — vive sólo en memoria y se
// envía dentro del payload del POST de envío. Por eso los tests trabajan
// directamente sobre setState/getState sin tocar sessionStorage.
describe('solicitudStore — telemetría pasiva (Bloque 1.B)', () => {
  beforeEach(() => {
    sessionStorage.clear()
    useSolicitudStore.setState(estadoInicial() as never)
  })

  describe('inicializarSession() — iniciadoEn', () => {
    it('setea iniciadoEn a un ISO timestamp si no existe', () => {
      useSolicitudStore.getState().inicializarSession()
      const iniciadoEn = useSolicitudStore.getState().iniciadoEn
      expect(iniciadoEn).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      // Date.parse del ISO debe ser cercano a Date.now()
      expect(Date.parse(iniciadoEn!)).toBeGreaterThan(Date.now() - 5_000)
    })

    it('no sobreescribe iniciadoEn si ya estaba seteado (idempotente)', () => {
      useSolicitudStore.setState({ iniciadoEn: '2026-05-12T10:00:00.000Z' } as never)
      useSolicitudStore.getState().inicializarSession()
      expect(useSolicitudStore.getState().iniciadoEn).toBe('2026-05-12T10:00:00.000Z')
    })
  })

  describe('marcarEntradaPaso(paso)', () => {
    it('setea pasoActualEntrada al timestamp actual cuando no hay paso previo abierto', () => {
      const antes = Date.now()
      useSolicitudStore.getState().marcarEntradaPaso(2)
      const entrada = useSolicitudStore.getState().pasoActualEntrada
      expect(entrada).not.toBeNull()
      expect(entrada!).toBeGreaterThanOrEqual(antes)
      expect(entrada!).toBeLessThanOrEqual(Date.now() + 10)
    })

    it('al cambiar de paso, acumula los ms del paso previo en tiemposPaso[paso{N}Ms]', async () => {
      const T0 = Date.now()
      useSolicitudStore.setState({ pasoActualEntrada: T0, pasoActual: 2 } as never)

      // Esperamos ~30ms para que la diferencia sea medible.
      await new Promise((r) => setTimeout(r, 30))
      useSolicitudStore.getState().marcarEntradaPaso(3)

      const tiempos = useSolicitudStore.getState().tiemposPaso
      expect(tiempos.paso2Ms).not.toBeNull()
      expect(tiempos.paso2Ms!).toBeGreaterThanOrEqual(20)
      // La entrada al nuevo paso queda registrada.
      expect(useSolicitudStore.getState().pasoActualEntrada).not.toBeNull()
    })

    it('soporta re-entradas: si el usuario vuelve a un paso, los ms se suman al acumulado existente', async () => {
      useSolicitudStore.setState({
        tiemposPaso: {
          paso1Ms: null,
          paso2Ms: 5000, // ya estuvimos 5s antes en paso2
          paso3Ms: null,
          paso4Ms: null,
          paso5Ms: null,
          paso6Ms: null,
          paso7Ms: null,
        },
        pasoActualEntrada: Date.now() - 200,
        pasoActual: 2,
      } as never)

      useSolicitudStore.getState().marcarEntradaPaso(3)

      const acumulado = useSolicitudStore.getState().tiemposPaso.paso2Ms
      // El acumulado previo (5000) + ~200ms de esta visita.
      expect(acumulado!).toBeGreaterThanOrEqual(5100)
      expect(acumulado!).toBeLessThan(5500)
    })

    it('clampa el número de paso al rango 1..7 — pasos fuera de rango no actualizan tiemposPaso', () => {
      const tiemposAntes = useSolicitudStore.getState().tiemposPaso
      // 0 y 8 no son pasos válidos del wizard
      useSolicitudStore.getState().marcarEntradaPaso(0 as 1)
      useSolicitudStore.getState().marcarEntradaPaso(8 as 1)
      expect(useSolicitudStore.getState().tiemposPaso).toEqual(tiemposAntes)
    })
  })

  describe('incrementarEdicion(nombreCampo)', () => {
    it('crea la key con valor 1 si no existía', () => {
      useSolicitudStore.getState().incrementarEdicion('nombre')
      expect(useSolicitudStore.getState().edicionesPorCampo).toEqual({ nombre: 1 })
    })

    it('incrementa el contador en visitas sucesivas', () => {
      useSolicitudStore.getState().incrementarEdicion('curp')
      useSolicitudStore.getState().incrementarEdicion('curp')
      useSolicitudStore.getState().incrementarEdicion('curp')
      expect(useSolicitudStore.getState().edicionesPorCampo.curp).toBe(3)
    })

    it('clampa el valor al máximo permitido por el schema (10_000)', () => {
      useSolicitudStore.setState({ edicionesPorCampo: { spam: 9_999 } } as never)
      useSolicitudStore.getState().incrementarEdicion('spam')
      useSolicitudStore.getState().incrementarEdicion('spam') // intento de pasar a 10_001
      expect(useSolicitudStore.getState().edicionesPorCampo.spam).toBe(10_000)
    })

    it('rechaza nombres de campo > 64 chars (max length del schema)', () => {
      const nombreLargo = 'a'.repeat(65)
      useSolicitudStore.getState().incrementarEdicion(nombreLargo)
      expect(useSolicitudStore.getState().edicionesPorCampo[nombreLargo]).toBeUndefined()
    })

    it('rechaza nombres con caracteres fuera del regex [a-zA-Z0-9._-]', () => {
      useSolicitudStore.getState().incrementarEdicion('nombre con espacios')
      useSolicitudStore.getState().incrementarEdicion('campo$malicioso')
      expect(useSolicitudStore.getState().edicionesPorCampo).toEqual({})
    })

    it('acepta nombres válidos con todos los caracteres del whitelist', () => {
      useSolicitudStore.getState().incrementarEdicion('apellidoPaterno')
      useSolicitudStore.getState().incrementarEdicion('ref1Email')
      useSolicitudStore.getState().incrementarEdicion('datos.curp')
      useSolicitudStore.getState().incrementarEdicion('campo_test-2')
      expect(Object.keys(useSolicitudStore.getState().edicionesPorCampo)).toEqual([
        'apellidoPaterno',
        'ref1Email',
        'datos.curp',
        'campo_test-2',
      ])
    })

    it('rechaza nuevas keys cuando ya hay 200 keys registradas (max del schema)', () => {
      const lleno: Record<string, number> = {}
      for (let i = 0; i < 200; i++) {
        lleno[`campo_${i}`] = 1
      }
      useSolicitudStore.setState({ edicionesPorCampo: lleno } as never)

      // Una nueva key (201) NO debe entrar.
      useSolicitudStore.getState().incrementarEdicion('campo_nuevo')
      expect(useSolicitudStore.getState().edicionesPorCampo.campo_nuevo).toBeUndefined()
      expect(Object.keys(useSolicitudStore.getState().edicionesPorCampo)).toHaveLength(200)

      // Pero incrementar una key existente sí debe funcionar.
      useSolicitudStore.getState().incrementarEdicion('campo_5')
      expect(useSolicitudStore.getState().edicionesPorCampo.campo_5).toBe(2)
    })
  })

  describe('resetForm — limpia también la telemetría', () => {
    it('resetForm borra tiemposPaso, edicionesPorCampo, iniciadoEn y pasoActualEntrada', () => {
      useSolicitudStore.setState({
        iniciadoEn: '2026-05-12T10:00:00.000Z',
        pasoActualEntrada: Date.now(),
        tiemposPaso: {
          paso1Ms: 1000,
          paso2Ms: 2000,
          paso3Ms: 3000,
          paso4Ms: null,
          paso5Ms: null,
          paso6Ms: null,
          paso7Ms: null,
        },
        edicionesPorCampo: { nombre: 3, curp: 2 },
      } as never)

      useSolicitudStore.getState().resetForm()

      const s = useSolicitudStore.getState()
      expect(s.iniciadoEn).not.toBe('2026-05-12T10:00:00.000Z')
      expect(s.pasoActualEntrada).toBeNull()
      expect(s.tiemposPaso).toEqual({
        paso1Ms: null,
        paso2Ms: null,
        paso3Ms: null,
        paso4Ms: null,
        paso5Ms: null,
        paso6Ms: null,
        paso7Ms: null,
      })
      expect(s.edicionesPorCampo).toEqual({})
    })
  })

  describe('no se persiste telemetría en sessionStorage', () => {
    it('después de mutar tiemposPaso/edicionesPorCampo, el partialize de sessionStorage no contiene esos campos', () => {
      useSolicitudStore.getState().inicializarSession()
      useSolicitudStore.setState({
        pasoActualEntrada: Date.now(),
        tiemposPaso: {
          paso1Ms: 1000,
          paso2Ms: 2000,
          paso3Ms: null,
          paso4Ms: null,
          paso5Ms: null,
          paso6Ms: null,
          paso7Ms: null,
        },
        edicionesPorCampo: { nombre: 5 },
      } as never)

      // El middleware de Zustand persiste de forma síncrona al cambiar estado.
      const raw = sessionStorage.getItem('vl-solicitud')
      expect(raw).toBeTruthy()
      const persistido = JSON.parse(raw!) as { state: Record<string, unknown> }
      expect(persistido.state.tiemposPaso).toBeUndefined()
      expect(persistido.state.edicionesPorCampo).toBeUndefined()
      expect(persistido.state.pasoActualEntrada).toBeUndefined()
      // iniciadoEn tampoco se persiste (es runtime — si la sesión muere,
      // la siguiente captura empieza de cero).
      expect(persistido.state.iniciadoEn).toBeUndefined()
    })
  })
})
