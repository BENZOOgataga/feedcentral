import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import type { Source, JobStatus } from '@prisma/client';
import { RSS_CONFIG } from '@/lib/rss-config';
// Use require to avoid type-resolution problems in environments missing @types/sanitize-html
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sanitizeHtmlLib: any = require('sanitize-html');
import dns from 'dns/promises';

// IP/CIDR utilities (simple, focused on IPv4 CIDRs used by allowed list below)
import net from 'net';

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
 * Resolve hostname and validate the resolved IP is not private/reserved unless
 * explicitly allowed. Throws on disallowed addresses.
 */
async function ensureUrlAllowed(feedUrl: string) {
  try {
    const url = new URL(feedUrl);

    // Only http(s) allowed
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Only HTTP/HTTPS URLs are allowed');
    }

    const hostname = url.hostname;

    // Resolve the hostname to an address (may return IPv4 or IPv6)
    const addrs = await dns.lookup(hostname, { all: true });

    // Allowed CIDRs (examples provided by project owner: Vercel ranges and more)
    const allowedCidrs = [
      '76.76.21.0/24',
      '76.76.22.0/24',
      '76.223.16.0/20',
      '76.76.154.0/24',
      '99.83.64.0/18',
      '193.38.250.0/24',
    ];

    function ipToLong(ip: string) {
      return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
    }

    function cidrContains(cidr: string, ip: string) {
      if (!net.isIP(ip) || net.isIP(ip) === 6) return false; // only IPv4 CIDRs here
      const [range, bits] = cidr.split('/');
      const mask = ~(2 ** (32 - Number(bits)) - 1) >>> 0;
      return (ipToLong(range) & mask) === (ipToLong(ip) & mask);
    }

    function isPrivateIPv4(ip: string) {
      const parts = ip.split('.').map((s) => parseInt(s, 10));
      if (parts[0] === 10) return true;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      if (parts[0] === 192 && parts[1] === 168) return true;
      if (parts[0] === 127) return true; // loopback
      if (parts[0] === 169 && parts[1] === 254) return true; // link local
      return false;
    }

    for (const a of addrs) {
      const address = a.address;

      // If IPv6, do a basic check to block ::1 and local ranges
      if (net.isIP(address) === 6) {
        const lc = address.toLowerCase();
        if (lc === '::1' || lc.startsWith('fc') || lc.startsWith('fd') || lc.startsWith('fe80')) {
          throw new Error('Resolved to a private/reserved IPv6 address');
        }
        // otherwise, allow IPv6 addresses (no CIDR checks added here)
        continue;
      }

      // IPv4 checks
      if (isPrivateIPv4(address)) {
        // allow if it's in the explicit allowed CIDR list
        const allowed = allowedCidrs.some((c) => cidrContains(c, address));
        if (!allowed) {
          throw new Error('Resolved to a private IP address');
        }
      }
    }
  } catch (err: any) {
    throw new Error(`Feed URL not allowed: ${err.message || String(err)}`);
  }
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
    // Use sanitize-html to allow a safe subset of tags and attributes.
    // Transform <img> tags whose host is not in the allowlist into a placeholder
    // explaining the image was removed for security reasons.
    const allowedImageHosts = new Set([
      'images.unsplash.com',
      'assets.bwbx.io',
      'ichef.bbci.co.uk',
      'static01.nyt.com',
      'cdn.cnn.com',
      'i.imgur.com',
      'pbs.twimg.com',
      'media.npr.org',
      'cdn.vox-cdn.com',
      'content.jwplatform.com',
      'images.theconversation.com',
    ]);

    function isImgHostAllowed(src: string | undefined) {
      if (!src) return false;
      try {
        const u = new URL(src, 'http://example.com');
        const host = u.hostname;
        return allowedImageHosts.has(host) || host === 'localhost' || host === '127.0.0.1';
      } catch (err) {
        return false;
      }
    }

    return sanitizeHtmlLib(html, {
      allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height'],
        '*': ['class', 'id', 'title', 'style'],
      },
      transformTags: {
  img: (tagName: string, attribs: any) => {
          const src = attribs.src || attribs['data-src'];
          if (isImgHostAllowed(src)) {
            // Keep the image but force rel/noopener on parent links via sanitizer rules
            return {
              tagName: 'img',
              attribs: {
                src: src || '',
                alt: attribs.alt || '',
              },
            };
          }

          // Replace disallowed images with a placeholder DIV carrying a data attribute
          return {
            tagName: 'div',
            text: '[Image removed by server: judged unsafe]'
          };
        }
      }
    }).trim();
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

  // SSRF protection: ensure resolved host is allowed
  await ensureUrlAllowed(source.feedUrl);

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

  // SSRF protection: ensure resolved host is allowed
  await ensureUrlAllowed(feedUrl);

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
  // SSRF protection: ensure resolved host is allowed
  await ensureUrlAllowed(userSource.feedUrl);

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
