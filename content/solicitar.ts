import { User, Home, Briefcase, Users, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Paso {
  numero: number
  etiqueta: string
  icono: LucideIcon
}

/**
 * Pasos del stepper (form steps).
 * El stepper sólo cubre los pasos de captura del formulario. Los extremos
 * (paso 1 = calculadora/landing, paso 7 = revisión/landing pre-submit) no
 * se renderizan en el stepper. Mapeo app pasoActual → stepper position:
 *   app paso 2 → stepper paso 1 (Tu identidad)
 *   app paso 6 → stepper paso 5 (Documentos)
 */
export const pasos: readonly Paso[] = [
  { numero: 1, etiqueta: 'Tu identidad', icono: User },
  { numero: 2, etiqueta: 'Tu domicilio', icono: Home },
  { numero: 3, etiqueta: 'Tu economía', icono: Briefcase },
  { numero: 4, etiqueta: 'Tus contactos', icono: Users },
  { numero: 5, etiqueta: 'Tus documentos', icono: FileText },
] as const

export const trustBadges = [
  { icono: 'lock', texto: 'Datos cifrados' },
  { icono: 'verified_user', texto: 'Solicitud segura' },
  { icono: 'support_agent', texto: 'Soporte por WhatsApp' },
] as const

export const exitoCopy = {
  titulo: 'Listo, ya quedó tu solicitud',
  subtituloPrefijo: 'Estamos revisándola. En menos de 24 h te escribimos al ',
  subtituloEnfasis: 'WhatsApp',
  subtituloSufijo: ' con la respuesta.',
  labelProximosPasos: 'Te contactaremos en:',
  mensajeContacto: 'Guarda nuestro número para reconocer el mensaje.',
  labelFolio: 'Tu folio',
  botonInicio: 'Ir al inicio',
} as const

export const salidaCopy = {
  submitting: {
    titulo: 'Espera, estamos enviando tu solicitud',
    descripcion: 'Si sales ahora, la solicitud podría no completarse. Tarda apenas unos segundos.',
  },
  archivos: {
    titulo: '¿Salir y empezar de nuevo?',
    descripcion:
      'Si sales ahora perderás los archivos que ya subiste y todo lo que llenaste. Tendrías que empezar desde cero.',
  },
  datos: {
    titulo: '¿Salir y empezar de nuevo?',
    descripcion:
      'Si sales ahora perderás lo que ya llevas y tendrías que volver a llenar el formulario.',
  },
  botonQuedarme: 'Mejor me quedo',
  botonSalir: 'Sí, salir',
} as const
