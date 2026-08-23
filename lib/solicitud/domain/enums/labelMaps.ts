import type {
  Antiguedad,
  Sexo,
  DestinoPrestamo,
  TipoActividad,
  RelacionReferencia,
  AniosViviendo,
  TipoVivienda,
  EstadoCivil,
  DependientesEconomicos,
  TipoIdentificacion,
} from '@varolisto/shared-schemas/enums'
import {
  Calculator,
  Briefcase,
  Heart,
  Wrench,
  Home,
  GraduationCap,
  Users,
  Plane,
  MoreHorizontal,
  User,
  Contact,
  Handshake,
  Store,
  Laptop,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ── Meta objects con icono (fuente de verdad para label + icono) ──────────────

export const SEXO_META: Record<Sexo, { label: string; icono: string; lucideIcon: LucideIcon }> = {
  M: { label: 'Hombre', icono: 'man', lucideIcon: User },
  F: { label: 'Mujer', icono: 'woman', lucideIcon: User },
  X: { label: 'Prefiero no decirlo', icono: 'person', lucideIcon: User },
}

export const DESTINOS_META: Record<
  DestinoPrestamo,
  { label: string; icono: string; lucideIcon: LucideIcon }
> = {
  liquidar_deuda: { label: 'Liquidar una deuda', icono: 'sync_alt', lucideIcon: Calculator },
  capital_trabajo: { label: 'Capital de trabajo', icono: 'store', lucideIcon: Briefcase },
  gasto_medico: { label: 'Gasto médico', icono: 'local_hospital', lucideIcon: Heart },
  equipo_trabajo: { label: 'Equipo de trabajo', icono: 'build', lucideIcon: Wrench },
  mejora_hogar: { label: 'Mejora del hogar', icono: 'home_repair_service', lucideIcon: Home },
  educacion: { label: 'Educación', icono: 'school', lucideIcon: GraduationCap },
  gasto_familiar: { label: 'Gasto familiar', icono: 'family_restroom', lucideIcon: Users },
  viaje_evento: { label: 'Viaje o evento', icono: 'flight', lucideIcon: Plane },
  otro: { label: 'Otro', icono: 'more_horiz', lucideIcon: MoreHorizontal },
}

export const ACTIVIDADES_META: Record<
  TipoActividad,
  { label: string; icono: string; hint: string; lucideIcon: LucideIcon }
> = {
  empleado_formal: {
    label: 'Empleado formal',
    icono: 'badge',
    hint: 'Con nómina o recibos',
    lucideIcon: Contact,
  },
  empleado_informal: {
    label: 'Empleado informal',
    icono: 'handshake',
    hint: 'Sin contrato fijo',
    lucideIcon: Handshake,
  },
  negocio_propio: {
    label: 'Negocio propio',
    icono: 'store',
    hint: 'Soy el dueño',
    lucideIcon: Store,
  },
  independiente: {
    label: 'Por cuenta propia',
    icono: 'laptop_mac',
    hint: 'Honorarios o servicios profesionales',
    lucideIcon: Laptop,
  },
  otro: {
    label: 'Otro',
    icono: 'more_horiz',
    hint: 'Otra fuente de ingresos',
    lucideIcon: MoreHorizontal,
  },
}

export const ANTIGUEDAD_META: Record<Antiguedad, string> = {
  menos_1: 'Menos de 1 año',
  uno_a_dos: 'Entre 1 y 2 años',
  mas_2: 'Más de 2 años',
}

// ── Labels planos (usados en Paso7Revision) ──────────────────────────────────
// DESTINO_LABELS y ACTIVIDAD_LABELS se derivan de sus meta objects para evitar
// duplicar los strings de texto.

export const ANTIGUEDAD_LABELS: Record<Antiguedad, string> = {
  menos_1: 'Menos de 1 año',
  uno_a_dos: '1–2 años',
  mas_2: 'Más de 2 años',
}

export const DESTINO_LABELS = Object.fromEntries(
  Object.entries(DESTINOS_META).map(([k, v]) => [k, v.label]),
) as Record<DestinoPrestamo, string>

export const ACTIVIDAD_LABELS = Object.fromEntries(
  Object.entries(ACTIVIDADES_META).map(([k, v]) => [k, v.label]),
) as Record<TipoActividad, string>

export const RELACION_LABELS: Record<RelacionReferencia, string> = {
  familiar: 'Familiar',
  trabajo: 'Trabajo',
  amigo: 'Amigo',
  otro: 'Otro',
}

export const ANIOS_VIVIENDO_LABELS: Record<AniosViviendo, string> = {
  menos_de_1: 'Menos de 1 año',
  entre_1_y_2: '1 – 2 años',
  entre_3_y_5: '3 – 5 años',
  mas_de_5: 'Más de 5 años',
}

export const TIPO_VIVIENDA_LABELS: Record<TipoVivienda, string> = {
  propia: 'Propia',
  rentada: 'Rentada',
  de_familiar: 'De un familiar',
}

export const ESTADO_CIVIL_LABELS: Record<EstadoCivil, string> = {
  soltero: 'Soltero/a',
  casado: 'Casado/a',
  union_libre: 'Unión libre',
  divorciado: 'Divorciado/a',
  viudo: 'Viudo/a',
}

export const DEPENDIENTES_LABELS: Record<DependientesEconomicos, string> = {
  ninguno: 'Ninguno',
  uno: '1',
  dos: '2',
  tres: '3',
  cuatro_o_mas: '4 o más',
}

export const TIPO_IDENTIFICACION_LABELS: Record<TipoIdentificacion, string> = {
  ine: 'INE',
  pasaporte: 'Pasaporte',
}

export const RELACIONES_META: Record<RelacionReferencia, string> = RELACION_LABELS

// ── Constantes de documentos (usadas en usePaso6) ────────────────────────────

export const COPY_DOCUMENTOS: Record<string, string> = {
  empleado_formal: 'Sube al menos 2 recibos de nómina o estados de cuenta de los últimos 3 meses.',
  negocio_propio:
    'Sube al menos 2 estados de cuenta donde se vean tus depósitos (últimos 3 meses). También puedes incluir recibos de proveedores o fotos de tu negocio.',
  empleado_informal:
    'Sube al menos 2 estados de cuenta donde se vean tus depósitos (últimos 3 meses).',
  independiente:
    'Sube tus estados de cuenta de los últimos 3 meses o comprobantes de depósitos por honorarios.',
}

export const MIN_COMPROBANTES = 2

export const TIPOS_SIN_BANCO = ['negocio_propio', 'empleado_informal', 'otro'] as const

export const COPY_ALTERNATIVOS: Record<string, string> = {
  negocio_propio:
    'Cualquiera de estos sirve: fotos de tu negocio o mercancía, notas de venta, facturas a proveedores, o cualquier prueba de la actividad de tu negocio.',
  empleado_informal:
    'Cualquiera de estos sirve: carta de tu empleador, fotos de recibos en efectivo, notas de venta con tu nombre, o cualquier otra prueba de tus ingresos.',
  otro: 'Cualquier prueba de tus ingresos sirve: recibos, transferencias, capturas de depósitos, notas de venta o fotos de tu actividad.',
}
