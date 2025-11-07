/**
 * API Route: Verify and Complete 2FA Setup
 * POST /api/user/2fa/verify
 * 
 * Verifies the TOTP code and enables 2FA for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyTOTPCode } from '@/lib/two-factor';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const { code } = body;

      if (!code || typeof code !== 'string') {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        );
      }

      // Get user's secret
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          twoFactorSecret: true,
          twoFactorEnabled: true,
        },
      });

      if (!dbUser?.twoFactorSecret) {
        return NextResponse.json(
          { error: 'Two-factor authentication setup not started' },
          { status: 400 }
        );
      }

      // Verify the code
      const isValid = verifyTOTPCode(dbUser.twoFactorSecret, code);

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 401 }
        );
      }

      // Enable 2FA
      await prisma.user.update({
        where: { id: user.userId },
        data: { twoFactorEnabled: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Two-factor authentication enabled successfully',
      });

    } catch (error: any) {
      console.error('2FA verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify two-factor authentication' },
        { status: 500 }
      );
    }
  });
}
