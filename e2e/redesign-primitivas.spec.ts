import { test, expect, type Page } from '@playwright/test'

const STORE_KEY = 'vl-solicitud'

async function setStoreEnPaso2(page: Page) {
  const STORE = {
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
  }
  await page.addInitScript((store) => {
    sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
  }, STORE)
  await page.goto('/solicitar')
  await page.waitForSelector('text=Cuéntanos sobre ti', { timeout: 15_000 })
}

test.describe('Rediseño /solicitar — Primitivas (FloatingInput, PillOption)', () => {
  test('FloatingInput: el wrapper del input tiene rounded-full y border-2', async ({ page }) => {
    await setStoreEnPaso2(page)
    const input = page.locator('input[name=nombre]')
    const wrapper = input.locator('xpath=ancestor::*[contains(@class,"rounded-full")][1]')
    await expect(wrapper).toBeVisible()
    const radius = await wrapper.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).borderRadius),
    )
    const borderWidth = await wrapper.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).borderTopWidth),
    )
    expect(radius).toBeGreaterThan(100) // rounded-full ≈ 9999px
    expect(borderWidth).toBe(2)
  })

  test('FloatingInput: la label "Nombre(s)" es uppercase y está sobre el input', async ({
    page,
  }) => {
    await setStoreEnPaso2(page)
    const label = page.locator('label').filter({ hasText: 'Nombre(s)' }).first()
    await expect(label).toBeVisible()
    const tt = await label.evaluate((el) => window.getComputedStyle(el).textTransform)
    expect(tt).toBe('uppercase')
  })

  test('FloatingInput: el campo CURP muestra contador 0/18 dentro del label', async ({ page }) => {
    await setStoreEnPaso2(page)
    const curpLabel = page.locator('label').filter({ hasText: 'CURP' })
    await expect(curpLabel.getByText('0/18')).toBeVisible()
  })

  test('PillOption: las pills de Sexo son rounded-full', async ({ page }) => {
    await setStoreEnPaso2(page)
    const pillHombre = page.getByRole('button', { name: /^Hombre$/i }).first()
    await expect(pillHombre).toBeVisible()
    const radius = await pillHombre.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).borderRadius),
    )
    expect(radius).toBeGreaterThan(100)
  })

  test('NO se muestran los trust badges legacy en paso 2', async ({ page }) => {
    await setStoreEnPaso2(page)
    await expect(page.getByText('Datos encriptados')).toHaveCount(0)
    await expect(page.getByText('100% seguro')).toHaveCount(0)
    await expect(page.getByText('Soporte en 24h')).toHaveCount(0)
  })

  test('DatePickerInput "Fecha de nacimiento" usa label uppercase ABOVE (no floating)', async ({
    page,
  }) => {
    await setStoreEnPaso2(page)
    const label = page.locator('label').filter({ hasText: 'Fecha de nacimiento' }).first()
    await expect(label).toBeVisible()
    const tt = await label.evaluate((el) => window.getComputedStyle(el).textTransform)
    expect(tt).toBe('uppercase')
    // NO debe ser floating (position: absolute)
    const position = await label.evaluate((el) => window.getComputedStyle(el).position)
    expect(position).not.toBe('absolute')
  })

  test('FormActions: botón Atrás no tiene icono material-symbols (solo texto, igual que Figma)', async ({
    page,
  }) => {
    await setStoreEnPaso2(page)
    const atrasBtn = page.getByRole('button', { name: /^Atrás$/ })
    await expect(atrasBtn).toBeVisible()
    await expect(atrasBtn.locator('.material-symbols-outlined')).toHaveCount(0)
  })
})

test.describe('Rediseño /solicitar — counters fuera del input en pasos 3+', () => {
  async function setStoreEnPaso3(page: Page) {
    const STORE = {
      state: {
        pasoActual: 3,
        datos: {
          montoSolicitado: 5000,
          plazoMeses: '4',
          destinoPrestamo: 'liquidar_deuda',
          nombre: 'María',
          apellidoPaterno: 'García',
          apellidoMaterno: 'López',
          sexo: 'F',
          fechaNacimiento: '1990-05-15',
          curp: 'GALM900515MDFXXX01',
          email: 'maria@example.com',
          telefono: '5512345678',
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
    await page.waitForSelector('text=Tu domicilio', { timeout: 15_000 })
  }

  test('Paso 3 CP: contador 0/5 dentro del label (no del input)', async ({ page }) => {
    await setStoreEnPaso3(page)
    const cpLabel = page.locator('label').filter({ hasText: 'Código postal' })
    await expect(cpLabel.getByText('0/5')).toBeVisible()
  })
})

test.describe('Rediseño /solicitar — fixes Fase 2.2 (Sexo grid + Colonia label-above)', () => {
  async function setStoreEnPaso2(page: Page) {
    const STORE = {
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
    }
    await page.addInitScript((store) => {
      sessionStorage.setItem('vl-solicitud', JSON.stringify(store))
    }, STORE)
    await page.goto('/solicitar')
    await page.waitForSelector('text=Cuéntanos sobre ti', { timeout: 15_000 })
  }

  async function setStoreEnPaso3WithCP(page: Page) {
    const STORE = {
      state: {
        pasoActual: 3,
        datos: {
          montoSolicitado: 5000,
          plazoMeses: '4',
          destinoPrestamo: 'liquidar_deuda',
          nombre: 'María',
          apellidoPaterno: 'García',
          apellidoMaterno: 'López',
          sexo: 'F',
          fechaNacimiento: '1990-05-15',
          curp: 'GALM900515MDFXXX01',
          email: 'maria@example.com',
          telefono: '5512345678',
          codigoPostal: '06600',
          colonia: 'Roma Norte',
          municipio: 'Cuauhtémoc',
          estado: 'Ciudad de México',
          ciudad: 'Ciudad de México',
        },
        timestampInicio: Date.now(),
        coloniasCache: {
          '06600': [
            {
              response: {
                asentamiento: 'Roma Norte',
                municipio: 'Cuauhtémoc',
                estado: 'Ciudad de México',
                ciudad: 'Ciudad de México',
                tipo_asentamiento: 'Colonia',
              },
            },
          ],
        },
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
    await page.waitForSelector('text=Tu domicilio', { timeout: 15_000 })
  }

  test('mobile: las pills de Sexo se apilan verticalmente (no en una fila)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await setStoreEnPaso2(page)
    const pillHombre = page.getByRole('button', { name: /^Hombre$/i }).first()
    const pillMujer = page.getByRole('button', { name: /^Mujer$/i }).first()
    const hombreBox = await pillHombre.boundingBox()
    const mujerBox = await pillMujer.boundingBox()
    expect(hombreBox).not.toBeNull()
    expect(mujerBox).not.toBeNull()
    // En mobile están en filas distintas → mujer.y > hombre.y + hombre.height/2
    expect(mujerBox!.y).toBeGreaterThan(hombreBox!.y + 10)
  })

  test('Paso 3 Colonia: el label "Colonia" es uppercase ABOVE (no floating)', async ({ page }) => {
    await setStoreEnPaso3WithCP(page)
    // Buscar el label de Colonia (puede ser <p> en FloatingSelect o <label>)
    const coloniaLabel = page
      .locator('p, label')
      .filter({ hasText: /^Colonia/ })
      .first()
    await expect(coloniaLabel).toBeVisible()
    const tt = await coloniaLabel.evaluate((el) => window.getComputedStyle(el).textTransform)
    const position = await coloniaLabel.evaluate((el) => window.getComputedStyle(el).position)
    expect(tt).toBe('uppercase')
    expect(position).not.toBe('absolute')
  })
})
