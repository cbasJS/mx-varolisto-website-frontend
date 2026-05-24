import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitSolicitud, type SubmitSolicitudInput } from './submitSolicitud'
import type { TelemetriaSolicitud } from '@varolisto/shared-schemas/form'

// Datos completos representativos de una solicitud real — empleado formal,
// $5,000 a 4 meses, CDMX, con 2 referencias en el array nuevo.
const inputBase: SubmitSolicitudInput = {
  paso7Data: { aceptaPrivacidad: true, aceptaTerminos: true },
  datos: {
    nombre: 'Juan',
    apellidoPaterno: 'García',
    apellidoMaterno: 'López',
    sexo: 'M',
    fechaNacimiento: '1995-06-15',
    curp: 'GALJ950615HDFRCN01',
    email: 'juan.garcia@example.com',
    telefono: '5512345678',
    codigoPostal: '06600',
    colonia: 'Juárez',
    municipio: 'Cuauhtémoc',
    estado: 'Ciudad de México',
    calle: 'Av. Insurgentes Norte',
    numeroExterior: '123',
    aniosViviendo: 'entre_1_y_2',
    tipoVivienda: 'rentada',
    montoSolicitado: 5000,
    plazoMeses: '4',
    destinoPrestamo: 'gasto_medico',
    tipoActividad: 'empleado_formal',
    nombreEmpleadorNegocio: 'ACME Corp SA de CV',
    antiguedad: 'mas_2',
    estadoCivil: 'soltero',
    dependientesEconomicos: 'ninguno',
    ingresoMensual: 15000,
    gastoMensual: 5000,
    tieneDeudas: 'no',
    referencias: [
      { nombre: 'María Pérez', telefono: '5598765432', relacion: 'familiar' },
      { nombre: 'Carlos Ruiz', telefono: '5511112222', relacion: 'amigo' },
    ],
  },
}

const telemetria: TelemetriaSolicitud = {
  iniciadoEn: '2026-05-12T10:00:00.000Z',
  enviadoEn: '2026-05-12T10:04:30.000Z',
  duracionTotalMs: 270_000,
  tiemposPaso: {
    paso1Ms: 12_000,
    paso2Ms: 45_000,
    paso3Ms: 60_000,
    paso4Ms: 30_000,
    paso5Ms: 25_000,
    paso6Ms: 50_000,
    paso7Ms: null, // legacy del flujo previo
  },
  tiempoCapturaFormularioMs: 210_000,
  edicionesPorCampo: { nombre: 1, curp: 2 },
  dispositivo: {
    userAgent: 'Mozilla/5.0 happy-dom',
    viewport: { width: 390, height: 844 },
    idioma: 'es-MX',
    zonaHoraria: 'America/Mexico_City',
  },
}

describe('submitSolicitud — integración con telemetría (Bloque 1.B)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('cuando se pasa telemetria, el POST la incluye en el body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers(),
      json: async () => ({
        folio: 'VL-260501-0001',
        estado: 'recibida',
        fechaCreacion: '2026-05-12T10:04:30.000Z',
        tiempoEsperadoRespuesta: '24h',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await submitSolicitud({ ...inputBase, telemetria })

    expect(fetchMock).toHaveBeenCalled()
    const call = fetchMock.mock.calls[0]
    const init = call[1] as RequestInit | undefined
    expect(init?.body).toBeDefined()
    const body = JSON.parse(init!.body as string) as Record<string, unknown>
    expect(body.telemetria).toBeDefined()
    const tel = body.telemetria as Record<string, unknown>
    expect(tel.iniciadoEn).toBe('2026-05-12T10:00:00.000Z')
    expect(tel.tiempoCapturaFormularioMs).toBe(210_000)
    expect((tel.dispositivo as Record<string, unknown>).zonaHoraria).toBe('America/Mexico_City')
  })

  it('cuando NO se pasa telemetria, el body sale sin el bloque (campo opcional)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers(),
      json: async () => ({
        folio: 'VL-260501-0002',
        estado: 'recibida',
        fechaCreacion: '2026-05-12T10:04:30.000Z',
        tiempoEsperadoRespuesta: '24h',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await submitSolicitud(inputBase)

    const call = fetchMock.mock.calls[0]
    const init = call[1] as RequestInit | undefined
    const body = JSON.parse(init!.body as string) as Record<string, unknown>
    expect(body.telemetria).toBeUndefined()
  })

  it('preserva todo el resto del payload (regresión: telemetría no debe sustituir otros campos)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers(),
      json: async () => ({
        folio: 'VL-260501-0003',
        estado: 'recibida',
        fechaCreacion: '2026-05-12T10:04:30.000Z',
        tiempoEsperadoRespuesta: '24h',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await submitSolicitud({ ...inputBase, telemetria })

    const call = fetchMock.mock.calls[0]
    const body = JSON.parse((call[1] as RequestInit).body as string) as Record<string, unknown>
    expect(body.nombre).toBe('Juan')
    expect(body.curp).toBe('GALJ950615HDFRCN01')
    expect(body.aceptaPrivacidad).toBe(true)
    expect(body.aceptaTerminos).toBe(true)
    // Referencias viajan como array — sin sessionUuid/tipoIdentificacion/
    // archivosDeclarados (removidos del contrato en shared-schemas 0.15.0).
    expect(body.referencias).toEqual([
      { nombre: 'María Pérez', telefono: '5598765432', relacion: 'familiar' },
      { nombre: 'Carlos Ruiz', telefono: '5511112222', relacion: 'amigo' },
    ])
    expect(body.sessionUuid).toBeUndefined()
    expect(body.tipoIdentificacion).toBeUndefined()
    expect(body.archivosDeclarados).toBeUndefined()
  })
})
