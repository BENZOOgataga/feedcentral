'use client';

import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    }
  }, [user, article.id]);

  async function checkBookmarkStatus() {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();

      if (data.success) {
        const bookmarked = data.data.some((b: any) => b.articleId === article.id);
        setIsBookmarked(bookmarked);
      }
    } catch (err) {
      console.error('Failed to check bookmark status:', err);
    }
  }

  async function toggleBookmark() {
    if (!user) {
      router.push('/login');
      return;
    }

    setBookmarkLoading(true);

    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch('/api/bookmarks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      });

      const data = await response.json();

      if (data.success) {
        setIsBookmarked(!isBookmarked);
      } else {
        console.error('Failed to toggle bookmark:', data.error);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  }

  return (
    <header className="mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{article.source.name}</Badge>
        <Badge variant="outline">{article.category.name}</Badge>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={typeof article.publishedAt === 'string' ? article.publishedAt : article.publishedAt.toISOString()}>{formattedDate}</time>
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {decodeHtmlEntities(article.title)}
      </h1>

      {article.author && (
        <p className="mb-6 text-sm text-muted-foreground">by {decodeHtmlEntities(article.author)}</p>
      )}

      <div className="flex gap-2">
        <Button asChild className="gap-2">
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read on {article.source.name}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleBookmark}
          disabled={bookmarkLoading}
          title={user ? (isBookmarked ? 'Remove bookmark' : 'Add bookmark') : 'Sign in to bookmark'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
