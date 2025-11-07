'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Info } from 'lucide-react';

export function ContentLanguageDisclaimer() {
  const locale = useLocale();
  const t = useTranslations();
  
  // Only show disclaimer for non-English locales
  if (locale === 'en') return null;
  
  return (
    <div className="mb-8 mx-auto max-w-3xl rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
      <div className="flex items-start gap-3 text-left">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-foreground">
            <strong className="font-semibold">{t('disclaimer.title')}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('disclaimer.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
