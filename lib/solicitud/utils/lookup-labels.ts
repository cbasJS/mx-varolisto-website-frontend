export const DESTINO_LABELS: Record<string, string> = {
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

export const ACTIVIDAD_LABELS: Record<string, string> = {
  empleado_formal: "Empleado formal",
  empleado_informal: "Empleado informal",
  negocio_propio: "Negocio propio",
  independiente: "Freelance / Honorarios",
  otro: "Otro",
}

export const RELACION_LABELS: Record<string, string> = {
  familiar: "Familiar",
  trabajo: "Trabajo",
  amigo: "Amigo",
  otro: "Otro",
}

export function maskClabe(clabe: string): string {
  return `••••••••••••${clabe.slice(-4)}`
}
