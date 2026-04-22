import { z } from "zod"
import { zStr } from "./paso1"

export const paso4Schema = z
  .object({
    ref1Nombre: zStr().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/, "Solo se permiten letras"),
    ref1Telefono: zStr()
      .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
    ref1Relacion: z.enum(["familiar", "trabajo", "amigo", "otro"], {
      error: () => "Selecciona una relación",
    }),
    ref1Email: z
      .string()
      .max(100, "Máximo 100 caracteres")
      .email("Correo inválido")
      .optional()
      .or(z.literal("")),
    ref2Nombre: zStr().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/, "Solo se permiten letras"),
    ref2Telefono: zStr()
      .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
    ref2Relacion: z.enum(["familiar", "trabajo", "amigo", "otro"], {
      error: () => "Selecciona una relación",
    }),
    ref2Email: z
      .string()
      .max(100, "Máximo 100 caracteres")
      .email("Correo inválido")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.ref1Telefono !== data.ref2Telefono, {
    message: "El teléfono de la segunda referencia no puede ser igual al primero",
    path: ["ref2Telefono"],
  })

export type Paso4Data = z.infer<typeof paso4Schema>
