import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/stats
 * Dashboard statistics and metrics
 */
export async function GET() {
  try {
    // Calculate date for "today" articles (last 24 hours)
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    // Run queries in parallel for performance
    const [
      totalArticles,
      todayArticles,
      activeSources,
      categories,
      recentJobs,
    ] = await Promise.all([
      // Total articles count
      prisma.article.count(),

      // Articles from last 24 hours
      prisma.article.count({
        where: {
          publishedAt: {
            gte: yesterday,
          },
        },
      }),

      // Active sources count
      prisma.source.count({
        where: {
          isActive: true,
        },
      }),

      // Categories with article counts
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          _count: {
            select: {
              articles: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      }),

      // Recent feed jobs
      prisma.feedJob.findMany({
        include: {
          source: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalArticles,
        todayArticles,
        activeSources,
        categories: categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          articleCount: cat._count.articles,
        })),
        recentJobs: recentJobs.map((job: any) => ({
          id: job.id,
          sourceId: job.sourceId,
          sourceName: job.source.name,
          status: job.status,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          articlesFound: job.articlesFound,
          articlesAdded: job.articlesAdded,
          error: job.error,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
