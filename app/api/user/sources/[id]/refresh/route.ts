import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/user/sources/[id]/refresh
 * Manually refresh a custom RSS source
 */
export async function POST(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Find the source and verify ownership
    const source = await prisma.userSource.findUnique({
      where: { id },
    });

    if (!source) {
      return NextResponse.json(
        { error: 'Source not found' },
        { status: 404 }
      );
    }

    if (source.userId !== authUser.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Import the fetch function
    const { fetchAndStoreUserArticles } = await import('@/lib/rss-parser');

    // Fetch articles from the source
    const result = await fetchAndStoreUserArticles(source);

    if (result.error) {
      return NextResponse.json({
        message: 'Failed to refresh source',
        error: result.error,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Source refreshed successfully',
      found: result.found,
      added: result.added,
    });
  } catch (error) {
    console.error('Error refreshing user source:', error);
    return NextResponse.json(
      { error: 'Failed to refresh source' },
      { status: 500 }
    );
  }
}
