'use client';

import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  article: Article;
  index?: number;
}

export function FeedCard({ article, index = 0 }: FeedCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
    >
      <Link
        href={`/article/${article.id}`}
        className={cn(
          'block rounded-xl border border-border/50 bg-card p-4 transition-all duration-200',
          'hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <div className="flex gap-4">
          {/* Article Image */}
          {article.imageUrl && (
            <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 128px, 128px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col gap-2">
            {/* Title */}
            <h3 className="line-clamp-2 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
              {article.title}
            </h3>

            {/* Description */}
            {article.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {article.description}
              </p>
            )}

            {/* Meta */}
            <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                {article.source.name}
              </Badge>
              
              {article.category && (
                <Badge variant="outline" className="font-normal">
                  {article.category.name}
                </Badge>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={article.publishedAt.toISOString()}>{formattedDate}</time>
              </div>

              {article.author && (
                <span className="hidden sm:inline">by {article.author}</span>
              )}
            </div>
          </div>

          {/* External link indicator */}
          <div className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
