interface BrandNameProps {
  className?: string;
}

export default function BrandName({ className = "" }: BrandNameProps) {
  return (
    <span className={className}>
      Varo<span className="text-secondary">Listo.mx</span>
    </span>
  );
}
