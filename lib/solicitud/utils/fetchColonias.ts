import type { CopomexResponse } from "../types"

export async function fetchColonias(cp: string): Promise<CopomexResponse[]> {
  const res = await fetch(`/api/colonias?cp=${cp}`)
  if (!res.ok) throw new Error("CP no encontrado")
  const data: unknown = await res.json()
  if (!Array.isArray(data) || data.length === 0)
    throw new Error("CP no encontrado")
  return data as CopomexResponse[]
}
