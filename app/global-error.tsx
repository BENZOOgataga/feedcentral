'use client';

import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-red-500/10 p-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3">
              Critical Error
            </h1>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset}>
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
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
      </body>
    </html>
  );
}
