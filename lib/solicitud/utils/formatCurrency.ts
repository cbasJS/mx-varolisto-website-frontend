/** Inicializa el display a partir de un número guardado en el store. */
export function initCurrencyDisplay(num: number | undefined): string {
  if (num === undefined || num === null) return ''
  return num.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Maneja el onChange de un input de moneda. Devuelve el texto a mostrar y el número parseado. */
export function formatCurrencyOnChange(raw: string): { display: string; num: number | undefined } {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const endsWithDot = cleaned.endsWith('.')
  const num = parseFloat(cleaned)

  if (!isNaN(num)) {
    const [intPart, decPart] = cleaned.split('.')
    const formattedInt = parseInt(intPart || '0', 10).toLocaleString('es-MX')
    let display: string
    if (endsWithDot) {
      display = `${formattedInt}.`
    } else if (decPart !== undefined) {
      display = `${formattedInt}.${decPart}`
    } else {
      display = formattedInt
    }
    return { display, num }
  }

  if (cleaned === '' || cleaned === '.') {
    return { display: cleaned, num: undefined }
  }

  return { display: raw, num: undefined }
}

function parseDisplay(display: string): number | undefined {
  const n = parseFloat(display.replace(/,/g, ''))
  return isNaN(n) ? undefined : n
}

/** Maneja el onBlur: formatea con 2 decimales fijos. */
export function formatCurrencyOnBlur(display: string): string {
  const num = parseDisplay(display)
  if (num !== undefined) {
    return num.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return display
}

/** Maneja el onFocus: quita el .00 del blur para edición más cómoda. */
export function formatCurrencyOnFocus(display: string): string {
  const num = parseDisplay(display)
  if (num !== undefined) {
    return num.toLocaleString('es-MX')
  }
  return display
}
