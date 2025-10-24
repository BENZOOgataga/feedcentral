'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArticleHeader } from '@/components/reader/ArticleHeader';
import { ArticleContent } from '@/components/reader/ArticleContent';
import { Article } from '@/types';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  async function fetchArticle() {
    try {
      const startTime = Date.now();
      const response = await fetch(`/api/articles/${id}`);
      const data = await response.json();

      if (data.success) {
        setArticle(data.data);
      } else {
        setError(true);
      }

      // Ensure minimum loading time of 1 second for smoother UX
      const elapsed = Date.now() - startTime;
      const minLoadTime = 1000;
      if (elapsed < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
      }
    } catch (err) {
      console.error('Failed to fetch article:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="content-container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 rounded bg-neutral-800" />
            <div className="h-12 w-3/4 rounded bg-neutral-800" />
            <div className="h-6 w-1/2 rounded bg-neutral-800" />
            <div className="space-y-2">
              <div className="h-4 rounded bg-neutral-800" />
              <div className="h-4 rounded bg-neutral-800" />
              <div className="h-4 w-5/6 rounded bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="content-container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-2xl font-bold">Article not found</h1>
          <p className="mb-6 text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/app">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="content-container px-4 py-8 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>
        </Button>

        {/* Article */}
        <ArticleHeader article={article} />
        
        {article.content && (
          <div className="mt-8 border-t border-border pt-8">
            <ArticleContent content={article.content} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
