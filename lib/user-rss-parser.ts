import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import type { UserSource } from '@prisma/client';
import { RSS_CONFIG } from '@/lib/rss-config';

interface ParsedUserArticle {
  title: string;
  excerpt?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
}

/**
 * User RSS Feed Parser
 * Handles custom user-added RSS feeds
 */
export class UserRSSFeedParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      timeout: RSS_CONFIG.FEED_TIMEOUT,
      headers: {
        'User-Agent': RSS_CONFIG.USER_AGENT,
      },
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['content:encoded', 'contentEncoded'],
          ['description', 'description'],
        ],
      },
    });
  }

  /**
   * Fetch and parse a single user RSS feed
   */
  async fetchFeed(feedUrl: string): Promise<ParsedUserArticle[]> {
    try {
      const feed = await this.parser.parseURL(feedUrl);
      
      // Limit articles per feed to prevent memory issues
      const items = feed.items.slice(0, RSS_CONFIG.MAX_ARTICLES_PER_FEED);
      
      return items.map((item) => {
        // Extract image from various possible locations
        const imageUrl = this.extractImage(item);
        
        // Parse published date
        const publishedAt = item.pubDate 
          ? new Date(item.pubDate) 
          : new Date();

        return {
          title: this.decodeHtmlEntities(item.title || 'Untitled'),
          excerpt: this.decodeHtmlEntities(item.contentSnippet || item.summary || ''),
          url: item.link || '',
          imageUrl,
          author: item.creator || item.author || undefined,
          publishedAt,
        };
      });
    } catch (error) {
      console.error(`Failed to fetch user feed ${feedUrl}:`, error);
      throw error;
    }
  }

  /**
   * Extract image URL from RSS item
   */
  private extractImage(item: any): string | undefined {
    if (item.enclosure?.url) return item.enclosure.url;
    if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
    if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
    
    const ogImageMatch = item.content?.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogImageMatch) return ogImageMatch[1];
    
    const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
    
    return undefined;
  }

  /**
   * Decode HTML entities (e.g., &amp; -> &, &quot; -> ", &#39; -> ')
   */
  private decodeHtmlEntities(text: string): string {
    const entities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&mdash;': '\u2014',
      '&ndash;': '\u2013',
      '&hellip;': '\u2026',
      '&lsquo;': '\u2018',
      '&rsquo;': '\u2019',
      '&ldquo;': '\u201C',
      '&rdquo;': '\u201D',
    };

    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }

    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec));
    });

    decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return decoded;
  }
}

/**
 * Fetch articles from a user source and store in database
 * Optimized with batch inserts
 */
export async function fetchAndStoreUserArticles(userSource: UserSource): Promise<{
  found: number;
  added: number;
  error?: string;
}> {
  const parser = new UserRSSFeedParser();

  try {
    // Fetch articles from RSS feed
    const articles = await parser.fetchFeed(userSource.feedUrl);

    if (articles.length === 0) {
      // No articles found - still mark as successful
      await prisma.userSource.update({
        where: { id: userSource.id },
        data: { 
          lastFetchedAt: new Date(),
          fetchAttempts: 0,
          isValid: true,
        },
      });

      return { found: 0, added: 0 };
    }

    // Get existing article URLs to avoid duplicates (single query)
    const existingUrls = new Set(
      (await prisma.userArticle.findMany({
        where: {
          userSourceId: userSource.id,
          url: { in: articles.map(a => a.url) },
        },
        select: { url: true },
      })).map(a => a.url)
    );

    // Filter out duplicates
    const newArticles = articles.filter(article => !existingUrls.has(article.url));

    // Batch insert all new articles (single query)
    let addedCount = 0;
    if (newArticles.length > 0) {
      try {
        await prisma.userArticle.createMany({
          data: newArticles.map(article => ({
            title: article.title,
            excerpt: article.excerpt,
            url: article.url,
            imageUrl: article.imageUrl,
            author: article.author,
            publishedAt: article.publishedAt,
            userSourceId: userSource.id,
            userId: userSource.userId,
          })),
          skipDuplicates: true,
        });
        addedCount = newArticles.length;
      } catch (error: any) {
        console.warn(`Partial insert failure for user source ${userSource.id}:`, error.message);
        addedCount = 0;
      }
    }

    // Update source status
    await prisma.userSource.update({
      where: { id: userSource.id },
      data: { 
        lastFetchedAt: new Date(),
        articleCount: { increment: addedCount },
        fetchAttempts: 0,
        isValid: true,
        lastFetchError: null,
      },
    });

    return {
      found: articles.length,
      added: addedCount,
    };
  } catch (error: any) {
    // Update source with error info
    await prisma.userSource.update({
      where: { id: userSource.id },
      data: {
        lastFetchError: error.message,
        fetchAttempts: { increment: 1 },
        isValid: false,
      },
    });

    return {
      found: 0,
      added: 0,
      error: error.message,
    };
  }
}

/**
 * Fetch all enabled user sources with controlled concurrency
 */
export async function fetchAllUserSources(options?: {
  concurrency?: number;
  userId?: string;
}) {
  const { concurrency = 5, userId } = options || {};

  // Fetch enabled user sources
  const userSources = await prisma.userSource.findMany({
    where: {
      isEnabled: true,
      ...(userId && { userId }),
    },
    include: { 
      user: {
        select: { email: true },
      },
    },
  });

  console.log(`[USER RSS] Fetching ${userSources.length} user sources with concurrency ${concurrency}`);

  // Process in batches to control concurrency
  const results: Array<{
    source: string;
    userId: string;
    status: 'fulfilled' | 'rejected';
    data?: { found: number; added: number; error?: string };
    error?: any;
  }> = [];

  for (let i = 0; i < userSources.length; i += concurrency) {
    const batch = userSources.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((source) => fetchAndStoreUserArticles(source))
    );

    results.push(
      ...batchResults.map((result, index) => ({
        source: batch[index].customName || batch[index].feedUrl,
        userId: batch[index].userId,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : undefined,
        error: result.status === 'rejected' ? result.reason : undefined,
      }))
    );

    // Log progress
    console.log(`[USER RSS] Completed batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(userSources.length / concurrency)}`);
  }

  return results;
}

/**
 * Fetch a single user source by ID
 */
export async function fetchSingleUserSource(userSourceId: string) {
  const userSource = await prisma.userSource.findUnique({
    where: { id: userSourceId },
  });

  if (!userSource) {
    throw new Error(`User source ${userSourceId} not found`);
  }

  if (!userSource.isEnabled) {
    throw new Error(`User source is disabled`);
  }

  return await fetchAndStoreUserArticles(userSource);
}
