import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import type { Source, JobStatus } from '@prisma/client';

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
      timeout: 10000,
      headers: {
        'User-Agent': 'FeedCentral/1.0',
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
      
      return feed.items.map((item) => {
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

    // Store articles (skip duplicates based on URL)
    let addedCount = 0;
    for (const article of articles) {
      try {
        await prisma.article.create({
          data: {
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            imageUrl: article.imageUrl,
            author: article.author,
            publishedAt: article.publishedAt,
            sourceId: source.id,
            categoryId: source.categoryId,
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

    // Update source last fetched time
    await prisma.source.update({
      where: { id: source.id },
      data: { lastFetchedAt: new Date() },
    });

    // Update job as completed
    await prisma.feedJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        articlesFound: articles.length,
        articlesAdded: addedCount,
      },
    });

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
 * Fetch all active sources
 */
export async function fetchAllActiveSources() {
  const sources = await prisma.source.findMany({
    where: { isActive: true },
    include: { category: true },
  });

  const results = await Promise.allSettled(
    sources.map((source) => fetchAndStoreArticles(source))
  );

  return results.map((result, index) => ({
    source: sources[index].name,
    status: result.status,
    data: result.status === 'fulfilled' ? result.value : undefined,
    error: result.status === 'rejected' ? result.reason : undefined,
  }));
}
