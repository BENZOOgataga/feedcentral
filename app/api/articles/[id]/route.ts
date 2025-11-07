import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/articles/[id]
 * Fetch single article by ID
 * Supports both default articles (Article table) and custom source articles (UserArticle table)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to find in default articles first
    const article = await prisma.article.findFirst({
      where: { 
        id,
        deletedAt: null, // Only show non-deleted articles
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
    });

    if (article) {
      return NextResponse.json({
        success: true,
        data: article,
      });
    }

    // If not found in default articles, try user articles (custom sources)
    const userArticle = await prisma.userArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        userSource: {
          select: {
            id: true,
            customName: true,
            feedTitle: true,
            siteUrl: true,
            logoUrl: true,
            categoryId: true,
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
        },
      },
    });

    if (!userArticle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    // Transform UserArticle to match Article structure
    const transformedArticle = {
      id: userArticle.id,
      title: userArticle.title,
      description: userArticle.excerpt || '',
      content: null, // UserArticle doesn't store full content
      url: userArticle.url,
      imageUrl: userArticle.imageUrl,
      author: userArticle.author,
      publishedAt: userArticle.publishedAt,
      sourceId: userArticle.userSourceId,
      categoryId: userArticle.userSource.categoryId,
      tags: [],
      deletedAt: userArticle.deletedAt,
      createdAt: userArticle.createdAt,
      updatedAt: userArticle.updatedAt,
      source: {
        id: userArticle.userSource.id,
        name: userArticle.userSource.customName || userArticle.userSource.feedTitle || 'Custom Source',
        url: userArticle.userSource.siteUrl || userArticle.url,
        logoUrl: userArticle.userSource.logoUrl,
      },
      category: userArticle.userSource.category,
    };

    return NextResponse.json({
      success: true,
      data: transformedArticle,
    });
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch article',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
