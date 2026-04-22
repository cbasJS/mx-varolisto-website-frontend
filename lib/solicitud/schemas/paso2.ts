import { z } from "zod"

export const paso2Schema = z
  .object({
    montoSolicitado: z
      .number({ error: () => "Ingresa un monto válido" })
      .min(2000, "Mínimo $2,000")
      .max(20000, "Máximo $20,000"),
    plazoMeses: z.enum(["2", "3", "4", "5", "6"], {
      error: () => "Selecciona un plazo",
    }),
    primerCredito: z.enum(["si", "no"], { error: () => "Selecciona una opción" }),
    destinoPrestamo: z.enum(
      [
        "liquidar_deuda",
        "capital_trabajo",
        "gasto_medico",
        "equipo_trabajo",
        "mejora_hogar",
        "educacion",
        "gasto_familiar",
        "viaje_evento",
        "otro",
      ],
      { error: () => "Selecciona un destino" }
    ),
    destinoOtro: z.string().optional(),
  })
  .refine(
    (data) =>
      data.destinoPrestamo !== "otro" ||
      (data.destinoOtro && data.destinoOtro.trim().length > 0),
    {
      message: "Describe el destino del préstamo",
      path: ["destinoOtro"],
    }
  )

export type Paso2Data = z.infer<typeof paso2Schema>
