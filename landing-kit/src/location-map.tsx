import type { Coordinates } from "./types.js";

export interface LocationMapProps {
  coordinates: Coordinates;
  title?: string;
  zoom?: number;
  className?: string;
}

export function LocationMap({
  coordinates,
  title = "Location map",
  zoom = 14,
  className,
}: LocationMapProps) {
  const { latitude, longitude } = coordinates;
  const span = 0.18 / 2 ** (zoom - 10);
  const bounds = [
    longitude - span,
    latitude - span,
    longitude + span,
    latitude + span,
  ].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className ?? "h-80 w-full rounded-xl border"}
    />
  );
}
