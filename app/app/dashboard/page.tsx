'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks/useAuth';
import { LayoutDashboard, BookmarkIcon, Eye, TrendingUp, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalBookmarks: number;
  articlesRead: number;
  recentActivity: number;
  favoriteCategory?: {
    name: string;
    color: string;
    count: number;
  };
}

interface RecentArticle {
  id: string;
  title: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookmarks: 0,
    articlesRead: 0,
    recentActivity: 0,
  });
  const [recentBookmarks, setRecentBookmarks] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    try {
      const startTime = Date.now();
      
      // Fetch bookmarks to calculate stats
      const bookmarksRes = await fetch('/api/bookmarks');
      const bookmarksData = await bookmarksRes.json();

      if (bookmarksData.success) {
        const bookmarks = bookmarksData.data;
        
        // Calculate stats
        const categoryCount: Record<string, { name: string; color: string; count: number }> = {};
        
        bookmarks.forEach((bookmark: any) => {
          const catName = bookmark.article.category.name;
          if (!categoryCount[catName]) {
            categoryCount[catName] = {
              name: catName,
              color: bookmark.article.category.color || '#7C5CFF',
              count: 0,
            };
          }
          categoryCount[catName].count++;
        });

        // Find favorite category (most bookmarked)
        const categories = Object.values(categoryCount);
        const favoriteCategory = categories.length > 0
          ? categories.reduce((max, cat) => cat.count > max.count ? cat : max)
          : undefined;

        // Get recent bookmarks (last 5)
        const recent = bookmarks
          .slice(0, 5)
          .map((b: any) => ({
            id: b.article.id,
            title: b.article.title,
            source: b.article.source,
            publishedAt: b.article.publishedAt,
          }));

        setStats({
          totalBookmarks: bookmarks.length,
          articlesRead: bookmarks.length, // For now, articles read = bookmarks
          recentActivity: bookmarks.filter((b: any) => {
            const bookmarkDate = new Date(b.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return bookmarkDate >= sevenDaysAgo;
          }).length,
          favoriteCategory,
        });

        setRecentBookmarks(recent);
      }

      // Ensure minimum loading time for smooth UX
      const elapsed = Date.now() - startTime;
      const minLoadTime = 800;
      if (elapsed < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background" style={{ width: '100%' }}>
        <div className="content-container px-4 py-8 sm:px-6" style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-lg bg-muted p-2 w-10 h-10 animate-pulse" />
              <div className="h-9 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-full bg-muted p-3 w-12 h-12 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookmarks Skeleton */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="space-y-2">
                    <div className="h-5 w-full bg-muted rounded animate-pulse" />
                    <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Bookmarks',
      value: stats.totalBookmarks,
      icon: BookmarkIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Articles saved',
    },
    {
      title: 'Articles Read',
      value: stats.articlesRead,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Total viewed',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Last 7 days',
    },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ width: '100%' }}>
      <div className="content-container px-4 py-8 sm:px-6" style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user.name}! Here's an overview of your reading activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Favorite Category */}
          {stats.favoriteCategory && (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Favorite Category
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: stats.favoriteCategory.color + '20',
                    color: stats.favoriteCategory.color,
                  }}
                >
                  📚
                </div>
                <div>
                  <p className="font-semibold text-foreground" style={{ color: stats.favoriteCategory.color }}>
                    {stats.favoriteCategory.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.favoriteCategory.count} bookmarked articles
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/app"
                className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Browse Latest Articles</span>
              </Link>
              <Link
                href="/app/bookmarks"
                className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors"
              >
                <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">View All Bookmarks</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Bookmarks */}
        {recentBookmarks.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Bookmarks</h2>
              <Link
                href="/app/bookmarks"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentBookmarks.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="block rounded-lg border border-border bg-card p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{article.source.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats.totalBookmarks === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <BookmarkIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No bookmarks yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start saving articles to see your reading stats and activity here.
            </p>
            <Link href="/app">
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Browse Articles
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
