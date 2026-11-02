import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@zulkifli-dev/ui/components/dialog";
import type { ImageAsset } from "./types.js";
import { ImagePlaceholder } from "./image-placeholder.js";

export interface CareersGalleryProps {
  images: ImageAsset[];
}

export function CareersGallery({ images }: CareersGalleryProps) {
  const [activeImage, setActiveImage] = useState<ImageAsset | null>(null);

  return (
    <>
      <ul className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src || `${image.alt}-${index}`}>
            <button
              type="button"
              className="block bg-transparent p-0 border-0 rounded-xl focus-visible:outline-[#2673b9] focus-visible:outline-2 focus-visible:outline-offset-2 w-full cursor-zoom-in"
              aria-label={`View image: ${image.alt}`}
              onClick={() => setActiveImage(image)}
            >
              {image.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="rounded-xl w-full object-cover aspect-square"
                  loading="lazy"
                />
              ) : (
                <ImagePlaceholder
                  alt={image.alt}
                  className="rounded-xl w-full aspect-square"
                  label="Careers image"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      <Dialog
        open={activeImage !== null}
        onOpenChange={(open) => {
          if (!open) setActiveImage(null);
        }}
      >
        <DialogContent
          aria-label={activeImage?.alt ?? "Career image"}
          className="z-1100 flex justify-center items-center bg-[#111923] shadow-none px-6 pt-13 pb-6 border-0 rounded-none ring-0 w-screen max-w-none sm:max-w-none h-dvh overflow-hidden text-white"
          overlayClassName="z-[1099] bg-[rgb(9_18_29/92%)]"
          closeButtonClassName="top-3 right-4 size-10 rounded-full bg-[#28394a] text-white hover:bg-[#3a5065]"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveImage(null);
          }}
        >
          <DialogTitle className="sr-only">
            {activeImage?.alt ?? "Career image"}
          </DialogTitle>
          {activeImage?.src ? (
            <img
              className="max-w-full max-h-[calc(100dvh-80px)] object-contain"
              src={activeImage.src}
              alt={activeImage.alt}
            />
          ) : activeImage ? (
            <ImagePlaceholder
              alt={activeImage.alt}
              className="rounded-xl w-[min(90vw,900px)] aspect-square"
              label="Careers image"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
