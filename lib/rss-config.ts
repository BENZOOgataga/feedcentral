/**
 * RSS Feed Fetching Configuration
 * Centralized settings for performance tuning
 */

export const RSS_CONFIG = {
  /**
   * Number of feeds to fetch concurrently
   * Higher = faster but more database connections
   * Recommended: 3-10 depending on your database capacity
   */
  DEFAULT_CONCURRENCY: 5,

  /**
   * Maximum concurrency allowed via API query params
   * Prevents abuse and database overload
   */
  MAX_CONCURRENCY: 10,

  /**
   * Feed fetch timeout in milliseconds
   * Prevents hanging on slow/dead feeds
   */
  FEED_TIMEOUT: 10000, // 10 seconds

  /**
   * User agent for RSS requests
   * Some sites block generic user agents
   */
  USER_AGENT: 'FeedCentral/1.0 (RSS Aggregator)',

  /**
   * Maximum articles to fetch per feed per run
   * Prevents memory issues with large feeds
   */
  MAX_ARTICLES_PER_FEED: 50,

  /**
   * Batch size for database inserts
   * Larger batches = fewer queries but more memory
   */
  DB_BATCH_SIZE: 100,

  /**
   * Retry configuration for failed feeds
   */
  RETRY: {
    enabled: true,
    maxAttempts: 2,
    delayMs: 1000,
  },
} as const;

/**
 * Get validated concurrency value
 * Ensures concurrency is within safe bounds
 */
export function getValidatedConcurrency(value?: number): number {
  if (!value) return RSS_CONFIG.DEFAULT_CONCURRENCY;
  
  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed) || parsed < 1) {
    return RSS_CONFIG.DEFAULT_CONCURRENCY;
  }
  
  return Math.min(parsed, RSS_CONFIG.MAX_CONCURRENCY);
}

/**
 * Environment-based configuration overrides
 */
export function getRuntimeConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';

  return {
    ...RSS_CONFIG,
    // Use lower concurrency on Vercel to avoid hitting connection limits
    DEFAULT_CONCURRENCY: isVercel ? 3 : RSS_CONFIG.DEFAULT_CONCURRENCY,
  };
}
