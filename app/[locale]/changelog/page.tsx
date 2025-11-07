'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Zap, Database, Shield, Sparkles } from 'lucide-react';
import { Link } from '@/i18n-navigation';
import { Button } from '@/components/ui/button';
import { changelog, type ChangelogEntry } from '@/lib/changelog-data';
import { markChangelogAsSeen } from '@/components/changelog/ChangelogNotification';
import { useTranslations, useLocale } from 'next-intl';

const getUpdateTypeBadge = (type: 'major' | 'minor' | 'patch', t: any) => {
  const styles = {
    major: {
      bg: 'bg-purple-500/10 border-purple-500/30',
      text: 'text-purple-400',
      label: t('changelog.types.major'),
    },
    minor: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      text: 'text-blue-400',
      label: t('changelog.types.minor'),
    },
    patch: {
      bg: 'bg-green-500/10 border-green-500/30',
      text: 'text-green-400',
      label: t('changelog.types.patch'),
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

// Sort changes by type priority: removal -> feature -> improvement -> fix
const sortChangesByType = (changes: ChangelogEntry['changes']) => {
  const typePriority = {
    removal: 0,
    feature: 1,
    improvement: 2,
    fix: 3,
  };
  
  return [...changes].sort((a, b) => {
    return typePriority[a.type] - typePriority[b.type];
  });
};

export default function ChangelogPage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const entriesRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const ITEMS_PER_PAGE = 5;
  
  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mark changelog as seen when page is visited
  useEffect(() => {
    markChangelogAsSeen();
  }, []);

  const toggleExpanded = (entryIndex: number, changeIndex: number) => {
    const key = `${entryIndex}-${changeIndex}`;
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
    // Scroll to entries section when paginating
    if (entriesRef.current) {
      const headerOffset = 20; // Small offset from top
      const elementPosition = entriesRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
              {t('changelog.title')}
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              {t('changelog.subtitle')}
            </p>

            {/* Warning Notice */}
            <div className="mb-8 mx-auto max-w-2xl rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <strong className="font-semibold">{t('changelog.note')}:</strong> {t('changelog.noteDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/app">
                  {t('changelog.backToDashboard')}
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
            <h3 className="text-lg font-semibold text-foreground mb-6">{t('changelog.legend')}</h3>
            
            {/* Update Types Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">{t('changelog.updateTypes')}</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-purple-500/10 border-purple-500/30 text-purple-400">
                    {t('changelog.majorUpdate')}
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    {t('changelog.majorDescription')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-blue-500/10 border-blue-500/30 text-blue-400">
                    {t('changelog.minorUpdate')}
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    {t('changelog.minorDescription')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-green-500/10 border-green-500/30 text-green-400">
                    {t('changelog.patchUpdate')}
                  </span>
                  <p className="text-xs text-muted-foreground pt-1 break-words">
                    {t('changelog.patchDescription')}
                  </p>
                </div>
              </div>
            </div>

            {/* Change Types Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">{t('changelog.changeTypes')}</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">{t('changelog.feature')}</span>
                    <p className="text-xs text-muted-foreground break-words">{t('changelog.featureDescription')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">{t('changelog.improvement')}</span>
                    <p className="text-xs text-muted-foreground break-words">{t('changelog.improvementDescription')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">{t('changelog.fix')}</span>
                    <p className="text-xs text-muted-foreground break-words">{t('changelog.fixDescription')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground">{t('changelog.removal')}</span>
                    <p className="text-xs text-muted-foreground break-words">{t('changelog.removalDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entries Section - scroll target for pagination */}
          <div ref={entriesRef} className="space-y-12">
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
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getUpdateTypeBadge(entry.type, t).bg} ${getUpdateTypeBadge(entry.type, t).text}`}>
                        {getUpdateTypeBadge(entry.type, t).label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="font-mono text-xs bg-muted/30 px-2 py-0.5 rounded">
                        v{entry.version}
                      </span>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-3 pl-12">
                    {sortChangesByType(entry.changes).map((change, changeIndex) => {
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
                                  {t(`changelog.categories.${change.type}`)}
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
                                    <span className="font-medium">{t('changelog.clickForDetails')}</span>
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
                      {t('changelog.reportBugs')}{' '}
                      <Link 
                        href="/issues"
                        className="text-primary hover:underline font-medium"
                      >
                        {t('changelog.visitIssuesPage')}
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
                {t('common.previous')}
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
                {t('common.next')}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {t('changelog.showing', {
                start: startIndex + 1,
                end: Math.min(endIndex, changelog.length),
                total: changelog.length
              })}
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              {t('changelog.suggestFeature')}{' '}
              <Link href="/app/settings" className="text-primary hover:underline">
                {t('changelog.contactUs')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
