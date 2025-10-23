'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArticleHeader } from '@/components/reader/ArticleHeader';
import { ArticleContent } from '@/components/reader/ArticleContent';
import { Article } from '@/types';

// Mock article fetching - replace with actual API call
async function getArticle(id: string): Promise<Article | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return null; // Replace with actual fetch
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  // For now, return a mock state - in production, use proper data fetching
  const article = null as Article | null;

  if (!article) {
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
