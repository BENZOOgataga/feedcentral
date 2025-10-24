'use client';

import { useState, useEffect } from 'react';
import { AppTabs } from '@/components/layout/AppTabs';
import { FeedList } from '@/components/feed/FeedList';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { Article, Category } from '@/types';

export default function AppDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        const cats = data.data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          order: 0,
        }));
        
        // Add "All" category
        setCategories([
          { id: 'all', name: 'All', slug: 'all', order: 0 },
          ...cats,
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchArticles(pageNum = 1) {
    try {
      setIsLoading(pageNum === 1);
      const startTime = Date.now();
      const response = await fetch(`/api/articles?page=${pageNum}&pageSize=20`);
      const data = await response.json();

      if (data.success) {
        setArticles(pageNum === 1 ? data.data : [...articles, ...data.data]);
        setHasMore(data.pagination.hasNext);
        setPage(pageNum);
      }

      // Ensure minimum loading time of 1 second for smoother UX
      const elapsed = Date.now() - startTime;
      const minLoadTime = 1000;
      if (elapsed < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    
    try {
      // Trigger cron job manually (requires CRON_API_KEY)
      await fetch('/api/cron/fetch-feeds', {
        method: 'POST',
      });
      
      // Wait a bit then refresh articles
      setTimeout(() => {
        fetchArticles(1);
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh feeds:', error);
      setIsRefreshing(false);
    }
  }

  function handleLoadMore() {
    fetchArticles(page + 1);
  }

  const tabs = categories.map((cat) => ({
    label: cat.name,
    href: cat.slug === 'all' ? '/app' : `/app/${cat.slug}`,
    value: cat.slug,
  }));

  return (
    <div>
      {/* Category Tabs */}
      <AppTabs tabs={tabs} />

      {/* Feed Content */}
      <div className="content-container px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            All Feeds
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest articles from your subscribed sources
          </p>
        </div>
        
        <div>


        {/* Feed List */}
        {isLoading && page === 1 ? (
          <FeedSkeleton count={5} />
        ) : articles.length > 0 ? (
          <>
            <FeedList articles={articles} />
            
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="rounded-lg border border-white/10 bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
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
