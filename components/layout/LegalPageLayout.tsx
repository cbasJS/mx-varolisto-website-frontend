interface LegalPageLayoutProps {
  titulo: string;
  fechaActualizacion: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  titulo,
  fechaActualizacion,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="bg-white text-gray-900 min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">{titulo}</h1>
        <p className="text-sm text-gray-400 mb-10">{fechaActualizacion}</p>
        {children}
      </div>
    </main>
  );
}
