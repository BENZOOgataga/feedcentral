import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCronApiKey } from '@/lib/env';

/**
 * RSS Feed Statistics Endpoint
 * Provides insights into feed fetching performance
 * 
 * Security: Requires CRON_API_KEY or admin session
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const cronApiKey = getCronApiKey();
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAuthorized = cronApiKey && authHeader === `Bearer ${cronApiKey}`;

    if (!isDevelopment && !isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sourceId = searchParams.get('sourceId') || undefined;

    // Fetch recent jobs
    const recentJobs = await prisma.feedJob.findMany({
      where: sourceId ? { sourceId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        source: {
          select: {
            name: true,
            feedUrl: true,
            isActive: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalJobs = recentJobs.length;
    const completedJobs = recentJobs.filter(j => j.status === 'COMPLETED').length;
    const failedJobs = recentJobs.filter(j => j.status === 'FAILED').length;
    const runningJobs = recentJobs.filter(j => j.status === 'RUNNING').length;

    const totalArticlesFound = recentJobs.reduce((sum, j) => sum + (j.articlesFound || 0), 0);
    const totalArticlesAdded = recentJobs.reduce((sum, j) => sum + (j.articlesAdded || 0), 0);

    // Calculate average duration for completed jobs
    const completedJobsWithDuration = recentJobs.filter(
      j => j.status === 'COMPLETED' && j.completedAt
    );
    const avgDuration = completedJobsWithDuration.length > 0
      ? completedJobsWithDuration.reduce((sum, j) => {
          const duration = j.completedAt!.getTime() - j.createdAt.getTime();
          return sum + duration;
        }, 0) / completedJobsWithDuration.length
      : 0;

    // Get source-level statistics
    const sourceStats = await prisma.source.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        lastFetchedAt: true,
        _count: {
          select: {
            articles: true,
            feedJobs: true,
          },
        },
      },
      orderBy: { lastFetchedAt: 'desc' },
    });

    const stats = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        recentJobs: {
          total: totalJobs,
          completed: completedJobs,
          failed: failedJobs,
          running: runningJobs,
          successRate: totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(2) + '%' : '0%',
        },
        articles: {
          found: totalArticlesFound,
          added: totalArticlesAdded,
          duplicates: totalArticlesFound - totalArticlesAdded,
        },
        performance: {
          avgDurationMs: Math.round(avgDuration),
          avgDurationSeconds: (avgDuration / 1000).toFixed(2) + 's',
        },
      },
      sources: sourceStats.map(s => ({
        id: s.id,
        name: s.name,
        lastFetchedAt: s.lastFetchedAt?.toISOString() || null,
        totalArticles: s._count.articles,
        totalJobs: s._count.feedJobs,
      })),
      recentJobs: recentJobs.map(j => ({
        id: j.id,
        source: j.source.name,
        status: j.status,
        createdAt: j.createdAt.toISOString(),
        completedAt: j.completedAt?.toISOString() || null,
        duration: j.completedAt 
          ? `${((j.completedAt.getTime() - j.createdAt.getTime()) / 1000).toFixed(2)}s`
          : null,
        articlesFound: j.articlesFound || 0,
        articlesAdded: j.articlesAdded || 0,
        error: j.error,
      })),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('[RSS Stats] Error:', error);
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
