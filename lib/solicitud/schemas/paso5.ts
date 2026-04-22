import { z } from "zod"
import { zStr } from "./paso1"
import { validateClabe } from "@/lib/clabe-validator"

export const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "application/pdf"]
export const MAX_TAMANO = 10 * 1024 * 1024 // 10 MB

export const paso5Schema = z.object({
  comprobantes: z
    .array(z.custom<File>())
    .min(2, "Sube al menos 2 archivos")
    .max(5, "Máximo 5 archivos")
    .refine(
      (files) => files.every((f) => (f as File).size <= MAX_TAMANO),
      "Cada archivo debe pesar máximo 10 MB"
    )
    .refine(
      (files) => files.every((f) => TIPOS_PERMITIDOS.includes((f as File).type)),
      "Solo se permiten archivos JPG, PNG o PDF"
    ),
  clabe: zStr()
    .regex(/^\d{18}$/, "La CLABE debe tener 18 dígitos")
    .refine(validateClabe, "CLABE inválida. Verifica que no sea el número de tu tarjeta."),
})

export type Paso5Data = z.infer<typeof paso5Schema>
