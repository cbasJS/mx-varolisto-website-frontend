import type { SolicitudCompleta } from '@/lib/solicitud/domain/solicitud/schemas'

export interface GuardarPasoInput {
  paso: number
  datos: Partial<SolicitudCompleta>
  guardarPasoFn: (paso: number, datos: Partial<SolicitudCompleta>) => void
  setPasoFn: (paso: number) => void
}

export function guardarYAvanzar({ paso, datos, guardarPasoFn, setPasoFn }: GuardarPasoInput): void {
  guardarPasoFn(paso, datos)
  setPasoFn(paso + 1)
}
