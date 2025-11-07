/**
 * License Key Redemption API
 * POST /api/user/licenses/redeem
 * 
 * Allows authenticated users to redeem a premium license key
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  isValidKeyFormat, 
  formatLicenseKey, 
  verifyLicenseSignature,
  calculateExpirationDate,
  getInstanceId,
} from '@/lib/license';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      let { key } = body;

      if (!key || typeof key !== 'string') {
        return NextResponse.json(
          { error: 'License key is required' },
          { status: 400 }
        );
      }

      // Format and validate key structure
      key = formatLicenseKey(key);
      
      if (!isValidKeyFormat(key)) {
        return NextResponse.json(
          { error: 'Invalid license key format. Expected format: FEED-XXXX-XXXX-XXXX-XXXX' },
          { status: 400 }
        );
      }

      // Find the license key in database
      const license = await prisma.licenseKey.findUnique({
        where: { key },
      });

      if (!license) {
        return NextResponse.json(
          { error: 'License key not found or invalid' },
          { status: 404 }
        );
      }

      // Check if already redeemed
      if (license.redeemedBy) {
        return NextResponse.json(
          { error: 'This license key has already been redeemed' },
          { status: 409 }
        );
      }

      // Check if revoked
      if (license.isRevoked) {
        return NextResponse.json(
          { error: 'This license key has been revoked and cannot be used' },
          { status: 403 }
        );
      }

      // CRITICAL: Verify instance binding
      const currentInstanceId = getInstanceId();
      if (license.instanceId !== currentInstanceId) {
        return NextResponse.json(
          { 
            error: 'This license key is not valid for this FeedCentral instance. ' +
                   'License keys are instance-specific and cannot be transferred between different deployments.',
          },
          { status: 403 }
        );
      }

      // CRITICAL: Verify signature to prevent tampering
      const isValidSignature = verifyLicenseSignature(
        license.key,
        license.instanceId,
        license.tier,
        license.duration,
        license.signature
      );

      if (!isValidSignature) {
        console.error('License signature verification failed for key:', license.key);
        return NextResponse.json(
          { error: 'License key signature is invalid. This key may have been tampered with.' },
          { status: 403 }
        );
      }

      // Calculate expiration date
      const redemptionDate = new Date();
      const expiresAt = calculateExpirationDate(redemptionDate, license.duration);

      // Redeem the license
      await prisma.$transaction(async (tx) => {
        // Update license key
        await tx.licenseKey.update({
          where: { key },
          data: {
            redeemedBy: user.userId,
            redeemedAt: redemptionDate,
            expiresAt,
          },
        });

        // Upgrade user account
        await tx.user.update({
          where: { id: user.userId },
          data: {
            premiumTier: license.tier,
            premiumExpiresAt: expiresAt,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: `License key activated successfully! Your ${license.tier} tier is now active.`,
        data: {
          tier: license.tier,
          expiresAt,
          durationDays: license.duration,
        },
      });

    } catch (error: any) {
      console.error('License redemption error:', error);
      return NextResponse.json(
        { error: 'Failed to redeem license key' },
        { status: 500 }
      );
    }
  });
}
