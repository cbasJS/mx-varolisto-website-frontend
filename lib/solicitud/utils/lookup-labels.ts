import type {
  Antiguedad,
  Sexo,
  DestinoPrestamo,
  TipoActividad,
  CantidadDeudas,
  MontoTotalDeudas,
  RelacionReferencia,
  AniosViviendo,
  TipoVivienda,
  EstadoCivil,
  DependientesEconomicos,
  TipoIdentificacion,
} from "@varolisto/shared-schemas/enums"

// ── Labels planos (usados en Paso7Revision) ──────────────────────────────────

export const ANTIGUEDAD_LABELS: Record<Antiguedad, string> = {
  menos_1:   "Menos de 1 año",
  uno_a_dos: "1–2 años",
  mas_2:     "Más de 2 años",
}

export const DESTINO_LABELS: Record<DestinoPrestamo, string> = {
  liquidar_deuda: "Liquidar una deuda",
  capital_trabajo: "Capital de trabajo",
  gasto_medico: "Gasto médico",
  equipo_trabajo: "Equipo de trabajo",
  mejora_hogar: "Mejora del hogar",
  educacion: "Educación",
  gasto_familiar: "Gasto familiar",
  viaje_evento: "Viaje o evento",
  otro: "Otro",
}

export const ACTIVIDAD_LABELS: Record<TipoActividad, string> = {
  empleado_formal: "Empleado formal",
  empleado_informal: "Empleado informal",
  negocio_propio: "Negocio propio",
  independiente: "Por cuenta propia",
  otro: "Otro",
}

export const RELACION_LABELS: Record<RelacionReferencia, string> = {
  familiar: "Familiar",
  trabajo: "Trabajo",
  amigo: "Amigo",
  otro: "Otro",
}

export const ANIOS_VIVIENDO_LABELS: Record<AniosViviendo, string> = {
  menos_de_1:  "Menos de 1 año",
  entre_1_y_2: "1 – 2 años",
  entre_3_y_5: "3 – 5 años",
  mas_de_5:    "Más de 5 años",
}

export const TIPO_VIVIENDA_LABELS: Record<TipoVivienda, string> = {
  propia:     "Propia",
  rentada:    "Rentada",
  de_familiar: "De un familiar",
}

export const ESTADO_CIVIL_LABELS: Record<EstadoCivil, string> = {
  soltero:     "Soltero/a",
  casado:      "Casado/a",
  union_libre: "Unión libre",
  divorciado:  "Divorciado/a",
  viudo:       "Viudo/a",
}

export const DEPENDIENTES_LABELS: Record<DependientesEconomicos, string> = {
  ninguno:      "Ninguno",
  uno:          "1",
  dos:          "2",
  tres:         "3",
  cuatro_o_mas: "4 o más",
}

export const TIPO_IDENTIFICACION_LABELS: Record<TipoIdentificacion, string> = {
  ine:       "INE / IFE",
  pasaporte: "Pasaporte mexicano",
}

// ── Meta objects con icono (usados en los componentes de pasos) ───────────────

export const SEXO_META: Record<Sexo, { label: string; icono: string }> = {
  M: { label: "Hombre",            icono: "man" },
  F: { label: "Mujer",             icono: "woman" },
  X: { label: "Prefiero no decir", icono: "person" },
}

export const DESTINOS_META: Record<DestinoPrestamo, { label: string; icono: string }> = {
  liquidar_deuda: { label: "Liquidar una deuda", icono: "sync_alt" },
  capital_trabajo: { label: "Capital de trabajo", icono: "store" },
  gasto_medico:   { label: "Gasto médico",        icono: "local_hospital" },
  equipo_trabajo: { label: "Equipo de trabajo",   icono: "build" },
  mejora_hogar:   { label: "Mejora del hogar",    icono: "home_repair_service" },
  educacion:      { label: "Educación",           icono: "school" },
  gasto_familiar: { label: "Gasto familiar",      icono: "family_restroom" },
  viaje_evento:   { label: "Viaje o evento",      icono: "flight" },
  otro:           { label: "Otro",                icono: "more_horiz" },
}

export const ACTIVIDADES_META: Record<TipoActividad, { label: string; icono: string; hint: string }> = {
  empleado_formal:   { label: "Empleado formal",    icono: "badge",      hint: "Con comprobante de nómina" },
  empleado_informal: { label: "Empleado informal",  icono: "handshake",  hint: "Sin contrato" },
  negocio_propio:    { label: "Negocio propio",      icono: "store",      hint: "Dueño de negocio" },
  independiente:     { label: "Por cuenta propia",   icono: "laptop_mac", hint: "Honorarios" },
  otro:              { label: "Otro",                icono: "more_horiz", hint: "" },
}

export const CANTIDAD_DEUDAS_META: Record<CantidadDeudas, string> = {
  sin_deudas: "Sin deudas",
  una_deuda:  "1 deuda",
  dos_deudas: "2 deudas",
  tres_o_mas: "3 o más",
}

export const ANTIGUEDAD_META: Record<Antiguedad, string> = {
  menos_1:   "Menos de 1 año",
  uno_a_dos: "Entre 1 y 2 años",
  mas_2:     "Más de 2 años",
}

export const MONTO_TOTAL_DEUDAS_META: Record<MontoTotalDeudas, string> = {
  menos_5k: "Menos de $5,000",
  "5k_15k": "$5,000 – $15,000",
  "15k_30k": "$15,000 – $30,000",
  mas_30k:  "Más de $30,000",
}

export const RELACIONES_META: Record<RelacionReferencia, string> = RELACION_LABELS

// ── Constantes de documentos (usadas en usePaso6) ────────────────────────────

export const COPY_DOCUMENTOS: Record<string, string> = {
  empleado_formal:
    "Al menos 2 comprobantes de nómina / estados de cuenta de los últimos 3 meses.",
  negocio_propio:
    "Al menos 2 estados de cuenta con depósitos de los últimos 3 meses. También puedes incluir recibos de proveedores o fotos de tu negocio.",
  empleado_informal:
    "Al menos 2 estados de cuenta con depósitos de los últimos 3 meses.",
  independiente:
    "Estados de cuenta de los últimos 3 meses o comprobantes de depósitos por honorarios.",
}

export const MIN_COMPROBANTES: Record<string, number> = {
  empleado_formal: 2,
  negocio_propio: 2,
  empleado_informal: 2,
  independiente: 2,
}

export const TIPOS_SIN_BANCO = ["negocio_propio", "empleado_informal", "otro"] as const

export const COPY_ALTERNATIVOS: Record<string, string> = {
  negocio_propio:
    "Puedes subir fotos de tu negocio o mercancía, notas de venta, facturas a proveedores, comprobantes de pago a distribuidores, o cualquier documento que muestre la actividad de tu negocio.",
  empleado_informal:
    "Puedes subir una carta de tu empleador, fotos de recibos de pago en efectivo, notas de venta en las que aparezca tu nombre, o cualquier otro comprobante de tus ingresos.",
  otro:
    "Puedes subir cualquier documento que muestre tus ingresos: recibos de pago, transferencias, capturas de depósitos, notas de venta, o fotos de tu actividad económica.",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function maskClabe(clabe: string): string {
  return `••••••••••••${clabe.slice(-4)}`
}
