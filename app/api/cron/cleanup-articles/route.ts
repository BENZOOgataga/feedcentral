import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCronApiKey } from '@/lib/env';

/**
 * Cron endpoint for article cleanup
 * 
 * Strategy:
 * 1. Soft-delete articles older than 7 days (deletedAt timestamp)
 * 2. Hard-delete articles older than 14 days (permanent removal)
 * 3. NEVER delete bookmarked articles - preserve them with archived data
 * 
 * This prevents database saturation while maintaining user bookmarks
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron authorization
    const authHeader = request.headers.get('authorization');
    const cronApiKey = getCronApiKey();
    const isDevelopment = process.env.NODE_ENV === 'development';

    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isAuthorized = cronApiKey && authHeader === `Bearer ${cronApiKey}`;

    if (!isDevelopment && !isVercelCron && !isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CLEANUP] Starting article cleanup...');
    const startTime = Date.now();

    // Calculate cutoff dates
    const now = new Date();
    const softDeleteCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const hardDeleteCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

    // Step 1: Find articles to soft-delete (7+ days old, not already deleted, not bookmarked)
    const articlesToSoftDelete = await prisma.article.findMany({
      where: {
        publishedAt: {
          lt: softDeleteCutoff,
        },
        deletedAt: null,
        bookmarks: {
          none: {}, // No bookmarks
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        publishedAt: true,
      },
    });

    // Soft-delete articles (set deletedAt timestamp)
    let softDeleted = 0;
    if (articlesToSoftDelete.length > 0) {
      const result = await prisma.article.updateMany({
        where: {
          id: {
            in: articlesToSoftDelete.map(a => a.id),
          },
        },
        data: {
          deletedAt: now,
        },
      });
      softDeleted = result.count;
    }

    // Step 2: Archive bookmarked articles that are old (preserve data)
    const bookmarkedOldArticles = await prisma.article.findMany({
      where: {
        publishedAt: {
          lt: softDeleteCutoff,
        },
        deletedAt: null,
        bookmarks: {
          some: {}, // Has bookmarks
        },
      },
      include: {
        source: {
          select: {
            name: true,
            url: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // Archive bookmarked articles with their data preserved
    let archived = 0;
    for (const article of bookmarkedOldArticles) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          deletedAt: now,
          archivedData: {
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.imageUrl,
            author: article.author,
            publishedAt: article.publishedAt,
            source: article.source,
            category: article.category,
            preservedForBookmarks: true,
          },
        },
      });
      archived++;
    }

    // Step 3: Hard-delete very old articles (14+ days, not bookmarked)
    const hardDeleteResult = await prisma.article.deleteMany({
      where: {
        publishedAt: {
          lt: hardDeleteCutoff,
        },
        bookmarks: {
          none: {},
        },
      },
    });
    const hardDeleted = hardDeleteResult.count;

    const duration = Date.now() - startTime;

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      cleanup: {
        softDeleted,
        archived,
        hardDeleted,
        total: softDeleted + archived + hardDeleted,
      },
      cutoffDates: {
        softDelete: softDeleteCutoff.toISOString(),
        hardDelete: hardDeleteCutoff.toISOString(),
      },
    };

    console.log('[CLEANUP] Article cleanup completed:', summary);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[CLEANUP] Error cleaning up articles:', error);
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
