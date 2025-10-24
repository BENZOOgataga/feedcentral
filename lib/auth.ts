import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/env';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

/**
 * Verify JWT token and return user data
 */
export async function verifyAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from cookie or Authorization header
    const token = 
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    // Verify and decode token
    const decoded = verify(token, getJwtSecret()) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware wrapper for protected routes
 * Returns 401 if not authenticated
 */
export async function requireAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required',
      },
      { status: 401 }
    );
  }

  return handler(request, user);
}

/**
 * Middleware wrapper for admin-only routes
 * Returns 401 if not authenticated, 403 if not admin
 */
export async function requireAdmin(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await verifyAuth(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required',
      },
      { status: 401 }
    );
  }

  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      {
        success: false,
        error: 'Admin access required',
      },
      { status: 403 }
    );
  }

  return handler(request, user);
}
