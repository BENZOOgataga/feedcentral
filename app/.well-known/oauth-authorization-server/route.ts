import { NextResponse } from 'next/server';
import { origin } from '@/lib/mcp-auth';
export function GET() { return NextResponse.json({
  issuer: origin, authorization_endpoint: origin + '/oauth/authorize',
  token_endpoint: origin + '/oauth/token', registration_endpoint: origin + '/oauth/register',
  response_types_supported: ['code'], grant_types_supported: ['authorization_code', 'refresh_token'],
  token_endpoint_auth_methods_supported: ['none'], code_challenge_methods_supported: ['S256'],
  scopes_supported: ['feedcentral:admin'],
}); }
