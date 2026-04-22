import { z } from "zod"
import { zStr } from "./paso1"

export const paso3Schema = z
  .object({
    tipoActividad: z.enum(
      [
        "empleado_formal",
        "empleado_informal",
        "negocio_propio",
        "independiente",
        "otro",
      ],
      { error: () => "Selecciona una opción" }
    ),
    nombreEmpleadorNegocio: zStr().min(2, "Mínimo 2 caracteres"),
    antiguedad: z.enum(["menos_1", "uno_a_dos", "mas_2"], {
      error: () => "Selecciona una opción",
    }),
    ingresoMensual: z
      .number({ error: () => "Ingresa un ingreso válido" })
      .min(1000, "Mínimo $1,000"),
    tieneDeudas: z.enum(["si", "no"], { error: () => "Selecciona una opción" }),
    cantidadDeudas: z.enum(["1", "2", "3_o_mas"]).optional(),
    montoTotalDeudas: z
      .enum(["menos_5k", "5k_15k", "15k_30k", "mas_30k"])
      .optional(),
    pagoMensualDeudas: z.number().min(0).optional(),
  })
  .refine(
    (data) =>
      data.tieneDeudas !== "si" || data.cantidadDeudas !== undefined,
    {
      message: "Indica cuántas deudas tienes",
      path: ["cantidadDeudas"],
    }
  )
  .refine(
    (data) =>
      data.tieneDeudas !== "si" || data.montoTotalDeudas !== undefined,
    {
      message: "Indica el monto total de tus deudas",
      path: ["montoTotalDeudas"],
    }
  )
  .refine(
    (data) =>
      data.tieneDeudas !== "si" || data.pagoMensualDeudas !== undefined,
    {
      message: "Indica tu pago mensual",
      path: ["pagoMensualDeudas"],
    }
  )

export type Paso3Data = z.infer<typeof paso3Schema>
