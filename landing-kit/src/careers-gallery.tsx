import type { ImageAsset } from "./types.js";
import { ImagePlaceholder } from "./image-placeholder.js";

export interface CareersGalleryProps {
  images: ImageAsset[];
}

export function CareersGallery({ images }: CareersGalleryProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <li key={image.src}>
          {image.src ? (
            <img
              src={image.src}
              alt={image.alt}
              className="aspect-[4/3] w-full rounded-xl object-cover"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder
              alt={image.alt}
              className="aspect-[4/3] w-full rounded-xl"
              label="Careers image"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
