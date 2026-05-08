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
  { numero: 3, etiqueta: 'Economía', icono: Briefcase },
  { numero: 4, etiqueta: 'Referencias', icono: Users },
  { numero: 5, etiqueta: 'Documentos', icono: FileText },
] as const

export const trustBadges = [
  { icono: 'lock', texto: 'Datos encriptados' },
  { icono: 'verified_user', texto: '100% seguro' },
  { icono: 'support_agent', texto: 'Soporte en 24h' },
] as const

export const exitoCopy = {
  titulo: '¡Solicitud enviada!',
  subtituloPrefijo:
    'Hemos recibido tu solicitud y nuestros analistas ya la están revisando. Todo el seguimiento y la respuesta final te la daremos ',
  subtituloEnfasis: 'directamente por WhatsApp',
  subtituloSufijo: '.',
  labelProximosPasos: 'Te escribiremos al:',
  mensajeContacto:
    'Guarda nuestro número para que sepas que somos nosotros y asegúrate de tener conexión.',
  labelFolio: 'Folio de seguimiento',
  botonInicio: 'Volver al inicio',
} as const

export const salidaCopy = {
  submitting: {
    titulo: '¿Seguro que quieres salir?',
    descripcion: 'Estamos enviando tu solicitud. Si sales ahora, podríamos perder los datos.',
  },
  archivos: {
    titulo: '¿Seguro que quieres salir?',
    descripcion:
      'Si sales ahora, perderás los archivos que ya subiste y la información capturada. Tendrías que empezar de nuevo.',
  },
  datos: {
    titulo: '¿Seguro que quieres salir?',
    descripcion:
      'Si sales ahora, perderás la información que has capturado y tendrías que empezar de nuevo.',
  },
  botonQuedarme: 'Quedarme',
  botonSalir: 'Salir de todas formas',
} as const
