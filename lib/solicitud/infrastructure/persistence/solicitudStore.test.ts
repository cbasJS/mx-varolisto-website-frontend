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

describe('solicitudStore — resetForm tras conflicto de préstamo activo', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('resetForm no degrada _hasHydrated: la UI debe seguir hidratada para no caer al FormSkeleton', async () => {
    // Simulamos el estado real tras una solicitud completa al llegar al Paso 7:
    // store hidratado, sessionUuid presente, datos cargados y archivos subidos.
    sembrarPersistido(Date.now())
    await useSolicitudStore.persist.rehydrate()
    expect(useSolicitudStore.getState()._hasHydrated).toBe(true)

    // El usuario hace submit y el backend responde 409 → el modal de
    // conflicto llama handleConflictoConfirmado, que ejecuta resetForm.
    useSolicitudStore.getState().resetForm()

    // FormularioSolicitudInner usa _hasHydrated para decidir si pinta el form
    // o el FormSkeleton: si queda en false, el usuario ve un skeleton infinito
    // porque inicializarSession solo corre al montar y nadie revierte el flag.
    expect(useSolicitudStore.getState()._hasHydrated).toBe(true)
    expect(useSolicitudStore.getState().pasoActual).toBe(1)
    expect(useSolicitudStore.getState().datos).toEqual({})
  })

  it('resetForm regenera sessionUuid para que el siguiente intento de envío no se aborte', async () => {
    sembrarPersistido(Date.now())
    await useSolicitudStore.persist.rehydrate()
    const sessionUuidPrevio = useSolicitudStore.getState().sessionUuid
    expect(sessionUuidPrevio).toBeTruthy()

    useSolicitudStore.getState().resetForm()

    // handleSubmit en useSolicitudNavigation aborta con `if (!sessionUuid) return`
    // y el inicializador solo corre al montar el orquestador, así que tras un
    // resetForm en caliente el sessionUuid debe quedar listo para el próximo envío.
    const sessionUuidNuevo = useSolicitudStore.getState().sessionUuid
    expect(sessionUuidNuevo).toBeTruthy()
    expect(sessionUuidNuevo).not.toBe(sessionUuidPrevio)
  })
})
