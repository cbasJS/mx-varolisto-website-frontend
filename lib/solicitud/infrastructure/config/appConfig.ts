// Internal lead capture form route
export const CTA_URL = '/solicitar'

// Routes that use the dark (navy) header variant
export const DARK_HEADER_ROUTES = [CTA_URL]

// React Query stale time for generic reference data (ms)
export const QUERY_STALE_TIME_MS = 60_000

// Colonias/CP data rarely changes — cache for 24 h in memory and sessionStorage
export const COLONIAS_STALE_TIME_MS = 24 * 60 * 60 * 1_000

// WhatsApp number in international format, without + or spaces
export const WHATSAPP_NUMBER = '+525650456534'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const CONTACT_EMAIL = 'contacto@varolisto.mx'

export const BRAND_NAME = 'VaroListo.mx'

// Height of the fixed navbar in px — used for scroll offset calculations
export const NAVBAR_HEIGHT = 72
