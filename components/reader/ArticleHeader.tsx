import { Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{article.source.name}</Badge>
        <Badge variant="outline">{article.category.name}</Badge>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={article.publishedAt.toISOString()}>{formattedDate}</time>
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {article.title}
      </h1>

      {article.author && (
        <p className="mb-4 text-sm text-muted-foreground">by {article.author}</p>
      )}

      {article.description && (
        <p className="mb-6 text-lg text-muted-foreground">{article.description}</p>
      )}

      <Button asChild className="gap-2">
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          Read on {article.source.name}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </header>
  );
}
