export interface ImagePlaceholderProps {
  alt: string;
  className?: string;
  label?: string;
}

export function ImagePlaceholder({
  alt,
  className = "aspect-[3/1] w-full",
  label = "CMS image",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${alt} — image placeholder`}
      className={`flex items-center justify-center bg-muted text-xs text-muted-foreground ${className}`}
    >
      {label} · 300 × 100
    </div>
  );
}
