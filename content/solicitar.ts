import { Wallet, User, Home, Briefcase, Users, FileText, ClipboardCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Paso {
  numero: number
  etiqueta: string
  icono: LucideIcon
}

export const pasos: readonly Paso[] = [
  { numero: 1, etiqueta: 'Préstamo', icono: Wallet },
  { numero: 2, etiqueta: 'Identidad', icono: User },
  { numero: 3, etiqueta: 'Domicilio', icono: Home },
  { numero: 4, etiqueta: 'Economía', icono: Briefcase },
  { numero: 5, etiqueta: 'Referencias', icono: Users },
  { numero: 6, etiqueta: 'Documentos', icono: FileText },
  { numero: 7, etiqueta: 'Revisión', icono: ClipboardCheck },
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
