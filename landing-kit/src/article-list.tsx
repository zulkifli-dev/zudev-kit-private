import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@zudev/ui/components/card";
import { ImagePlaceholder } from "./image-placeholder.js";
import type { Article } from "./types.js";

export interface ArticleListProps {
  articles: Article[];
  articleHref?: (article: Article) => string;
  locale?: string;
  actionLabel?: string;
  className?: string;
}

export function ArticleList({
  articles,
  articleHref = (article) => `/articles/${article.slug}`,
  locale = "en",
  actionLabel = "Read more",
  className = "",
}: ArticleListProps) {
  return (
    <ul className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${className}`}>
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={articleHref(article)}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full gap-0 overflow-hidden border-0 p-0 shadow-none transition-shadow group-hover:shadow-md">
              {article.image.src ? (
                <img
                  src={article.image.src}
                  alt={article.image.alt}
                  className="w-full object-cover aspect-video"
                  loading="lazy"
                />
              ) : (
                <ImagePlaceholder
                  alt={article.image.alt}
                  className="aspect-video w-full rounded-none"
                  label="Article image"
                />
              )}
              <CardContent className="flex flex-col gap-2 px-4 py-4">
                <time
                  dateTime={article.publishedAt}
                  className="text-muted-foreground text-xs font-medium leading-4"
                >
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(article.publishedAt))}
                </time>
                <CardTitle className="text-sm font-semibold leading-5">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-xs leading-[1.45]">
                  {article.excerpt}
                </CardDescription>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-foreground">
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
