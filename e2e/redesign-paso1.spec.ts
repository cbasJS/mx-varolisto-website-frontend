import { test, expect } from '@playwright/test'
import { irAlFormulario } from './helpers'

test.describe('Rediseño /solicitar — Paso 1 (calculadora)', () => {
  test('muestra el hero pill "Tu préstamo, directo y rápido"', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Tu préstamo, directo y rápido')).toBeVisible()
  })

  test('el CTA "Solicitar ahora" ocupa el 100% del contenedor del form', async ({ page }) => {
    await irAlFormulario(page)
    const cta = page.getByRole('button', { name: /Solicitar ahora/i })
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
    await expect(page.getByRole('button', { name: 'Ver más opciones' })).toBeVisible()
  })

  test('mobile: click en "Ver más opciones" revela los demás destinos', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await irAlFormulario(page)
    await page.getByRole('button', { name: 'Ver más opciones' }).click()
    await expect(page.getByRole('button', { name: 'Equipo de trabajo' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Otro' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ver menos opciones' })).toBeVisible()
  })

  test('muestra los 3 trust indicators con copy de Figma', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Tus datos seguros')).toBeVisible()
    await expect(page.getByText('Sin letra chica')).toBeVisible()
    await expect(page.getByText('Respuesta en 24h')).toBeVisible()
  })

  test('muestra la Info Section "Es súper fácil" con 3 pasos numerados', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Es súper fácil')).toBeVisible()
    await expect(page.getByText(/Completa tu solicitud/)).toBeVisible()
    await expect(page.getByText(/Te respondemos/)).toBeVisible()
    await expect(page.getByText(/Recibe el dinero/)).toBeVisible()
  })
})
