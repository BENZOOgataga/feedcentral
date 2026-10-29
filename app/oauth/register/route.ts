import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enabled, token } from '@/lib/mcp-auth';
export async function POST(request: NextRequest) {
  if (!(await enabled()).enabled) return NextResponse.json({ error: 'MCP disabled' }, { status: 404 });
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.redirect_uris) || body.redirect_uris.length < 1 || body.redirect_uris.length > 5 ||
      !body.redirect_uris.every((x: unknown) => typeof x === 'string' && x.length < 2048 && (() => {
        try { const url = new URL(x); return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)); }
        catch { return false; }
      })()))
    return NextResponse.json({ error: 'invalid_client_metadata' }, { status: 400 });
  const client = await prisma.mcpOAuthClient.create({
    data: { id: token(), redirectUris: body.redirect_uris, clientName: typeof body.client_name === 'string' ? body.client_name.slice(0, 120) : null },
  });
  return NextResponse.json({ client_id: client.id, client_name: client.clientName, redirect_uris: client.redirectUris,
    token_endpoint_auth_method: 'none', grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'] }, { status: 201 });
}
