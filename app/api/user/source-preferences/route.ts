import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/user/source-preferences
 * Bulk update default source preferences (enable/disable sources)
 */
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sourceId, isEnabled } = body;

    if (!sourceId || typeof isEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'sourceId and isEnabled are required' },
        { status: 400 }
      );
    }

    // Verify source exists
    const source = await prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      return NextResponse.json(
        { error: 'Source not found' },
        { status: 404 }
      );
    }

    // Upsert the preference
    const preference = await prisma.userSourcePreference.upsert({
      where: {
        userId_sourceId: {
          userId: authUser.userId,
          sourceId: sourceId,
        },
      },
      update: {
        isEnabled,
      },
      create: {
        userId: authUser.userId,
        sourceId: sourceId,
        isEnabled,
      },
    });

    return NextResponse.json({
      message: 'Preference updated successfully',
      preference,
    });
  } catch (error) {
    console.error('Error updating source preference:', error);
    return NextResponse.json(
      { error: 'Failed to update preference' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/source-preferences
 * Get user's source preferences
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

    const preferences = await prisma.userSourcePreference.findMany({
      where: { userId: authUser.userId },
      include: {
        source: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      preferences,
    });
  } catch (error) {
    console.error('Error fetching source preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}
