import { Card, CardTitle } from "@zudev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { BrandPartner } from "./types.js";

export interface BrandPartnerGridProps {
  partners: BrandPartner[];
}

function PartnerItems({ partners, duplicate = false }: BrandPartnerGridProps & { duplicate?: boolean }) {
  return (
    <ul className="brand-partner-group" aria-hidden={duplicate || undefined}>
      {partners.map((partner) => (
        <li key={partner.id}>
          <Card className="brand-partner-card flex h-full flex-col items-center justify-center gap-2 border-0 bg-white p-4 pb-2 text-center shadow-sm">
            {partner.logo.src ? (
              <img
                src={partner.logo.src}
                alt={duplicate ? "" : partner.logo.alt}
                className="mx-auto aspect-[3/2] w-full max-w-[300px] object-contain object-center"
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder
                alt={partner.logo.alt}
                label="Logo brand"
                className="aspect-[3/2] w-full max-w-[300px] rounded-md"
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

export function BrandPartnerGrid({ partners }: BrandPartnerGridProps) {
  return (
    <div className="brand-partner-carousel">
      <div
        className="brand-partner-marquee"
        role="region"
        aria-label="Brand partner I-Tech Lafacos"
        tabIndex={0}
      >
        <div className="brand-partner-track">
          <PartnerItems partners={partners} />
          <PartnerItems partners={partners} duplicate />
        </div>
      </div>
    </div>
  );
}
