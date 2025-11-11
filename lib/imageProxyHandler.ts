import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dns from 'dns/promises';
import net from 'net';
import { prisma } from '@/lib/prisma';
import { getImageProxyConfig, isHostAllowed } from '@/lib/imageProxyConfig';
import { cache } from '@/lib/cache';
import { fetchWithLimit } from '@/lib/fetchWithLimit';

function isPrivateIp(ip: string) {
  if (!ip) return false;
  const kind = net.isIP(ip);
  if (kind === 4) {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local
    return false;
  }
  if (kind === 6) {
    // IPv6: block loopback ::1 and unique/local (fc00::/7) and link-local fe80::/10
    if (ip === '::1') return true;
    const low = ip.toLowerCase();
    if (low.startsWith('fc') || low.startsWith('fd')) return true; // unique local
    if (low.startsWith('fe80')) return true; // link-local
    return false;
  }
  return false;
}

export async function imageProxyHandler(articleId: string, request?: Request | NextRequest): Promise<NextResponse> {
  try {
    if (!articleId) return NextResponse.json({ error: 'missing articleId' }, { status: 400 });
    const method = (request && 'method' in request && request.method) ? request.method.toUpperCase() : 'GET';

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { imageUrl: true, sourceId: true },
    });

    if (article && article.imageUrl) {
      const rawUrl = article.imageUrl.startsWith('//') ? `https:${article.imageUrl}` : article.imageUrl;
      let parsed: URL;
      try {
        parsed = new URL(rawUrl);
      } catch (e) {
        // Invalid URL: return HEAD diagnostics when probing so client doesn't see 4xx
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', 'invalid_image_url');
          return new NextResponse(null, { status: 200, headers: h });
        }
        return NextResponse.json({ error: 'invalid image url' }, { status: 400 });
      }

      const cfg = getImageProxyConfig();

      if (parsed.protocol !== 'https:') {
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', 'non_https');
          return new NextResponse(null, { status: 200, headers: h });
        }
        return NextResponse.json({ error: 'only https images allowed' }, { status: 400 });
      }

      // Resolve hostname and block private/reserved IP ranges to mitigate SSRF.
      let resolvedAddrs: Array<{ address: string; family?: number }> = [];
      try {
        resolvedAddrs = await dns.lookup(parsed.hostname, { all: true });
        for (const a of resolvedAddrs) {
          const ip = a.address;
          if (isPrivateIp(ip)) {
            console.warn('image-proxy: blocked private ip', { articleId, hostname: parsed.hostname, ip });
            // For HEAD requests return a non-error body 200 with headers so client probes don't show 4xx in devtools.
            if (method === 'HEAD') {
              const h = new Headers();
              h.set('x-image-proxy-available', '0');
              h.set('x-image-proxy-reason', 'disallowed_ip');
              return new NextResponse(null, { status: 200, headers: h });
            }
            return NextResponse.json({ error: 'disallowed ip' }, { status: 403 });
          }
        }
      } catch (e: any) {
        console.warn('image-proxy: dns resolution failed', { articleId, hostname: parsed.hostname, error: String(e) });
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', 'failed_resolve');
          return new NextResponse(null, { status: 200, headers: h });
        }
        // If DNS resolution fails, treat as bad request
        return NextResponse.json({ error: 'failed to resolve host' }, { status: 400 });
      }

      // Cache bypass support: allow header `x-bypass-cache: 1` or query `?bypassCache=1`
      const getBypassRequested = (req?: Request | NextRequest) => {
        try {
          if (!req) return false;
          const hdr = (req as any).headers?.get?.('x-bypass-cache');
          if (hdr === '1' || hdr === 'true') return true;
          const urlStr = (req as any).url;
          if (urlStr) {
            const q = new URL(urlStr).searchParams.get('bypassCache');
            if (q === '1' || q === 'true') return true;
          } else if ((req as any).nextUrl && (req as any).nextUrl.searchParams) {
            const q = (req as any).nextUrl.searchParams.get('bypassCache');
            if (q === '1' || q === 'true') return true;
          }
        } catch (e) {
          // ignore
        }
        return false;
      };

      const bypassRequested = getBypassRequested(request);
      const allowCacheBypass = process.env.API_ALLOW_CACHE_BYPASS ? (process.env.API_ALLOW_CACHE_BYPASS === '1' || process.env.API_ALLOW_CACHE_BYPASS === 'true') : (process.env.NODE_ENV !== 'production');
      const skipCache = bypassRequested && allowCacheBypass;

      // Check server-side cache for previously fetched/sanitized images
      const cacheKey = `image:${articleId}`;
      const useCache = process.env.NODE_ENV !== 'test' && !skipCache;
      const cached = useCache ? cache.get<{ buffer: ArrayBuffer; contentType: string }>(cacheKey) : undefined;
      if (cached) {
        const respHeaders = new Headers();
        respHeaders.set('Content-Type', cached.contentType);
        // honor proxy cache control TTL (s-maxage) via config
        const cfgLocal = getImageProxyConfig();
        respHeaders.set('Cache-Control', `public, max-age=${cfgLocal.maxAge}, s-maxage=${cfgLocal.sMaxAge}`);
        if (method === 'HEAD') {
          respHeaders.set('x-image-proxy-available', '1');
          respHeaders.set('x-image-proxy-content-type', cached.contentType);
          return new NextResponse(null, { status: 200, headers: respHeaders });
        }
        return new NextResponse(cached.buffer, { headers: respHeaders });
      }

      const { ok, status, headers, buffer, error } = await fetchWithLimit(rawUrl, {
        timeoutMs: cfg.timeoutMs,
        maxBytes: cfg.maxBytes,
        redirect: 'manual',
      });

      if (!ok) {
        const reason = error || 'failed_to_fetch';
        console.warn('image-proxy: fetch failed', { articleId, hostname: parsed.hostname, reason, status });
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', reason);
          return new NextResponse(null, { status: 200, headers: h });
        }
        if (error === 'redirect') return NextResponse.json({ error: 'redirects not allowed' }, { status: 422 });
        if (error === 'too-large') return NextResponse.json({ error: 'image too large' }, { status: 422 });
        if (error === 'unsupported-type') return NextResponse.json({ error: 'unsupported media type' }, { status: 415 });
        if (error === 'timeout') return NextResponse.json({ error: 'fetch timeout' }, { status: 504 });
        return NextResponse.json({ error: 'failed to fetch image' }, { status: 502 });
      }

      const contentType = headers?.get('content-type') || '';
      if (contentType.includes('svg')) {
        console.warn('image-proxy: svg blocked', { articleId, hostname: parsed.hostname });
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', 'svg_not_allowed');
          return new NextResponse(null, { status: 200, headers: h });
        }
        return NextResponse.json({ error: 'svg images are not allowed' }, { status: 415 });
      }

      let outBuffer: ArrayBuffer | undefined = buffer;
      let outContentType = contentType || 'application/octet-stream';

      try {
        const sharpModule = await import('sharp').catch(() => null);
        const sharp = (sharpModule && (sharpModule.default || sharpModule)) as any | null;
        if (sharp && buffer) {
          const nodeBuf = Buffer.from(buffer as ArrayBuffer);
          const processed = await sharp(nodeBuf).webp({ quality: 80 }).toBuffer();
          outBuffer = processed.buffer.slice(processed.byteOffset, processed.byteOffset + processed.byteLength);
          outContentType = 'image/webp';
        }
      } catch (e) {
        console.error('image-proxy: image sanitization failed', e);
        if (method === 'HEAD') {
          const h = new Headers();
          h.set('x-image-proxy-available', '0');
          h.set('x-image-proxy-reason', 'sanitization_failed');
          return new NextResponse(null, { status: 200, headers: h });
        }
        return NextResponse.json({ error: 'image sanitization failed' }, { status: 422 });
      }

      const respHeaders = new Headers();
      respHeaders.set('Content-Type', outContentType);
      respHeaders.set('Cache-Control', `public, max-age=${cfg.maxAge}, s-maxage=${cfg.sMaxAge}`);
      // Cache successfully fetched & sanitized images for a short TTL to avoid
      // re-fetching identical images repeatedly. TTL controlled via IMAGE_CACHE_TTL_SEC.
      try {
        const imageCacheTtlSec = Number(process.env.IMAGE_CACHE_TTL_SEC || '300');
        if (outBuffer && outContentType && useCache) {
          cache.set(cacheKey, { buffer: outBuffer, contentType: outContentType }, imageCacheTtlSec * 1000);
        }
      } catch (e) {
        console.warn('image-proxy: failed to cache image', e);
      }
      // For HEAD requests we can return 200 with a header indicating availability so client probes do not see 4xx.
      if (method === 'HEAD') {
        respHeaders.set('x-image-proxy-available', '1');
        respHeaders.set('x-image-proxy-content-type', outContentType);
        return new NextResponse(null, { status: 200, headers: respHeaders });
      }

      return new NextResponse(outBuffer, { headers: respHeaders });
    }

    const userArticle = await prisma.userArticle.findUnique({ where: { id: articleId }, select: { id: true } });
    if (userArticle) {
      if (method === 'HEAD') {
        const h = new Headers();
        h.set('x-image-proxy-available', '0');
        h.set('x-image-proxy-reason', 'proxy_disabled_for_user_source');
        return new NextResponse(null, { status: 200, headers: h });
      }
      return NextResponse.json({ error: 'proxy disabled for user-provided sources' }, { status: 403 });
    }
    if (method === 'HEAD') {
      const h = new Headers();
      h.set('x-image-proxy-available', '0');
      h.set('x-image-proxy-reason', 'article_not_found');
      return new NextResponse(null, { status: 200, headers: h });
    }
    return NextResponse.json({ error: 'article not found' }, { status: 404 });
  } catch (error: any) {
    console.error('image-proxy handler error', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export default imageProxyHandler;
