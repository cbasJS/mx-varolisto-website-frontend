import { test, expect, type Page } from '@playwright/test'
import { irAlFormulario } from './helpers'

const STORE_KEY = 'vl-solicitud'

async function setStoreEnPaso2(page: Page) {
  // sessionStorage es por-document; un goto genera un document nuevo y
  // limpia sessionStorage. La forma confiable de inyectar antes de la
  // primera carga es addInitScript (corre en el contexto del browser
  // antes de cualquier script de la página).
  const STORE = {
    state: {
      pasoActual: 2,
      datos: {
        montoSolicitado: 8000,
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
  }
  await page.addInitScript((store) => {
    sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
  }, STORE)
  await page.goto('/solicitar')
  await page.waitForSelector('text=Cuéntanos sobre ti', { timeout: 15_000 })
}

test.describe('Rediseño /solicitar — Resumen de solicitud (pasos 2-7)', () => {
  test('NO aparece el resumen en Paso 1', async ({ page }) => {
    await irAlFormulario(page)
    await expect(page.getByText('Estás pidiendo:')).toHaveCount(0)
  })

  test('Aparece resumen en Paso 2 con monto, plazo y cuota visibles', async ({ page }) => {
    await setStoreEnPaso2(page)
    const resumen = page.locator('[data-testid="resumen-solicitud"]')
    await expect(resumen).toBeVisible()
    await expect(resumen.getByText('Estás pidiendo:')).toBeVisible()
    await expect(resumen.getByText('$8,000')).toBeVisible()
    await expect(resumen.getByText('en 4 meses')).toBeVisible()
    await expect(resumen.getByText('Pagas al mes')).toBeVisible()
  })

  test('El resumen tiene fondo navy (gradient con primary)', async ({ page }) => {
    await setStoreEnPaso2(page)
    const resumen = page.locator('[data-testid="resumen-solicitud"]')
    const bg = await resumen.evaluate((el) => window.getComputedStyle(el).backgroundImage)
    // Debe ser un gradient (no "none") — confirma el navy gradient del Figma
    expect(bg).not.toBe('none')
    expect(bg).toContain('gradient')
  })

  test('Click en "Cambiar" regresa al Paso 1', async ({ page }) => {
    await setStoreEnPaso2(page)
    await page.getByRole('button', { name: 'Cambiar' }).click()
    await expect(page.getByText('¿Cuánto necesitas?')).toBeVisible()
  })
})
