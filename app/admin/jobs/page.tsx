'use client';

import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    <div className="content-container px-4 py-6 sm:px-6">
      <div className="space-y-6">
        {/* Back to Admin */}
        <div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Panel
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Feed Jobs</h1>
        <p className="text-sm text-neutral-400 mt-1">
          RSS feed fetch job history and status
        </p>
      </div>

      <div className="space-y-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-lg border border-white/10 bg-neutral-900 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(job.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{job.source.name}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="mt-1 text-sm text-neutral-400">
                    Started: {new Date(job.startedAt).toLocaleString()}
                  </div>
                  {job.completedAt && (
                    <div className="text-sm text-neutral-400">
                      Completed: {new Date(job.completedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-neutral-400">
                  Found: {job.articlesFound}
                </div>
                <div className="text-sm text-green-400">
                  Added: {job.articlesAdded}
                </div>
              </div>
            </div>

            {job.error && (
              <div className="mt-3 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                <span className="font-medium">Error:</span> {job.error}
              </div>
            )}
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            No jobs found
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
