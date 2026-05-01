import { describe, it, expect } from "vitest"
import { dateToYYYYMMDD, yyyymmddToDate, formatDDMMYYYY } from "./dateUtils"

describe("dateToYYYYMMDD", () => {
  it("convierte una fecha a string YYYY-MM-DD", () => {
    const fecha = new Date(1990, 5, 15) // 15 jun 1990 (mes 0-indexed)
    expect(dateToYYYYMMDD(fecha)).toBe("1990-06-15")
  })

  it("agrega ceros a mes y día de un dígito", () => {
    const fecha = new Date(2000, 0, 5) // 5 ene 2000
    expect(dateToYYYYMMDD(fecha)).toBe("2000-01-05")
  })
})

describe("yyyymmddToDate", () => {
  it("convierte un string YYYY-MM-DD a Date", () => {
    const fecha = yyyymmddToDate("1990-06-15")
    expect(fecha).not.toBeNull()
    expect(fecha!.getFullYear()).toBe(1990)
    expect(fecha!.getMonth()).toBe(5) // junio = 5 (0-indexed)
    expect(fecha!.getDate()).toBe(15)
  })

  it("devuelve null para string vacío", () => {
    expect(yyyymmddToDate("")).toBeNull()
  })

  it("devuelve null para formato inválido", () => {
    expect(yyyymmddToDate("15/06/1990")).toBeNull()
    expect(yyyymmddToDate("1990-6-15")).toBeNull()
    expect(yyyymmddToDate("abc")).toBeNull()
  })

  it("es inversa de dateToYYYYMMDD", () => {
    const original = new Date(1985, 11, 25) // 25 dic 1985
    const str = dateToYYYYMMDD(original)
    const recuperada = yyyymmddToDate(str)
    expect(recuperada!.getFullYear()).toBe(original.getFullYear())
    expect(recuperada!.getMonth()).toBe(original.getMonth())
    expect(recuperada!.getDate()).toBe(original.getDate())
  })
})

describe("formatDDMMYYYY", () => {
  it("convierte YYYY-MM-DD a DD/MM/YYYY", () => {
    expect(formatDDMMYYYY("1990-06-15")).toBe("15/06/1990")
  })

  it("devuelve string vacío para input vacío", () => {
    expect(formatDDMMYYYY("")).toBe("")
  })
})
