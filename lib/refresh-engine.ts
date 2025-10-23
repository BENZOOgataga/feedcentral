import { sql } from "./db";
import { logger } from "./logger";
import { parseFeedSafe } from "./rss-parser";
import type { Source, FeedRefreshResult, RefreshSummary } from "@/types";

const CONCURRENCY_LIMIT = 3;
const ARTICLE_RETENTION_DAYS = 90;

async function processFeedBatch(sources: Source[]): Promise<FeedRefreshResult[]> {
  const results: FeedRefreshResult[] = [];

  for (let i = 0; i < sources.length; i += CONCURRENCY_LIMIT) {
    const batch = sources.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(batch.map((source) => processSingleFeed(source)));
    results.push(...batchResults);
  }

  return results;
}

async function processSingleFeed(source: Source): Promise<FeedRefreshResult> {
  const startTime = Date.now();

  try {
    logger.info("Processing feed", { source: source.name, url: source.url });

    const articles = await parseFeedSafe(source.url);

    if (!articles) {
      return {
        source_id: source.id,
        source_name: source.name,
        success: false,
        new_articles: 0,
        error: "Failed to parse feed",
        elapsed_ms: Date.now() - startTime,
      };
    }

    let newArticles = 0;

    for (const article of articles) {
      try {
        await sql`
          INSERT INTO articles (title, description, url, source_name, source_id, category, pub_date, image_url)
          VALUES (
            ${article.title},
            ${article.description},
            ${article.url},
            ${source.name},
            ${source.id},
            ${source.category},
            ${article.pubDate.toISOString()},
            ${article.imageUrl}
          )
          ON CONFLICT (url) DO NOTHING
        `;
        newArticles++;
      } catch (error) {
        // Likely duplicate URL, continue
        logger.debug("Article insert skipped (likely duplicate)", {
          url: article.url,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      source_id: source.id,
      source_name: source.name,
      success: true,
      new_articles: newArticles,
      elapsed_ms: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("Failed to process feed", {
      source: source.name,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      source_id: source.id,
      source_name: source.name,
      success: false,
      new_articles: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      elapsed_ms: Date.now() - startTime,
    };
  }
}

async function cleanupOldArticles(): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ARTICLE_RETENTION_DAYS);

    const result = await sql`
      DELETE FROM articles
      WHERE pub_date < ${cutoffDate.toISOString()}
    `;

    const deletedCount = result.rowCount || 0;
    logger.info("Old articles cleaned up", {
      deletedCount,
      cutoffDate: cutoffDate.toISOString(),
    });

    return deletedCount;
  } catch (error) {
    logger.error("Failed to cleanup old articles", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

export async function refreshFeeds(): Promise<RefreshSummary> {
  const overallStart = Date.now();

  logger.info("Starting feed refresh");

  try {
    // Fetch all active sources
    const sourcesResult = await sql<Source>`
      SELECT id, name, url, category, active, created_at
      FROM sources
      WHERE active = true
      ORDER BY category, name
    `;

    const sources = sourcesResult.rows;

    if (sources.length === 0) {
      logger.warn("No active sources found");
      return {
        total_sources: 0,
        successful: 0,
        failed: 0,
        total_new_articles: 0,
        total_elapsed_ms: Date.now() - overallStart,
        results: [],
        articles_deleted: 0,
      };
    }

    logger.info("Fetching feeds", { sourceCount: sources.length });

    const results = await processFeedBatch(sources);

    // Cleanup old articles
    const deletedCount = await cleanupOldArticles();

    // Update metadata with last refresh timestamp
    await sql`
      INSERT INTO metadata (key, value, updated_at)
      VALUES ('last_refresh', ${new Date().toISOString()}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const totalNew = results.reduce((sum, r) => sum + r.new_articles, 0);

    const summary: RefreshSummary = {
      total_sources: sources.length,
      successful,
      failed,
      total_new_articles: totalNew,
      total_elapsed_ms: Date.now() - overallStart,
      results,
      articles_deleted: deletedCount,
    };

    logger.info("Feed refresh completed", summary);

    return summary;
  } catch (error) {
    logger.error("Feed refresh failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
