// Re-exports from shared-schemas v0.6.0
// UI step order (compromiso primero):
//   UI Paso 1 → schema paso2 (préstamo)
//   UI Paso 2 → schema paso1 (identidad)
//   UI Paso 3 → schema paso3 (domicilio)
//   UI Paso 4 → schema paso4 (situación económica)
//   UI Paso 5 → schema paso5 (referencias)
//   UI Paso 6 → schema paso6 (documentos)
//   UI Paso 7 → schema paso7 (revisión/consentimientos)

export {
  paso1Schema,
  paso2Schema,
  paso3Schema,
  paso4Schema,
  paso5Schema,
  paso6Schema,
  paso7Schema,
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
  SolicitudCompleta,
} from '@varolisto/shared-schemas/form'

export { zStr } from '@varolisto/shared-schemas'
