/**
 * API Route: Enable Two-Factor Authentication
 * POST /api/user/2fa/enable
 * 
 * Generates a new TOTP secret and QR code for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateTOTPSecret, generateQRCode } from '@/lib/two-factor';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      // Check if 2FA is already enabled
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { twoFactorEnabled: true },
      });

      if (dbUser?.twoFactorEnabled) {
        return NextResponse.json(
          { error: 'Two-factor authentication is already enabled' },
          { status: 400 }
        );
      }

      // Generate new TOTP secret
      const { secret, uri } = generateTOTPSecret(user.email);

      // Generate QR code
      const qrCode = await generateQRCode(uri);

      // Store secret temporarily (not enabled yet, waiting for verification)
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: false, // Not enabled until verified
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          secret, // Show secret as backup
          qrCode, // QR code data URL
        },
      });

    } catch (error: any) {
      console.error('2FA enable error:', error);
      return NextResponse.json(
        { error: 'Failed to enable two-factor authentication' },
        { status: 500 }
      );
    }
  });
}
