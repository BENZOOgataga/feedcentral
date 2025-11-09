'use client';

import { FileText } from 'lucide-react';
import { Link } from '@/i18n-navigation';
import { Button } from '@/components/ui/button';
import { useHasNewChangelog } from '@/components/changelog/ChangelogNotification';

interface ChangelogButtonProps {
  label: string;
}

export function ChangelogButton({ label }: ChangelogButtonProps) {
  const hasNewChangelog = useHasNewChangelog();

  return (
    <Button 
      asChild 
      variant={hasNewChangelog ? "default" : "outline"}
      size="lg" 
      className={`gap-2 text-base relative min-w-[165px] ${hasNewChangelog ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/50' : ''}`}
    >
      <Link href="/changelog">
        <FileText className="h-4 w-4" />
        {label}
        {hasNewChangelog && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        )}
      </Link>
    </Button>
  );
}
