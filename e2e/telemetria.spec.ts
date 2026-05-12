import { test, expect } from '@playwright/test'

// Verifica que el bloque opcional `telemetria` se envíe en el POST
// /api/solicitudes (Bloque 1.B del scoring v7). No se valida el contenido
// fino — eso lo cubre el unit test de buildPayload — sino la shape mínima
// del payload tal como llega al backend en sandbox.

const FOLIO_MOCK = 'VL-260501-0042'
const SESSION_UUID = '00000000-0000-4000-a000-000000000099'

const DATOS_COMPLETOS = {
  nombre: 'María',
  apellidoPaterno: 'García',
  apellidoMaterno: 'López',
  sexo: 'F' as const,
  fechaNacimiento: '1990-05-15',
  curp: 'GALM900515MDFXXX01',
  email: 'maria.garcia@example.com',
  telefono: '5512345678',
  codigoPostal: '06600',
  colonia: 'Juárez',
  municipio: 'Cuauhtémoc',
  estado: 'Ciudad de México',
  ciudad: 'Ciudad de México',
  calle: 'Insurgentes Sur',
  numeroExterior: '123',
  aniosViviendo: 'entre_1_y_2' as const,
  tipoVivienda: 'rentada' as const,
  montoSolicitado: 5000,
  plazoMeses: '4' as const,
  destinoPrestamo: 'gasto_medico' as const,
  tipoActividad: 'empleado_formal' as const,
  nombreEmpleadorNegocio: 'ACME Corp SA de CV',
  antiguedad: 'uno_a_dos' as const,
  estadoCivil: 'soltero' as const,
  dependientesEconomicos: 'ninguno' as const,
  ingresoMensual: 8500,
  gastoMensual: 4500,
  tieneDeudas: 'no' as const,
  ref1Nombre: 'Juan Pérez',
  ref1Telefono: '5598765432',
  ref1Relacion: 'familiar' as const,
  ref2Nombre: 'Ana Torres',
  ref2Telefono: '5511112222',
  ref2Relacion: 'amigo' as const,
}

const ARCHIVOS_COMPLETOS = [
  {
    clienteId: 'cliente-ine-frente',
    tipoArchivo: 'ine_frente',
    nombreOriginal: 'ine_frente.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 204800,
    storagePath: `staging/${SESSION_UUID}/ine_frente.jpg`,
    archivoId: 'arch-0001',
  },
  {
    clienteId: 'cliente-ine-reverso',
    tipoArchivo: 'ine_reverso',
    nombreOriginal: 'ine_reverso.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 198000,
    storagePath: `staging/${SESSION_UUID}/ine_reverso.jpg`,
    archivoId: 'arch-0002',
  },
  {
    clienteId: 'cliente-comprobante',
    tipoArchivo: 'comprobante_ingreso',
    nombreOriginal: 'nomina_abril.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 312000,
    storagePath: `staging/${SESSION_UUID}/nomina_abril.jpg`,
    archivoId: 'arch-0003',
  },
  {
    clienteId: 'cliente-domicilio',
    tipoArchivo: 'comprobante_domicilio',
    nombreOriginal: 'recibo_luz.pdf',
    mimeType: 'application/pdf',
    tamanoBytes: 98000,
    storagePath: `staging/${SESSION_UUID}/recibo_luz.pdf`,
    archivoId: 'arch-0004',
  },
]

async function inyectarStore(page: import('@playwright/test').Page) {
  await page.goto('/solicitar')
  await page.evaluate(
    ({ datos, archivos, sessionUuid }) => {
      const store = {
        state: {
          pasoActual: 7,
          datos,
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid,
          archivosSubidos: archivos,
          tipoIdentificacion: 'ine',
        },
        version: 0,
      }
      sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
    },
    { datos: DATOS_COMPLETOS, archivos: ARCHIVOS_COMPLETOS, sessionUuid: SESSION_UUID },
  )
  await page.reload()
}

test.describe('Telemetría (Bloque 1.B) — payload del POST /api/solicitudes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solicitar')
    await page.evaluate(() => sessionStorage.clear())
    await page.route('**/api/archivos/staging/**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ archivos: [] }),
        })
      } else {
        route.continue()
      }
    })
  })

  test('el POST de envío incluye el bloque telemetria con las señales mínimas', async ({
    page,
  }) => {
    let capturedBody: unknown = null

    await page.route('**/api/solicitudes', async (route) => {
      capturedBody = route.request().postDataJSON()
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ folio: FOLIO_MOCK }),
      })
    })

    await inyectarStore(page)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText(FOLIO_MOCK)).toBeVisible({ timeout: 10_000 })

    // Bloque telemetria presente y con shape mínima.
    expect(capturedBody).toBeTruthy()
    const body = capturedBody as Record<string, unknown>
    expect(body.telemetria).toBeDefined()

    const tel = body.telemetria as Record<string, unknown>
    expect(typeof tel.iniciadoEn).toBe('string')
    expect(typeof tel.enviadoEn).toBe('string')
    expect(typeof tel.duracionTotalMs).toBe('number')
    expect(typeof tel.tiempoCapturaFormularioMs).toBe('number')
    expect(tel.tiemposPaso).toBeDefined()
    expect(tel.edicionesPorCampo).toBeDefined()
    expect(tel.dispositivo).toBeDefined()

    const dispositivo = tel.dispositivo as Record<string, unknown>
    expect(typeof dispositivo.userAgent).toBe('string')
    expect(typeof dispositivo.idioma).toBe('string')
    expect(typeof dispositivo.zonaHoraria).toBe('string')
    expect(dispositivo.viewport).toBeDefined()
  })

  test('la geolocalización NO se incluye cuando el feature flag está apagado (default)', async ({
    page,
  }) => {
    let capturedBody: unknown = null

    await page.route('**/api/solicitudes', async (route) => {
      capturedBody = route.request().postDataJSON()
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ folio: FOLIO_MOCK }),
      })
    })

    await inyectarStore(page)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText(FOLIO_MOCK)).toBeVisible({ timeout: 10_000 })

    const tel = (capturedBody as { telemetria?: Record<string, unknown> })?.telemetria
    expect(tel).toBeDefined()
    expect(tel?.geolocalizacion).toBeUndefined()
  })
})
