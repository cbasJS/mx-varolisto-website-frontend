import { ApiError } from '@/lib/solicitud/infrastructure/http/apiErrors'
import type { CrearSolicitudResponse } from '@varolisto/shared-schemas/api'

// Dev-only: el panel del Paso 7 setea el caso a simular antes de disparar el
// submit. submitSolicitud() consulta este módulo y si hay un caso activo
// devuelve/lanza la respuesta simulada en vez de llamar al backend.
// Activo solo cuando NEXT_PUBLIC_ENV === 'local'. En sandbox/production el
// guard evalúa a `false` estático (Next.js inlinea NEXT_PUBLIC_*) y todo el
// panel + ejecutarMockSubmit son eliminados por dead-code elimination.

export type MockSubmitCase =
  | 'exito_201'
  | 'conflicto_solicitud_revision'
  | 'conflicto_prestamo_activo'
  | 'plazo_invalido_para_monto'
  | 'no_elegible_403'
  | 'validacion_422'
  | 'error_500'
  | 'red_0'

export const isDevMockEnabled = () => process.env.NEXT_PUBLIC_ENV === 'local'

let activo: MockSubmitCase | null = null

export function setMockSubmitCase(caso: MockSubmitCase | null) {
  if (!isDevMockEnabled()) return
  activo = caso
}

export function getMockSubmitCase(): MockSubmitCase | null {
  if (!isDevMockEnabled()) return null
  return activo
}

const SIMULATED_LATENCY_MS = 800

export async function ejecutarMockSubmit(): Promise<CrearSolicitudResponse> {
  const caso = activo
  activo = null

  if (!caso) throw new Error('ejecutarMockSubmit llamado sin caso activo')

  await new Promise((res) => setTimeout(res, SIMULATED_LATENCY_MS))

  switch (caso) {
    case 'exito_201':
      return {
        folio: 'VL-202605-9999',
        estado: 'recibida',
        fechaCreacion: new Date().toISOString(),
        tiempoEsperadoRespuesta: '24 horas',
      }
    case 'conflicto_solicitud_revision':
      throw new ApiError({
        status: 409,
        code: 'solicitud_en_revision',
        mensaje: 'Ya tienes una solicitud en revisión. Te contactaremos pronto por WhatsApp.',
      })
    case 'conflicto_prestamo_activo':
      throw new ApiError({
        status: 409,
        code: 'prestamo_activo',
        mensaje: 'Tienes un crédito activo. Termínalo antes de solicitar otro.',
      })
    case 'plazo_invalido_para_monto':
      throw new ApiError({
        status: 422,
        code: 'plazo_invalido_para_monto',
        mensaje:
          'El plazo 6 no está disponible para un monto de $2500. Plazos válidos: 2, 3 meses.',
      })
    case 'no_elegible_403':
      throw new ApiError({
        status: 403,
        code: 'solicitante_no_elegible',
        mensaje:
          'No podemos procesar tu solicitud en este momento. Por favor contáctanos para más información.',
      })
    case 'validacion_422':
      throw new ApiError({
        status: 422,
        code: 'validation_error',
        mensaje: 'El payload no cumple con el formato esperado',
        detalles: {
          montoSolicitado: ['Debe estar entre 2000 y 20000'],
          plazoMeses: ['Debe estar entre 2 y 6'],
        },
      })
    case 'error_500':
      throw new ApiError({
        status: 500,
        code: 'internal_error',
        mensaje: 'Error procesando la solicitud. Intenta de nuevo en unos minutos.',
      })
    case 'red_0':
      throw new ApiError({
        status: 0,
        code: 'network',
        mensaje: 'Error de red o tiempo de espera agotado',
      })
  }
}

export const MOCK_CASE_LABELS: Record<MockSubmitCase, string> = {
  exito_201: '201 — Éxito (PantallaExito)',
  conflicto_solicitud_revision: '409 — solicitud_en_revision (modal)',
  conflicto_prestamo_activo: '409 — prestamo_activo (modal)',
  plazo_invalido_para_monto: '422 — plazo_invalido_para_monto (modal)',
  no_elegible_403: '403 — solicitante_no_elegible (toast)',
  validacion_422: '422 — validation_error (sin UI hoy)',
  error_500: '500 — internal_error (toast)',
  red_0: 'Red — timeout/abort (toast)',
}
