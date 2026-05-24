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
  gastoMensual: 4500,
  tieneDeudas: 'no',
  // Referencias (paso 5) — array dinámico nuevo (shared-schemas 0.15.0)
  referencias: [
    { nombre: 'Juan Pérez', telefono: '5598765432', relacion: 'familiar' },
    { nombre: 'Ana Torres', telefono: '5511112222', relacion: 'amigo' },
  ],
}

// Bloque 1: ARCHIVOS_COMPLETOS removido — el formulario público dejó de
// capturar archivos en línea; el paso 7 anterior de "Documentos" quedó
// desconectado del wizard. El paso de revisión (ahora paso 6) no requiere
// archivos previos para mostrar el resumen y enviar la solicitud.

// Flag-guard: el init script sólo inyecta una vez por test, sin re-poblar
// sessionStorage en navegaciones subsecuentes que pudieran sobreescribir el
// resetForm post-submit.
const SETUP_FLAG = 'vl-e2e-setup-injected'

/**
 * Inyecta el store completo en sessionStorage posicionado en el paso indicado.
 * Usar sessionStorage es la estrategia correcta para E2E — evita dependencias
 * frágiles del DatePicker y llamadas reales a APIs externas (COPOMEX, uploads).
 *
 * addInitScript corre antes que cualquier script de la página. Reemplaza el
 * patrón goto → evaluate → reload, que bajo carga del dev server permite que
 * el inicializarSession() del primer mount sobreescriba la inyección antes
 * del reload, dejando la página en Paso 1.
 */
async function inyectarStore(
  page: import('@playwright/test').Page,
  paso: number,
  extra: Partial<typeof DATOS_COMPLETOS> = {},
) {
  await page.addInitScript(
    ({ paso, datos, sessionUuid, flag }) => {
      if (sessionStorage.getItem(flag) === 'true') return
      // Bloque 1: el store del formulario público ya no persiste
      // `archivosSubidos` ni `tipoIdentificacion`. El flujo de revisión
      // (paso 6) no requiere archivos en memoria — se removió el paso de
      // documentos en línea del wizard.
      const store = {
        state: {
          pasoActual: paso,
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
      paso,
      datos: { ...DATOS_COMPLETOS, ...extra },
      sessionUuid: SESSION_UUID,
      flag: SETUP_FLAG,
    },
  )
  await page.goto('/solicitar')
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

    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText('Listo, ya quedó tu solicitud')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/Estamos revisándola/)).toBeVisible()
    await expect(page.getByText(FOLIO_MOCK)).toBeVisible()
    await expect(page.getByText('Tu folio')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ir al inicio' })).toBeVisible()
  })

  test("botón Enviar muestra 'Enviando…' mientras el POST está en vuelo", async ({ page }) => {
    // POST que nunca responde — simula latencia real
    await page.route('**/api/solicitudes', () => {
      /* sin respuesta */
    })

    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.getByText('Enviando tu solicitud…')).toBeVisible({ timeout: 3_000 })
  })

  // ── Paso 7: resumen de datos ──────────────────────────────────────────────

  test('Paso 7 muestra resumen con datos del solicitante y del préstamo', async ({ page }) => {
    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // Datos de identidad
    await expect(page.getByText('María')).toBeVisible()
    await expect(page.getByText('García')).toBeVisible()
    await expect(page.getByText('maria.garcia@example.com')).toBeVisible()
    await expect(page.getByText('5512345678')).toBeVisible()
    // Datos del préstamo — el card "Detalles del préstamo" del Paso 7 es el
    // único lugar donde aparecen monto/plazo/destino (ResumenSolicitud del
    // header se oculta en Paso 7). No requiere scope al <form>.
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

    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(
      page.getByRole('heading', { name: 'Ya tienes una solicitud en curso' }),
    ).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('¡Solicitud enviada!')).not.toBeVisible()
    await expect(page.getByText('Casi listo. Revisa todo')).toBeVisible()
  })

  test('modal de conflicto: click en "Entendido" limpia sessionStorage y regresa al Paso 1', async ({
    page,
  }) => {
    await page.route('**/api/solicitudes', (route) =>
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'conflict', mensaje: 'Ya existe una solicitud activa' }),
      }),
    )

    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(
      page.getByRole('heading', { name: 'Ya tienes una solicitud en curso' }),
    ).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: 'Entendido' }).click()

    // El modal cierra y vemos el Paso 1 (calculadora) — no el skeleton ni el
    // Paso 7. El bug previo dejaba _hasHydrated=false en resetForm y la UI se
    // quedaba pintando el FormSkeleton, sin pintar el Paso 1.
    await expect(page.getByRole('heading', { name: '¿Cuánto necesitas?' })).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('Casi listo. Revisa todo')).not.toBeVisible()

    // El store reseteado debe tener pasoActual=1, datos vacíos y sessionUuid
    // distinto del previo (regenerado para el siguiente intento).
    const persistido = await page.evaluate(() => {
      const raw = sessionStorage.getItem('vl-solicitud')
      return raw ? JSON.parse(raw) : null
    })
    expect(persistido?.state?.pasoActual).toBe(1)
    expect(persistido?.state?.datos).toEqual({})
    expect(persistido?.state?.sessionUuid).toBeTruthy()
    expect(persistido?.state?.sessionUuid).not.toBe('00000000-0000-4000-a000-000000000099')
  })

  test('error de red muestra mensaje de reintento y permanece en Paso 7', async ({ page }) => {
    await page.route('**/api/solicitudes', (route) => route.abort('failed'))

    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()
    await page.click("button:has-text('Enviar solicitud')")

    await expect(page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible({
      timeout: 5_000,
    })
    await expect(page.getByText('¡Solicitud enviada!')).not.toBeVisible()
  })

  // ── Validación de checkboxes ──────────────────────────────────────────────

  test('botón Enviar está deshabilitado sin aceptar ningún checkbox', async ({ page }) => {
    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // El botón está disabled mientras no se acepten ambos términos
    await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled()
  })

  test('botón Enviar está deshabilitado aceptando solo el primer checkbox', async ({ page }) => {
    await inyectarStore(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    await page.locator('button[role="checkbox"]').nth(0).click()

    // Con solo uno de los dos, el botón sigue deshabilitado
    await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled()
  })
})
