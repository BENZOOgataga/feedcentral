/**
 * API Route: Disable Two-Factor Authentication
 * POST /api/user/2fa/disable
 * 
 * Disables 2FA for the user after password verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const { password } = body;

      if (!password || typeof password !== 'string') {
        return NextResponse.json(
          { error: 'Password is required to disable 2FA' },
          { status: 400 }
        );
      }

      // Get user with password hash
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          passwordHash: true,
          twoFactorEnabled: true,
        },
      });

      if (!dbUser?.twoFactorEnabled) {
        return NextResponse.json(
          { error: 'Two-factor authentication is not enabled' },
          { status: 400 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash);

      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }

      // Disable 2FA and remove secret
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Two-factor authentication disabled successfully',
      });

    } catch (error: any) {
      console.error('2FA disable error:', error);
      return NextResponse.json(
        { error: 'Failed to disable two-factor authentication' },
        { status: 500 }
      );
    }
  });
}
