import { Card, CardTitle } from "@zudev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { BrandPartner } from "./types.js";

export interface BrandPartnerGridProps {
  partners: BrandPartner[];
}

export function BrandPartnerGrid({ partners }: BrandPartnerGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((partner) => (
        <li key={partner.id}>
          <Card className="flex h-full items-center gap-2 border-0 bg-white p-4 text-center shadow-sm">
            {partner.logo.src ? (
              <img
                src={partner.logo.src}
                alt={partner.logo.alt}
                className="aspect-[3/1] w-full max-w-[300px] object-contain"
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder
                alt={partner.logo.alt}
                label="Logo brand"
                className="aspect-[3/1] w-full max-w-[300px] rounded-md"
              />
            )}
            <CardTitle className="text-sm leading-5">{partner.name}</CardTitle>
            <p className="text-xs leading-4 text-muted-foreground">{partner.country}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
