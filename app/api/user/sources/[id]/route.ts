import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PATCH /api/user/sources/[id]
 * Update a custom RSS source (enable/disable, rename, change category)
 */
export async function PATCH(
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
    const body = await req.json();
    const { customName, isEnabled, categoryId } = body;

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

    // Update the source
    const updatedSource = await prisma.userSource.update({
      where: { id },
      data: {
        ...(customName !== undefined && { customName: customName?.trim() || null }),
        ...(isEnabled !== undefined && { isEnabled }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        updatedAt: new Date(),
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
      message: 'Source updated successfully',
      source: updatedSource,
    });
  } catch (error) {
    console.error('Error updating user source:', error);
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/sources/[id]
 * Delete a custom RSS source
 */
export async function DELETE(
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

    // Delete the source (cascade will delete associated articles)
    await prisma.userSource.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Source deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user source:', error);
    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}
