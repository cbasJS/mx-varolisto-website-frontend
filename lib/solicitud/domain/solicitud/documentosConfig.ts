export const MAX_COMPROBANTES_INGRESO = 3

export const MAX_SIZE_IMAGEN_BYTES = 15 * 1024 * 1024
export const MAX_SIZE_PDF_BYTES = 15 * 1024 * 1024
// PDFs < 50 KB suelen estar vacíos o dañados. Filtro defensivo antes de pagar
// el costo de pdfjs (Fase C) o el envío al backend.
export const MIN_SIZE_PDF_BYTES = 50 * 1024

export const PDF_MAX_PAGES_DOMICILIO = 5
export const PDF_MAX_PAGES_INGRESOS = 15
// Fase C añade conteo real con pdfjs; estas constantes definen el techo por
// contexto cuando ese check se active.
export const PDF_MAX_PAGES_IDENTIDAD = 2
export const PDF_MAX_PAGES_COMPROBANTE = 3

// Textract recomienda ≥25 px de alto por carácter para extracción confiable;
// a 800 px de lado corto el texto chico del INE (CURP, fecha) cae sobre ese
// piso. 600 px dejaba pasar fotos que el OCR luego marcaba con baja confianza.
export const RESOLUCION_MIN_IDENTIDAD_PX = 800
export const RESOLUCION_MIN_DOMICILIO_PX = 800

// Lado largo / lado corto > 3 → rechazo. Evita que una franja recortada
// (p.ej. 4000×500) pase el filtro de resolución y llegue al OCR como basura.
export const ASPECT_RATIO_MAX = 3
