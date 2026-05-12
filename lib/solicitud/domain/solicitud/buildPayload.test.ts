import { describe, it, expect } from 'vitest'
import { buildPayload, type BuildPayloadInput } from './buildPayload'

// Datos representativos de un solicitante real:
// - empleado formal, $10,000 a 6 meses para capital de trabajo
// - vive en CDMX, 18-30 años en la misma dirección
const inputBase: BuildPayloadInput = {
  sessionUuid: 'test-uuid-1234',
  tipoIdentificacion: 'ine',
  archivosSubidos: [],
  paso7Data: {
    aceptaPrivacidad: true,
    aceptaTerminos: true,
  },
  datos: {
    // identidad (schema paso1)
    nombre: 'Juan',
    apellidoPaterno: 'García',
    apellidoMaterno: 'López',
    sexo: 'M',
    fechaNacimiento: '1995-06-15',
    curp: 'GALJ950615HDFRCN01',
    email: 'juan.garcia@example.com',
    telefono: '5512345678',
    // domicilio (schema paso3) — CP real de Col. Juárez, CDMX
    codigoPostal: '06600',
    colonia: 'Juárez',
    municipio: 'Cuauhtémoc',
    estado: 'Ciudad de México',
    calle: 'Av. Insurgentes Norte',
    numeroExterior: '123',
    aniosViviendo: 'entre_1_y_2',
    tipoVivienda: 'rentada',
    // préstamo (schema paso2) — monto y plazo dentro del rango $2,000–$20,000 / 2–6 meses
    montoSolicitado: 10000,
    plazoMeses: '6',
    destinoPrestamo: 'capital_trabajo',
    // economía (schema paso4)
    tipoActividad: 'empleado_formal',
    nombreEmpleadorNegocio: 'Empresa SA de CV',
    antiguedad: 'mas_2',
    estadoCivil: 'soltero',
    dependientesEconomicos: 'ninguno',
    ingresoMensual: 15000,
    gastoMensual: 5000,
    tieneDeudas: 'no',
    // referencias (schema paso5)
    ref1Nombre: 'María Pérez',
    ref1Telefono: '5598765432',
    ref1Relacion: 'familiar',
    ref2Nombre: 'Carlos Ruiz',
    ref2Telefono: '5511112222',
    ref2Relacion: 'amigo',
  },
}

describe('buildPayload', () => {
  it('mapea los datos de identidad correctamente', () => {
    const payload = buildPayload(inputBase)
    expect(payload.nombre).toBe('Juan')
    expect(payload.apellidoPaterno).toBe('García')
    expect(payload.apellidoMaterno).toBe('López')
    expect(payload.sexo).toBe('M')
    expect(payload.fechaNacimiento).toBe('1995-06-15')
    expect(payload.curp).toBe('GALJ950615HDFRCN01')
    expect(payload.email).toBe('juan.garcia@example.com')
    expect(payload.telefono).toBe('5512345678')
  })

  it('mapea los datos del préstamo con valores dentro del rango del producto', () => {
    const payload = buildPayload(inputBase)
    expect(payload.montoSolicitado).toBe(10000) // $2,000–$20,000
    expect(payload.plazoMeses).toBe('6') // "2"|"3"|"4"|"5"|"6"
    expect(payload.destinoPrestamo).toBe('capital_trabajo')
  })

  it('mapea la situación económica con enums reales', () => {
    const payload = buildPayload(inputBase)
    expect(payload.tipoActividad).toBe('empleado_formal')
    expect(payload.antiguedad).toBe('mas_2')
    expect(payload.estadoCivil).toBe('soltero')
    expect(payload.dependientesEconomicos).toBe('ninguno')
    expect(payload.ingresoMensual).toBe(15000) // mínimo $1,000 según schema
    expect(payload.gastoMensual).toBe(5000) // Bloque 1.A: insumo para capacidad disponible v7
  })

  it('hardcodea tieneDeudas=no y cantidadDeudas=sin_deudas como dummies de transición (Bloque 1.A)', () => {
    // El backend sigue esperando el contrato viejo hasta el Bloque 2. La UI ya
    // no captura "tienes deudas", así que el payload envía 'no' / 'sin_deudas'
    // sin importar lo que esté en el store. Defense in depth: incluso si una
    // sesión stale tiene tieneDeudas='si', el payload sale como 'no'.
    const inputConStale: BuildPayloadInput = {
      ...inputBase,
      datos: {
        ...inputBase.datos,
        tieneDeudas: 'si',
        cantidadDeudas: 'una_deuda',
        montoTotalDeudas: '5k_15k',
        pagoMensualDeudas: 1500,
      },
    }
    const payload = buildPayload(inputConStale)
    expect(payload.tieneDeudas).toBe('no')
    expect(payload.cantidadDeudas).toBe('sin_deudas')
    expect(payload.montoTotalDeudas).toBeUndefined()
    expect(payload.pagoMensualDeudas).toBeUndefined()
  })

  it('mapea las referencias con relaciones válidas', () => {
    const payload = buildPayload(inputBase)
    expect(payload.ref1Relacion).toBe('familiar') // "familiar"|"trabajo"|"amigo"|"otro"
    expect(payload.ref2Relacion).toBe('amigo')
  })

  it('incluye sessionUuid y tipoIdentificacion', () => {
    const payload = buildPayload(inputBase)
    expect(payload.sessionUuid).toBe('test-uuid-1234')
    expect(payload.tipoIdentificacion).toBe('ine') // "ine"|"pasaporte"
  })

  it('incluye los consentimientos del paso 7', () => {
    const payload = buildPayload(inputBase)
    expect(payload.aceptaPrivacidad).toBe(true)
    expect(payload.aceptaTerminos).toBe(true)
  })

  it('mapea archivosSubidos a archivosDeclarados con tipos de archivo reales', () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      archivosSubidos: [
        {
          clienteId: 'cliente-1',
          tipoArchivo: 'ine_frente', // tipo real del enum TIPO_ARCHIVO
          nombreOriginal: 'ine_frente.jpg',
          mimeType: 'image/jpeg',
          tamanoBytes: 204800, // 200 KB
          storagePath: 'staging/test-uuid/ine_frente.jpg',
          archivoId: 'archivo-1',
        },
        {
          clienteId: 'cliente-2',
          tipoArchivo: 'comprobante_domicilio',
          nombreOriginal: 'recibo_luz.pdf',
          mimeType: 'application/pdf',
          tamanoBytes: 512000, // 500 KB
          storagePath: 'staging/test-uuid/recibo_luz.pdf',
          archivoId: 'archivo-2',
        },
      ],
    }
    const payload = buildPayload(input)
    expect(payload.archivosDeclarados).toHaveLength(2)
    expect(payload.archivosDeclarados[0]).toEqual({
      tipoArchivo: 'ine_frente',
      nombreOriginal: 'ine_frente.jpg',
      mimeType: 'image/jpeg',
      tamanoBytes: 204800,
    })
    expect(payload.archivosDeclarados[1].tipoArchivo).toBe('comprobante_domicilio')
  })

  it('archivosDeclarados no expone clienteId, storagePath ni archivoId al backend', () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      archivosSubidos: [
        {
          clienteId: 'cliente-1',
          tipoArchivo: 'ine_reverso',
          nombreOriginal: 'ine_reverso.jpg',
          mimeType: 'image/jpeg',
          tamanoBytes: 180000,
          storagePath: 'staging/test-uuid/ine_reverso.jpg',
          archivoId: 'archivo-1',
        },
      ],
    }
    const payload = buildPayload(input)
    const archivo = payload.archivosDeclarados[0] as Record<string, unknown>
    expect(archivo['clienteId']).toBeUndefined()
    expect(archivo['storagePath']).toBeUndefined()
    expect(archivo['archivoId']).toBeUndefined()
  })

  it('devuelve array vacío de archivosDeclarados cuando no hay archivos subidos', () => {
    const payload = buildPayload(inputBase)
    expect(payload.archivosDeclarados).toEqual([])
  })

  it('usa string vacío como fallback para campos de texto requeridos ausentes', () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      datos: { ...inputBase.datos, nombre: undefined },
    }
    const payload = buildPayload(input)
    expect(payload.nombre).toBe('')
  })

  it('pasa undefined para rfc y numeroInterior cuando no se proporcionan', () => {
    const payload = buildPayload(inputBase)
    expect(payload.rfc).toBeUndefined()
    expect(payload.numeroInterior).toBeUndefined()
  })

  it('incluye pasaporte como tipoIdentificacion válido', () => {
    const input: BuildPayloadInput = {
      ...inputBase,
      tipoIdentificacion: 'pasaporte',
      archivosSubidos: [
        {
          clienteId: 'cliente-1',
          tipoArchivo: 'pasaporte_principal',
          nombreOriginal: 'pasaporte.jpg',
          mimeType: 'image/jpeg',
          tamanoBytes: 350000,
          storagePath: 'staging/test-uuid/pasaporte.jpg',
          archivoId: 'archivo-1',
        },
      ],
    }
    const payload = buildPayload(input)
    expect(payload.tipoIdentificacion).toBe('pasaporte')
    expect(payload.archivosDeclarados[0].tipoArchivo).toBe('pasaporte_principal')
  })
})

// Telemetría — Bloque 1.B del scoring v7.
// El bloque es opcional en el contrato de @varolisto/shared-schemas: si la
// captura falla por cualquier razón, la solicitud se manda igual (la
// telemetría es complementaria, no requisito).
describe('buildPayload — bloque telemetría', () => {
  // Datos representativos de una captura real: 4 minutos llenando el form,
  // pasos 2-6 medidos. Pasos 1 (landing) y 7 (revisión) capturados pero
  // fuera del cálculo anti-fraude del Bloque 2C.
  const telemetriaBase = {
    iniciadoEn: '2026-05-12T10:00:00.000Z',
    enviadoEn: '2026-05-12T10:04:30.000Z',
    duracionTotalMs: 270_000, // 4m30s wall-clock
    tiemposPaso: {
      paso1Ms: 12_000, // 12s mirando el slider de la calculadora
      paso2Ms: 45_000, // 45s identidad
      paso3Ms: 60_000, // 60s domicilio (incluye espera de colonias)
      paso4Ms: 30_000, // 30s economía
      paso5Ms: 25_000, // 25s referencias
      paso6Ms: 50_000, // 50s subir docs
      paso7Ms: 8_000, // 8s revisión rápida
    },
    // Suma de paso2..paso6 = 210_000ms (3m30s captura real de datos)
    tiempoCapturaFormularioMs: 210_000,
    edicionesPorCampo: {
      nombre: 1,
      curp: 3,
      codigoPostal: 2,
    },
    dispositivo: {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      viewport: { width: 390, height: 844 }, // iPhone 14 Pro vertical
      idioma: 'es-MX',
      zonaHoraria: 'America/Mexico_City',
      plataforma: 'MacIntel',
    },
    red: { referrer: 'https://www.google.com/' },
    fingerprint: 'abc123def456deadbeef',
  } as const

  it('incluye el bloque telemetria tal cual cuando viene completo', () => {
    const payload = buildPayload({ ...inputBase, telemetria: telemetriaBase })
    expect(payload.telemetria).toBeDefined()
    expect(payload.telemetria?.iniciadoEn).toBe('2026-05-12T10:00:00.000Z')
    expect(payload.telemetria?.enviadoEn).toBe('2026-05-12T10:04:30.000Z')
    expect(payload.telemetria?.dispositivo.zonaHoraria).toBe('America/Mexico_City')
    expect(payload.telemetria?.fingerprint).toBe('abc123def456deadbeef')
  })

  it('cuando los pasos 2-6 están todos medidos, tiempoCapturaFormularioMs es la suma exacta', () => {
    const payload = buildPayload({ ...inputBase, telemetria: telemetriaBase })
    const suma =
      telemetriaBase.tiemposPaso.paso2Ms +
      telemetriaBase.tiemposPaso.paso3Ms +
      telemetriaBase.tiemposPaso.paso4Ms +
      telemetriaBase.tiemposPaso.paso5Ms +
      telemetriaBase.tiemposPaso.paso6Ms
    // Restricción del schema (refine): equality estricta cuando los 5 están medidos.
    expect(payload.telemetria?.tiempoCapturaFormularioMs).toBe(suma)
    expect(suma).toBe(210_000)
  })

  it('cuando algún paso 2-6 es null, tiempoCapturaFormularioMs suma sólo los medidos', () => {
    const telemetriaParcial = {
      ...telemetriaBase,
      tiemposPaso: {
        ...telemetriaBase.tiemposPaso,
        paso3Ms: null, // El usuario nunca pasó por el paso 3 (impossible en flujo normal pero defensivo)
        paso5Ms: null,
      },
      tiempoCapturaFormularioMs:
        telemetriaBase.tiemposPaso.paso2Ms +
        telemetriaBase.tiemposPaso.paso4Ms +
        telemetriaBase.tiemposPaso.paso6Ms,
    }
    const payload = buildPayload({ ...inputBase, telemetria: telemetriaParcial })
    // Cuando hay nulls, el refine del schema no verifica equality — el cliente
    // decide qué mandar y el backend lo acepta. Nuestra suma debe excluir nulls.
    expect(payload.telemetria?.tiempoCapturaFormularioMs).toBe(125_000)
    expect(payload.telemetria?.tiemposPaso.paso3Ms).toBeNull()
    expect(payload.telemetria?.tiemposPaso.paso5Ms).toBeNull()
  })

  it('si no se proporciona telemetria, el payload sale sin el bloque (opcional por contrato)', () => {
    const payload = buildPayload(inputBase)
    expect(payload.telemetria).toBeUndefined()
  })

  it('preserva geolocalización cuando el feature flag la capturó', () => {
    const telemetriaConGeo = {
      ...telemetriaBase,
      geolocalizacion: {
        lat: 19.4326,
        lon: -99.1332,
        precisionMetros: 50,
        capturadaEn: '2026-05-12T10:00:05.000Z',
      },
    }
    const payload = buildPayload({ ...inputBase, telemetria: telemetriaConGeo })
    expect(payload.telemetria?.geolocalizacion?.lat).toBe(19.4326)
    expect(payload.telemetria?.geolocalizacion?.lon).toBe(-99.1332)
  })

  it('omite red y fingerprint opcionales cuando no se capturan', () => {
    const telemetriaMinima = {
      iniciadoEn: '2026-05-12T10:00:00.000Z',
      enviadoEn: '2026-05-12T10:04:30.000Z',
      duracionTotalMs: 270_000,
      tiemposPaso: telemetriaBase.tiemposPaso,
      tiempoCapturaFormularioMs: 210_000,
      edicionesPorCampo: {},
      dispositivo: telemetriaBase.dispositivo,
    }
    const payload = buildPayload({ ...inputBase, telemetria: telemetriaMinima })
    expect(payload.telemetria).toBeDefined()
    expect(payload.telemetria?.red).toBeUndefined()
    expect(payload.telemetria?.fingerprint).toBeUndefined()
    expect(payload.telemetria?.geolocalizacion).toBeUndefined()
  })
})
