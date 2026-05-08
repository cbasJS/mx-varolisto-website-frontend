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
        <FormularioSolicitud />
      </div>
    </SolicitudProviders>
  )
}
