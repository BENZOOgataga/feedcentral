import Parser from "rss-parser";
import { sanitize } from "./sanitize";
import { logger } from "./logger";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "FeedCentral/1.0",
  },
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

export interface ParsedArticle {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  imageUrl: string | null;
}

async function fetchWithRetry(
  url: string,
  retries: number = 3,
  backoff: number = 1000
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await parser.parseURL(url);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      const delay = backoff * Math.pow(2, attempt - 1);
      logger.warn(`RSS fetch attempt ${attempt} failed, retrying in ${delay}ms`, {
        url,
        error: error instanceof Error ? error.message : String(error),
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function extractImageUrl(item: any): string | null {
  // Try media:content
  if (item["media:content"] && item["media:content"].$ && item["media:content"].$.url) {
    return item["media:content"].$.url;
  }

  // Try media:thumbnail
  if (item["media:thumbnail"] && item["media:thumbnail"].$ && item["media:thumbnail"].$.url) {
    return item["media:thumbnail"].$.url;
  }

  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    const url = item.enclosure.url;
    if (
      url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
      (item.enclosure.type && item.enclosure.type.startsWith("image/"))
    ) {
      return url;
    }
  }

  // Try content:encoded or content field for img tags
  const content = item["content:encoded"] || item.content || "";
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
  if (imgMatch) {
    return imgMatch[1];
  }

  return null;
}

export async function parseFeed(url: string): Promise<ParsedArticle[]> {
  try {
    const feed = await fetchWithRetry(url);

    if (!feed || !feed.items || feed.items.length === 0) {
      logger.warn("Feed has no items", { url });
      return [];
    }

    const articles: ParsedArticle[] = [];

    for (const item of feed.items) {
      try {
        const title = item.title?.trim();
        const link = item.link?.trim();

        if (!title || !link) {
          logger.debug("Skipping item without title or link", { url });
          continue;
        }

        const rawDescription = item.contentSnippet || item.content || item.description || "";
        const description = sanitize(rawDescription, 2000);

        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        // Validate date
        if (isNaN(pubDate.getTime())) {
          logger.warn("Invalid pub date, using current time", { url, pubDate: item.pubDate });
        }

        const imageUrl = extractImageUrl(item);

        articles.push({
          title,
          description,
          url: link,
          pubDate: isNaN(pubDate.getTime()) ? new Date() : pubDate,
          imageUrl,
        });
      } catch (itemError) {
        logger.warn("Failed to parse feed item", {
          url,
          error: itemError instanceof Error ? itemError.message : String(itemError),
        });
        // Continue to next item
      }
    }

    logger.info("Successfully parsed feed", { url, articleCount: articles.length });
    return articles;
  } catch (error) {
    logger.error("Failed to parse feed", {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function parseFeedSafe(url: string): Promise<ParsedArticle[] | null> {
  try {
    return await parseFeed(url);
  } catch (error) {
    return null;
  }
}
