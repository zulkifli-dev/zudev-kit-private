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
      <ul className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src || `${image.alt}-${index}`}>
            {image.src ? (
              <button
                type="button"
                className="block bg-transparent p-0 border-0 rounded-xl focus-visible:outline-[#2673b9] focus-visible:outline-2 focus-visible:outline-offset-2 w-full cursor-zoom-in"
                aria-label={`View image: ${image.alt}`}
                onClick={() => setActiveImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="rounded-xl w-full object-cover aspect-square"
                  loading="lazy"
                />
              </button>
            ) : (
              <ImagePlaceholder
                alt={image.alt}
                className="rounded-xl w-full aspect-square"
                label="Careers image"
              />
            )}
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        className="hidden z-1100 fixed inset-0 open:flex open:justify-center open:items-center bg-[#111923] backdrop:bg-[rgb(9_18_29/92%)] m-auto px-6 pt-13 pb-6 border-0 w-screen max-w-none h-dvh max-h-none overflow-hidden text-white"
        aria-label={activeImage?.alt ?? "Career image"}
        onClose={() => setActiveImage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveImage(null);
        }}
      >
        <button
          type="button"
          className="top-3 right-4 absolute place-items-center grid bg-[#28394a] border-0 rounded-full size-10 text-[28px] text-white leading-none cursor-pointer"
          aria-label="Close image"
          onClick={() => setActiveImage(null)}
        >
          ×
        </button>
        {activeImage ? (
          <img
            className="max-w-full max-h-[calc(100dvh-80px)] object-contain"
            src={activeImage.src}
            alt={activeImage.alt}
          />
        ) : null}
      </dialog>
    </>
  );
}
