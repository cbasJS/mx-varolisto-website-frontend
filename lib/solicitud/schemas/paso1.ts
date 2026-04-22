import { z } from "zod"

// Helper: campo de texto requerido con mensajes correctos en Zod 4.
export function zStr(msg = "Campo requerido") {
  return z.string().min(1, msg)
}

export const paso1Schema = z.object({
  nombre: zStr().min(2, "Mínimo 2 caracteres"),
  apellidoPaterno: zStr().min(2, "Mínimo 2 caracteres"),
  apellidoMaterno: zStr().min(2, "Mínimo 2 caracteres"),
  sexo: z.enum(["M", "F", "ND"], { error: () => "Selecciona una opción" }),
  fechaNacimiento: zStr("Selecciona una fecha")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido")
    .refine((val) => {
      const birth = new Date(val)
      const today = new Date()
      const age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      return age > 18 || (age === 18 && m >= 0)
    }, "Debes tener al menos 18 años"),
  curp: zStr()
    .length(18, "La CURP debe tener exactamente 18 caracteres")
    .regex(
      /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/,
      "Formato de CURP inválido"
    ),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  telefono: zStr()
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  codigoPostal: zStr()
    .regex(/^\d{5}$/, "El CP debe tener 5 dígitos"),
  colonia: zStr("Selecciona una colonia").min(1, "Selecciona una colonia"),
  municipio: zStr().min(2, "Mínimo 2 caracteres"),
  calle: zStr().min(2, "Mínimo 2 caracteres"),
  numeroExterior: zStr("Campo requerido").min(1, "Campo requerido"),
  numeroInterior: z.string().optional(),
})

export type Paso1Data = z.infer<typeof paso1Schema>
