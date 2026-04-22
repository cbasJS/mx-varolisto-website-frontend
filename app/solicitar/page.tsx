import SolicitudProviders from "./providers";
import FormularioSolicitud from "@/components/solicitar/FormularioSolicitud";

export const metadata = {
  title: "Solicitar crédito | VaroListo.mx",
  description:
    "Completa tu solicitud de microcrédito personal. Sin trámites complicados.",
};

export default function SolicitarPage() {
  return (
    <SolicitudProviders>
      {/* Shell bicolor: navy arriba, gris claro abajo */}
      <div className="relative min-h-screen bg-[#f5f5f7]">
        {/* Banda navy superior */}
        <div className="absolute inset-x-0 top-0 h-64 bg-primary md:h-72" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-20 pb-10 md:pt-24 md:pb-14">
          {/* Logo / marca en la banda navy */}
          <div className="mb-8 text-center">
            {/* <p className="font-headline text-2xl font-bold tracking-tight text-white">
              VaroListo<span className="text-secondary">.</span>mx
            </p> */}
            <p className="mt-1 text-xl text-white font-extrabold font-headline">
              Solicitud de préstamo personal
            </p>
          </div>

          <FormularioSolicitud />
        </div>
      </div>
    </SolicitudProviders>
  );
}
