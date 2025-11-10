'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppTabs } from '@/components/layout/AppTabs';
import { FeedList } from '@/components/feed/FeedList';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { AccountBenefitsBanner } from '@/components/feed/AccountBenefitsBanner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { Article, Category } from '@/types';

export default function AppDashboard() {
  const t = useTranslations();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [jumpPage, setJumpPage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read initial page from URL query param if present
    const param = searchParams?.get ? searchParams.get('page') : null;
    const parsed = param ? parseInt(param, 10) : NaN;
    const initialPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

    // Fetch categories and the initial page (parallel)
    Promise.all([fetchCategories(), fetchArticles(initialPage)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        const cats = data.data.categories.map((cat: any) => ({
          id: cat.id,
          name: t(`category.${cat.slug}`),
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          order: 0,
        }));
        
        // Add "All" category
        setCategories([
          { id: 'all', name: t('category.all'), slug: 'all', order: 0 },
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
      const response = await fetch(`/api/articles?page=${pageNum}&pageSize=20`);
      const data = await response.json();

      if (data.success) {
        // Use paginated pages (replace the list on page change)
        setArticles(data.data);
        setHasMore(data.pagination.hasNext);
        setPage(pageNum);

        // If the API provides total pages, keep it
        if (data.pagination && typeof data.pagination.totalPages === 'number') {
          setTotalPages(data.pagination.totalPages);
        } else {
          setTotalPages(null);
        }

        // Update the URL query param so the page is shareable
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('page', String(pageNum));
          router.replace(url.pathname + url.search);
        } catch (err) {
          // ignore router update errors in dev
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
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

  function handleNextPage() {
    fetchArticles(page + 1);
  }

  function handlePrevPage() {
    if (page > 1) fetchArticles(page - 1);
  }

  function handleJumpToPage() {
    const p = parseInt(jumpPage, 10);
    if (!Number.isFinite(p) || p < 1) return;
    // If totalPages is known, clamp the requested page
    if (totalPages && p > totalPages) return;
    fetchArticles(p);
    setJumpPage('');
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
            {t('appPage.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('appPage.subtitle')}
          </p>
        </div>

        {/* Account Benefits Banner (only for non-authenticated users) */}
        {!user && <AccountBenefitsBanner />}
        
        <div>


        {/* Feed List */}
        {initialLoad ? (
          <FeedSkeleton count={3} />
        ) : articles.length > 0 ? (
          <>
            <FeedList articles={articles} />

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={isLoading || page === 1}
              >
                {t('common.prev') || 'Prev'}
              </Button>

              <div className="text-sm text-muted-foreground">{`${t('common.page') || 'Page'} ${page}${totalPages ? ` / ${totalPages}` : ''}`}</div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder={t('common.page') || 'Page'}
                  className="w-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJumpToPage();
                  }}
                  aria-label={t('common.page') || 'Page'}
                />

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleJumpToPage}
                  disabled={isLoading || jumpPage.trim() === ''}
                >
                  Go
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={isLoading || !hasMore}
              >
                {isLoading ? t('common.loading') : t('common.next') || 'Next'}
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            title={t('feed.empty.title')}
            description={t('feed.empty.description')}
            action={{
              label: t('appPage.refreshFeeds'),
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
