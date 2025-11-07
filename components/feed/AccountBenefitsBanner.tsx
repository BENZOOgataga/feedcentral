'use client';

import { useState } from 'react';
import { BookmarkCheck, Settings, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n-navigation';
import { useTranslations } from 'next-intl';

export function AccountBenefitsBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has dismissed the banner
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hideBenefitsBanner') !== 'true';
    }
    return true;
  });
  
  const router = useRouter();
  const t = useTranslations('app');

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hideBenefitsBanner', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative mb-6 rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-4">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pr-8">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {t('benefitsBanner.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('benefitsBanner.description')}
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                <span>{t('benefitsBanner.bookmarks')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Settings className="h-3.5 w-3.5 text-primary" />
                <span>{t('benefitsBanner.preferences')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 sm:flex-col sm:min-w-[120px]">
          <Button
            size="sm"
            onClick={() => router.push('/login')}
            className="flex-1 sm:flex-none"
          >
            {t('benefitsBanner.createAccount')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/login')}
            className="flex-1 sm:flex-none"
          >
            {t('benefitsBanner.signIn')}
          </Button>
        </div>
      </div>
    </div>
  );
}
