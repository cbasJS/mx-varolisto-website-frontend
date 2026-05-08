import { test, expect } from '@playwright/test'
import { irAlFormulario } from './helpers'

test.describe('Rediseño /solicitar — page shell', () => {
  test('no renderiza la banda navy superior', async ({ page }) => {
    await irAlFormulario(page)
    const bandaNavy = page.locator('div.bg-primary.h-64, div.bg-primary.md\\:h-72')
    await expect(bandaNavy).toHaveCount(0)
  })

  test('no muestra el título "Solicitud de préstamo personal"', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Solicitud de préstamo personal')).toHaveCount(0)
  })

  test('la card del formulario no tiene la franja verde superior', async ({ page }) => {
    await irAlFormulario(page)
    const cardConFranjaVerde = page.locator('div.border-t-4.border-t-secondary')
    await expect(cardConFranjaVerde).toHaveCount(0)
  })

  test('el formulario sigue presente y navegable', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('¿Cuánto necesitas?')).toBeVisible()
  })

  test('el logo del header no es blanco (queda legible sobre fondo claro)', async ({ page }) => {
    await irAlFormulario(page)
    const logo = page.getByRole('link', { name: 'VaroListo.mx - Inicio' })
    const color = await logo.evaluate((el) => window.getComputedStyle(el).color)
    // text-white sería rgb(255, 255, 255) — debe ser cualquier otro color (navy / primary)
    expect(color).not.toBe('rgb(255, 255, 255)')
  })
})
