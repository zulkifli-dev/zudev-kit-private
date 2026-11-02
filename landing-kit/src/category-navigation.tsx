import { Button } from "@zulkifli-dev/ui/components/button";
import { useEffect, useState } from "react";
import type { ProductCategory } from "./types.js";

export interface CategoryNavigationProps {
  categories: ProductCategory[];
  selectedCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  allLabel?: string;
}

interface CategoryItemsProps extends Omit<CategoryNavigationProps, "allLabel"> {
  expandedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;
}

function getAncestorIds(categories: ProductCategory[], selectedId: string | null): string[] {
  if (!selectedId) return [];

  for (const category of categories) {
    if (category.children?.some((child) => child.id === selectedId)) return [category.id];
    const ancestors = category.children ? getAncestorIds(category.children, selectedId) : [];
    if (ancestors.length) return [category.id, ...ancestors];
  }

  return [];
}

function CategoryItems({
  categories,
  selectedCategoryId,
  onSelectCategory,
  expandedCategoryIds,
  onToggleCategory,
}: CategoryItemsProps) {
  return (
    <ul className="space-y-2">
      {categories.map((category) => {
        const selectedChild = category.children?.find(
          (child) => child.id === selectedCategoryId,
        );
        const isActive =
          selectedCategoryId === category.id || selectedChild !== undefined;
        const isExpanded = expandedCategoryIds.includes(category.id);

        return (
          <li key={category.id}>
            <Button
              type="button"
              variant={isActive ? "default" : "ghost"}
              className="h-auto w-full justify-between px-3 py-2 text-left"
              aria-current={isActive ? "page" : undefined}
              aria-expanded={category.children?.length ? isExpanded : undefined}
              aria-controls={category.children?.length ? `category-children-${category.id}` : undefined}
              onClick={() => {
                if (category.children?.length) onToggleCategory(category.id);
                else onSelectCategory(category.id);
              }}
            >
              {category.name}
              {category.children?.length ? (
                <span aria-hidden="true" className="ml-3 text-base leading-none text-current">
                  {isExpanded ? "−" : "+"}
                </span>
              ) : null}
            </Button>
            {category.children?.length && isExpanded ? (
              <div id={`category-children-${category.id}`} className="ml-3 mt-2 border-l pl-2">
                <CategoryItems
                  categories={category.children}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={onSelectCategory}
                  expandedCategoryIds={expandedCategoryIds}
                  onToggleCategory={onToggleCategory}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryNavigation({
  categories,
  selectedCategoryId = null,
  onSelectCategory,
  allLabel = "All products",
}: CategoryNavigationProps) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>(() =>
    getAncestorIds(categories, selectedCategoryId),
  );

  useEffect(() => {
    const ancestors = getAncestorIds(categories, selectedCategoryId);
    if (ancestors.length) {
      setExpandedCategoryIds((current) => [...new Set([...current, ...ancestors])]);
    }
  }, [categories, selectedCategoryId]);

  function toggleCategory(categoryId: string) {
    setExpandedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  return (
    <nav aria-label="Product categories" className="space-y-2">
      <Button
        type="button"
        variant={selectedCategoryId === null ? "default" : "ghost"}
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
        expandedCategoryIds={expandedCategoryIds}
        onToggleCategory={toggleCategory}
      />
    </nav>
  );
}
