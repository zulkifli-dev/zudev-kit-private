import { Card, CardContent, CardTitle } from "@zudev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { Product } from "./types.js";

export interface ProductGridProps {
  products: Product[];
  productHref?: (product: Product) => string;
}

export function ProductGrid({
  products,
  productHref = (product) => `/products/${product.slug}`,
}: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <a
            href={productHref(product)}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full overflow-hidden p-0 transition-shadow group-hover:shadow-md">
              {product.images[0]?.src ? (
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ImagePlaceholder
                  alt={product.images[0]?.alt ?? `${product.name} product photo`}
                  className="aspect-[4/3] w-full"
                  label="Product image"
                />
              )}
              <CardContent className="space-y-2 py-5">
                <CardTitle>{product.name}</CardTitle>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  );
}
