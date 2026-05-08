import { test, expect, type Page } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 390, height: 844 } // iPhone 14
const DESKTOP_VIEWPORT = { width: 1280, height: 800 }

const STORE_KEY = 'vl-solicitud'
const ACTIVE_FORM_ID = 'paso-form-activo'

/** Hidrata el store en `pasoActual` con datos válidos del paso 1. */
async function irAPaso(page: Page, pasoActual: number) {
  await page.addInitScript(
    ({ paso, key }) => {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          state: {
            pasoActual: paso,
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
        }),
      )
    },
    { paso: pasoActual, key: STORE_KEY },
  )
  await page.goto('/solicitar')
}

async function scrollDown(page: Page, y = 600) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
}

test.describe('Sticky mobile CTA — visibilidad y scroll', () => {
  test('mobile, paso 2: oculto al inicio, visible tras scroll, oculto al volver arriba', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeHidden()

    await scrollDown(page, 600)
    await expect(sticky).toBeVisible()

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(sticky).toBeHidden()
  })

  test('desktop: nunca aparece, sin importar el scroll', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeHidden()
    await scrollDown(page, 800)
    await expect(sticky).toBeHidden()
  })
})

test.describe('Sticky mobile CTA — paso 1 (calculadora)', () => {
  test('mobile, paso 1: muestra "Ver mi oferta" sin botón Atrás', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })
    await scrollDown(page, 400)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await expect(sticky.getByRole('button', { name: /ver mi oferta/i })).toBeVisible()
    await expect(sticky.getByRole('button', { name: /atrás/i })).toHaveCount(0)
  })

  test('mobile, paso 1: el botón submit está vinculado al form del paso (mismo formId)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })
    await scrollDown(page, 400)

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /ver mi oferta/i })
    await expect(submitBtn).toHaveAttribute('type', 'submit')
    await expect(submitBtn).toHaveAttribute('form', ACTIVE_FORM_ID)
  })

  test('mobile, paso 1: click en sticky avanza al paso 2', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })
    await scrollDown(page, 400)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await sticky.getByRole('button', { name: /ver mi oferta/i }).click()
    await expect(page.getByText('Cuéntanos quién eres')).toBeVisible({
      timeout: 5_000,
    })
  })
})

test.describe('Sticky mobile CTA — pasos 2-6 (data steps)', () => {
  test('mobile, paso 2: contiene Atrás + Continuar y nada más', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })
    await scrollDown(page, 600)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await expect(sticky.getByRole('button', { name: /atrás/i })).toBeVisible()
    await expect(sticky.getByRole('button', { name: /continuar/i })).toBeVisible()
    await expect(sticky.getByText('$8,000')).toHaveCount(0)
  })

  test('mobile, paso 2: el botón Atrás navega al paso 1', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })
    await scrollDown(page, 600)

    await page.getByTestId('sticky-mobile-cta').getByRole('button', { name: /atrás/i }).click()
    await expect(page.getByText('¿Cuánto necesitas?')).toBeVisible({
      timeout: 5_000,
    })
  })

  test('mobile, paso 2: el botón Continuar tiene type=submit y form=paso-form-activo', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })
    await scrollDown(page, 600)

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /continuar/i })
    await expect(submitBtn).toHaveAttribute('type', 'submit')
    await expect(submitBtn).toHaveAttribute('form', ACTIVE_FORM_ID)
  })

  test('mobile: el FormActions inline (portal del paso 2) está oculto en mobile', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })

    const inlineSubmit = page
      .locator('button[type="submit"][form="paso-form-activo"]')
      .filter({ hasNotText: '' })
      .first()
    // El inline existe en el DOM (portal) pero no debe estar visible en mobile.
    const visibles = await page
      .locator('button[type="submit"][form="paso-form-activo"]:visible')
      .count()
    // Si el sticky NO está visible (sin scroll), no hay submits visibles.
    expect(visibles).toBe(0)
    void inlineSubmit
  })
})

test.describe('Sticky mobile CTA — paso 7 (revisión)', () => {
  test('mobile, paso 7: muestra "Enviar solicitud" y deshabilitado sin checkboxes', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 7)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })
    await scrollDown(page, 400)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    const submitBtn = sticky.getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeDisabled()
    await expect(sticky.getByRole('button', { name: /atrás/i })).toBeVisible()
  })

  test('mobile, paso 7: se habilita después de aceptar privacidad y términos', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 7)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // Aceptar ambos checkboxes (los del paso 7 viven en ConsentimientosSection)
    const checks = page.locator('button[role="checkbox"]')
    await checks.nth(0).click()
    await checks.nth(1).click()

    await scrollDown(page, 400)
    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await expect(sticky.getByRole('button', { name: /enviar solicitud/i })).toBeEnabled()
  })

  test('mobile, paso 7: el botón submit está vinculado al form del paso', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 7)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })
    await scrollDown(page, 400)

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toHaveAttribute('type', 'submit')
    await expect(submitBtn).toHaveAttribute('form', ACTIVE_FORM_ID)
  })
})
