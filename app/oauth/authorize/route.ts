import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { enabled, origin, sha, token } from '@/lib/mcp-auth';
import { sign, verify } from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/env';

function params(request: NextRequest) { return request.nextUrl.searchParams; }
async function validate(p: URLSearchParams) {
  const clientId = p.get('client_id') || '';
  const redirectUri = p.get('redirect_uri') || '';
  const challenge = p.get('code_challenge') || '';
  const client = await prisma.mcpOAuthClient.findUnique({ where: { id: clientId } });
  return client && client.redirectUris.includes(redirectUri) && p.get('response_type') === 'code'
    && p.get('code_challenge_method') === 'S256' && /^[A-Za-z0-9_-]{43}$/.test(challenge)
    && (p.get('scope') || '') === 'feedcentral:admin';
}
export async function GET(request: NextRequest) {
  if (!(await enabled()).enabled) return new NextResponse('MCP is disabled', { status: 404 });
  const p = params(request);
  if (!(await validate(p))) return new NextResponse('Invalid OAuth authorization request', { status: 400 });
  const user = await verifyAuth(request);
  if (!user || user.role !== 'ADMIN') {
    const locale = '/en/login';
    const returnTo = encodeURIComponent(origin + '/oauth/authorize?' + p.toString());
    return NextResponse.redirect(origin + locale + '?returnTo=' + returnTo);
  }
  const csrf = sign({ purpose: 'mcp-consent', userId: user.userId, clientId: p.get('client_id') }, getJwtSecret(), { expiresIn: '10m' });
  const inputs = [...p.entries()].map(([k,v]) => '<input type="hidden" name="'+k.replace(/[^a-z_]/g,'')+'" value="'+v.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')+'">').join('');
  return new NextResponse('<!DOCTYPE html><html lang="en"><meta charset="utf-8"><title>FeedCentral MCP authorization</title><body style="font:16px sans-serif;max-width:42rem;margin:5rem auto"><h1>Authorize FeedCentral MCP</h1><p>This grants an external AI client permission to view RSS sources and job history. If writes are enabled in admin settings, it can also change sources and trigger feed fetches.</p><p>Only continue if you trust the client.</p><form method="POST">'+inputs+'<input type="hidden" name="csrf" value="'+csrf+'"><button type="submit">Authorize</button></form></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Security-Policy': `default-src 'none'; style-src 'unsafe-inline'; form-action 'self' ${new URL(p.get('redirect_uri')!).origin}; frame-ancestors 'none'; base-uri 'none'` } });
}
export async function POST(request: NextRequest) {
  if (!(await enabled()).enabled) return new NextResponse('MCP disabled', { status: 404 });
  if (request.headers.get('origin') !== origin) return new NextResponse('Invalid origin', { status: 403 });
  const user = await verifyAuth(request);
  if (!user || user.role !== 'ADMIN') return new NextResponse('Admin authentication required', { status: 401 });
  const body = await request.formData();
  const p = new URLSearchParams();
  for (const [key, value] of body.entries()) if (key !== 'csrf' && typeof value === 'string') p.set(key, value);
  if (!(await validate(p))) return new NextResponse('Invalid request', { status: 400 });
  try {
    const claims = verify(String(body.get('csrf') || ''), getJwtSecret()) as { purpose: string; userId: string; clientId: string };
    if (claims.purpose !== 'mcp-consent' || claims.userId !== user.userId || claims.clientId !== p.get('client_id')) throw Error('bad csrf');
  } catch { return new NextResponse('Invalid authorization challenge', { status: 403 }); }
  const code = token();
  await prisma.mcpAuthCode.create({ data: {
    codeHash: sha(code), clientId: p.get('client_id')!, userId: user.userId,
    redirectUri: p.get('redirect_uri')!, codeChallenge: p.get('code_challenge')!,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  } });
  const url = new URL(p.get('redirect_uri')!);
  url.searchParams.set('code', code);
  if (p.has('state')) url.searchParams.set('state', p.get('state')!);
  return NextResponse.redirect(url, { status: 303 });
}
