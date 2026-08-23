// Re-exports from shared-schemas v0.15.0
// UI step order (compromiso primero, MVP scoring v7 — Bloque 1):
//   UI Paso 1 → schema paso2 (préstamo)
//   UI Paso 2 → schema paso1 (identidad)
//   UI Paso 3 → schema paso3 (domicilio)
//   UI Paso 4 → schema paso4 (situación económica)
//   UI Paso 5 → schema paso5 (referencias — array, 1 obligatoria + N opcionales)
//   UI Paso 6 → schema paso7 (revisión/consentimientos)
//
// El paso de documentos del wizard quedó deprecado en Bloque 1: el formulario
// público ya no captura archivos. paso6Schema se conserva exportado para
// reuso futuro como página standalone de carga (liga por WhatsApp).

export {
  paso1Schema,
  paso2Schema,
  paso3Schema,
  paso4Schema,
  paso5Schema,
  paso6Schema,
  paso7Schema,
  referenciaSchema,
  solicitudSchema,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@varolisto/shared-schemas/form'

export type {
  Paso1Data,
  Paso2Data,
  Paso3Data,
  Paso4Data,
  Paso5Data,
  Paso6Data,
  Paso7Data,
  Referencia,
  SolicitudCompleta,
} from '@varolisto/shared-schemas/form'

export { zStr } from '@varolisto/shared-schemas'
