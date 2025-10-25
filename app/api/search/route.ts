import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/search
 * Full-text search across articles using PostgreSQL FTS with relevance ranking
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

    // Use PostgreSQL full-text search with ts_rank for relevance
    // tsquery automatically handles word stemming and stop words
    const searchQuery = query.trim().split(/\s+/).join(' & '); // AND search for all terms

    const articles = await prisma.$queryRaw`
      SELECT
        a.id,
        a.title,
        a.description,
        a.content,
        a.url,
        a."imageUrl",
        a.author,
        a."publishedAt",
        a."sourceId",
        a."categoryId",
        a.tags,
        a."createdAt",
        a."updatedAt",
        ts_rank(a.search_vector, to_tsquery('english', ${searchQuery})) AS rank
      FROM articles a
      WHERE a.search_vector @@ to_tsquery('english', ${searchQuery})
      ORDER BY rank DESC, a."publishedAt" DESC
      LIMIT ${limit}
    `;

    // Fetch related source and category data for each article
    const enrichedArticles = await Promise.all(
      (articles as any[]).map(async (article) => {
        const [source, category] = await Promise.all([
          prisma.source.findUnique({
            where: { id: article.sourceId },
            select: {
              id: true,
              name: true,
              url: true,
              logoUrl: true,
            },
          }),
          prisma.category.findUnique({
            where: { id: article.categoryId },
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true,
            },
          }),
        ]);

        // Remove the rank field from final output
        const { rank, ...articleData } = article;
        
        return {
          ...articleData,
          source,
          category,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedArticles,
      total: enrichedArticles.length,
      query,
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
