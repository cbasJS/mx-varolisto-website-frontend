'use client'

import { FlaskConical } from 'lucide-react'
import {
  MOCK_CASE_LABELS,
  setMockSubmitCase,
  type MockSubmitCase,
} from '@/lib/solicitud/dev/mockSubmit'

interface DevMockPanelProps {
  onSimular: (caso: MockSubmitCase) => void
  enviando: boolean
}

const ORDEN: MockSubmitCase[] = [
  'exito_201',
  'conflicto_solicitud_revision',
  'conflicto_prestamo_activo',
  'no_elegible_403',
  'validacion_422',
  'error_500',
  'red_0',
]

export function DevMockPanel({ onSimular, enviando }: DevMockPanelProps) {
  const handleClick = (caso: MockSubmitCase) => {
    setMockSubmitCase(caso)
    onSimular(caso)
  }

  return (
    <div className="mb-6 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-900">
        <FlaskConical className="size-4" aria-hidden />
        <span>DEV — simular respuesta del backend</span>
      </div>
      <p className="mb-3 text-xs text-amber-800">
        Bypasea checkboxes y red. Cada botón dispara el flujo real de submit con la respuesta
        elegida. Solo visible en desarrollo.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ORDEN.map((caso) => (
          <button
            key={caso}
            type="button"
            onClick={() => handleClick(caso)}
            disabled={enviando}
            className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-left text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {MOCK_CASE_LABELS[caso]}
          </button>
        ))}
      </div>
    </div>
  )
}
