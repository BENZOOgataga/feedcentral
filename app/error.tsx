'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-3">
          Something Went Wrong
        </h1>
        <p className="text-neutral-400 mb-2 max-w-md mx-auto">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        
        {error.message && (
          <div className="mt-4 mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 max-w-md mx-auto">
            <p className="text-sm text-red-400 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/app">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        {error.digest && (
          <div className="mt-8">
            <p className="text-xs text-neutral-600">
              Error ID: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
