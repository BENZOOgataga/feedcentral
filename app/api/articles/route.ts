import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/articles
 * Fetch articles with pagination and filtering
 * Query params: category, page, pageSize, sourceId
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const sourceId = searchParams.get('sourceId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));

    // Build where clause
    const where: any = {};
    
    if (category) {
      where.category = {
        slug: category,
      };
    }
    
    if (sourceId) {
      where.sourceId = sourceId;
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Fetch articles with relations
    const articles = await prisma.article.findMany({
      where,
      include: {
        source: {
          select: {
            id: true,
            name: true,
            url: true,
            logoUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
