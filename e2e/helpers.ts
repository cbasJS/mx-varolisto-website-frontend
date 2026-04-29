import type { Page } from "@playwright/test"

/** Navigate to the form and wait for it to hydrate (step 1 visible). */
export async function irAlFormulario(page: Page) {
  await page.goto("/solicitar")
  // Wait for hydration — step 1 heading must appear
  await page.waitForSelector("text=¿Cuánto necesitas?", { timeout: 10_000 })
}

/** Fill Paso 1 — Préstamo deseado. */
export async function llenarPaso1(page: Page) {
  // Slider is pre-filled at $5,000 — leave as is
  // Select plazo 4 meses
  await page.click("button:has-text('4')")
  // Select destino: gasto_medico
  await page.click("button:has-text('Gasto médico')")
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Cuéntanos sobre ti")
}

/** Fill Paso 2 — Identidad. */
export async function llenarPaso2(page: Page) {
  await page.fill("input[name=nombre]", "María")
  await page.fill("input[name=apellidoPaterno]", "García")
  await page.fill("input[name=apellidoMaterno]", "López")
  // Sexo F
  await page.click("button:has-text('Mujer')")
  // Fecha nacimiento: 1990-05-15
  const fechaInput = page.locator("input[name=fechaNacimiento]")
  await fechaInput.fill("1990-05-15")
  await page.fill("input[name=curp]", "GALM900515MDFXXX01")
  await page.fill("input[name=email]", "maria@example.com")
  await page.fill("input[name=telefono]", "5512345678")
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Tu domicilio")
}

/** Fill Paso 3 — Domicilio. Validates CP logic. */
export async function llenarPaso3(page: Page, opts?: { cambiarCp?: boolean }) {
  const cpInput = page.locator("input[name=codigoPostal]")
  await cpInput.fill("06600")
  // Wait for colonia select to appear
  await page.waitForSelector("text=Selecciona tu colonia", { timeout: 8_000 })
  // Select first colonia via combobox
  await page.locator("#colonia").click()
  await page.locator("[data-radix-popper-content-wrapper] [role=option]").first().click()
  await page.fill("input[name=calle]", "Insurgentes Sur")
  await page.fill("input[name=numeroExterior]", "123")
  // aniosViviendo
  await page.locator("select, [role=combobox]").filter({ hasText: "Tiempo viviendo" }).click()
  await page.getByRole("option", { name: "1 – 2 años" }).click()
  // tipoVivienda
  await page.locator("select, [role=combobox]").filter({ hasText: "Tipo de vivienda" }).click()
  await page.getByRole("option", { name: "Rentada" }).click()
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Tu situación económica")
}

/** Fill Paso 4 — Economía. */
export async function llenarPaso4(page: Page) {
  await page.click("button:has-text('Empleado formal')")
  await page.fill("input[name=nombreEmpleadorNegocio]", "ACME Corp")
  // Antigüedad
  await page.locator("[role=combobox]").filter({ hasText: "Antigüedad" }).click()
  await page.getByRole("option", { name: "Entre 1 y 2 años" }).click()
  // Estado civil
  await page.locator("[role=combobox]").filter({ hasText: "Estado civil" }).click()
  await page.getByRole("option", { name: "Soltero/a" }).click()
  // Dependientes
  await page.locator("[role=combobox]").filter({ hasText: "Dependientes" }).click()
  await page.getByRole("option", { name: "Ninguno" }).click()
  // Ingreso
  const ingreso = page.locator("input[placeholder=' ']").filter({ has: page.locator("~ *:has-text('MXN')") }).first()
  await ingreso.click()
  await ingreso.fill("15000")
  await ingreso.blur()
  // Sin deudas
  await page.click("button:has-text('No tengo deudas')")
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Referencias personales")
}

/** Fill Paso 5 — Referencias. */
export async function llenarPaso5(page: Page) {
  await page.fill("input[name=ref1Nombre]", "Juan Pérez")
  await page.fill("input[name=ref1Telefono]", "5598765432")
  await page.locator("[role=combobox]").filter({ hasText: "Relación" }).first().click()
  await page.getByRole("option", { name: "Familiar" }).click()
  await page.fill("input[name=ref2Nombre]", "Ana Torres")
  await page.fill("input[name=ref2Telefono]", "5511112222")
  await page.locator("[role=combobox]").filter({ hasText: "Relación" }).last().click()
  await page.getByRole("option", { name: "Amigo" }).click()
  await page.click("button[type=submit]")
  await page.waitForSelector("text=Documentos")
}
