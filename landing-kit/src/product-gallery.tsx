import { useState } from "react";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { ImageAsset } from "./types.js";

export interface ProductGalleryProps {
  images: ImageAsset[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) return null;

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#dce4eb]">
        {selectedImage.src ? (
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="absolute inset-0 size-full object-contain"
          />
        ) : (
          <ImagePlaceholder
            alt={selectedImage.alt}
            className="absolute inset-0 size-full rounded-none"
            label="Product image"
          />
        )}
      </div>
      {images.length > 1 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Product images">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className="block size-16 overflow-hidden rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                aria-pressed={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              >
                {image.src ? (
                  <img
                    src={image.src}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <ImagePlaceholder
                    alt={image.alt}
                    className="size-full rounded-none"
                    label="Image"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
