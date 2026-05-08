'use client'

interface ResumenSolicitudProps {
  monto: number
  plazoMeses: string
  cuota: number
  onCambiar: () => void
}

export function ResumenSolicitud({ monto, plazoMeses, cuota, onCambiar }: ResumenSolicitudProps) {
  return (
    <div
      data-testid="resumen-solicitud"
      className="mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-container p-4 text-white shadow-lg shadow-primary/20"
    >
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="opacity-90">Tu solicitud:</span>
        <button
          type="button"
          onClick={onCambiar}
          className="text-xs underline opacity-75 transition-opacity hover:opacity-100"
        >
          Editar
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-headline text-3xl font-bold tracking-tight">
            ${monto.toLocaleString('es-MX')}
          </p>
          <p className="text-sm opacity-75">a {plazoMeses} meses</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">Pagarías al mes</p>
          <p className="font-headline text-2xl font-bold tracking-tight">
            ${cuota.toLocaleString('es-MX')}
          </p>
        </div>
      </div>
    </div>
  )
}
