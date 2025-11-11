"use client";

import { Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n-navigation';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FeedCardProps {
  article: Article;
  index?: number;
}

export function FeedCard({ article, index = 0 }: FeedCardProps) {
  const t = useTranslations('feed');
  const [imgError, setImgError] = useState(false);
  // currentSrc holds the URL we give to <Image> (proxy first, fallback to remote when allowed)
  const [attemptedFallback, setAttemptedFallback] = useState(false);
  const [proxyChecked, setProxyChecked] = useState(false);
  const [proxyOk, setProxyOk] = useState(false);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Priority loading for first 3 articles (above the fold)
  const isPriority = index < 3;

  // Default allowlist of image hosts derived from the project's default sources.
  // Includes common publisher domains and a couple of known asset/CDN hosts used by those feeds.
  // This list is intentionally conservative; it can be extended at build/runtime using
  // NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS (comma-separated hostnames).
  const defaultAllowedImageHosts = [
    'techcrunch.com',
    'www.techcrunch.com',
    'theverge.com',
    'www.theverge.com',
    'platform.theverge.com',
    'engadget.com',
    'www.engadget.com',
    'arstechnica.com',
    'www.arstechnica.com',
    'sciencedaily.com',
    'www.sciencedaily.com',
    'technologyreview.com',
    'www.technologyreview.com',
    'phys.org',
    'www.phys.org',
    'bloomberg.com',
    'www.bloomberg.com',
    'assets.bwbx.io',
    'forbes.com',
    'www.forbes.com',
    'entrepreneur.com',
    'www.entrepreneur.com',
    'thehackernews.com',
    'feeds.feedburner.com',
    'krebsonsecurity.com',
    'www.krebsonsecurity.com',
    'schneier.com',
    'www.schneier.com',
    // allow unsplash fallback used by the UI
    'images.unsplash.com',
    'localhost',
    '127.0.0.1'
  ];

  const allowedImageHosts = useMemo(() => {
    try {
      const env = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS : undefined;
      if (!env) return new Set(defaultAllowedImageHosts);
      const fromEnv = env.split(',').map(s => s.trim()).filter(Boolean);
      return new Set([...defaultAllowedImageHosts, ...fromEnv]);
    } catch (e) {
      return new Set(defaultAllowedImageHosts);
    }
  }, []);

  function extractHostname(url?: string | null) {
    if (!url) return null;
    try {
      // handle protocol-relative urls
      const normalized = url.startsWith('//') ? `https:${url}` : url;
      const u = new URL(normalized);
      return u.hostname.toLowerCase();
    } catch (e) {
      return null;
    }
  }

  const imageUrl = article.imageUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop`;
  const imageHost = extractHostname(imageUrl);

  const hasRemoteImage = !!article.imageUrl;
  const initialProxySrc = imageUrl; // start with placeholder/local until proxy is checked
  const [currentSrc, setCurrentSrc] = useState<string>(initialProxySrc);

  // Check proxy availability client-side before giving the URL to next/image.
  // We do a HEAD request to avoid fetching the full image twice. Only when
  // proxy responds OK with an image content-type do we switch the Image src
  // to the proxy; otherwise we either fall back to the remote URL (allowlist)
  // or keep the placeholder to avoid Next optimizer 400s.
  useEffect(() => {
    if (!hasRemoteImage) {
      setProxyChecked(true);
      setProxyOk(false);
      return;
    }
    let aborted = false;
    (async () => {
      try {
        const resp = await fetch(`/api/image-proxy/${article.id}`, { method: 'HEAD' });
        if (aborted) return;
        // New proxy HEAD behavior: handler returns 200 for diagnostic HEAD probes and
        // sets `x-image-proxy-available: 1|0` and optionally `x-image-proxy-content-type`.
        // Prefer the availability header when present; fall back to content-type check
        // for backwards compatibility.
        const avail = resp.headers.get('x-image-proxy-available');
        const proxyCt = resp.headers.get('x-image-proxy-content-type');
        const ct = proxyCt || resp.headers.get('content-type') || '';

        if (avail === '1' || (avail === null && resp.ok && ct.includes('image'))) {
          setProxyOk(true);
          setCurrentSrc(`/api/image-proxy/${article.id}`);
        } else {
          // Optionally log diagnostic reason in dev mode
          const reason = resp.headers.get('x-image-proxy-reason');
          if (reason && process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.debug(`image-proxy HEAD for ${article.id} -> unavailable: ${reason}`);
          }
          setProxyOk(false);
        }
      } catch (e) {
        if (!aborted) setProxyOk(false);
      } finally {
        if (!aborted) setProxyChecked(true);
      }
    })();
    return () => { aborted = true; };
  }, [article.id, hasRemoteImage]);

  // If we checked the proxy and it failed, and the remote host is allowed,
  // automatically try the direct remote image once as a fallback.
  useEffect(() => {
    if (proxyChecked && !proxyOk && hasRemoteImage && !attemptedFallback && imageHost && allowedImageHosts.has(imageHost)) {
      setAttemptedFallback(true);
      setCurrentSrc(imageUrl);
    }
  }, [proxyChecked, proxyOk, hasRemoteImage, attemptedFallback, imageHost, imageUrl, allowedImageHosts]);

  // If the article's source is a user-provided custom source, enforce the image host allowlist.
  // For default/admin sources (no isUserSource flag), allow images broadly to avoid blocking
  // publisher images that are trusted by feedcentral administrators.
  // For user-provided sources we prefer the server-side proxy decision: if the proxy
  // reports availability (proxyOk) we show the proxied image. If the proxy failed and
  // we've attempted the remote fallback (and the host is allowlisted), allow the remote
  // fallback to be displayed. This avoids requiring a manual host whitelist for every
  // user source while still honoring the allowlist for direct remote fallbacks.
  const isUserSource = !!(article.source && (article.source as any).isUserSource);
  const isImageAllowed = (() => {
    if (!isUserSource) return true;
    // If the proxy check succeeded, allow the proxied image.
    if (proxyOk) return true;
    // If proxy failed but we attempted a remote fallback and the host is allowlisted,
    // allow the remote image to be displayed.
    if (!proxyOk && attemptedFallback && imageHost && allowedImageHosts.has(imageHost)) return true;
    return false;
  })();

  return (
    <article className="group">
      {/* If the article's image host was judged unsafe/unknown, don't open the in-app reader.
          Instead, send the user directly to the original article (external) so they can read
          on the publisher's site; we also show a clear placeholder explaining the image was
          removed for safety. */}
      <Link
        href={!imgError ? `/article/${article.id}` : article.url}
        // If we've determined we can't show the image (imgError), open original externally
        {...(imgError ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
          'block rounded-xl border border-border/50 bg-card p-4 transition-all duration-150',
          'hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <div className="flex gap-4">
          {/* Article Image - Only render <Image> when the host is allowed. If not allowed, show explanatory placeholder. */}
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
            {isImageAllowed && !imgError ? (
              // Use next/image only for same-origin proxy URLs. For remote
              // URLs (which may not be configured in next.config.js), render
              // a plain <img> to avoid Next's runtime hostname validation error.
              currentSrc && currentSrc.startsWith('/api/') ? (
                <Image
                  src={currentSrc}
                  alt={article.title}
                  fill
                  onError={() => setImgError(true)}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 128px, 128px"
                  priority={isPriority}
                  loading={isPriority ? undefined : "lazy"}
                  fetchPriority={isPriority ? "high" : "low"}
                />
              ) : (
                <img
                  src={currentSrc}
                  alt={article.title}
                  onError={() => {
                    // Try the allowed-host fallback once, otherwise show placeholder
                    if (!attemptedFallback && imageHost && allowedImageHosts.has(imageHost) && !currentSrc.startsWith('http') ) {
                      // shouldn't happen: currentSrc not http; guard
                    }
                    // If this was a remote image and it errors, mark as failed
                    setImgError(true);
                  }}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  loading={isPriority ? undefined : 'lazy'}
                />
              )
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-xs text-muted-foreground">
                  <div>{t('imageRemovedForSecurity')}</div>
                  <button
                    type="button"
                    onClick={() => window.open(article.url, '_blank', 'noopener')}
                    className="mt-1 text-xs text-primary underline"
                  >
                    {t('openOriginalArticle')}
                  </button>
                </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-2">
            {/* Title */}
            <h3 className="line-clamp-2 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
              {decodeHtmlEntities(article.title)}
            </h3>

            {/* Description */}
            {article.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {decodeHtmlEntities(article.description)}
              </p>
            )}

            {/* Meta */}
            <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-normal">
                {article.source.name}
              </Badge>
              
              {article.category && (
                <Badge variant="outline" className="font-normal">
                  {article.category.name}
                </Badge>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={typeof article.publishedAt === 'string' ? article.publishedAt : article.publishedAt.toISOString()}>{formattedDate}</time>
              </div>

              {article.author && (
                <span className="hidden sm:inline">by {article.author}</span>
              )}
            </div>
          </div>

          {/* External link indicator */}
          <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Link>
    </article>
  );
}
