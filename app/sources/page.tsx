'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rss, ExternalLink, ArrowLeft, Globe, Calendar, BarChart3, Radio } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface Source {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  logoUrl: string | null;
  lastFetchedAt: string | null;
  category: Category;
  _count: {
    articles: number;
  };
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedSources, setGroupedSources] = useState<Record<string, Source[]>>({});

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources');
      const data = await response.json();
      
      if (data.sources) {
        setSources(data.sources);
        
        // Group sources by category
        const grouped = data.sources.reduce((acc: Record<string, Source[]>, source: Source) => {
          const categoryName = source.category.name;
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(source);
          return acc;
        }, {});
        
        setGroupedSources(grouped);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Rss className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                RSS Feed Sources
              </h1>
              
              <p className="mb-8 text-lg text-muted-foreground">
                All RSS feeds aggregated by FeedCentral
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>{sources.length} Active Sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{Object.keys(groupedSources).length} Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-xl border border-border/50 bg-card"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedSources).map(([categoryName, categorySources]) => (
                <section key={categoryName}>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">
                    {categoryName}
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categorySources.map((source) => (
                      <div
                        key={source.id}
                        className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          {source.logoUrl ? (
                            <img
                              src={source.logoUrl}
                              alt={source.name}
                              className="h-12 w-12 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Rss className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary">
                              {source.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {source._count.articles} articles
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {formatDate(source.lastFetchedAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate hover:text-primary"
                            >
                              {new URL(source.url).hostname}
                            </a>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Visit Site
                            </Button>
                          </a>
                          <a
                            href={source.feedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              <Rss className="mr-2 h-3 w-3" />
                              RSS Feed
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {!loading && sources.length === 0 && (
            <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
              <Rss className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No Sources Found</h3>
              <p className="text-sm text-muted-foreground">
                There are currently no active RSS feed sources.
              </p>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
              <Radio className="h-4 w-4 shrink-0" />
              About These Sources
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              These are the <strong className="text-foreground">official RSS feed sources</strong> for 
              the FeedCentral instance at{' '}
              <a 
                href="https://feed.benzoogataga.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                feed.benzoogataga.com
              </a>
              . Third-party forks may use different sources.
            </p>
            <p className="text-xs text-muted-foreground">
              All content is fetched directly from these RSS feeds. FeedCentral aggregates and displays 
              articles but does not host the original content. Each article links back to its original source.
              These sources do not include user-specific feeds or personalized subscriptions.
              If you're a source owner and want to be removed or have questions, please{' '}
              <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                contact us
              </a>
              .
            </p>
          </div>

          {/* Support Note */}
          <div className="mt-8 rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Like FeedCentral? Consider supporting on{' '}
              <a 
                href="https://www.patreon.com/BENZOOgataga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold"
              >
                Patreon
              </a>
              {' '}or just star us on{' '}
              <a 
                href="https://github.com/BENZOOgataga/feedcentral" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
