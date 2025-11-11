export type ImageProxyConfig = {
  allowedHosts: string[]; // exact or suffix patterns (e.g. "cloudfront.net" or ".example.com")
  maxBytes: number;
  timeoutMs: number;
  maxAge: number;
  sMaxAge: number;
};

function parseList(env?: string | null): string[] {
  if (!env) return [];
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export function getImageProxyConfig(): ImageProxyConfig {
  const allowed = parseList(process.env.IMAGE_PROXY_ALLOWED_HOSTS) || [];
  // sensible defaults if env not set — keep small and conservative
  const defaultAllowed = [
    'images.unsplash.com',
    'assets.bwbx.io',
    'platform.theverge.com',
    'i.imgur.com',
    'pbs.twimg.com',
    'cdn.vox-cdn.com',
  ];

  const allowedHosts = allowed.length > 0 ? allowed : defaultAllowed;

  const maxBytes = Number(process.env.IMAGE_PROXY_MAX_BYTES || 1024 * 1024); // 1MB default
  const timeoutMs = Number(process.env.IMAGE_PROXY_TIMEOUT_MS || 5000); // 5s default
  const maxAge = Number(process.env.IMAGE_PROXY_CACHE_MAX_AGE || 60); // seconds
  const sMaxAge = Number(process.env.IMAGE_PROXY_CACHE_SMAX || 300);

  return {
    allowedHosts,
    maxBytes,
    timeoutMs,
    maxAge,
    sMaxAge,
  };
}

/**
 * Returns true if hostname matches an allowed host.
 * Allowed entries support exact matches and suffix matches (e.g. 'cloudfront.net').
 */
export function isHostAllowed(hostname: string, cfg?: ImageProxyConfig): boolean {
  if (!hostname) return false;
  const normalized = hostname.toLowerCase();
  const c = cfg || getImageProxyConfig();
  for (const entry of c.allowedHosts) {
    if (entry === normalized) return true;
    // suffix match: allow entry 'cloudfront.net' to match 'd1abc.cloudfront.net'
    if (normalized === entry || normalized.endsWith('.' + entry)) return true;
  }
  return false;
}

export default getImageProxyConfig;
