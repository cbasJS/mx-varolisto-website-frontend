import {
  ColoniaNotFoundError,
  ColoniaServiceError,
} from '@/lib/solicitud/infrastructure/colonias/coloniaRepository'

export const CP_NOT_FOUND_MESSAGE = 'No encontramos este CP. Revísalo y vuelve a intentar.'
export const CP_SERVICE_ERROR_MESSAGE =
  'Estamos teniendo un problema buscando tu CP. Inténtalo en unos segundos.'

export function getCpErrorMessage(error: unknown): string | null {
  if (error == null) return null
  if (error instanceof ColoniaNotFoundError) return CP_NOT_FOUND_MESSAGE
  if (error instanceof ColoniaServiceError) return CP_SERVICE_ERROR_MESSAGE
  return CP_SERVICE_ERROR_MESSAGE
}
