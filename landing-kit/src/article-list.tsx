import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@zudev/ui/components/card";
import type { Article } from "./types.js";

export interface ArticleListProps {
  articles: Article[];
  articleHref?: (article: Article) => string;
  locale?: string;
}

export function ArticleList({
  articles,
  articleHref = (article) => `/articles/${article.slug}`,
  locale = "en",
}: ArticleListProps) {
  return (
    <ul className="gap-6 grid grid-cols-1 md:grid-cols-2">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={articleHref(article)}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="group-hover:shadow-md p-0 h-full overflow-hidden transition-shadow">
              <img
                src={article.image.src}
                alt={article.image.alt}
                className="w-full object-cover aspect-video"
                loading="lazy"
              />
              <CardContent className="space-y-3 py-5">
                <time
                  dateTime={article.publishedAt}
                  className="text-muted-foreground text-sm"
                >
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(article.publishedAt))}
                </time>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardContent>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  );
}
