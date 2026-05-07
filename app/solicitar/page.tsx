import SolicitudProviders from './providers'
import FormularioSolicitud from '@/components/solicitar/FormularioSolicitud'

export const metadata = {
  title: 'Solicitar crédito | VaroListo.mx',
  description: 'Completa tu solicitud de microcrédito personal. Sin trámites complicados.',
}

export default function SolicitarPage() {
  return (
    <SolicitudProviders>
      <div className="min-h-screen bg-surface-bright">
        <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
          <FormularioSolicitud />
        </div>
      </div>
    </SolicitudProviders>
  )
}
