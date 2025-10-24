'use client';

import { use, useState, useEffect } from 'react';
import { Article, Category } from '@/types';
import { AppTabs } from '@/components/layout/AppTabs';
import { FeedList } from '@/components/feed/FeedList';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { Button } from '@/components/ui/button';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1); // Reset page when category changes
    fetchArticles(1);
  }, [category]);

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

        // Find current category name
        const currentCat = cats.find((c: any) => c.slug === category);
        setCategoryName(currentCat?.name || category);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchArticles(pageNum = page) {
    try {
      setLoading(pageNum === 1);
      const response = await fetch(
        `/api/articles?category=${category}&page=${pageNum}&pageSize=20`
      );
      const data = await response.json();

      if (data.success) {
        setArticles(pageNum === 1 ? data.data : [...articles, ...data.data]);
        setHasMore(data.pagination.hasNext);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    fetchArticles(page + 1);
  }

  const tabs = categories.map((cat) => ({
    label: cat.name,
    href: cat.slug === 'all' ? '/app' : `/app/${cat.slug}`,
    value: cat.slug,
  }));

  return (
    <div style={{ width: '100%' }}>
      {/* Category Tabs */}
      <AppTabs tabs={tabs} />

      {/* Feed Content */}
      <div className="content-container px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {categoryName || category}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest articles in {categoryName?.toLowerCase() || category}
          </p>
        </div>

        {/* Articles */}
        {loading && page === 1 ? (
          <FeedSkeleton count={5} />
        ) : !loading && articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description={`No articles in the ${categoryName || category} category yet.`}
          />
        ) : (
          <div className="space-y-6">
            <FeedList articles={articles} />

            {hasMore && (
              <div className="flex justify-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
