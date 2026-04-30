export function generateFolio(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0")
  return `VL-${year}${month}-${random}`
}
