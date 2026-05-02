import type { CopomexResponse } from '@/lib/solicitud/infrastructure/colonias/types'

export class ColoniaNotFoundError extends Error {}
export class ColoniaServiceError extends Error {}

export async function fetchColonias(cp: string): Promise<CopomexResponse[]> {
  let res: Response
  try {
    res = await fetch(`/api/colonias?cp=${cp}`)
  } catch {
    throw new ColoniaServiceError(
      'No pudimos consultar tu código postal. Intenta de nuevo en un momento.',
    )
  }

  if (res.status === 404) throw new ColoniaNotFoundError('CP no encontrado')
  if (!res.ok)
    throw new ColoniaServiceError(
      'No pudimos consultar tu código postal. Intenta de nuevo en un momento.',
    )

  const data: unknown = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new ColoniaNotFoundError('CP no encontrado')
  return data as CopomexResponse[]
}
