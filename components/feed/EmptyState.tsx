'use client';

import { FileQuestion, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
}

export function EmptyState({
  title = 'No articles found',
  description = 'Try adjusting your filters or refresh the feed.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" style={{ width: '100%' }}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground" style={{ maxWidth: '24rem' }}>{description}</p>

      {action && (
        <Button
          onClick={action.onClick}
          disabled={action.loading}
          className="gap-2"
        >
          {action.loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              {action.label}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
