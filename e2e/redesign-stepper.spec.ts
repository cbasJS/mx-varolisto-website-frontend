import { test, expect, type Page } from '@playwright/test'

/**
 * Inyecta el store en pasoActual=2 para que el stepper sea visible
 * (en paso 1 el stepper se oculta por diseño — paso 1 es la calculadora).
 */
async function irAPaso2(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      'vl-solicitud',
      JSON.stringify({
        state: {
          pasoActual: 2,
          datos: {
            montoSolicitado: 5000,
            plazoMeses: '4',
            destinoPrestamo: 'liquidar_deuda',
          },
          timestampInicio: Date.now(),
          coloniasCache: {},
          sessionUuid: '00000000-0000-4000-a000-000000000001',
          archivosSubidos: [],
          tipoIdentificacion: null,
        },
        version: 0,
      }),
    )
  })
  await page.goto('/solicitar')
  await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })
}

test.describe('Rediseño /solicitar — stepper (BarraPasos)', () => {
  test('desktop: las 5 etiquetas form-step son legibles sobre fondo claro', async ({ page }) => {
    await irAPaso2(page)
    const desktopBar = page.locator('div.hidden.md\\:block').filter({ hasText: 'Tu identidad' })
    await expect(desktopBar).toBeVisible()

    // Sólo 5 form-steps en el stepper; paso 1 (calculadora) y paso 7 (revisión)
    // son landings sin stepper.
    const etiquetas = [
      'Tu identidad',
      'Tu domicilio',
      'Tu economía',
      'Tus contactos',
      'Tus documentos',
    ]
    for (const et of etiquetas) {
      const label = desktopBar.getByText(et).first()
      await expect(label).toBeVisible()
      const color = await label.evaluate((el) => window.getComputedStyle(el).color)
      expect(color).not.toMatch(/^rgba?\(\s*255,?\s*255,?\s*255/)
    }
  })

  test('desktop: el círculo del paso activo tiene borde navy (text-primary #000666)', async ({
    page,
  }) => {
    await irAPaso2(page)
    // App paso 2 = stepper step 1 (Tu identidad) activo → step-node-1.
    const activeNode = page.locator('[data-testid="step-node-1"]')
    await expect(activeNode).toBeVisible()
    const borderColor = await activeNode.evaluate((el) => window.getComputedStyle(el).borderColor)
    // primary en tailwind.config.ts → #000666 → rgb(0, 6, 102)
    expect(borderColor).toBe('rgb(0, 6, 102)')
  })

  test('el stepper queda en una franja con fondo blanco pegada al navbar', async ({ page }) => {
    // El strip solo se renderiza cuando hay stepper visible (pasos 2-6); en
    // paso 1 y 7 se omite para que el contenido quede pegado al navbar.
    await irAPaso2(page)
    const strip = page.locator('[data-testid="stepper-strip"]')
    await expect(strip).toBeVisible()

    // Background blanco
    const bg = await strip.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    expect(bg).toBe('rgb(255, 255, 255)')

    // El strip incluye un padding-top de NAVBAR_HEIGHT=72px para cubrir el
    // espacio del navbar fijo (transparente) con fondo blanco continuo.
    const stripPaddingTop = await strip.evaluate((el) => window.getComputedStyle(el).paddingTop)
    expect(stripPaddingTop).toBe('72px')
  })

  test('los conectores del stepper desktop son visibles (no invisibles sobre blanco)', async ({
    page,
  }) => {
    await irAPaso2(page)
    // step-connector-1 entre Tu identidad y Tu domicilio
    const connector = page.locator('[data-testid="step-connector-1"]')
    await expect(connector).toBeVisible()
    const bg = await connector.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // No debe ser ni blanco puro ni transparente — debe tener algún tono gris perceptible
    expect(bg).not.toBe('rgb(255, 255, 255)')
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('paso 1 NO muestra el stepper (sólo es la calculadora/landing)', async ({ page }) => {
    await irAlFormulario(page)
    // En paso 1 no debe haber circles de pasos visibles
    await expect(page.locator('[data-testid="step-node-1"]')).toHaveCount(0)
    // En paso 1 tampoco debe haber barra de progreso mobile
    await expect(page.locator('[data-testid="progress-bar"]')).toHaveCount(0)
  })

  test('desktop: el círculo del paso pendiente tiene borde gray-200 (Figma)', async ({ page }) => {
    await irAPaso2(page)
    // App paso 2 = stepper paso 1 activo. step-node-2 (Tu domicilio) es pendiente.
    const pendingNode = page.locator('[data-testid="step-node-2"]')
    await expect(pendingNode).toBeVisible()
    const borderColor = await pendingNode.evaluate((el) => window.getComputedStyle(el).borderColor)
    // gray-200 → rgb(229, 231, 235)
    expect(borderColor).toBe('rgb(229, 231, 235)')
  })

  test('desktop: el conector base usa gray-100 (Figma)', async ({ page }) => {
    await irAPaso2(page)
    // step-connector-2 entre Tu domicilio y Economía (ambos pendientes en paso 2)
    const connector = page.locator('[data-testid="step-connector-2"]')
    await expect(connector).toBeVisible()
    const bg = await connector.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // gray-100 → rgb(243, 244, 246)
    expect(bg).toBe('rgb(243, 244, 246)')
  })

  test('navbar en /solicitar es bg-white con border-b (matchea el strip continuo)', async ({
    page,
  }) => {
    await irAlFormulario(page)
    const navbar = page.locator('header').first()
    const bg = await navbar.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    const borderBottom = await navbar.evaluate(
      (el) => window.getComputedStyle(el).borderBottomWidth,
    )
    expect(bg).toBe('rgb(255, 255, 255)')
    expect(borderBottom).not.toBe('0px')
  })

  test('mobile: en paso 2 muestra "Paso 1 de 5", la etiqueta y la barra', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAPaso2(page)
    const mobileBar = page.locator('div.md\\:hidden').filter({ hasText: 'Paso 1 de 5' })
    await expect(mobileBar.getByText('Paso 1 de 5')).toBeVisible()
    await expect(mobileBar.getByText('Tu identidad')).toBeVisible()
    await expect(mobileBar.locator('[data-testid="progress-bar"]')).toBeVisible()
  })
})
