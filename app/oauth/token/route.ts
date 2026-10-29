import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { accessToken, enabled, pkce, sha, token } from '@/lib/mcp-auth';
export async function POST(request: NextRequest) {
  if (!(await enabled()).enabled) return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  const body = await request.formData();
  const clientId = String(body.get('client_id') || '');
  const client = await prisma.mcpOAuthClient.findUnique({ where: { id: clientId } });
  if (!client) return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  let userId: string;
  if (body.get('grant_type') === 'authorization_code') {
    const raw = String(body.get('code') || '');
    const record = await prisma.mcpAuthCode.findUnique({ where: { codeHash: sha(raw) } });
    const uri = String(body.get('redirect_uri') || '');
    const verifier = String(body.get('code_verifier') || '');
    if (!record || record.clientId !== clientId || record.redirectUri !== uri ||
        record.expiresAt < new Date() || !/^[A-Za-z0-9_-]{43,128}$/.test(verifier) || !pkce(verifier, record.codeChallenge))
      return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    const consumed = await prisma.mcpAuthCode.deleteMany({ where: { codeHash: record.codeHash } });
    if (consumed.count !== 1) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    userId = record.userId;
  } else if (body.get('grant_type') === 'refresh_token') {
    const record = await prisma.mcpRefreshToken.findUnique({ where: { tokenHash: sha(String(body.get('refresh_token') || '')) } });
    if (!record || record.clientId !== clientId || record.expiresAt < new Date())
      return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    const consumed = await prisma.mcpRefreshToken.deleteMany({ where: { tokenHash: record.tokenHash } });
    if (consumed.count !== 1) return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
    userId = record.userId;
  } else return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
  const refresh = token();
  await prisma.mcpRefreshToken.create({ data: { tokenHash: sha(refresh), clientId, userId, expiresAt: new Date(Date.now() + 30 * 86400000) } });
  return NextResponse.json({ access_token: accessToken(userId, clientId), token_type: 'Bearer',
    expires_in: 3600, refresh_token: refresh, scope: 'feedcentral:admin' },
    { headers: { 'Cache-Control': 'no-store', Pragma: 'no-cache' } });
}
