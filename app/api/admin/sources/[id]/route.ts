import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/sources/[id]
 * Get single source by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(request, async () => {
    try {
      const { id } = await params;
      const source = await prisma.source.findUnique({
        where: { id },
        include: {
          category: true,
          _count: {
            select: {
              articles: true,
              feedJobs: true,
            },
          },
        },
      });

      if (!source) {
        return NextResponse.json(
          {
            success: false,
            error: 'Source not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: source,
      });
    } catch (error: any) {
      console.error('Error fetching source:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch source',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}

/**
 * PATCH /api/admin/sources/[id]
 * Update source (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(request, async () => {
    try {
      const { id } = await params;
      const body = await request.json();
      const { name, url, feedUrl, categoryId, logoUrl, isActive, fetchInterval } = body;

      const source = await prisma.source.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(url !== undefined && { url }),
          ...(feedUrl !== undefined && { feedUrl }),
          ...(categoryId !== undefined && { categoryId }),
          ...(logoUrl !== undefined && { logoUrl }),
          ...(isActive !== undefined && { isActive }),
          ...(fetchInterval !== undefined && { fetchInterval }),
        },
        include: {
          category: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: source,
      });
    } catch (error: any) {
      console.error('Error updating source:', error);
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            error: 'Source not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update source',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}

/**
 * DELETE /api/admin/sources/[id]
 * Delete source (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(request, async () => {
    try {
      const { id } = await params;
      await prisma.source.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Source deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting source:', error);
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            error: 'Source not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete source',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}
