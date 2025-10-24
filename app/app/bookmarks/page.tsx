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
      const response = await fetch('/api/bookmarks');
      const data = await response.json();

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
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} className="px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>
          <FeedSkeleton count={3} />
        </div>
      </div>
    );
  }

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} className="px-4 py-8">
          <div className="text-center space-y-6" style={{ maxWidth: '32rem', margin: '0 auto' }}>
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
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} className="px-4 py-8">
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
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} className="px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>
          <EmptyState
            title="No bookmarks yet"
            description="Start bookmarking articles to build your reading list. You'll see a bookmark button on every article."
          />
          <div className="text-center mt-6">
            <Link href="/app">
              <Button>Browse Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show bookmarks
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }} className="px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <span className="text-sm text-neutral-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <div className="space-y-4">
          {bookmarks.map((bookmark, index) => (
            <div key={bookmark.id} className="relative group">
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
