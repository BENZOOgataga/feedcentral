'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { FeedCard } from '@/components/feed/FeedCard';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { EmptyState } from '@/components/feed/EmptyState';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Bookmark {
  id: string;
  articleId: string;
  createdAt: string;
  article: {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl: string | null;
    author: string | null;
    publishedAt: string;
    isDeleted?: boolean; // Flag for soft-deleted articles
    source: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export default function BookmarksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      fetchBookmarks();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  async function fetchBookmarks() {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      const response = await fetch('/api/bookmarks');
      const data = await response.json();

      // Ensure minimum 1 second loading time for smooth UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (data.success) {
        setBookmarks(data.data);
      } else {
        setError(data.error || 'Failed to fetch bookmarks');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(articleId: string) {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setBookmarks(bookmarks.filter(b => b.articleId !== articleId));
      } else {
        console.error('Failed to remove bookmark:', data.error);
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  }

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="w-full">
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Bookmarks</h1>
            <div className="h-5 w-16 bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <FeedSkeleton count={1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <div className="w-full">
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold mb-3">📚 Save Your Favorite Articles</h1>
              <p className="text-neutral-400 text-lg">
                Create an account or sign in to bookmark articles and access them anytime.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900 p-6 space-y-4">
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-white">Benefits of bookmarking:</h3>
                <ul className="text-sm text-neutral-400 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Save articles to read later</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Access your bookmarks from any device</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Keep track of important stories</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Build your personal reading list</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => router.push('/login')}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="flex-1"
                >
                  Create Account
                </Button>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Once signed in, you'll see a bookmark button on every article
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full">
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (bookmarks.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Bookmarks</h1>
          
          {/* Enhanced Empty State */}
          <div className="mt-8">
            {/* Icon and Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <svg 
                  className="w-10 h-10 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No bookmarks yet
              </h2>
              <p className="text-muted-foreground text-base mx-auto" style={{ maxWidth: '28rem' }}>
                Start saving your favorite articles to build your personal reading collection
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Save for Later</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the bookmark icon on any article to save it
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Access Anywhere</h3>
                    <p className="text-sm text-muted-foreground">
                      Your bookmarks sync across all your devices
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Stay Organized</h3>
                    <p className="text-sm text-muted-foreground">
                      Build your personal library of important articles
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-500/10 p-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Never Lose Track</h3>
                    <p className="text-sm text-muted-foreground">
                      Articles remain saved even if they're removed from feeds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/app">
                <Button size="lg" className="gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Browse Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show bookmarks
  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <span className="text-sm text-neutral-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <div className="space-y-4">
          {bookmarks.map((bookmark, index) => (
            <div key={bookmark.id} className="relative group">
              {/* Deleted article badge */}
              {bookmark.article.isDeleted && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archived
                  </div>
                </div>
              )}
              
              <FeedCard
                article={{
                  ...bookmark.article,
                  source: {
                    id: bookmark.article.source.id,
                    name: bookmark.article.source.name,
                    url: '',
                    feedUrl: '',
                    category: {
                      ...bookmark.article.category,
                      order: 0,
                    },
                    logoUrl: bookmark.article.source.logoUrl || undefined,
                    isActive: true,
                    fetchInterval: 30,
                  },
                  category: {
                    ...bookmark.article.category,
                    order: 0,
                  },
                }}
                index={index}
              />
              <Button
                onClick={() => removeBookmark(bookmark.articleId)}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-900/90 backdrop-blur-sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
