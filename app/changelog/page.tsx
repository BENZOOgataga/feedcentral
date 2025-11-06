'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, Zap, Database, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChangelogEntry {
  version: string;
  name: string; // Human-readable release name
  type: 'major' | 'minor' | 'patch'; // Semantic versioning type
  date: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'removal';
    description: string;
    details?: string; // Optional extended explanation
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    name: 'Database Optimization & Changelog',
    type: 'minor',
    date: 'November 6, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Added article retention warning in bookmarks page to inform users about automatic cleanup',
        details: 'A prominent information banner now appears on the bookmarks page, clearly explaining that unbookmarked articles are removed after 7 days while bookmarked articles are preserved forever. This helps users understand the importance of bookmarking content they want to keep.',
      },
      {
        type: 'feature',
        description: 'Added changelog page to track FeedCentral updates and improvements',
        details: 'This dedicated changelog page provides a comprehensive history of all updates, organized by version with color-coded tags for different change types. Includes expandable cards for detailed explanations and a legend to help users understand what each update means.',
      },
      {
        type: 'improvement',
        description: 'Optimized article retention to 7 days (down from 30 days) to reduce database usage by 64%',
        details: 'Articles older than 7 days are now automatically soft-deleted unless they are bookmarked. This aggressive cleanup strategy helps keep database size under control on the free tier. Hard-deletion occurs after 14 days for permanently removing unbookmarked articles from the database.',
      },
      {
        type: 'improvement',
        description: 'Bookmarked articles are now permanently preserved and never deleted',
        details: 'The cleanup system is smart enough to detect bookmarked articles and exclude them from both soft-delete and hard-delete operations. Bookmarked articles are also archived with their full metadata (title, description, images, source info) to ensure they remain accessible even if the original source is removed.',
      },
      {
        type: 'improvement',
        description: 'Replaced admin panel link with changelog link on landing page for better user experience',
      },
      {
        type: 'fix',
        description: 'Fixed gradient banding artifacts on landing page and changelog header for smoother visuals',
        details: 'Removed CSS gradients that were causing visible color banding (horizontal lines) on certain displays. Replaced with solid backgrounds for a clean, professional appearance without visual artifacts.',
      },
    ],
  },
  {
    version: '1.0.5',
    name: 'Automated Cleanup System',
    type: 'patch',
    date: 'November 5, 2025',
    changes: [
      {
        type: 'removal',
        description: 'Removed one-time migration endpoints to clean up API surface',
        details: 'Temporary API endpoints used for initial database migrations were removed after successful deployment. These endpoints were only needed during the transition period and posed a potential security risk if left active in production.',
      },
      {
        type: 'feature',
        description: 'Implemented automated article cleanup system with soft-delete (7 days) and hard-delete (14 days) strategies',
        details: 'A three-tier cleanup strategy: (1) Soft-delete unbookmarked articles after 7 days by setting a deletedAt timestamp, (2) Archive bookmarked articles with preserved metadata, and (3) Hard-delete very old unbookmarked articles after 14 days to permanently free up database space.',
      },
      {
        type: 'feature',
        description: 'Added crontab configuration and automated feed refresh scripts for production deployment',
        details: 'Production server now runs automated tasks: feed fetching every 30 minutes to keep content fresh, and article cleanup daily at 2 AM to maintain database health. Both scripts include detailed logging and error handling for reliable operation.',
      },
      {
        type: 'improvement',
        description: 'Added soft-delete migration support for production database',
      },
    ],
  },
  {
    version: '1.0.4',
    name: 'Bookmarks & User Experience',
    type: 'patch',
    date: 'November 4, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Complete bookmarks feature: user-linked bookmarks with full CRUD API and dedicated UI',
        details: 'Users can now save their favorite articles with a one-click bookmark button. Bookmarked articles are permanently preserved and will never be deleted by the automatic cleanup system. The bookmarks page provides a clean interface to manage all saved articles.',
      },
      {
        type: 'feature',
        description: 'Added database migration for bookmarks table with SQL scripts and API endpoints',
      },
      {
        type: 'improvement',
        description: 'Replaced password change dialog with toast notifications for better UX',
      },
      {
        type: 'fix',
        description: 'Fixed empty preferences route that was causing build errors',
      },
    ],
  },
  {
    version: '1.0.3',
    name: 'Search Performance & Registration',
    type: 'patch',
    date: 'November 3, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Added user registration with password recovery warning and admin contact guidance',
        details: 'New users can now create accounts with a clear warning that password recovery via email is not available. If users forget their password, they must contact the administrator for a manual reset. This is clearly communicated during registration to set proper expectations.',
      },
      {
        type: 'feature',
        description: 'Implemented Google-like relevance ranking for search results',
        details: 'Search results are now ranked by relevance using multiple factors: exact title matches are prioritized, followed by partial title matches, then description matches. This ensures the most relevant articles appear at the top of search results, similar to how Google ranks pages.',
      },
      {
        type: 'improvement',
        description: 'Optimized search modal animations to 120fps with GPU acceleration and spring physics',
        details: 'Search interactions now feel incredibly smooth and responsive. By leveraging GPU acceleration (will-change CSS hints) and optimized transition timings, the search modal animates at up to 120fps on capable displays. Spring physics create natural, fluid motion.',
      },
      {
        type: 'improvement',
        description: 'Enhanced search bar with smooth 300ms animations and GPU acceleration',
      },
      {
        type: 'fix',
        description: 'Fixed search bar width, padding, and API response structure issues',
      },
    ],
  },
  {
    version: '1.0.2',
    name: 'Layout Fixes & Security',
    type: 'patch',
    date: 'November 2, 2025',
    changes: [
      {
        type: 'removal',
        description: 'Removed Cmd+K keyboard shortcut indicator from search bar for cleaner UI',
        details: 'The Cmd+K (or Ctrl+K) keyboard shortcut badge was removed from the search bar to reduce visual clutter. The shortcut still works, but the UI is now cleaner and more minimalist. Power users can still use the keyboard shortcut without the visual indicator.',
      },
      {
        type: 'removal',
        description: 'Removed default credentials text from login page for better security',
        details: 'Removed the display of default admin credentials from the login page to improve security. While this was helpful during development, showing credentials publicly is a security risk in production. Users should receive credentials securely through other channels.',
      },
      {
        type: 'feature',
        description: 'Added placeholder pages for Bookmarks, Dashboard, and Settings',
      },
      {
        type: 'improvement',
        description: 'Removed Cmd+K keyboard shortcut indicator and default credentials from login page',
      },
      {
        type: 'fix',
        description: 'Fixed Feed nav item staying active when navigating to other sections',
      },
      {
        type: 'fix',
        description: 'Fixed width 0px issues in content containers across the application',
        details: 'Resolved a critical layout bug where content containers would sometimes render at 0px width due to Tailwind CSS class conflicts. Added explicit inline width styles and fixed arbitrary value handling to ensure consistent, responsive layouts across all pages.',
      },
      {
        type: 'fix',
        description: 'Resolved text wrapping issues on placeholder pages with proper max-width and padding',
      },
    ],
  },
  {
    version: '1.0.1',
    name: 'Deployment Fixes',
    type: 'patch',
    date: 'November 1, 2025',
    changes: [
      {
        type: 'removal',
        description: 'Removed debug endpoints after fixing database connection issues',
        details: 'Temporary debugging endpoints that were used to diagnose Prisma and Neon adapter connection issues have been removed. These endpoints exposed internal system information and were only needed during troubleshooting. Removing them improves security and reduces API surface area.',
      },
      {
        type: 'removal',
        description: 'Removed temporary setup endpoints after successful deployment',
      },
      {
        type: 'improvement',
        description: 'Allowed all HTTPS images in Next.js config for article thumbnails',
        details: 'Updated Next.js image optimization configuration to accept images from any HTTPS source. This is necessary because RSS feeds reference images from various domains, and trying to maintain a whitelist of all possible sources would be impractical. Only HTTPS sources are allowed for security.',
      },
      {
        type: 'fix',
        description: 'Fixed admin user creation and email configuration',
      },
      {
        type: 'fix',
        description: 'Resolved Prisma client issues with Neon adapter and Vercel deployment',
        details: 'Fixed multiple issues with Prisma deployment on Vercel: configured the Neon serverless adapter correctly, set proper connection pooling, resolved binary bundling issues, and ensured the database client initializes correctly in edge runtime. This involved extensive trial and error with Prisma 6.x and Vercel edge functions.',
      },
      {
        type: 'fix',
        description: 'Fixed database connection pooling with proper environment variables',
      },
      {
        type: 'fix',
        description: 'Multiple fixes for seed endpoint and database schema alignment',
      },
    ],
  },
  {
    version: '1.0.0',
    name: 'Initial Release',
    type: 'major',
    date: 'October 25, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Initial release of FeedCentral RSS aggregator with Vercel-like design system',
      },
      {
        type: 'feature',
        description: 'User authentication and authorization with JWT tokens',
      },
      {
        type: 'feature',
        description: 'Automatic RSS feed fetching and article aggregation',
      },
      {
        type: 'feature',
        description: 'Admin panel for managing sources, categories, and users',
      },
      {
        type: 'feature',
        description: 'Full-text search with relevance ranking',
      },
      {
        type: 'feature',
        description: 'Responsive design with dark mode support',
      },
      {
        type: 'feature',
        description: 'PostgreSQL database with Prisma ORM',
      },
      {
        type: 'feature',
        description: 'Vercel deployment with automatic HTTPS and edge caching',
      },
    ],
  },
];

const getUpdateTypeBadge = (type: 'major' | 'minor' | 'patch') => {
  const styles = {
    major: {
      bg: 'bg-purple-500/10 border-purple-500/30',
      text: 'text-purple-400',
      label: 'Major Update',
    },
    minor: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-400',
      label: 'Minor Update',
    },
    patch: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-400',
      label: 'Patch',
    },
  };
  
  return styles[type];
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <Sparkles className="h-4 w-4 text-blue-500" />;
    case 'improvement':
      return <Zap className="h-4 w-4 text-green-500" />;
    case 'fix':
      return <Shield className="h-4 w-4 text-orange-500" />;
    case 'removal':
      return <Database className="h-4 w-4 text-red-500" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-neutral-500" />;
  }
};

const getTypeBadge = (type: string) => {
  const styles = {
    feature: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    improvement: 'bg-green-500/10 text-green-500 border-green-500/20',
    fix: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    removal: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return styles[type as keyof typeof styles] || 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
};

export default function ChangelogPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const toggleExpanded = (entryIndex: number, changeIndex: number) => {
    const key = `${versionIndex}-${changeIndex}`;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const isExpanded = (entryIndex: number, changeIndex: number) => {
    return expandedItems.has(`${entryIndex}-${changeIndex}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(changelog.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedChangelog = changelog.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Changelog
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              Track all updates, improvements, and new features added to FeedCentral
            </p>

            {/* Warning Notice */}
            <div className="mb-8 mx-auto max-w-2xl rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <strong className="font-semibold">Note:</strong> This changelog reflects changes made to this specific FeedCentral instance. 
                    Some details may differ from other deployments, such as database content, configuration settings, or custom features.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/app">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Legend */}
          <div className="mb-12 rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Legend</h3>
            
            {/* Update Types Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Update Types</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-purple-500/10 border-purple-500/30 text-purple-400">
                    Major Update
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    Significant releases with major new features, architectural changes, or important milestones
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-blue-500/10 border-blue-500/30 text-blue-400">
                    Minor Update
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    New features and enhancements that expand functionality without breaking existing features
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-green-500/10 border-green-500/30 text-green-400">
                    Patch
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    Bug fixes, security updates, and small improvements that don't add new features
                  </p>
                </div>
              </div>
            </div>

            {/* Change Types Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Change Types</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">Feature</span>
                    <p className="text-xs text-muted-foreground break-words">New capabilities and additions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">Improvement</span>
                    <p className="text-xs text-muted-foreground break-words">Enhancements and optimizations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">Fix</span>
                    <p className="text-xs text-muted-foreground break-words">Bug fixes and corrections</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">Removal</span>
                    <p className="text-xs text-muted-foreground break-words">Deprecated or removed features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {paginatedChangelog.map((entry, index) => {
              const actualIndex = startIndex + index;
              return (
              <div key={entry.version} className="relative">
                {/* Timeline line */}
                {index !== paginatedChangelog.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-border/50" />
                )}

                {/* Entry Card */}
                <div className="relative rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg">
                  {/* Version Badge */}
                  <div className="absolute -left-3 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary border-4 border-background">
                    <span className="text-sm font-bold text-primary-foreground">
                      {entry.changes.length}
                    </span>
                  </div>

                  {/* Header */}
                  <div className="mb-6 pl-12">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-foreground truncate max-w-[600px]" title={entry.name}>
                        {entry.name}
                      </h2>
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getUpdateTypeBadge(entry.type).bg} ${getUpdateTypeBadge(entry.type).text}`}>
                        {getUpdateTypeBadge(entry.type).label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{entry.date}</span>
                      </div>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="font-mono text-xs bg-muted/30 px-2 py-0.5 rounded">
                        v{entry.version}
                      </span>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-3 pl-12">
                    {entry.changes.map((change, changeIndex) => {
                      const hasDetails = !!change.details;
                      const itemKey = `${actualIndex}-${changeIndex}`;
                      const expanded = isExpanded(actualIndex, changeIndex);
                      
                      return (
                        <div
                          key={changeIndex}
                          className={`rounded-lg border border-border/30 bg-muted/20 transition-all ${
                            hasDetails 
                              ? 'cursor-pointer hover:bg-muted/40 hover:border-border/50 hover:shadow-md active:scale-[0.99]' 
                              : ''
                          }`}
                          onClick={() => hasDetails && toggleExpanded(actualIndex, changeIndex)}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <div className="mt-0.5">
                              {getTypeIcon(change.type)}
                            </div>
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getTypeBadge(change.type)}`}>
                                  {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                                </span>
                                {hasDetails && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <svg 
                                      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="font-medium">Click for details</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-foreground break-words">
                                {change.description}
                              </p>
                              {hasDetails && expanded && (
                                <div className="mt-3 pt-3 border-t border-border/30">
                                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                                    {change.details}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Entry Footer */}
                  <div className="mt-6 pt-4 border-t border-border/30 pl-12">
                    <p className="text-xs text-muted-foreground">
                      To report bugs or issues,{' '}
                      <Link 
                        href="/issues"
                        className="text-primary hover:underline font-medium"
                      >
                        visit our issues page
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, changelog.length)} of {changelog.length} releases
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Want to suggest a feature or report an issue?{' '}
              <Link href="/app/settings" className="text-primary hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
