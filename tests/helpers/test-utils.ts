import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-only';

/**
 * Create a mock NextRequest with optional authentication
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: any;
    userId?: string;
    cookies?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
): NextRequest {
  const {
    method = 'GET',
    body,
    userId,
    cookies = {},
    searchParams = {},
  } = options;

  // Build URL with search params
  const urlObj = new URL(url, 'http://localhost:3000');
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  // Create auth token if userId provided
  if (userId) {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    cookies['auth_token'] = token; // Note: cookie name is auth_token not auth-token
  }

  // Build cookie header
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');

  const requestInit: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(urlObj.toString(), requestInit);
}

/**
 * Extract JSON from NextResponse
 */
export async function getResponseData(response: Response) {
  const data = await response.json();
  return {
    status: response.status,
    data,
  };
}

/**
 * Create mock params for dynamic routes
 */
export function createMockParams<T extends Record<string, string>>(params: T): Promise<T> {
  return Promise.resolve(params);
}
