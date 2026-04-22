import { z } from "zod"
import { validateClabe } from "./clabe-validator"

// Helper: campo de texto requerido con mensajes correctos en Zod 4.
// Muestra msg cuando el valor está ausente/vacío; deja pasar los mensajes
// de las validaciones encadenadas (.min, .regex, .email, etc.) intactos.
function zStr(msg = "Campo requerido") {
  return z.string().min(1, msg)
}

// ─── Paso 1 — Datos Personales ───────────────────────────────────────────────

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

// ─── Paso 2 — Solicitud ──────────────────────────────────────────────────────

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

// ─── Paso 3 — Situación Económica ────────────────────────────────────────────

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

// ─── Paso 4 — Referencias ────────────────────────────────────────────────────

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

// ─── Paso 5 — Documentos ─────────────────────────────────────────────────────

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "application/pdf"]
const MAX_TAMANO = 10 * 1024 * 1024 // 10 MB

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

// ─── Paso 6 — Revisión y aceptación ─────────────────────────────────────────

export const paso6Schema = z.object({
  aceptaPrivacidad: z.literal(true, {
    error: () => "Debes aceptar el Aviso de Privacidad",
  }),
  aceptaTerminos: z.literal(true, {
    error: () => "Debes aceptar los Términos y Condiciones",
  }),
})

export type Paso6Data = z.infer<typeof paso6Schema>

// ─── Schema completo ─────────────────────────────────────────────────────────

export const solicitudSchema = paso1Schema
  .and(paso2Schema)
  .and(paso3Schema)
  .and(paso4Schema)
  .and(paso5Schema)
  .and(paso6Schema)

export type SolicitudCompleta = z.infer<typeof solicitudSchema>
