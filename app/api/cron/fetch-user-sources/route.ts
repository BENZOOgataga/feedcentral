import { NextRequest, NextResponse } from 'next/server';
import { fetchAllUserSources } from '@/lib/user-rss-parser';
import { getCronApiKey } from '@/lib/env';
import { getValidatedConcurrency, getRuntimeConfig } from '@/lib/rss-config';

/**
 * Cron endpoint for fetching user-specific RSS feeds
 * Fetches articles from custom user-added sources (UserSource model)
 * 
 * Security: Requires CRON_API_KEY header or Vercel cron secret
 * 
 * Query params:
 * - concurrency: Number of feeds to fetch in parallel (default: 5, max: 10)
 * - userId: Fetch sources for a specific user only (optional)
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

    console.log('[USER CRON] Starting user sources fetch...');
    const startTime = Date.now();

    // Parse query parameters with validation
    const searchParams = request.nextUrl.searchParams;
    const config = getRuntimeConfig();
    const requestedConcurrency = searchParams.get('concurrency');
    const concurrency = requestedConcurrency 
      ? getValidatedConcurrency(parseInt(requestedConcurrency, 10))
      : config.DEFAULT_CONCURRENCY;
    const userId = searchParams.get('userId') || undefined;

    // Fetch user sources with controlled concurrency
    const results = await fetchAllUserSources({ concurrency, userId });

    const duration = Date.now() - startTime;
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const totalAdded = results.reduce((sum, r) => sum + (r.data?.added || 0), 0);
    const totalFound = results.reduce((sum, r) => sum + (r.data?.found || 0), 0);

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${(duration / 1000).toFixed(2)}s`,
      durationMs: duration,
      concurrency,
      type: 'user_sources',
      userId: userId || 'all',
      sources: {
        total: results.length,
        successful,
        failed,
      },
      articles: {
        found: totalFound,
        added: totalAdded,
        duplicates: totalFound - totalAdded,
      },
      results: results.map(r => ({
        source: r.source,
        userId: r.userId,
        status: r.status,
        articlesFound: r.data?.found || 0,
        articlesAdded: r.data?.added || 0,
        error: r.error?.message || r.data?.error,
      })),
    };

    console.log('[USER CRON] User sources fetch completed:', {
      duration: summary.duration,
      sources: summary.sources,
      articles: summary.articles,
    });

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[USER CRON] Error fetching user sources:', error);
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
