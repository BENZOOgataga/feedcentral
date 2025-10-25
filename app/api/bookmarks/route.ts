import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/bookmarks
 * Get all bookmarks for the authenticated user
 */
export async function GET(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.userId },
        include: {
          article: {
            include: {
              source: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform bookmarks to handle deleted articles
      const transformedBookmarks = bookmarks.map(bookmark => {
        const article = bookmark.article;
        
        // If article is soft-deleted, use archived data
        if (article.deletedAt && article.archivedData) {
          const archived = article.archivedData as any;
          return {
            ...bookmark,
            article: {
              ...article,
              title: archived.title || article.title,
              description: archived.description || article.description,
              url: archived.url || article.url,
              imageUrl: archived.imageUrl || article.imageUrl,
              author: archived.author || article.author,
              publishedAt: archived.publishedAt || article.publishedAt,
              isDeleted: true, // Flag for UI
              source: {
                ...article.source,
                name: archived.sourceName || article.source.name,
              },
              category: {
                ...article.category,
                name: archived.categoryName || article.category.name,
              },
            },
          };
        }
        
        return {
          ...bookmark,
          article: {
            ...article,
            isDeleted: false,
          },
        };
      });

      return NextResponse.json({
        success: true,
        data: transformedBookmarks,
      });
    } catch (error: any) {
      console.error('Get bookmarks error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch bookmarks',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}

/**
 * POST /api/bookmarks
 * Add a bookmark for the authenticated user
 * Body: { articleId: string }
 */
export async function POST(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const { articleId } = body;

      if (!articleId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article ID is required',
          },
          { status: 400 }
        );
      }

      // Check if article exists
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article not found',
          },
          { status: 404 }
        );
      }

      // Check if bookmark already exists
      const existingBookmark = await prisma.bookmark.findUnique({
        where: {
          userId_articleId: {
            userId: user.userId,
            articleId,
          },
        },
      });

      if (existingBookmark) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article already bookmarked',
          },
          { status: 409 }
        );
      }

      // Create bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          userId: user.userId,
          articleId,
        },
        include: {
          article: {
            include: {
              source: true,
              category: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: bookmark,
      });
    } catch (error: any) {
      console.error('Create bookmark error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create bookmark',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}

/**
 * DELETE /api/bookmarks
 * Remove a bookmark for the authenticated user
 * Body: { articleId: string }
 */
export async function DELETE(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const { articleId } = body;

      if (!articleId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article ID is required',
          },
          { status: 400 }
        );
      }

      // Delete bookmark
      await prisma.bookmark.delete({
        where: {
          userId_articleId: {
            userId: user.userId,
            articleId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: { message: 'Bookmark removed' },
      });
    } catch (error: any) {
      console.error('Delete bookmark error:', error);
      
      // Handle case where bookmark doesn't exist
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            error: 'Bookmark not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete bookmark',
          message: error.message,
        },
        { status: 500 }
      );
    }
  });
}
