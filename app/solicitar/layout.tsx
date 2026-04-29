import { SubmittingProvider } from "@/lib/solicitud/submitting-context"
import SolicitudGuardaWrapper from "@/components/solicitar/SolicitudGuardaWrapper"

export default function SolicitarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubmittingProvider>
      <SolicitudGuardaWrapper>{children}</SolicitudGuardaWrapper>
    </SubmittingProvider>
  )
}
