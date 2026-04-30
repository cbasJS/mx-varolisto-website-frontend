export function dateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function yyyymmddToDate(str: string): Date | null {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null
  const [y, mo, d] = str.split("-").map(Number)
  return new Date(y, mo - 1, d)
}

export function formatDDMMYYYY(yyyymmdd: string): string {
  if (!yyyymmdd) return ""
  const [y, m, d] = yyyymmdd.split("-")
  return `${d}/${m}/${y}`
}
