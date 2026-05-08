'use client'

export function StepTitle({
  numero,
  total,
  titulo,
  subtitulo,
}: {
  numero: number
  total: number
  titulo: string
  subtitulo?: string
}) {
  return (
    <div className="mb-7">
      <h2 className="font-headline text-2xl font-bold text-on-surface">{titulo}</h2>
      {subtitulo && <p className="mt-1 text-sm text-outline">{subtitulo}</p>}
    </div>
  )
}
