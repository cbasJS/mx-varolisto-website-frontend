import type { FileError } from 'react-dropzone'
import { MAX_SIZE_IMAGEN_BYTES, MAX_SIZE_PDF_BYTES } from './documentosConfig'

export const FILE_ERROR_IMAGEN_TOO_LARGE = 'imagen-too-large'
export const FILE_ERROR_PDF_TOO_LARGE = 'pdf-too-large'

const MB = 1024 * 1024

export function validarTamanoPorTipo(file: File): FileError | null {
  const esPDF = file.type === 'application/pdf'
  if (esPDF && file.size > MAX_SIZE_PDF_BYTES) {
    return {
      code: FILE_ERROR_PDF_TOO_LARGE,
      message: `Supera ${Math.round(MAX_SIZE_PDF_BYTES / MB)} MB.`,
    }
  }
  if (!esPDF && file.size > MAX_SIZE_IMAGEN_BYTES) {
    return {
      code: FILE_ERROR_IMAGEN_TOO_LARGE,
      message: `Supera ${Math.round(MAX_SIZE_IMAGEN_BYTES / MB)} MB.`,
    }
  }
  return null
}

export function mapDropzoneError(code: string): string {
  switch (code) {
    case 'file-invalid-type':
      return 'Formato no válido — solo se aceptan JPG, PNG o PDF.'
    case 'too-many-files':
      return 'Ya tienes el máximo de archivos en esta sección — elimina uno antes de agregar otro.'
    case 'file-too-large':
      return 'Supera el tamaño máximo permitido.'
    case FILE_ERROR_IMAGEN_TOO_LARGE:
      return `Foto muy pesada — supera ${Math.round(
        MAX_SIZE_IMAGEN_BYTES / MB,
      )} MB. Tómala con menor resolución o compártela como JPG.`
    case FILE_ERROR_PDF_TOO_LARGE:
      return `PDF muy pesado — supera ${Math.round(
        MAX_SIZE_PDF_BYTES / MB,
      )} MB. Expórtalo con menor calidad o sólo las páginas necesarias.`
    default:
      return 'Archivo no válido.'
  }
}
