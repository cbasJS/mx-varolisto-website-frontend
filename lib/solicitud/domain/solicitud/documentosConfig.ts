export const MAX_COMPROBANTES_INGRESO = 3

export const MAX_SIZE_IMAGEN_BYTES = 15 * 1024 * 1024
export const MAX_SIZE_PDF_BYTES = 15 * 1024 * 1024

// Conteo máximo de páginas por contexto (validatePDF con pdfjs):
// - INE/pasaporte: 2 hojas como mucho.
// - Comprobante de ingresos: 20 hojas. Cubre estados de cuenta de banca
//   tradicional (BBVA, Santander, Banorte, Banamex) de hasta 2-3 meses
//   en un solo PDF (4-8 pp/mes × 3 meses).
// - Comprobante de domicilio: 3 hojas. Recibo de servicio típico (CFE,
//   Telmex, agua, predial, etc.) cabe en 1-3 hojas.
export const PDF_MAX_PAGES_IDENTIDAD = 2
export const PDF_MAX_PAGES_INGRESOS = 20
export const PDF_MAX_PAGES_DOMICILIO = 3
