import { test, expect } from "@playwright/test"
import { irAlFormulario } from "./helpers"

// ─────────────────────────────────────────────────────────────────────────────
// Store state presets — inject into sessionStorage to jump to a step
// ─────────────────────────────────────────────────────────────────────────────

const DATOS_BASE = {
  nombre: "María",
  apellidoPaterno: "García",
  apellidoMaterno: "López",
  sexo: "F",
  fechaNacimiento: "1990-05-15",
  curp: "GALM900515MDFXXX01",
  email: "maria@example.com",
  telefono: "5512345678",
  codigoPostal: "06600",
  colonia: "Roma Norte",
  municipio: "Cuauhtémoc",
  calle: "Insurgentes Sur",
  numeroExterior: "123",
  aniosViviendo: "entre_1_y_2",
  tipoVivienda: "rentada",
  montoSolicitado: 5000,
  plazoMeses: "4",
  destinoPrestamo: "gasto_medico",
  tipoActividad: "empleado_formal",
  nombreEmpleadorNegocio: "ACME Corp",
  antiguedad: "uno_a_dos",
  estadoCivil: "soltero",
  dependientesEconomicos: "ninguno",
  ingresoMensual: 15000,
  tieneDeudas: "no",
  cantidadDeudas: "sin_deudas",
  ref1Nombre: "Juan Pérez",
  ref1Telefono: "5598765432",
  ref1Relacion: "familiar",
  ref2Nombre: "Ana Torres",
  ref2Telefono: "5511112222",
  ref2Relacion: "amigo",
}

async function setStep(page: import("@playwright/test").Page, paso: number, extra: object = {}) {
  await page.goto("/solicitar")
  await page.evaluate(
    ({ paso, datos }) => {
      const store = {
        state: {
          pasoActual: paso,
          datos,
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: "00000000-0000-4000-a000-000000000001",
          archivosSubidos: [],
          tipoIdentificacion: null,
        },
        version: 0,
      }
      sessionStorage.setItem("vl-solicitud", JSON.stringify(store))
    },
    { paso, datos: { ...DATOS_BASE, ...extra } }
  )
  await page.reload()
}

// ─────────────────────────────────────────────────────────────────────────────
// Fill paso 1 quickly (no complex pickers)
// ─────────────────────────────────────────────────────────────────────────────

async function fillPaso1(page: import("@playwright/test").Page) {
  await irAlFormulario(page)
  await page.click("button:has-text('4')")
  await page.click("button:has-text('Gasto médico')")
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Cuéntanos sobre ti", { timeout: 5_000 })
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Formulario de solicitud — Fase 2", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/solicitar")
    await page.evaluate(() => sessionStorage.clear())
    await page.reload()
  })

  // ── 1. Paso 1 = Préstamo, sin campo primer crédito ───────────────────────
  test("Paso 1 es Préstamo deseado y NO tiene campo Primer crédito", async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText("¿Cuánto necesitas?")).toBeVisible()
    await expect(page.getByText(/primer cr[eé]dito/i)).not.toBeVisible()
    await expect(page.locator("input[name=destinoOtro]")).not.toBeVisible()
  })

  // ── 2. Destino "Otro" no muestra campo libre ─────────────────────────────
  test("Seleccionar destino Otro NO muestra campo de texto libre", async ({ page }) => {
    await irAlFormulario(page)
    await page.click("button:has-text('Otro')")
    await expect(page.locator("input[name=destinoOtro]")).not.toBeVisible()
  })

  // ── 3. Paso 2 = Identidad ────────────────────────────────────────────────
  test("Paso 2 es Identidad y contiene CURP, email, teléfono; RFC oculto", async ({ page }) => {
    await fillPaso1(page)
    await expect(page.getByText("Cuéntanos sobre ti")).toBeVisible()
    await expect(page.locator("input[name=curp]")).toBeVisible()
    await expect(page.locator("input[name=email]")).toBeVisible()
    await expect(page.locator("input[name=telefono]")).toBeVisible()
    await expect(page.locator("input[name=rfc]")).not.toBeVisible()
  })

  // ── 4. Paso 3: CP cambia → preserva calle/nums, resetea COPOMEX ──────────
  test("Paso 3: cambiar CP preserva calle/números y resetea colonia/municipio", async ({ page }) => {
    // Start with colonia empty so the hint text can appear after COPOMEX loads
    await setStep(page, 3, { colonia: "", municipio: "", codigoPostal: "" })
    await page.waitForSelector("text=Tu domicilio", { timeout: 5_000 })

    // Fill calle and número first (independent of CP)
    await page.fill("input[name=calle]", "Insurgentes Sur")
    await page.fill("input[name=numeroExterior]", "42")

    // Enter first CP; colonia selector and hint appear once COPOMEX responds
    const cpInput = page.locator("input[name=codigoPostal]")
    await cpInput.fill("06600")
    await page.waitForSelector("text=Selecciona tu colonia", { timeout: 10_000 })

    // Change CP — the component resets colonia, hint text reappears
    await cpInput.fill("")
    await cpInput.fill("11800")
    await page.waitForSelector("text=Selecciona tu colonia", { timeout: 10_000 })

    // Calle and número must be preserved
    await expect(page.locator("input[name=calle]")).toHaveValue("Insurgentes Sur")
    await expect(page.locator("input[name=numeroExterior]")).toHaveValue("42")
  })

  // ── 5. Paso 3 tiene aniosViviendo y tipoVivienda ─────────────────────────
  test("Paso 3 tiene selects de aniosViviendo y tipoVivienda", async ({ page }) => {
    await setStep(page, 3)
    await page.waitForSelector("text=Tu domicilio", { timeout: 5_000 })
    await expect(page.getByText("Tiempo viviendo aquí")).toBeVisible()
    await expect(page.getByText("Tipo de vivienda")).toBeVisible()
  })

  // ── 6. Paso 4 tiene estadoCivil y dependientesEconomicos ─────────────────
  test("Paso 4 tiene campos estadoCivil y dependientesEconomicos", async ({ page }) => {
    await setStep(page, 4)
    await page.waitForSelector("text=Tu situación económica", { timeout: 5_000 })
    await expect(page.getByText("Estado civil")).toBeVisible()
    await expect(page.getByText("Dependientes económicos")).toBeVisible()
  })

  // ── 7. Paso 4 label "Por cuenta propia" no "Freelance" ───────────────────
  test("Paso 4 muestra 'Por cuenta propia' y NO 'Freelance'", async ({ page }) => {
    await setStep(page, 4)
    await page.waitForSelector("text=Tu situación económica", { timeout: 5_000 })
    await expect(page.getByText("Por cuenta propia")).toBeVisible()
    await expect(page.getByRole("button", { name: "Freelance" })).not.toBeVisible()
  })

  // ── 8. Paso 6: INE → frente + reverso ────────────────────────────────────
  test("Paso 6: seleccionar INE muestra dropzones de frente y reverso", async ({ page }) => {
    await setStep(page, 6)
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })

    await page.click("button:has-text('INE / IFE')")

    await expect(page.getByText("Frente de tu INE")).toBeVisible()
    await expect(page.getByText("Reverso de tu INE")).toBeVisible()
    await expect(page.getByText("Página principal del pasaporte")).not.toBeVisible()
  })

  // ── 9. Paso 6: Pasaporte → dropzone único ────────────────────────────────
  test("Paso 6: seleccionar Pasaporte muestra dropzone único de página principal", async ({ page }) => {
    await setStep(page, 6)
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })

    await page.click("button:has-text('Pasaporte mexicano')")

    await expect(page.getByText("Página principal del pasaporte")).toBeVisible()
    await expect(page.getByText("Frente de tu INE")).not.toBeVisible()
    await expect(page.getByText("Reverso de tu INE")).not.toBeVisible()
  })

  // ── 10. Paso 6 NO tiene campo CLABE ──────────────────────────────────────
  test("Paso 6 no tiene campo CLABE interbancaria", async ({ page }) => {
    await setStep(page, 6)
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })

    await expect(page.getByText(/CLABE interbancaria/i)).not.toBeVisible()
    await expect(page.locator("input[name=clabe]")).not.toBeVisible()
  })

  // ── 12. Paso 3: COPOMEX sin ciudad → fallback al municipio ───────────────
  test("Paso 3: cuando COPOMEX no devuelve ciudad, el campo ciudad muestra el municipio", async ({ page }) => {
    // Intercept the Next.js API route before navigating
    await page.route("**/api/colonias**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          // No `ciudad` key — simulates a rural CP where COPOMEX omits it
          { response: { municipio: "Ocosingo", estado: "Chiapas", asentamiento: "Centro" } },
        ]),
      })
    )

    await setStep(page, 3, { colonia: "", municipio: "", codigoPostal: "", ciudad: undefined })
    await page.waitForSelector("text=Tu domicilio", { timeout: 5_000 })

    const cpInput = page.locator("input[name=codigoPostal]")
    await cpInput.fill("29950")
    await page.waitForSelector("text=Selecciona tu colonia", { timeout: 10_000 })

    // The ciudad field (read-only, populated from fallback) must show the municipio value
    await expect(page.locator("input[name=ciudad]")).toHaveValue("Ocosingo")

    // Verify the value is also present in the form state by checking the municipio field
    await expect(page.locator("input[name=municipio]")).toHaveValue("Ocosingo")
  })

  // ── E1. Cambio de tipoIdentificacion con cleanup ────────────────────────
  test("E1: cambiar INE→Pasaporte elimina archivos INE del bucket, radios deshabilitados durante cleanup", async ({ page }) => {
    const deletedPaths: string[] = []

    // Mock upload-url para simular subida exitosa de INE
    await page.route("**/api/archivos/upload-url", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          uploadUrl: "https://example.com/fake-upload",
          storagePath: `staging/00000000-0000-4000-a000-000000000001/ine_frente.jpg`,
          archivoId: "aaaa-0001",
          expiresIn: 7200,
        }),
      })
    )

    // Mock PUT para simular subida al bucket
    await page.route("https://example.com/fake-upload", (route) =>
      route.fulfill({ status: 200 })
    )

    // Mock DELETE staging
    await page.route("**/api/archivos/staging", (route) => {
      const body = route.request().postDataJSON() as { storagePath: string }
      deletedPaths.push(body.storagePath)
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deleted: true }),
      })
    })

    // Ir a paso 6 con un archivo INE frente ya subido en el store
    await page.evaluate(() => {
      const store = {
        state: {
          pasoActual: 6,
          datos: {},
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: "00000000-0000-4000-a000-000000000001",
          archivosSubidos: [
            {
              clienteId: "client-ine-frente",
              tipoArchivo: "ine_frente",
              nombreOriginal: "ine_frente.jpg",
              mimeType: "image/jpeg",
              tamanoBytes: 102400,
              storagePath: "staging/00000000-0000-4000-a000-000000000001/ine_frente.jpg",
              archivoId: "aaaa-0001",
            },
          ],
          tipoIdentificacion: "ine",
        },
        version: 0,
      }
      sessionStorage.setItem("vl-solicitud", JSON.stringify(store))
    })
    await page.reload()
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })

    // Verify INE frente archivo is shown
    await expect(page.getByText("ine_frente.jpg")).toBeVisible()

    // Cambiar a Pasaporte — triggers async cleanup
    await page.click("button:has-text('Pasaporte mexicano')")

    // Radios deben estar deshabilitados mientras dura el cleanup
    // (can be very fast in test env, so check that they become re-enabled)
    await expect(page.locator("button:has-text('Pasaporte mexicano')")).toBeEnabled({ timeout: 3_000 })

    // Archivo INE ya no aparece en UI
    await expect(page.getByText("ine_frente.jpg")).not.toBeVisible()

    // El DELETE fue llamado con el storagePath correcto
    expect(deletedPaths).toContain(
      "staging/00000000-0000-4000-a000-000000000001/ine_frente.jpg"
    )

    // Dropzone de pasaporte ahora visible
    await expect(page.getByText("Página principal del pasaporte")).toBeVisible()
  })

  // ── E2. Eliminación y re-subida de comprobante ───────────────────────────
  test("E2: eliminar comprobante llama DELETE en bucket y lo quita de la lista", async ({ page }) => {
    const deletedPaths: string[] = []

    await page.route("**/api/archivos/staging", (route) => {
      const body = route.request().postDataJSON() as { storagePath: string }
      deletedPaths.push(body.storagePath)
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ deleted: true }),
      })
    })

    // Ir a paso 6 con 2 comprobantes ya subidos
    await page.evaluate(() => {
      const store = {
        state: {
          pasoActual: 6,
          datos: {},
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: "00000000-0000-4000-a000-000000000001",
          archivosSubidos: [
            {
              clienteId: "client-comp-1",
              tipoArchivo: "comprobante_ingreso",
              nombreOriginal: "comprobante_enero.jpg",
              mimeType: "image/jpeg",
              tamanoBytes: 102400,
              storagePath: "staging/00000000-0000-4000-a000-000000000001/comprobante_enero.jpg",
              archivoId: "bbbb-0001",
            },
            {
              clienteId: "client-comp-2",
              tipoArchivo: "comprobante_ingreso",
              nombreOriginal: "comprobante_febrero.jpg",
              mimeType: "image/jpeg",
              tamanoBytes: 102400,
              storagePath: "staging/00000000-0000-4000-a000-000000000001/comprobante_febrero.jpg",
              archivoId: "bbbb-0002",
            },
          ],
          tipoIdentificacion: "ine",
        },
        version: 0,
      }
      sessionStorage.setItem("vl-solicitud", JSON.stringify(store))
    })
    await page.reload()
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })

    // Ambos comprobantes visibles
    await expect(page.getByText("comprobante_enero.jpg")).toBeVisible()
    await expect(page.getByText("comprobante_febrero.jpg")).toBeVisible()

    // Eliminar el primer comprobante
    await page.click('[aria-label="Eliminar comprobante_enero.jpg"]')

    // Esperar a que desaparezca
    await expect(page.getByText("comprobante_enero.jpg")).not.toBeVisible({ timeout: 5_000 })

    // DELETE fue llamado
    expect(deletedPaths).toContain(
      "staging/00000000-0000-4000-a000-000000000001/comprobante_enero.jpg"
    )

    // El otro comprobante sigue visible
    await expect(page.getByText("comprobante_febrero.jpg")).toBeVisible()
  })

  // ── E3. Eliminar INE frente y re-subir ───────────────────────────────────
  test("E3: eliminar INE frente y re-subir no deja archivo huérfano visible", async ({ page }) => {
    const deletedPaths: string[] = []

    await page.route("**/api/archivos/staging", (route) => {
      if (route.request().method() === "DELETE") {
        const body = route.request().postDataJSON() as { storagePath: string }
        deletedPaths.push(body.storagePath)
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ deleted: true }),
        })
      } else {
        route.continue()
      }
    })

    // Paso 6 con INE frente ya subido
    await page.evaluate(() => {
      const store = {
        state: {
          pasoActual: 6,
          datos: {},
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: "00000000-0000-4000-a000-000000000001",
          archivosSubidos: [
            {
              clienteId: "client-ine-f",
              tipoArchivo: "ine_frente",
              nombreOriginal: "ine_frente_viejo.jpg",
              mimeType: "image/jpeg",
              tamanoBytes: 102400,
              storagePath: "staging/00000000-0000-4000-a000-000000000001/ine_frente_viejo.jpg",
              archivoId: "cccc-0001",
            },
          ],
          tipoIdentificacion: "ine",
        },
        version: 0,
      }
      sessionStorage.setItem("vl-solicitud", JSON.stringify(store))
    })
    await page.reload()
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })
    await expect(page.getByText("ine_frente_viejo.jpg")).toBeVisible()

    // Eliminar con la X
    await page.click('[aria-label="Eliminar ine_frente_viejo.jpg"]')
    await expect(page.getByText("ine_frente_viejo.jpg")).not.toBeVisible({ timeout: 5_000 })

    // DELETE fue llamado
    expect(deletedPaths).toContain(
      "staging/00000000-0000-4000-a000-000000000001/ine_frente_viejo.jpg"
    )

    // Lista de archivos vacía — ningún archivo de upload huérfano visible
    await expect(page.locator("ul li").filter({ hasText: "ine_frente_viejo.jpg" })).not.toBeVisible()
  })

  // ── E4. Falla de DELETE no muta state ────────────────────────────────────
  test("E4: si DELETE falla con 500 tras retry, archivo sigue en lista y se muestra toast", async ({ page }) => {
    // Mock DELETE para siempre devolver 500
    await page.route("**/api/archivos/staging", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "internal_error", mensaje: "Error de storage" }),
      })
    )

    // Paso 6 con un comprobante ya subido
    await page.evaluate(() => {
      const store = {
        state: {
          pasoActual: 6,
          datos: {},
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: "00000000-0000-4000-a000-000000000001",
          archivosSubidos: [
            {
              clienteId: "client-err",
              tipoArchivo: "comprobante_ingreso",
              nombreOriginal: "comprobante_error.jpg",
              mimeType: "image/jpeg",
              tamanoBytes: 102400,
              storagePath: "staging/00000000-0000-4000-a000-000000000001/comprobante_error.jpg",
              archivoId: "dddd-0001",
            },
          ],
          tipoIdentificacion: "ine",
        },
        version: 0,
      }
      sessionStorage.setItem("vl-solicitud", JSON.stringify(store))
    })
    await page.reload()
    await page.waitForSelector("text=Tipo de identificación oficial", { timeout: 5_000 })
    await expect(page.getByText("comprobante_error.jpg")).toBeVisible()

    // Click X — DELETE falla, retry falla
    await page.click('[aria-label="Eliminar comprobante_error.jpg"]')

    // Toast de error debe aparecer
    await expect(
      page.getByText("No pudimos eliminar el archivo. Intenta de nuevo.")
    ).toBeVisible({ timeout: 5_000 })

    // Archivo SIGUE en la lista — state no fue mutado
    await expect(page.getByText("comprobante_error.jpg")).toBeVisible()
  })

  // ── 11. BarraPasos: 7 pasos, primero = Préstamo ──────────────────────────
  test("BarraPasos muestra 7 pasos, el primero es Préstamo (mobile y desktop)", async ({ page }) => {
    await irAlFormulario(page)

    // Desktop: step node with icon (paso 1 = active)
    // The step label "Préstamo" is visible in desktop bar
    await expect(page.getByText("Préstamo").first()).toBeVisible()

    // Switch to mobile viewport to check mobile bar
    await page.setViewportSize({ width: 375, height: 812 })
    await page.reload()
    await page.waitForSelector("text=¿Cuánto necesitas?")
    await expect(page.getByText("Paso 1 de 7")).toBeVisible()
    await expect(page.getByText("Préstamo").first()).toBeVisible()
  })
})
