import { NextRequest, NextResponse } from 'next/server';
import { fetchAllActiveSources } from '@/lib/rss-parser';
import { getCronApiKey } from '@/lib/env';

/**
 * Cron endpoint for automatic RSS feed fetching
 * Triggered by Vercel Cron every 30 minutes
 * 
 * Security: Requires CRON_API_KEY header or Vercel cron secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron authorization
    const authHeader = request.headers.get('authorization');
    const cronApiKey = getCronApiKey();
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Vercel Cron sends a secret in Authorization header
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isAuthorized = cronApiKey && authHeader === `Bearer ${cronApiKey}`;

    // Allow unauthenticated access in development for convenience
    if (!isDevelopment && !isVercelCron && !isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting RSS feed fetch...');
    const startTime = Date.now();

    // Fetch all active sources
    const results = await fetchAllActiveSources();

    const duration = Date.now() - startTime;
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      sources: {
        total: results.length,
        successful,
        failed,
      },
      results: results.map(r => ({
        source: r.source,
        status: r.status,
        articlesFound: r.data?.found || 0,
        articlesAdded: r.data?.added || 0,
        error: r.error?.message || r.data?.error,
      })),
    };

    console.log('[CRON] Feed fetch completed:', summary);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[CRON] Error fetching feeds:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Allow manual triggering via POST (for testing/admin)
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
