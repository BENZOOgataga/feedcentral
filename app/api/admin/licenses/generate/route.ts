/**
 * Admin-Only License Key Generation API
 * POST /api/admin/licenses/generate
 * 
 * Security:
 * - Requires admin authentication
 * - Generates instance-specific keys
 * - Keys cannot be used on other FeedCentral instances (including forks)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey, type LicenseTier, LICENSE_TIERS } from '@/lib/license';

export async function POST(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const { tier, duration, quantity = 1, notes } = body;

      // Validate inputs
      if (!tier || !LICENSE_TIERS[tier as LicenseTier]) {
        return NextResponse.json(
          { error: 'Invalid or missing license tier. Must be "premium" or "pro".' },
          { status: 400 }
        );
      }

      if (!duration || duration <= 0) {
        return NextResponse.json(
          { error: 'Invalid duration. Must be a positive number of days.' },
          { status: 400 }
        );
      }

      if (quantity < 1 || quantity > 100) {
        return NextResponse.json(
          { error: 'Quantity must be between 1 and 100.' },
          { status: 400 }
        );
      }

      // Generate license keys
      const generatedKeys = [];
      
      for (let i = 0; i < quantity; i++) {
        const licenseData = generateLicenseKey({
          tier: tier as LicenseTier,
          duration: parseInt(duration),
          issuedBy: user.userId,
          notes,
        });

        // Store in database
        const dbKey = await prisma.licenseKey.create({
          data: {
            key: licenseData.key,
            tier: licenseData.tier,
            duration: licenseData.duration,
            issuedBy: licenseData.issuedBy,
            instanceId: licenseData.instanceId,
            signature: licenseData.signature,
            notes: licenseData.notes,
          },
        });

        generatedKeys.push({
          id: dbKey.id,
          key: dbKey.key,
          tier: dbKey.tier,
          duration: dbKey.duration,
          issuedAt: dbKey.issuedAt,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully generated ${quantity} license key(s)`,
        keys: generatedKeys,
      });

    } catch (error: any) {
      console.error('License generation error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate license keys' },
        { status: 500 }
      );
    }
  });
}
