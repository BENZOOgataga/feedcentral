import { imageProxyHandler } from '@/lib/imageProxyHandler';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // Support both query param `?articleId=` and path-style `/api/image-proxy/{id}`
    let articleId = url.searchParams.get('articleId');
    if (!articleId) {
      const pathname = url.pathname || '';
      const m = pathname.match(/^\/api\/image-proxy\/(.+)$/);
      if (m && m[1]) articleId = m[1];
    }
    return imageProxyHandler(articleId || '');
  } catch (error: any) {
    console.error('image-proxy error', error);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
}
