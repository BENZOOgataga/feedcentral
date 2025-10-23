import { cn } from '@/lib/utils';

interface FeedSkeletonProps {
  count?: number;
}

export function FeedSkeleton({ count = 5 }: FeedSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-card p-4 animate-pulse"
        >
          <div className="flex gap-4">
            {/* Image skeleton */}
            <div className="h-24 w-32 flex-shrink-0 rounded-lg bg-muted" />

            {/* Content skeleton */}
            <div className="flex flex-1 flex-col gap-2">
              {/* Title */}
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-5 w-1/2 rounded bg-muted" />

              {/* Description */}
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-5/6 rounded bg-muted/60" />

              {/* Meta */}
              <div className="mt-auto flex gap-2">
                <div className="h-5 w-20 rounded bg-muted/80" />
                <div className="h-5 w-16 rounded bg-muted/80" />
                <div className="h-5 w-24 rounded bg-muted/80" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
