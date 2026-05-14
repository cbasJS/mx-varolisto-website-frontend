import { MAX_SIZE_IMAGEN_BYTES } from './documentosConfig'

const MB = 1024 * 1024
const MAX_MB = Math.round(MAX_SIZE_IMAGEN_BYTES / MB)

export function mapDropzoneError(code: string): string {
  switch (code) {
    case 'file-invalid-type':
      return 'Formato no válido — solo se aceptan JPG, PNG o PDF.'
    case 'too-many-files':
      return 'Ya tienes el máximo de archivos en esta sección — elimina uno antes de agregar otro.'
    case 'file-too-large':
      return `El archivo supera el tamaño permitido de ${MAX_MB} MB.`
    default:
      return 'Archivo no válido.'
  }
}
