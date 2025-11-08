import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import type { Source, JobStatus } from '@prisma/client';
import { RSS_CONFIG } from '@/lib/rss-config';

interface ParsedArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
}

/**
 * RSS Feed Parser
 * Fetches and normalizes RSS/Atom feeds
 */
export class RSSFeedParser {
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
   * Fetch and parse a single RSS feed
   */
  async fetchFeed(feedUrl: string): Promise<ParsedArticle[]> {
    try {
      const feed = await this.parser.parseURL(feedUrl);
      
      // Limit articles per feed to prevent memory issues
      const items = feed.items.slice(0, RSS_CONFIG.MAX_ARTICLES_PER_FEED);
      
      return items.map((item) => {
        // Extract image from various possible locations
        const imageUrl = this.extractImage(item);
        
        // Extract content (prefer full content over description)
        const content = this.extractContent(item);
        
        // Parse published date
        const publishedAt = item.pubDate 
          ? new Date(item.pubDate) 
          : new Date();

        return {
          title: this.decodeHtmlEntities(item.title || 'Untitled'),
          description: this.decodeHtmlEntities(item.contentSnippet || item.summary || ''),
          content,
          url: item.link || '',
          imageUrl,
          author: item.creator || item.author || undefined,
          publishedAt,
        };
      });
    } catch (error) {
      console.error(`Failed to fetch feed ${feedUrl}:`, error);
      throw error;
    }
  }

  /**
   * Parse feed metadata without fetching articles
   */
  async parseFeedMetadata(feedUrl: string) {
    return await this.parser.parseURL(feedUrl);
  }

  /**
   * Extract image URL from RSS item
   */
  private extractImage(item: any): string | undefined {
    // Try enclosure
    if (item.enclosure?.url) {
      return item.enclosure.url;
    }

    // Try media:content
    if (item.mediaContent?.$ ?.url) {
      return item.mediaContent.$.url;
    }

    // Try thumbnail
    if (item['media:thumbnail']?.$?.url) {
      return item['media:thumbnail'].$.url;
    }

    // Try og:image in content
    const ogImageMatch = item.content?.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogImageMatch) {
      return ogImageMatch[1];
    }

    // Try first image in content
    const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }

    return undefined;
  }

  /**
   * Extract full content from RSS item
   */
  private extractContent(item: any): string | undefined {
    // Prefer content:encoded (full content)
    if (item.contentEncoded) {
      return this.sanitizeHtml(item.contentEncoded);
    }

    // Fall back to content
    if (item.content) {
      return this.sanitizeHtml(item.content);
    }

    // Fall back to description
    if (item.description && item.description !== item.contentSnippet) {
      return this.sanitizeHtml(item.description);
    }

    return undefined;
  }

  /**
   * Basic HTML sanitization (remove scripts, styles)
   */
  private sanitizeHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
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

    // Decode numeric entities (e.g., &#8217; -> ')
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec));
    });

    // Decode hex entities (e.g., &#x2019; -> ')
    decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return decoded;
  }
}

/**
 * Fetch articles from a source and store in database
 * Optimized with batch inserts and reduced database round-trips
 */
export async function fetchAndStoreArticles(source: Source): Promise<{
  found: number;
  added: number;
  error?: string;
}> {
  const parser = new RSSFeedParser();
  let job;

  try {
    // Create job record
    job = await prisma.feedJob.create({
      data: {
        sourceId: source.id,
        status: 'RUNNING',
      },
    });

    // Fetch articles from RSS feed
    const articles = await parser.fetchFeed(source.feedUrl);

    if (articles.length === 0) {
      // No articles found - still mark as successful
      await Promise.all([
        prisma.source.update({
          where: { id: source.id },
          data: { lastFetchedAt: new Date() },
        }),
        prisma.feedJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            articlesFound: 0,
            articlesAdded: 0,
          },
        }),
      ]);

      return { found: 0, added: 0 };
    }

    // Get existing article URLs to avoid duplicates (single query)
    const existingUrls = new Set(
      (await prisma.article.findMany({
        where: {
          sourceId: source.id,
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
        await prisma.article.createMany({
          data: newArticles.map(article => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            imageUrl: article.imageUrl,
            author: article.author,
            publishedAt: article.publishedAt,
            sourceId: source.id,
            categoryId: source.categoryId,
          })),
          skipDuplicates: true,
        });
        addedCount = newArticles.length;
      } catch (error: any) {
        // Log but don't fail - some articles might have been added
        console.warn(`Partial insert failure for ${source.name}:`, error.message);
        addedCount = 0;
      }
    }

    // Update source and job in parallel (2 queries instead of sequential)
    await Promise.all([
      prisma.source.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date() },
      }),
      prisma.feedJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          articlesFound: articles.length,
          articlesAdded: addedCount,
        },
      }),
    ]);

    return {
      found: articles.length,
      added: addedCount,
    };
  } catch (error: any) {
    // Update job as failed
    if (job) {
      await prisma.feedJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error: error.message,
        },
      });
    }

    return {
      found: 0,
      added: 0,
      error: error.message,
    };
  }
}

/**
 * Fetch all active sources with controlled concurrency
 * Processes feeds in batches to avoid overwhelming the database connection pool
 */
export async function fetchAllActiveSources(options?: {
  concurrency?: number;
  sourceIds?: string[];
}) {
  const { concurrency = 5, sourceIds } = options || {};

  // Fetch active sources
  const sources = await prisma.source.findMany({
    where: {
      isActive: true,
      ...(sourceIds && { id: { in: sourceIds } }),
    },
    include: { category: true },
  });

  console.log(`[RSS] Fetching ${sources.length} sources with concurrency ${concurrency}`);

  // Process in batches to control concurrency
  const results: Array<{
    source: string;
    status: 'fulfilled' | 'rejected';
    data?: { found: number; added: number; error?: string };
    error?: any;
  }> = [];

  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((source) => fetchAndStoreArticles(source))
    );

    results.push(
      ...batchResults.map((result, index) => ({
        source: batch[index].name,
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : undefined,
        error: result.status === 'rejected' ? result.reason : undefined,
      }))
    );

    // Log progress
    console.log(`[RSS] Completed batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(sources.length / concurrency)}`);
  }

  return results;
}

/**
 * Fetch a single source by ID
 * Useful for manual refresh or testing
 */
export async function fetchSingleSource(sourceId: string) {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    include: { category: true },
  });

  if (!source) {
    throw new Error(`Source ${sourceId} not found`);
  }

  if (!source.isActive) {
    throw new Error(`Source ${source.name} is not active`);
  }

  return await fetchAndStoreArticles(source);
}

/**
 * Validate an RSS feed URL for custom user sources
 * Returns feed metadata if valid, throws error if invalid
 */
export async function validateRSSFeed(feedUrl: string): Promise<{
  isValid: boolean;
  feedTitle?: string;
  feedDescription?: string;
  siteUrl?: string;
  logoUrl?: string;
  error?: string;
}> {
  const parser = new RSSFeedParser();

  try {
    // Validate URL format
    const url = new URL(feedUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        isValid: false,
        error: 'Only HTTP and HTTPS URLs are supported',
      };
    }

    // Try to fetch and parse the feed
    const feed = await parser.parseFeedMetadata(feedUrl);

    // Extract metadata
    return {
      isValid: true,
      feedTitle: feed.title || undefined,
      feedDescription: feed.description || undefined,
      siteUrl: feed.link || undefined,
      logoUrl: feed.image?.url || undefined,
    };
  } catch (error: any) {
    console.error(`RSS validation failed for ${feedUrl}:`, error);
    
    let errorMessage = 'Invalid RSS feed';
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'Feed URL not found';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Feed request timed out';
    } else if (error.message?.includes('Invalid XML')) {
      errorMessage = 'Invalid RSS/Atom format';
    }

    return {
      isValid: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetch articles from a user's custom RSS source and store in database
 */
export async function fetchAndStoreUserArticles(userSource: {
  id: string;
  userId: string;
  feedUrl: string;
  customName: string | null;
  categoryId: string | null;
}): Promise<{
  found: number;
  added: number;
  error?: string;
}> {
  const parser = new RSSFeedParser();

  try {
    // Fetch articles from RSS feed
    const articles = await parser.fetchFeed(userSource.feedUrl);

    // Store articles in UserArticle table
    let addedCount = 0;
    for (const article of articles) {
      try {
        await prisma.userArticle.create({
          data: {
            title: article.title,
            excerpt: article.description,
            url: article.url,
            imageUrl: article.imageUrl,
            author: article.author,
            publishedAt: article.publishedAt,
            userId: userSource.userId,
            userSourceId: userSource.id,
          },
        });
        addedCount++;
      } catch (error: any) {
        // Skip duplicate URLs (unique constraint violation)
        if (error.code === 'P2002') {
          continue;
        }
        throw error;
      }
    }

    // Update user source metadata
    await prisma.userSource.update({
      where: { id: userSource.id },
      data: {
        lastFetchedAt: new Date(),
        lastFetchError: null,
        fetchAttempts: 0,
        isValid: true,
        articleCount: {
          increment: addedCount,
        },
      },
    });

    return {
      found: articles.length,
      added: addedCount,
    };
  } catch (error: any) {
    // Update user source with error
    const currentSource = await prisma.userSource.findUnique({
      where: { id: userSource.id },
      select: { fetchAttempts: true },
    });

    const newAttempts = (currentSource?.fetchAttempts || 0) + 1;
    const isInvalid = newAttempts >= 5;

    await prisma.userSource.update({
      where: { id: userSource.id },
      data: {
        lastFetchedAt: new Date(),
        lastFetchError: error.message,
        fetchAttempts: newAttempts,
        isValid: !isInvalid,
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
 * Fetch all active user sources for a specific user
 */
export async function fetchUserSources(userId: string) {
  const userSources = await prisma.userSource.findMany({
    where: {
      userId,
      isEnabled: true,
      isValid: true,
    },
  });

  const results = await Promise.allSettled(
    userSources.map((source) => fetchAndStoreUserArticles(source))
  );

  return results.map((result, index) => ({
    source: userSources[index].customName || userSources[index].feedUrl,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : undefined,
    error: result.status === 'rejected' ? result.reason : undefined,
  }));
}
