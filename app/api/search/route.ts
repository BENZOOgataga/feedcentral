import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Calculate relevance score for an article based on search query
 * Higher score = more relevant
 */
function calculateRelevanceScore(article: any, query: string): number {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  
  let score = 0;
  
  const title = (article.title || '').toLowerCase();
  const description = (article.description || '').toLowerCase();
  const content = (article.content || '').toLowerCase();
  const author = (article.author || '').toLowerCase();
  
  // Exact phrase match in title = highest priority (100 points)
  if (title.includes(queryLower)) {
    score += 100;
  }
  
  // Title starts with query (80 points)
  if (title.startsWith(queryLower)) {
    score += 80;
  }
  
  // Individual word matches in title (10 points per word)
  queryWords.forEach(word => {
    if (title.includes(word)) {
      score += 10;
    }
  });
  
  // Exact phrase match in description (50 points)
  if (description.includes(queryLower)) {
    score += 50;
  }
  
  // Individual word matches in description (5 points per word)
  queryWords.forEach(word => {
    if (description.includes(word)) {
      score += 5;
    }
  });
  
  // Exact phrase match in content (30 points)
  if (content.includes(queryLower)) {
    score += 30;
  }
  
  // Individual word matches in content (2 points per word)
  queryWords.forEach(word => {
    if (content.includes(word)) {
      score += 2;
    }
  });
  
  // Author match (20 points)
  if (author.includes(queryLower)) {
    score += 20;
  }
  
  // Recency boost (up to 10 points for articles from last 7 days)
  const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 7) {
    score += Math.max(0, 10 - daysOld);
  }
  
  return score;
}

/**
 * GET /api/search
 * Full-text search across articles with relevance ranking
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
      take: limit * 3, // Get more results to sort by relevance
    });

    // Calculate relevance scores and sort by score
    const scoredArticles = articles.map(article => ({
      ...article,
      relevanceScore: calculateRelevanceScore(article, query),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
    .map(({ relevanceScore, ...article }) => article); // Remove score from final results

    return NextResponse.json({
      success: true,
      data: scoredArticles,
      total: scoredArticles.length,
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
