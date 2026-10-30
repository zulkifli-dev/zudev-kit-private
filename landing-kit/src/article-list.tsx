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
}

export function ArticleList({
  articles,
  articleHref = (article) => `/articles/${article.slug}`,
  locale = "en",
  actionLabel = "Read more",
}: ArticleListProps) {
  return (
    <ul className="gap-6 grid grid-cols-1 md:grid-cols-2">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={articleHref(article)}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="group-hover:shadow-md gap-0 p-0 h-full overflow-hidden transition-shadow">
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
                <CardTitle className="text-base leading-6">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-sm leading-5">
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
