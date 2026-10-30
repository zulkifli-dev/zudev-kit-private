import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "./types.js";
import { ImagePlaceholder } from "./image-placeholder.js";

export interface CareersGalleryProps {
  images: ImageAsset[];
}

export function CareersGallery({ images }: CareersGalleryProps) {
  const [activeImage, setActiveImage] = useState<ImageAsset | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeImage && !dialog.open) dialog.showModal();
    if (!activeImage && dialog.open) dialog.close();
  }, [activeImage]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src || `${image.alt}-${index}`}>
            {image.src ? (
              <button
                type="button"
                className="career-gallery-trigger"
                aria-label={`Lihat gambar: ${image.alt}`}
                onClick={() => setActiveImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-square w-full rounded-xl object-cover"
                  loading="lazy"
                />
              </button>
            ) : (
              <ImagePlaceholder
                alt={image.alt}
                className="aspect-square w-full rounded-xl"
                label="Careers image"
              />
            )}
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        className="career-image-dialog"
        aria-label={activeImage?.alt ?? "Gambar karier"}
        onClose={() => setActiveImage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveImage(null);
        }}
      >
        <button
          type="button"
          className="career-image-dialog-close"
          aria-label="Tutup gambar"
          onClick={() => setActiveImage(null)}
        >
          ×
        </button>
        {activeImage ? <img src={activeImage.src} alt={activeImage.alt} /> : null}
      </dialog>
    </>
  );
}
