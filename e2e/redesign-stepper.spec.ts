import { test, expect } from '@playwright/test'
import { irAlFormulario } from './helpers'

test.describe('Rediseño /solicitar — stepper (BarraPasos)', () => {
  test('desktop: las 7 etiquetas son legibles sobre fondo claro (no text-white)', async ({
    page,
  }) => {
    await irAlFormulario(page)
    const desktopBar = page.locator('div.hidden.md\\:block').filter({ hasText: 'Préstamo' })
    await expect(desktopBar).toBeVisible()

    const etiquetas = [
      'Préstamo',
      'Identidad',
      'Domicilio',
      'Economía',
      'Referencias',
      'Documentos',
      'Revisión',
    ]
    for (const et of etiquetas) {
      const label = desktopBar.getByText(et).first()
      await expect(label).toBeVisible()
      const color = await label.evaluate((el) => window.getComputedStyle(el).color)
      // Antes era text-white/30 sobre banda navy; ahora va sobre fondo claro
      // y debe tener color visible (gris/navy), nunca rgba(255,255,255,*).
      expect(color).not.toMatch(/^rgba?\(\s*255,?\s*255,?\s*255/)
    }
  })

  test('desktop: el círculo del paso activo tiene borde navy (text-primary #000666)', async ({
    page,
  }) => {
    await irAlFormulario(page)
    const activeNode = page.locator('[data-testid="step-node-1"]')
    await expect(activeNode).toBeVisible()
    const borderColor = await activeNode.evaluate((el) => window.getComputedStyle(el).borderColor)
    // primary en tailwind.config.ts → #000666 → rgb(0, 6, 102)
    expect(borderColor).toBe('rgb(0, 6, 102)')
  })

  test('el stepper queda en una franja con fondo blanco pegada al navbar', async ({ page }) => {
    await irAlFormulario(page)
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
    await irAlFormulario(page)
    const connector = page.locator('[data-testid="step-connector-1"]')
    await expect(connector).toBeVisible()
    const bg = await connector.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // No debe ser ni blanco puro ni transparente — debe tener algún tono gris perceptible
    expect(bg).not.toBe('rgb(255, 255, 255)')
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
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

  test('mobile: muestra "Paso 1 de 7", la etiqueta del paso y una barra de progreso', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAlFormulario(page)
    const mobileBar = page.locator('div.md\\:hidden').filter({ hasText: 'Paso 1 de 7' })
    await expect(mobileBar.getByText('Paso 1 de 7')).toBeVisible()
    await expect(mobileBar.getByText('Préstamo')).toBeVisible()
    // Barra de progreso: data-testid robusto en lugar de selector de clase
    await expect(mobileBar.locator('[data-testid="progress-bar"]')).toBeVisible()
  })
})
