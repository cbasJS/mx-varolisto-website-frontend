import type { FieldValues, UseFormRegister } from "react-hook-form"

const DIGITS_ONLY_FIELDS = ["telefono", "codigoPostal"] as const

export function normalizeRegister<T extends FieldValues>(
  _register: UseFormRegister<T>
): UseFormRegister<T> {
  return (name, options) => {
    const field = _register(name, options)
    const digitsOnly = (DIGITS_ONLY_FIELDS as readonly string[]).includes(name as string)
    return {
      ...field,
      onChange: (e: { target: any; type?: any }) => {
        if (typeof e.target.value === "string") {
          if (digitsOnly) {
            e.target.value = e.target.value.replace(/\D/g, "")
          } else {
            e.target.value = e.target.value.replace(/\s+/g, " ").trimStart()
          }
        }
        return field.onChange(e)
      },
    }
  }
}
