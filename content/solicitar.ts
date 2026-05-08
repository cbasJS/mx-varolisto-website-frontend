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
  etiquetaRecibida: 'Solicitud recibida',
  titulo: '¡Todo listo!',
  subtitulo: 'Tu solicitud fue enviada exitosamente.',
  labelFolio: 'Número de folio',
  avisoFolio: 'Guarda este folio — lo necesitarás para cualquier consulta sobre tu solicitud.',
  labelProximosPasos: 'Próximos pasos',
  mensajeContacto: (telefono?: string) =>
    `Te contactaremos por WhatsApp${telefono ? ` al número ${telefono}` : ''} en un máximo de 24 horas hábiles para informarte el resultado.`,
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
