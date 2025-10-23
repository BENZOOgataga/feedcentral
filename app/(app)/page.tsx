'use client';

import { useState } from 'react';
import { AppTabs } from '@/components/layout/AppTabs';
import { FeedList } from '@/components/feed/FeedList';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { Article, Category } from '@/types';

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  { id: '1', name: 'All', slug: 'all', order: 0 },
  { id: '2', name: 'Technology', slug: 'tech', order: 1 },
  { id: '3', name: 'Science', slug: 'science', order: 2 },
  { id: '4', name: 'Business', slug: 'business', order: 3 },
];

const tabs = mockCategories.map((cat) => ({
  label: cat.name,
  href: cat.slug === 'all' ? '/app' : `/app/${cat.slug}`,
  value: cat.slug,
}));

export default function AppDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div>
      {/* Category Tabs */}
      <AppTabs tabs={tabs} />

      {/* Feed Content */}
      <div className="content-container px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              All Feeds
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest articles from your subscribed sources
            </p>
          </div>

          {/* Feed List */}
          {isLoading ? (
            <FeedSkeleton count={5} />
          ) : articles.length > 0 ? (
            <FeedList articles={articles} />
          ) : (
            <EmptyState
              title="No articles yet"
              description="Add some RSS sources or refresh your feeds to get started."
              action={{
                label: 'Refresh Feeds',
                onClick: handleRefresh,
                loading: isRefreshing,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
