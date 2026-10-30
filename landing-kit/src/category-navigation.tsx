import { Button } from "@zudev/ui/components/button";
import type { ProductCategory } from "./types.js";

export interface CategoryNavigationProps {
  categories: ProductCategory[];
  selectedCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  allLabel?: string;
}

function CategoryItems({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Omit<CategoryNavigationProps, "allLabel">) {
  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Button
            type="button"
            variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
            className="h-auto w-full justify-start px-3 py-2 text-left"
            aria-current={
              selectedCategoryId === category.id ? "page" : undefined
            }
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
          {category.children?.length ? (
            <div className="ml-3 border-l pl-2">
              <CategoryItems
                categories={category.children}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={onSelectCategory}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function CategoryNavigation({
  categories,
  selectedCategoryId = null,
  onSelectCategory,
  allLabel = "All products",
}: CategoryNavigationProps) {
  return (
    <nav aria-label="Product categories" className="space-y-2">
      <Button
        type="button"
        variant={selectedCategoryId === null ? "secondary" : "ghost"}
        className="h-auto w-full justify-start px-3 py-2 text-left"
        aria-current={selectedCategoryId === null ? "page" : undefined}
        onClick={() => onSelectCategory(null)}
      >
        {allLabel}
      </Button>
      <CategoryItems
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
      />
    </nav>
  );
}
