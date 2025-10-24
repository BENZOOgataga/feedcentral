import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4" style={{ width: '100vw', minWidth: '100vw' }}>
      <div className="text-center" style={{ width: '100%', maxWidth: '42rem' }}>
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white">404</h1>
          <div className="mt-2 h-1 mx-auto bg-linear-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '6rem' }}></div>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-400 mb-8 mx-auto" style={{ maxWidth: '28rem' }}>
          Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/app">
            <Button className="sm:w-auto" style={{ width: '100%' }}>
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="outline" className="sm:w-auto" style={{ width: '100%' }}>
              <Search className="w-4 h-4 mr-2" />
              Browse Articles
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-neutral-500">
            Need help? Contact support or check our documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
