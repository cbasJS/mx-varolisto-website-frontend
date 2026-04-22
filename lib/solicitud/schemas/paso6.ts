import { z } from "zod"

export const paso6Schema = z.object({
  aceptaPrivacidad: z.literal(true, {
    error: () => "Debes aceptar el Aviso de Privacidad",
  }),
  aceptaTerminos: z.literal(true, {
    error: () => "Debes aceptar los Términos y Condiciones",
  }),
})

export type Paso6Data = z.infer<typeof paso6Schema>
