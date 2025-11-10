 'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Article, Category } from '@/types';
import { AppTabs } from '@/components/layout/AppTabs';
import { FeedList } from '@/components/feed/FeedList';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const t = useTranslations();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [jumpPage, setJumpPage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset page when category changes and read optional ?page= param
    const param = searchParams?.get ? searchParams.get('page') : null;
    const parsed = param ? parseInt(param, 10) : NaN;
    const initialPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    setPage(initialPage);
    fetchArticles(initialPage, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

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
        
        // Add "All" category with translation
        setCategories([
          { id: 'all', name: t('category.all'), slug: 'all', order: 0 },
          ...cats,
        ]);

        // Find current category name and translate it
        const currentCat = data.data.categories.find((c: any) => c.slug === category);
        const translatedName = currentCat ? t(`category.${currentCat.slug}`) : category;
        setCategoryName(translatedName);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchArticles(pageNum = page, opts: { append?: boolean } = { append: false }) {
    try {
      setLoading(pageNum === 1);
      const response = await fetch(`/api/articles?category=${category}&page=${pageNum}&pageSize=20`);
      const data = await response.json();

      if (data.success) {
        if (opts.append) {
          setArticles((prev) => [...prev, ...data.data]);
        } else {
          setArticles(data.data);
        }

        setHasMore(data.pagination.hasNext);
        setPage(pageNum);

        if (data.pagination && typeof data.pagination.totalPages === 'number') {
          setTotalPages(data.pagination.totalPages);
        } else {
          setTotalPages(null);
        }

        // update URL so the page is shareable (replace to avoid polluting history)
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('page', String(pageNum));
          router.replace(url.pathname + url.search);
        } catch (err) {
          // ignore
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    fetchArticles(page + 1, { append: true });
  }

  function handleJumpToPage() {
    const p = parseInt(jumpPage, 10);
    if (!Number.isFinite(p) || p < 1) return;
    if (totalPages && p > totalPages) return;
    fetchArticles(p, { append: false });
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
            {categoryName || category}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('category.latestArticles', { category: categoryName?.toLowerCase() || category })}
          </p>
        </div>

        {/* Articles */}
        {loading && page === 1 ? (
          <FeedSkeleton count={5} />
        ) : !loading && articles.length === 0 ? (
          <EmptyState
            title={t('category.empty.title')}
            description={t('category.empty.description', { category: categoryName || category })}
          />
        ) : (
          <div className="space-y-6">
            <FeedList articles={articles} />

            {hasMore && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    placeholder={t('common.page') || 'Page'}
                    className={cn('w-20')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleJumpToPage();
                    }}
                    aria-label={t('common.page') || 'Page'}
                  />

                  <Button onClick={handleJumpToPage} disabled={loading || jumpPage.trim() === ''} size="sm">
                    Go
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button onClick={loadMore} disabled={loading} variant="outline">
                    {loading ? t('common.loading') : t('appPage.loadMore')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
