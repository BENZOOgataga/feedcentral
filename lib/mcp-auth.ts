import { NextRequest } from 'next/server';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';

export const origin = process.env.MCP_PUBLIC_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const sha = (value: string) => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('base64url');
export const metadata = { resource: origin + '/mcp', authorization_servers: [origin] };
export async function enabled() {
  const settings = await prisma.mcpSettings.findUnique({ where: { id: 'default' } });
  return { enabled: settings?.enabled === true, allowWrites: settings?.allowWrites === true };
}
export function bearer(request: NextRequest) {
  const match = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '');
  return match?.[1] || null;
}
export async function verifyMcp(request: NextRequest) {
  const raw = bearer(request);
  if (!raw) return null;
  try {
    const claims = verify(raw, getJwtSecret(), { audience: origin + '/mcp', issuer: origin }) as {
      sub: string; client_id: string; scope: string;
    };
    if (!claims.scope?.includes('feedcentral:admin')) return null;
    const user = await prisma.user.findUnique({ where: { id: claims.sub }, select: { id: true, role: true } });
    return user?.role === 'ADMIN' ? user.id : null;
  } catch { return null; }
}
export async function audit(userId: string, tool: string, target?: string) {
  await prisma.mcpAuditLog.create({ data: { userId, tool, target } });
}
export function accessToken(userId: string, clientId: string) {
  return sign({ scope: 'feedcentral:admin', client_id: clientId }, getJwtSecret(), {
    subject: userId, audience: origin + '/mcp', issuer: origin, expiresIn: '1h',
  });
}
export function pkce(verifier: string, challenge: string) {
  const actual = createHash('sha256').update(verifier).digest();
  const expected = Buffer.from(challenge.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function sameOrigin(request: NextRequest) {
  const header = request.headers.get('origin');
  return !header || header === origin;
}
