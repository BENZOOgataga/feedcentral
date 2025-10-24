import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/search
 * Full-text search across articles
 * Query params: q (search query), limit (max results, default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter "q" is required',
      }, { status: 400 });
    }

    // Perform case-insensitive search on title, description, and content
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
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
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        articles,
        total: articles.length,
        query,
      },
    });
  } catch (error: any) {
    console.error('Error searching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search articles',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
