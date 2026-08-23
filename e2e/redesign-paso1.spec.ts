import { test, expect } from '@playwright/test'
import { irAlFormulario } from './helpers'

test.describe('Rediseño /solicitar — Paso 1 (calculadora)', () => {
  test('muestra el hero pill "Préstamos personales · 100% en línea"', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Préstamos personales · 100% en línea')).toBeVisible()
  })

  test('el CTA "Ver mi oferta" ocupa el 100% del contenedor del form', async ({ page }) => {
    await irAlFormulario(page)
    const cta = page.getByRole('button', { name: /Ver mi oferta/i })
    await expect(cta).toBeVisible()
    const ctaBox = await cta.boundingBox()
    const form = page.locator('form').first()
    const formBox = await form.boundingBox()
    expect(ctaBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    // CTA width >= 95% del form (full-width con tolerancia mínima por padding)
    expect(ctaBox!.width / formBox!.width).toBeGreaterThan(0.95)
  })

  test('mobile: destino card muestra solo 3 opciones + botón "Ver más opciones"', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAlFormulario(page)
    // Primeros 3 destinos visibles
    await expect(page.getByRole('button', { name: 'Liquidar una deuda' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Capital de trabajo' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gasto médico' })).toBeVisible()
    // El 4to oculto en mobile (display: none) hasta presionar "Ver más"
    await expect(page.getByRole('button', { name: 'Equipo de trabajo' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Más opciones' })).toBeVisible()
  })

  test('mobile: click en "Ver más opciones" revela los demás destinos', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAlFormulario(page)
    await page.getByRole('button', { name: 'Más opciones' }).click()
    await expect(page.getByRole('button', { name: 'Equipo de trabajo' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Otro' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Menos opciones' })).toBeVisible()
  })

  test('muestra los 3 trust indicators con copy de Figma', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Datos cifrados')).toBeVisible()
    await expect(page.getByText('Sin letra chica')).toBeVisible()
    await expect(page.getByText('Respuesta en 24 h')).toBeVisible()
  })

  test('muestra la Info Section "Así de simple" con 3 pasos numerados', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Así de simple')).toBeVisible()
    await expect(page.getByText(/Llenas tu solicitud/)).toBeVisible()
    await expect(page.getByText(/Te respondemos/)).toBeVisible()
    await expect(page.getByText(/El dinero llega/)).toBeVisible()
  })

  test('mobile: un destino seleccionado en "Ver más opciones" sigue visible tras recargar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAlFormulario(page)
    // Expandir y seleccionar "Viaje o evento" (índice 7 — vive en la sección
    // colapsada por default).
    await page.getByRole('button', { name: 'Más opciones' }).click()
    await page.getByRole('button', { name: 'Viaje o evento' }).click()
    // Esperar a que el autoSave (debounced 300ms) persista el destino en sessionStorage.
    await expect
      .poll(
        async () => {
          const raw = await page.evaluate(() => sessionStorage.getItem('vl-solicitud'))
          return raw ? JSON.parse(raw).state?.datos?.destinoPrestamo : null
        },
        { timeout: 3_000 },
      )
      .toBe('viaje_evento')
    // Reload — el destino debe seguir visible y la sección debe estar expandida.
    await page.reload()
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 10_000 })
    await expect(page.getByRole('button', { name: 'Viaje o evento' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Menos opciones' })).toBeVisible()
  })
})
