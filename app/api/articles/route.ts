import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/cache';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/articles
 * Fetch articles with pagination and filtering
 * Query params: category, page, pageSize, sourceId
 * 
 * For authenticated users:
 * - Includes articles from enabled custom sources (UserArticle)
 * - Filters default sources based on user preferences
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional - works for both logged in and anonymous)
    const authUser = await verifyAuth(request);

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const sourceId = searchParams.get('sourceId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));

    let articles: any[] = [];
    let total = 0;

    // Build cache key for anonymous queries (do not cache per-user private results)
    const cacheTtlSec = Number(process.env.API_CACHE_TTL_SEC || '60');
    const cacheKey = `articles:page=${page}:size=${pageSize}:cat=${category||''}:src=${sourceId||''}`;
    // Cache bypass: allow clients (admins/tools) to bypass the server cache by
    // setting header `x-bypass-cache: 1` or query `?bypassCache=1`. This is
    // controlled by API_ALLOW_CACHE_BYPASS env var (default: enabled outside prod).
    const searchParams2 = request.nextUrl.searchParams;
    const bypassParam = searchParams2.get('bypassCache');
    const bypassHeader = request.headers.get('x-bypass-cache');
    const bypassRequested = bypassParam === '1' || bypassParam === 'true' || bypassHeader === '1' || bypassHeader === 'true';
    const allowCacheBypass = process.env.API_ALLOW_CACHE_BYPASS ? (process.env.API_ALLOW_CACHE_BYPASS === '1' || process.env.API_ALLOW_CACHE_BYPASS === 'true') : (process.env.NODE_ENV !== 'production');
    const skipCache = bypassRequested && allowCacheBypass;

    // Avoid using the server-side cache during tests so test cases that mock DB
    // failures can assert error paths reliably. In production/dev, use the cache
    // unless skipCache is requested and allowed.
    const useCache = process.env.NODE_ENV !== 'test' && !skipCache;
    if (useCache && !authUser) {
      const cached = cache.get<any>(cacheKey);
      if (cached) {
        const resp = NextResponse.json(cached);
        resp.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        return resp;
      }
    }

    if (authUser) {
      // === AUTHENTICATED USER ===
      // Fetch user's custom sources and preferences
      const [userSources, userPreferences] = await Promise.all([
        prisma.userSource.findMany({
          where: {
            userId: authUser.userId,
            isEnabled: true,
          },
          select: { id: true, categoryId: true },
        }),
        prisma.userSourcePreference.findMany({
          where: {
            userId: authUser.userId,
            isEnabled: false, // Only fetch disabled preferences
          },
          select: { sourceId: true },
        }),
      ]);

      // Build list of disabled default source IDs
      const disabledSourceIds = userPreferences.map(pref => pref.sourceId);

      // Build where clause for default articles
      const defaultArticlesWhere: any = {
        deletedAt: null,
        sourceId: {
          notIn: disabledSourceIds, // Exclude disabled sources
        },
      };

      // Build where clause for custom articles  
      const customArticlesWhere: any = {
        deletedAt: null,
        userSourceId: {
          in: userSources.map(s => s.id),
        },
      };

      // Apply category filter if specified
      if (category) {
        defaultArticlesWhere.category = { slug: category };
        
        // For custom articles, filter by category through userSource
        const categoryRecord = await prisma.category.findUnique({
          where: { slug: category },
          select: { id: true },
        });
        
        if (categoryRecord) {
          customArticlesWhere.userSource = {
            categoryId: categoryRecord.id,
          };
        }
      }

      // Apply sourceId filter if specified
      if (sourceId) {
        // Check if it's a default source or custom source
        const isDefaultSource = await prisma.source.findUnique({
          where: { id: sourceId },
          select: { id: true },
        });

        if (isDefaultSource) {
          defaultArticlesWhere.sourceId = sourceId;
          customArticlesWhere.userSourceId = 'impossible-id'; // Don't fetch custom articles
        } else {
          customArticlesWhere.userSourceId = sourceId;
          defaultArticlesWhere.sourceId = 'impossible-id'; // Don't fetch default articles
        }
      }

      // Fetch counts
      const [defaultCount, customCount] = await Promise.all([
        prisma.article.count({ where: defaultArticlesWhere }),
        prisma.userArticle.count({ where: customArticlesWhere }),
      ]);

      total = defaultCount + customCount;

      // Calculate how many articles to fetch from each source
      const skip = (page - 1) * pageSize;
      
      // Fetch articles from both sources
      const [defaultArticles, customArticles] = await Promise.all([
        prisma.article.findMany({
          where: defaultArticlesWhere,
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
          orderBy: { publishedAt: 'desc' },
          take: pageSize + skip, // Fetch more to account for merging
        }),
        prisma.userArticle.findMany({
          where: customArticlesWhere,
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
          orderBy: { publishedAt: 'desc' },
          take: pageSize + skip,
        }),
      ]);

      // Transform custom articles to match default article structure
      const transformedCustomArticles = customArticles.map((article: any) => ({
        id: article.id,
        title: article.title,
        description: article.excerpt || '',
        content: null,
        url: article.url,
        imageUrl: article.imageUrl,
        author: article.author,
        publishedAt: article.publishedAt,
        sourceId: article.userSourceId,
        categoryId: article.userSource.categoryId,
        tags: [],
        deletedAt: article.deletedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        source: {
          id: article.userSource.id,
          name: article.userSource.customName || article.userSource.feedTitle || 'Custom Source',
          url: article.userSource.siteUrl || article.url,
          logoUrl: article.userSource.logoUrl,
          // mark that this source came from a user-provided custom source
          isUserSource: true,
        },
        category: article.userSource.category,
      }));

      // Merge and sort by publishedAt
      const mergedArticles = [...defaultArticles, ...transformedCustomArticles]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Apply pagination after merge
      articles = mergedArticles.slice(skip, skip + pageSize);

    } else {
      // === ANONYMOUS USER ===
      // Show all default sources (original behavior)
      const where: any = {
        deletedAt: null,
      };
      
      if (category) {
        where.category = { slug: category };
      }
      
      if (sourceId) {
        where.sourceId = sourceId;
      }

      total = await prisma.article.count({ where });

      articles = await prisma.article.findMany({
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
    }

    const totalPages = Math.ceil(total / pageSize);

    const responseBody = {
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
    };

    // Cache anonymous responses server-side to reduce DB load unless bypassed
    if (!authUser && !skipCache) {
      try {
        cache.set(cacheKey, responseBody, cacheTtlSec * 1000);
      } catch (e) {
        // non-fatal
        console.warn('articles: cache set failed', e);
      }
    }

    const response = NextResponse.json(responseBody);
    // Cache for 60 seconds, stale-while-revalidate for better performance
    response.headers.set('Cache-Control', `public, s-maxage=${cacheTtlSec}, stale-while-revalidate=300`);

    return response;
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
