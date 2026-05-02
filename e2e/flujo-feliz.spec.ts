import { test, expect } from '@playwright/test'

// Folio real del backend: formato VL-XXXXXX-XXXX
const FOLIO_MOCK = 'VL-260501-0001'
const SESSION_UUID = '00000000-0000-4000-a000-000000000099'

// Datos completos de un solicitante real — empleada formal, $5,000 a 4 meses
const DATOS_COMPLETOS = {
  // Identidad (paso 2 UI / schema paso1)
  nombre: 'María',
  apellidoPaterno: 'García',
  apellidoMaterno: 'López',
  sexo: 'F',
  fechaNacimiento: '1990-05-15',
  curp: 'GALM900515MDFXXX01',
  email: 'maria.garcia@example.com',
  telefono: '5512345678',
  // Domicilio (paso 3) — CP 06600, Col. Juárez, CDMX
  codigoPostal: '06600',
  colonia: 'Juárez',
  municipio: 'Cuauhtémoc',
  estado: 'Ciudad de México',
  ciudad: 'Ciudad de México',
  calle: 'Insurgentes Sur',
  numeroExterior: '123',
  aniosViviendo: 'entre_1_y_2',
  tipoVivienda: 'rentada',
  // Préstamo (paso 1 UI / schema paso2) — dentro del rango $2,000–$20,000, 2–6 meses
  montoSolicitado: 5000,
  plazoMeses: '4',
  destinoPrestamo: 'gasto_medico',
  // Economía (paso 4) — ingreso mín $1,000
  tipoActividad: 'empleado_formal',
  nombreEmpleadorNegocio: 'ACME Corp SA de CV',
  antiguedad: 'uno_a_dos',
  estadoCivil: 'soltero',
  dependientesEconomicos: 'ninguno',
  ingresoMensual: 8500,
  tieneDeudas: 'no',
  // Referencias (paso 5)
  ref1Nombre: 'Juan Pérez',
  ref1Telefono: '5598765432',
  ref1Relacion: 'familiar',
  ref2Nombre: 'Ana Torres',
  ref2Telefono: '5511112222',
  ref2Relacion: 'amigo',
}

// Archivos documentos reales del producto — INE (frente + reverso) +
// comprobante de ingresos + comprobante de domicilio
const ARCHIVOS_COMPLETOS = [
  {
    clienteId: 'cliente-ine-frente',
    tipoArchivo: 'ine_frente',
    nombreOriginal: 'ine_frente.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 204800, // 200 KB
    storagePath: `staging/${SESSION_UUID}/ine_frente.jpg`,
    archivoId: 'arch-0001',
  },
  {
    clienteId: 'cliente-ine-reverso',
    tipoArchivo: 'ine_reverso',
    nombreOriginal: 'ine_reverso.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 198000, // ~193 KB
    storagePath: `staging/${SESSION_UUID}/ine_reverso.jpg`,
    archivoId: 'arch-0002',
  },
  {
    clienteId: 'cliente-comprobante',
    tipoArchivo: 'comprobante_ingreso',
    nombreOriginal: 'nomina_abril.jpg',
    mimeType: 'image/jpeg',
    tamanoBytes: 312000, // ~304 KB
    storagePath: `staging/${SESSION_UUID}/nomina_abril.jpg`,
    archivoId: 'arch-0003',
  },
  {
    clienteId: 'cliente-domicilio',
    tipoArchivo: 'comprobante_domicilio',
    nombreOriginal: 'recibo_luz.pdf',
    mimeType: 'application/pdf',
    tamanoBytes: 98000, // ~95 KB
    storagePath: `staging/${SESSION_UUID}/recibo_luz.pdf`,
    archivoId: 'arch-0004',
  },
]

/**
 * Inyecta el store completo en sessionStorage posicionado en el paso indicado.
 * Usar sessionStorage es la estrategia correcta para E2E — evita dependencias
 * frágiles del DatePicker y llamadas reales a APIs externas (COPOMEX, uploads).
 */
async function inyectarStore(
  page: import('@playwright/test').Page,
  paso: number,
  extra: Partial<typeof DATOS_COMPLETOS> = {},
) {
  await page.goto('/solicitar')
  await page.evaluate(
    ({ paso, datos, archivos, sessionUuid }) => {
      const store = {
        state: {
          pasoActual: paso,
          datos,
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid,
          archivosSubidos: paso >= 7 ? archivos : [],
          tipoIdentificacion: paso >= 7 ? 'ine' : null,
        },
        version: 0,
      }
      sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
    },
    {
      paso,
      datos: { ...DATOS_COMPLETOS, ...extra },
      archivos: ARCHIVOS_COMPLETOS,
      sessionUuid: SESSION_UUID,
    },
  )
  await page.reload()
}

test.describe('Flujo feliz — solicitud completa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solicitar')
    await page.evaluate(() => sessionStorage.clear())

    // GET staging — sin archivos previos
    await page.route(`**/api/archivos/staging/**`, (route) => {
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

  // ── Flujo principal ───────────────────────────────────────────────────────

  test('submit exitoso llega a PantallaExito con folio VL-XXXXXX-XXXX', async ({ page }) => {
    await page.route('**/api/solicitudes', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ folio: FOLIO_MOCK }),
      }),
    )

    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText('¡Todo listo!')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Solicitud recibida')).toBeVisible()
    await expect(page.getByText('Tu solicitud fue enviada exitosamente.')).toBeVisible()
    await expect(page.getByText(FOLIO_MOCK)).toBeVisible()
    await expect(page.getByText('Número de folio')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  })

  test("botón Enviar muestra 'Enviando…' mientras el POST está en vuelo", async ({ page }) => {
    // POST que nunca responde — simula latencia real
    await page.route('**/api/solicitudes', () => {
      /* sin respuesta */
    })

    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText('Enviando…')).toBeVisible({ timeout: 3_000 })
  })

  // ── Paso 7: resumen de datos ──────────────────────────────────────────────

  test('Paso 7 muestra resumen con datos del solicitante y del préstamo', async ({ page }) => {
    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    // Datos de identidad
    await expect(page.getByText('María')).toBeVisible()
    await expect(page.getByText('García')).toBeVisible()
    await expect(page.getByText('maria.garcia@example.com')).toBeVisible()
    await expect(page.getByText('5512345678')).toBeVisible()
    // Datos del préstamo — monto y plazo dentro del rango del producto
    await expect(page.getByText('$5,000')).toBeVisible()
    await expect(page.getByText('4 meses')).toBeVisible()
    await expect(page.getByText('Gasto médico')).toBeVisible()
  })

  // ── Errores del backend ───────────────────────────────────────────────────

  test('error 409 (conflicto) muestra mensaje y permanece en Paso 7', async ({ page }) => {
    await page.route('**/api/solicitudes', (route) =>
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'conflict', mensaje: 'Ya existe una solicitud activa' }),
      }),
    )

    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByRole('heading', { name: 'Solicitud activa existente' })).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('¡Todo listo!')).not.toBeVisible()
    await expect(page.getByText('Revisa tu solicitud')).toBeVisible()
  })

  test('error de red muestra mensaje de reintento y permanece en Paso 7', async ({ page }) => {
    await page.route('**/api/solicitudes', (route) => route.abort('failed'))

    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('¡Todo listo!')).not.toBeVisible()
  })

  // ── Validación de checkboxes ──────────────────────────────────────────────

  test('botón Enviar está deshabilitado sin aceptar ningún checkbox', async ({ page }) => {
    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    // El botón está disabled mientras no se acepten ambos términos
    await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled()
  })

  test('botón Enviar está deshabilitado aceptando solo el primer checkbox', async ({ page }) => {
    await inyectarStore(page, 7)
    await page.waitForSelector('text=Revisa tu solicitud', { timeout: 5_000 })

    await page.locator('button[role="checkbox"]').nth(0).click()

    // Con solo uno de los dos, el botón sigue deshabilitado
    await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled()
  })
})
