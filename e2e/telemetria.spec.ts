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
  // Bloque 1 v7: $5,000 → plazos válidos ['2','3']. Usar '3'.
  montoSolicitado: 5000,
  plazoMeses: '3' as const,
  destinoPrestamo: 'gasto_medico' as const,
  tipoActividad: 'empleado_formal' as const,
  nombreEmpleadorNegocio: 'ACME Corp SA de CV',
  antiguedad: 'uno_a_dos' as const,
  estadoCivil: 'soltero' as const,
  dependientesEconomicos: 'ninguno' as const,
  ingresoMensual: 8500,
  gastoMensual: 4500,
  tieneDeudas: 'no' as const,
  // Bloque 1: referencias migraron a array dinámico (shared-schemas 0.15.0).
  referencias: [
    { nombre: 'Juan Pérez', telefono: '5598765432', relacion: 'familiar' as const },
    { nombre: 'Ana Torres', telefono: '5511112222', relacion: 'amigo' as const },
  ],
}

// Bloque 1: ARCHIVOS_COMPLETOS removido — el formulario público dejó de
// capturar archivos en línea. La revisión (paso 6 nuevo) no requiere
// archivos previos para que la telemetría se envíe correctamente.

// Flag-guard para que el init script sólo inyecte una vez por test, sin
// re-poblar sessionStorage en navegaciones subsecuentes (post-submit a "/").
const SETUP_FLAG = 'vl-e2e-setup-injected'

async function inyectarStore(page: import('@playwright/test').Page) {
  // addInitScript corre antes que cualquier script de la página. Reemplaza
  // el patrón goto → evaluate → reload, que bajo carga del dev server permite
  // que el inicializarSession() del primer mount sobreescriba la inyección
  // antes del reload, dejando la página en Paso 1.
  //
  // Bloque 1: paso 6 (revisión) reemplaza al antiguo paso 7. El store ya no
  // persiste `archivosSubidos`/`tipoIdentificacion` — el formulario público
  // dejó de capturar documentos en línea.
  await page.addInitScript(
    ({ datos, sessionUuid, flag }) => {
      if (sessionStorage.getItem(flag) === 'true') return
      const store = {
        state: {
          pasoActual: 6,
          datos,
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid,
        },
        version: 0,
      }
      sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
      sessionStorage.setItem(flag, 'true')
    },
    {
      datos: DATOS_COMPLETOS,
      sessionUuid: SESSION_UUID,
      flag: SETUP_FLAG,
    },
  )
  await page.goto('/solicitar')
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
