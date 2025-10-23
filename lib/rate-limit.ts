import { RateLimitError } from "./errors";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt < now) {
        this.store.delete(key);
      }
    }
  }

  async check(identifier: string): Promise<void> {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetAt < now) {
      this.store.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return;
    }

    if (entry.count >= this.maxRequests) {
      const resetIn = Math.ceil((entry.resetAt - now) / 1000);
      throw new RateLimitError(`Rate limit exceeded. Try again in ${resetIn} seconds.`);
    }

    entry.count++;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Limiter instances for different endpoints
export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes
export const passwordChangeLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 requests per 15 minutes
export const refreshLimiter = new RateLimiter(2, 5 * 60 * 1000); // 2 requests per 5 minutes
export const sourcesMutationLimiter = new RateLimiter(10, 5 * 60 * 1000); // 10 requests per 5 minutes

export async function checkRateLimit(limiter: RateLimiter, identifier: string): Promise<void> {
  await limiter.check(identifier);
}
