'use client';

import { Article } from '@/types';
import { FeedCard } from './FeedCard';

interface FeedListProps {
  articles: Article[];
}

export function FeedList({ articles }: FeedListProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <FeedCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
