export { zStr, paso1Schema } from "./paso1"
export type { Paso1Data } from "./paso1"
export { paso2Schema } from "./paso2"
export type { Paso2Data } from "./paso2"
export { paso3Schema } from "./paso3"
export type { Paso3Data } from "./paso3"
export { paso4Schema } from "./paso4"
export type { Paso4Data } from "./paso4"
export { paso5Schema, TIPOS_PERMITIDOS, MAX_TAMANO } from "./paso5"
export type { Paso5Data } from "./paso5"
export { paso6Schema } from "./paso6"
export type { Paso6Data } from "./paso6"

import { paso1Schema } from "./paso1"
import { paso2Schema } from "./paso2"
import { paso3Schema } from "./paso3"
import { paso4Schema } from "./paso4"
import { paso5Schema } from "./paso5"
import { paso6Schema } from "./paso6"

export const solicitudSchema = paso1Schema
  .and(paso2Schema)
  .and(paso3Schema)
  .and(paso4Schema)
  .and(paso5Schema)
  .and(paso6Schema)

export type SolicitudCompleta = import("zod").infer<typeof solicitudSchema>
