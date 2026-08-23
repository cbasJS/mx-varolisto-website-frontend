import { User, Home, Briefcase, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Paso {
  numero: number
  etiqueta: string
  icono: LucideIcon
}

/**
 * Pasos del stepper (form steps).
 * El stepper sólo cubre los pasos de captura del formulario. Los extremos
 * (paso 1 = calculadora/landing, paso 6 = revisión/landing pre-submit) no
 * se renderizan en el stepper. Mapeo app pasoActual → stepper position:
 *   app paso 2 → stepper paso 1 (Tu identidad)
 *   app paso 5 → stepper paso 4 (Tus contactos)
 *
 * El paso de documentos (Paso6Documentos.tsx) quedó deprecado del flujo del
 * formulario público en Bloque 1: ya no se captura archivos en línea.
 */
export const pasos: readonly Paso[] = [
  { numero: 1, etiqueta: 'Tu identidad', icono: User },
  { numero: 2, etiqueta: 'Tu domicilio', icono: Home },
  { numero: 3, etiqueta: 'Tu economía', icono: Briefcase },
  { numero: 4, etiqueta: 'Tus contactos', icono: Users },
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
  datos: {
    titulo: '¿Salir y empezar de nuevo?',
    descripcion:
      'Si sales ahora perderás lo que ya llevas y tendrías que volver a llenar el formulario.',
  },
  // Variante para la futura página standalone de carga de documentos
  // (Bloque 3). El wizard del formulario público en Bloque 1 ya no la usa
  // — pasa `hayArchivos={false}` al GuardaWrapper. Se conserva el copy
  // para que cuando Paso6Documentos se reactive como ruta dedicada, el
  // contrato del GuardaWrapper no se rompa.
  archivos: {
    titulo: '¿Salir y perder los archivos?',
    descripcion:
      'Si sales ahora, los documentos que subiste se borrarán y tendrás que volver a cargarlos.',
  },
  botonQuedarme: 'Mejor me quedo',
  botonSalir: 'Sí, salir',
} as const
