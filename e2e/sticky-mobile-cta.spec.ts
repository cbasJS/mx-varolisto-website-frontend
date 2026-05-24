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
  test('mobile, paso 1: alwaysVisible + crossfade — visible desde el inicio, se oculta al fondo', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })

    const sticky = page.getByTestId('sticky-mobile-cta')
    // Top sin scroll — sticky visible (alwaysVisible bypassa el threshold).
    await expect(sticky).toBeVisible()
    // Scroll medio — sigue visible.
    await scrollDown(page, 200)
    await expect(sticky).toBeVisible()
    // Fondo — sticky se oculta (crossfade hacia inline).
    await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }))
    await expect(sticky).toBeHidden()
  })

  test('mobile, paso 1: muestra "Ver mi oferta" sin botón Atrás', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await expect(sticky.getByRole('button', { name: /ver mi oferta/i })).toBeVisible()
    await expect(sticky.getByRole('button', { name: /atrás/i })).toHaveCount(0)
  })

  test('mobile, paso 1: el botón submit tiene cta-shimmer (animación premium)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /ver mi oferta/i })
    await expect(submitBtn).toBeVisible()
    const className = await submitBtn.getAttribute('class')
    expect(className).toContain('cta-shimmer')
  })

  test('mobile, paso 1: el botón submit está vinculado al form del paso (mismo formId)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 1)
    await page.waitForSelector('text=¿Cuánto necesitas?', { timeout: 15_000 })

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

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await sticky.getByRole('button', { name: /ver mi oferta/i }).click({ force: true })
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
    // Scroll mínimo para activar el sticky sin llegar al sentinel del fondo
    // (donde aparecerían los inline y se ocultaría el sticky).
    await scrollDown(page, 200)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    // Click programático para evitar interferencia del overlay dev de Next.js
    // (badge "N") sobre la esquina inferior izquierda en mobile.
    await sticky
      .getByRole('button', { name: /atrás/i })
      .evaluate((el) => (el as HTMLButtonElement).click())
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

  test('mobile: el FormActions inline (portal del paso 2) está oculto vía opacity', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })

    // El inline reserva su espacio siempre (no usa display:none) — para evitar
    // layout shifts que romperían el IntersectionObserver. Sin scroll, el
    // sticky no está montado, queda solo el inline con su wrapper en
    // opacity:0 y pointer-events:none. Subo dos niveles para llegar al
    // wrapper que aplica opacity (FormActions tiene su propio div interior
    // que envuelve los botones).
    const inlineSubmit = page.locator('button[type="submit"][form="paso-form-activo"]').first()
    const wrapperOpacity = await inlineSubmit.evaluate((btn) => {
      let el: HTMLElement | null = btn.parentElement
      while (el) {
        const op = window.getComputedStyle(el).opacity
        if (op === '0') return op
        el = el.parentElement
      }
      return null
    })
    expect(wrapperOpacity).toBe('0')
  })
})

test.describe('Sticky mobile CTA — paso 6 (revisión)', () => {
  test('mobile, paso 6: muestra "Enviar solicitud" y deshabilitado sin checkboxes', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })
    await scrollDown(page, 200)

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    const submitBtn = sticky.getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeDisabled()
    await expect(sticky.getByRole('button', { name: /atrás/i })).toBeVisible()
  })

  test('mobile, paso 6: se habilita después de aceptar privacidad y términos', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // Aceptar ambos checkboxes (Radix button[role=checkbox]). Disparamos el
    // click programáticamente para evitar layout shifts del sticky e
    // interferencia del nextjs-portal en mobile dev.
    await page
      .locator('button[role="checkbox"]')
      .nth(0)
      .evaluate((el) => (el as HTMLButtonElement).click())
    await page
      .locator('button[role="checkbox"]')
      .nth(1)
      .evaluate((el) => (el as HTMLButtonElement).click())

    // Posición intermedia donde el sticky es visible (lejos del sentinel).
    await scrollDown(page, 200)
    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()
    await expect(sticky.getByRole('button', { name: /enviar solicitud/i })).toBeEnabled()
  })

  test('mobile, paso 6: el botón submit está vinculado al form del paso', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })
    await scrollDown(page, 200)

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toHaveAttribute('type', 'submit')
    await expect(submitBtn).toHaveAttribute('form', ACTIVE_FORM_ID)
  })

  test('mobile, paso 6: el botón "Enviar solicitud" usa verde varolisto (#2ECC71)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })
    await scrollDown(page, 200)

    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toBeVisible()
    const bg = await submitBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // secondary = #2ECC71 → rgb(46, 204, 113)
    expect(bg).toBe('rgb(46, 204, 113)')
  })

  test('mobile, paso 6: el botón submit del sticky tiene cta-shimmer', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // Aceptar checkboxes para que el botón se habilite (shimmer solo aplica
    // cuando el botón está habilitado — disabled no tiene animación).
    await page
      .locator('button[role="checkbox"]')
      .nth(0)
      .evaluate((el) => (el as HTMLButtonElement).click())
    await page
      .locator('button[role="checkbox"]')
      .nth(1)
      .evaluate((el) => (el as HTMLButtonElement).click())

    await scrollDown(page, 200)
    const submitBtn = page
      .getByTestId('sticky-mobile-cta')
      .getByRole('button', { name: /enviar solicitud/i })
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeEnabled()
    const className = await submitBtn.getAttribute('class')
    expect(className).toContain('cta-shimmer')
  })
})

test.describe('Sticky mobile CTA — crossfade con CTAs inline al fondo', () => {
  test('mobile, paso 2: al llegar al fondo del form, sticky se oculta y inline aparece', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 2)
    await page.waitForSelector('text=Cuéntanos quién eres', { timeout: 15_000 })

    // Scroll al fondo de la página para que el actionsSlot entre al viewport.
    await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }))

    // El sticky desaparece.
    await expect(page.getByTestId('sticky-mobile-cta')).toBeHidden()

    // Los inline (portal del FormActions) ahora son visibles en mobile.
    const inlineSubmits = page.locator('button[type="submit"][form="paso-form-activo"]:visible')
    await expect(inlineSubmits).toHaveCount(1)
  })

  test('mobile, paso 6: alwaysVisible — sticky visible desde el inicio sin scroll', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // alwaysVisible bypassa el threshold de scroll — visible inmediatamente.
    await expect(page.getByTestId('sticky-mobile-cta')).toBeVisible()
  })

  test('mobile, paso 6: al llegar al fondo, sticky se oculta y inline aparece (crossfade)', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso(page, 6)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }))

    // alwaysVisible no bypassa el crossfade — al fondo, sticky se oculta
    // y los CTAs inline (mobile) toman el control.
    await expect(page.getByTestId('sticky-mobile-cta')).toBeHidden()
  })
})

test.describe('Paso 6 — CTAs durante el submit', () => {
  // Hidrata el store en paso 6 (revisión) con datos completos. Bloque 1: el
  // formulario público ya no captura archivos en línea, así que el store de
  // revisión no necesita archivosSubidos/tipoIdentificacion para que
  // Paso7Revision (renderizado en pasoActual === 6) no retroceda al montar.
  async function irAPaso7Completo(page: Page) {
    const SESSION = '00000000-0000-4000-a000-000000000777'
    await page.addInitScript(
      ({ key, session }) => {
        sessionStorage.setItem(
          key,
          JSON.stringify({
            state: {
              pasoActual: 6,
              datos: {
                montoSolicitado: 5000,
                plazoMeses: '3',
                destinoPrestamo: 'liquidar_deuda',
                nombre: 'María',
                apellidoPaterno: 'García',
                apellidoMaterno: 'López',
                sexo: 'F',
                fechaNacimiento: '1990-05-15',
                estadoCivil: 'soltero',
                dependientesEconomicos: 'ninguno',
                curp: 'GALM900515MDFXXX01',
                email: 'maria@example.com',
                telefono: '5512345678',
                codigoPostal: '06600',
                ciudad: 'Ciudad de México',
                estado: 'Ciudad de México',
                municipio: 'Cuauhtémoc',
                colonia: 'Juárez',
                calle: 'Insurgentes Sur',
                numeroExterior: '123',
                aniosViviendo: '5',
                tipoVivienda: 'rentada',
                tipoActividad: 'empleado_formal',
                nombreEmpleadorNegocio: 'ACME Corp',
                ingresoMensual: 15000,
                gastoMensual: 6500,
                tieneDeudas: 'no',
                referencias: [
                  { nombre: 'Juan Pérez', telefono: '5598765432', relacion: 'familiar' },
                  { nombre: 'Ana Torres', telefono: '5511112222', relacion: 'amigo' },
                ],
              },
              timestampInicio: Date.now(),
              coloniasCache: {},
              sessionUuid: session,
            },
            version: 0,
          }),
        )
      },
      { key: STORE_KEY, session: SESSION },
    )
    // Mock /api/solicitudes — queda colgado para mantener enviando=true
    await page.route('**/api/solicitudes', () => {
      /* never resolve */
    })
    await page.goto('/solicitar')
  }

  test('mobile, scrolled al fondo: CTAs inline siguen visibles con loading durante submit', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso7Completo(page)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    // Aceptar checkboxes ANTES de scrollear (evita que el focus mueva el scroll)
    const checkboxes = page.locator('button[role="checkbox"]')
    await checkboxes.nth(0).click()
    await checkboxes.nth(1).click()

    // Scroll al fondo → inlineRevealed=true → sticky oculto, inline visible
    await page.evaluate(() => window.scrollTo({ top: 99999, behavior: 'instant' }))
    await expect(page.getByTestId('sticky-mobile-cta')).toBeHidden()

    // Click submit en inline; el POST queda colgado → enviando=true
    const inlineSubmit = page
      .locator(`form#${ACTIVE_FORM_ID} > div.mt-8 button[type="submit"]`)
      .first()
    await inlineSubmit.click()

    // Durante el submit el inline DEBE seguir visible con su loading state
    await expect(page.getByText('Enviando tu solicitud…')).toBeVisible({ timeout: 3_000 })
    const inlineWrapper = page.locator(`form#${ACTIVE_FORM_ID} > div.mt-8`)
    const opacity = await inlineWrapper.evaluate((el) => window.getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
  })

  test('mobile, sin scroll: sticky CTA sigue visible con loading durante submit', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await irAPaso7Completo(page)
    await page.waitForSelector('text=Casi listo. Revisa todo', { timeout: 15_000 })

    const checkboxes = page.locator('button[role="checkbox"]')
    await checkboxes.nth(0).click()
    await checkboxes.nth(1).click()

    // Volver arriba (los clicks pueden mover el scroll por focus)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))

    const sticky = page.getByTestId('sticky-mobile-cta')
    await expect(sticky).toBeVisible()

    await sticky.locator('button[type="submit"]').click()

    // El sticky permanece visible mostrando el loading
    await expect(sticky).toBeVisible()
    await expect(sticky.getByText('Enviando tu solicitud…')).toBeVisible({ timeout: 3_000 })
  })
})
