import { Card, CardContent, CardTitle } from "@zulkifli-dev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { Product } from "./types.js";

export interface ProductGridProps {
  products: Product[];
  productHref?: (product: Product) => string;
  actionLabel?: string;
  className?: string;
}

export function ProductGrid({
  products,
  productHref = (product) => `/products/${product.slug}`,
  actionLabel = "View product",
  className = "",
}: ProductGridProps) {
  return (
    <ul className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {products.map((product) => (
        <li key={product.id}>
          <a
            href={productHref(product)}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full gap-0 overflow-hidden border-[#e2e8ed] p-0 shadow-none transition-shadow group-hover:shadow-md">
              {product.images[0]?.src ? (
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  className="aspect-4/3 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ImagePlaceholder
                  alt={product.images[0]?.alt ?? `${product.name} product photo`}
                  className="aspect-4/3 w-full"
                  label="Product image"
                />
              )}
              <CardContent className="flex flex-col items-start gap-2 px-4 py-4">
                <CardTitle className="text-[15px] font-semibold leading-5">{product.name}</CardTitle>
                <p className="line-clamp-2 text-xs leading-[1.45] text-muted-foreground">
                  {product.description}
                </p>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
                  {actionLabel}<span aria-hidden="true">→</span>
                </span>
              </CardContent>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  );
}
