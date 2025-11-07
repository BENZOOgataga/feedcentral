import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateRSSFeed } from '@/lib/rss-parser';

/**
 * GET /api/user/sources
 * List user's custom RSS sources
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's custom sources with article counts
    const sources = await prisma.userSource.findMany({
      where: { userId: user.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total and active counts
    const totalCount = sources.length;
    const activeCount = sources.filter((s) => s.isEnabled).length;

    // Get user's premium tier to determine limits
    const isPremium = user.premiumTier === 'premium' || user.premiumTier === 'pro';
    const maxSources = isPremium ? null : 10; // null = unlimited for premium

    return NextResponse.json({
      sources,
      stats: {
        total: totalCount,
        active: activeCount,
        maxSources,
        canAddMore: isPremium || totalCount < 10,
      },
    });
  } catch (error) {
    console.error('Error fetching user sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/sources
 * Add a new custom RSS source
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { feedUrl, customName, categoryId } = body;

    // Validate required fields
    if (!feedUrl || typeof feedUrl !== 'string') {
      return NextResponse.json(
        { error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    // Check if user has reached their limit (free tier: 10 sources)
    const isPremium = user.premiumTier === 'premium' || user.premiumTier === 'pro';
    if (!isPremium) {
      const existingCount = await prisma.userSource.count({
        where: { userId: user.id },
      });

      if (existingCount >= 10) {
        return NextResponse.json(
          {
            error: 'Free tier limit reached',
            message: 'You have reached the maximum of 10 custom sources. Upgrade to premium for unlimited sources.',
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    }

    // Check for duplicate feed URL for this user
    const existing = await prisma.userSource.findFirst({
      where: {
        userId: user.id,
        feedUrl: feedUrl.trim(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already added this feed' },
        { status: 409 }
      );
    }

    // Validate the RSS feed
    const validation = await validateRSSFeed(feedUrl.trim());

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid RSS feed',
          message: validation.error || 'The URL does not point to a valid RSS or Atom feed',
        },
        { status: 400 }
      );
    }

    // Create the user source
    const userSource = await prisma.userSource.create({
      data: {
        userId: user.id,
        feedUrl: feedUrl.trim(),
        customName: customName?.trim() || null,
        feedTitle: validation.feedTitle || null,
        feedDescription: validation.feedDescription || null,
        siteUrl: validation.siteUrl || null,
        logoUrl: validation.logoUrl || null,
        categoryId: categoryId || null,
        isEnabled: true,
        isValid: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Source added successfully',
      source: userSource,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding user source:', error);
    return NextResponse.json(
      { error: 'Failed to add source' },
      { status: 500 }
    );
  }
}
