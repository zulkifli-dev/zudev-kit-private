import { Card, CardTitle } from "@zulkifli-dev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { BrandPartner } from "./types.js";

export interface BrandPartnerGridProps {
  partners: BrandPartner[];
}

function PartnerItems({ partners, duplicate = false }: BrandPartnerGridProps & { duplicate?: boolean }) {
  return (
    <ul className="m-0 flex flex-[0_0_auto] list-none gap-4 p-0 pr-4 max-[680px]:gap-3 max-[680px]:pr-3" aria-hidden={duplicate || undefined}>
      {partners.map((partner) => (
        <li className="flex-[0_0_230px] max-[680px]:flex-[0_0_190px]" key={partner.id}>
          <Card className="flex h-full min-h-37.5 flex-col items-center justify-center gap-2 border-0 bg-white p-4 pb-2 text-center shadow-sm">
            {partner.logo.src ? (
              <img
                src={partner.logo.src}
                alt={duplicate ? "" : partner.logo.alt}
                className="mx-auto aspect-3/2 w-full max-w-75 object-contain object-center"
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder
                alt={partner.logo.alt}
                label="Brand logo"
                className="aspect-3/2 w-full max-w-75 rounded-md"
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
      <div className="min-w-0">
      <div
        className="group overflow-hidden py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:overflow-x-auto"
        role="region"
        aria-label="I-Tech Lafacos brand partners"
        tabIndex={0}
      >
        <div className="flex w-max animate-[brand-partner-scroll_48s_linear_infinite] hover:paused group-focus-within:paused motion-reduce:animate-none">
          <PartnerItems partners={partners} />
          <PartnerItems partners={partners} duplicate />
        </div>
      </div>
    </div>
  );
}
