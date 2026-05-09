// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { useSolicitudStore } from './solicitudStore'

const STORE_KEY = 'vl-solicitud'

const HORA_MS = 60 * 60 * 1000

function sembrarPersistido(timestampInicio: number) {
  sessionStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      state: {
        pasoActual: 3,
        datos: {
          montoSolicitado: 5000,
          plazoMeses: '4',
          destinoPrestamo: 'liquidar_deuda',
        },
        timestampInicio,
        sessionUuid: '00000000-0000-4000-a000-000000000001',
        tipoIdentificacion: null,
      },
      version: 0,
    }),
  )
}

describe('solicitudStore — TTL de PII en sessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    useSolicitudStore.setState({
      pasoActual: 1,
      datos: {},
      timestampInicio: Date.now(),
      sessionUuid: null,
      archivosSubidos: [],
      tipoIdentificacion: null,
      comprobantes: [],
      _hasHydrated: false,
    })
  })

  it('descarta los datos cuando timestampInicio tiene 3h (>2h TTL)', async () => {
    sembrarPersistido(Date.now() - 3 * HORA_MS)
    await useSolicitudStore.persist.rehydrate()
    expect(useSolicitudStore.getState().datos).toEqual({})
    expect(useSolicitudStore.getState().pasoActual).toBe(1)
  })

  it('mantiene los datos cuando timestampInicio tiene 1h (<2h TTL)', async () => {
    sembrarPersistido(Date.now() - 1 * HORA_MS)
    await useSolicitudStore.persist.rehydrate()
    expect(useSolicitudStore.getState().datos.montoSolicitado).toBe(5000)
    expect(useSolicitudStore.getState().pasoActual).toBe(3)
  })
})
