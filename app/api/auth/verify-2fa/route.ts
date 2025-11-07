/**
 * API Route: Verify 2FA Code During Login
 * POST /api/auth/verify-2fa
 * 
 * Completes login flow after 2FA code verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify, sign } from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/env';
import { verifyTOTPCode } from '@/lib/two-factor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tempToken, code } = body;

    if (!tempToken || !code) {
      return NextResponse.json(
        { success: false, error: 'Temporary token and verification code are required' },
        { status: 400 }
      );
    }

    // Verify temporary token
    let decoded: any;
    try {
      decoded = verify(tempToken, getJwtSecret());
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check token purpose
    if (decoded.purpose !== '2fa-verification') {
      return NextResponse.json(
        { success: false, error: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Get user with 2FA secret
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: 'Two-factor authentication not configured' },
        { status: 400 }
      );
    }

    // Verify TOTP code
    const isValidCode = verifyTOTPCode(user.twoFactorSecret, code);

    if (!isValidCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate full auth token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      getJwtSecret(),
      {
        expiresIn: '7d',
      }
    );

    // Create response with token
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });

    // Set secure httpOnly cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
