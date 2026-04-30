"use client";

export function StepTitle({
  numero,
  titulo,
  subtitulo,
}: {
  numero: number;
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {numero}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
          Paso {numero} de 6
        </span>
      </div>
      <h2 className="font-headline text-2xl font-bold text-[#1a1c1c]">
        {titulo}
      </h2>
      {subtitulo && <p className="mt-1 text-sm text-[#767683]">{subtitulo}</p>}
    </div>
  );
}
