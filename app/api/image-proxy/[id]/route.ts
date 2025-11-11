import { imageProxyHandler } from '@/lib/imageProxyHandler';
import type { NextRequest } from 'next/server';

// Next's route handler may pass params as a Promise in some runtimes; accept any
export async function GET(request: NextRequest, context: any) {
  try {
    let params = context?.params;
    // If params is a promise, await it
    if (params && typeof params.then === 'function') {
      params = await params;
    }
    const articleId = params?.id || '';
    return await imageProxyHandler(articleId, request);
  } catch (error: any) {
    console.error('image-proxy dynamic route error', error);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
}
