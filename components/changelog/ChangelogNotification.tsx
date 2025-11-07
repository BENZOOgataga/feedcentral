'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Link } from '@/i18n-navigation';
import { getLatestNewChangelog } from '@/lib/changelog-data';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'feedcentral-changelog-seen';

export function useHasNewChangelog() {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const latest = getLatestNewChangelog();
    
    if (!latest) {
      setHasNew(false);
      return;
    }

    const seenVersion = localStorage.getItem(STORAGE_KEY);
    setHasNew(seenVersion !== latest.version);
  }, []);

  return hasNew;
}

export function markChangelogAsSeen() {
  const latest = getLatestNewChangelog();
  if (latest) {
    localStorage.setItem(STORAGE_KEY, latest.version);
  }
}

export function ChangelogToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [latestChangelog, setLatestChangelog] = useState<ReturnType<typeof getLatestNewChangelog>>(null);
  const t = useTranslations('changelog.notification');

  useEffect(() => {
    const latest = getLatestNewChangelog();
    
    if (!latest) {
      return;
    }

    const seenVersion = localStorage.getItem(STORAGE_KEY);
    if (seenVersion === latest.version) {
      return;
    }

    setLatestChangelog(latest);
    
    // Show toast after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    markChangelogAsSeen();
    setIsVisible(false);
  };

  if (!isVisible || !latestChangelog) {
    return null;
  }

  const totalChanges = latestChangelog.changes.length;
  const featureCount = latestChangelog.changes.filter(c => c.type === 'feature').length;
  const improvementCount = latestChangelog.changes.filter(c => c.type === 'improvement').length;
  const fixCount = latestChangelog.changes.filter(c => c.type === 'fix').length;
  
  // Determine the most prominent change type
  const counts = [
    { type: 'feature', count: featureCount, key: 'featuresAndMore' },
    { type: 'improvement', count: improvementCount, key: 'improvementsAndMore' },
    { type: 'fix', count: fixCount, key: 'fixesAndMore' }
  ];
  const mostProminent = counts.sort((a, b) => b.count - a.count)[0];
  const summary = mostProminent.count > 0 
    ? t(mostProminent.key, { count: mostProminent.count })
    : t('updatesAndMore', { count: totalChanges });

  return (
    <div className="fixed top-20 right-8 z-[9999] animate-in fade-in duration-500">
      <div className="bg-background border-2 border-yellow-500/50 rounded-xl shadow-2xl w-80">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('whatsNew', { version: latestChangelog.version })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {summary}
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="shrink-0 p-1 rounded-lg hover:bg-muted/50 transition-colors"
                  aria-label={t('close')}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <Link
                href="/changelog"
                onClick={markChangelogAsSeen}
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
              >
                {t('viewChangelog')}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
