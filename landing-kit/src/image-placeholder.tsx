import { useEffect, useRef, useState } from "react";

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
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = placeholderRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setDimensions({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={placeholderRef}
      role="img"
      aria-label={`${alt} — image placeholder`}
      className={`flex items-center justify-center bg-muted text-xs text-muted-foreground ${className}`}
    >
      {label} · {dimensions.width && dimensions.height
        ? `${dimensions.width} × ${dimensions.height}`
        : "mengukur ukuran"}
    </div>
  );
}
