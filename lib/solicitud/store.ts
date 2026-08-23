export { useSolicitudStore } from '@/lib/solicitud/infrastructure/persistence/solicitudStore'
export type {
  SolicitudState,
  SolicitudActions,
} from '@/lib/solicitud/infrastructure/persistence/solicitudStore'
// `ArchivoSubido` se movió a `lib/solicitud/domain/solicitud/types.ts` —
// vive ahí para reusarse en la futura página standalone de carga y en los
// casos de uso de upload aún vivos. El store del formulario público ya no
// lo expone porque no captura archivos en Bloque 1.
export type { ArchivoSubido } from '@/lib/solicitud/domain/solicitud/types'
