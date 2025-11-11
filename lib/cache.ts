/**
 * Small in-memory LRU cache with TTL suitable for server-side use in a single-node
 * deployment (development or small production). Not intended to replace Redis.
 */
type CacheEntry<T> = {
  value: T;
  expiresAt: number; // epoch ms
};

export class SimpleCache {
  private map = new Map<string, CacheEntry<any>>();
  private maxEntries: number;
  private defaultTtlMs: number;

  constructor(opts?: { maxEntries?: number; defaultTtlSec?: number }) {
    this.maxEntries = opts?.maxEntries ?? 500;
    this.defaultTtlMs = (opts?.defaultTtlSec ?? 60) * 1000; // default 60s
  }

  get<T>(key: string): T | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    // Refresh LRU position
    this.map.delete(key);
    this.map.set(key, e);
    return e.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expiresAt });
    // Evict oldest if over limit
    while (this.map.size > this.maxEntries) {
      const firstKey = this.map.keys().next().value;
      if (!firstKey) break;
      this.map.delete(firstKey);
    }
  }

  del(key: string) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }
}

// Singleton instance exported for app use
export const cache = new SimpleCache({ maxEntries: 2000, defaultTtlSec: Number(process.env.API_CACHE_TTL_SEC || '60') });

export default cache;
