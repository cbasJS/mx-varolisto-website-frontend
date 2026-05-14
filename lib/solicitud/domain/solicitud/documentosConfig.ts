export const MAX_COMPROBANTES_INGRESO = 3

export const MAX_SIZE_IMAGEN_BYTES = 15 * 1024 * 1024
export const MAX_SIZE_PDF_BYTES = 15 * 1024 * 1024
// PDFs < 50 KB suelen estar vacíos o dañados. Filtro defensivo antes de pagar
// el costo de pdfjs y antes del envío al backend.
export const MIN_SIZE_PDF_BYTES = 50 * 1024

// Conteo máximo de páginas por contexto (validatePDF con pdfjs):
// - INE/pasaporte: 2 hojas como mucho.
// - Comprobantes (ingreso o domicilio): 3 hojas. El usuario divide en
//   varios archivos cuando excede (MAX_COMPROBANTES_INGRESO da hasta 3
//   PDFs separados para ingresos).
export const PDF_MAX_PAGES_IDENTIDAD = 2
export const PDF_MAX_PAGES_COMPROBANTE = 3
