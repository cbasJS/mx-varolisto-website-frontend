import type { FieldValues, UseFormRegister } from "react-hook-form"

export function normalizeRegister<T extends FieldValues>(
  _register: UseFormRegister<T>
): UseFormRegister<T> {
  return (name, options) => {
    const field = _register(name, options)
    return {
      ...field,
      onChange: (e: { target: any; type?: any }) => {
        if (typeof e.target.value === "string") {
          e.target.value = e.target.value.replace(/\s+/g, " ").trimStart()
        }
        return field.onChange(e)
      },
    }
  }
}
