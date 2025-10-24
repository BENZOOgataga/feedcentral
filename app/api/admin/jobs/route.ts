import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/admin/jobs
 * Get feed jobs with filtering (admin only)
 */
export async function GET(request: NextRequest) {
  return requireAdmin(request, async () => {
    try {
      const searchParams = request.nextUrl.searchParams;
      const status = searchParams.get('status');
      const sourceId = searchParams.get('sourceId');
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));

      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (sourceId) {
        where.sourceId = sourceId;
      }

      const jobs = await prisma.feedJob.findMany({
        where,
        include: {
          source: {
            select: {
              id: true,
              name: true,
              feedUrl: true,
            },
          },
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: limit,
      });

      return NextResponse.json({
        success: true,
        data: jobs,
      });
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch jobs',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}
