'use client';

import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface FeedJob {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  completedAt: string | null;
  articlesFound: number;
  articlesAdded: number;
  error: string | null;
  source: {
    id: string;
    name: string;
    feedUrl: string;
  };
}

export default function AdminJobsPage() {
  const { user, isLoading: authLoading } = useRequireAdmin();
  const [jobs, setJobs] = useState<FeedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchJobs();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, [user]);

  async function fetchJobs() {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/admin/jobs');
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      }

      // Ensure minimum loading time of 1 second for smoother UX (only on initial load)
      if (loading) {
        const elapsed = Date.now() - startTime;
        const minLoadTime = 1000;
        if (elapsed < minLoadTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'RUNNING':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
      FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
      RUNNING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      PENDING: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    };

    return (
      <Badge className={colors[status] || colors.PENDING}>
        {status}
      </Badge>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400">Loading jobs...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Feed Jobs</h1>
          <p className="text-sm text-muted-foreground mt-2">
            RSS feed fetch job history and status (auto-refreshes every 10s)
          </p>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-border bg-card p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(job.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{job.source.name}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div>Started: {new Date(job.startedAt).toLocaleString()}</div>
                      {job.completedAt && (
                        <div>Completed: {new Date(job.completedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm text-muted-foreground">
                    Found: <span className="font-medium text-foreground">{job.articlesFound}</span>
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Added: <span className="font-medium">{job.articlesAdded}</span>
                  </div>
                </div>
              </div>

              {job.error && (
                <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                  <span className="font-semibold">Error:</span> {job.error}
                </div>
              )}
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No jobs found</p>
              <p className="text-sm mt-1">Feed jobs will appear here once RSS sources are fetched</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
