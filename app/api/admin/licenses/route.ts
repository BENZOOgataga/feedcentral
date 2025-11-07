/**
 * Admin License Key Management API
 * GET /api/admin/licenses - List all license keys
 * PATCH /api/admin/licenses - Revoke a license key
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET - List all license keys with filtering
 */
export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status'); // 'unredeemed', 'redeemed', 'revoked', 'all'
      const tier = searchParams.get('tier');
      const page = parseInt(searchParams.get('page') || '1');
      const pageSize = parseInt(searchParams.get('pageSize') || '50');

      // Build filter
      const where: any = {};
      
      if (status === 'unredeemed') {
        where.redeemedBy = null;
        where.isRevoked = false;
      } else if (status === 'redeemed') {
        where.redeemedBy = { not: null };
      } else if (status === 'revoked') {
        where.isRevoked = true;
      }
      
      if (tier && (tier === 'premium' || tier === 'pro')) {
        where.tier = tier;
      }

      // Get total count
      const total = await prisma.licenseKey.count({ where });

      // Get paginated results
      const keys = await prisma.licenseKey.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          key: true,
          tier: true,
          duration: true,
          issuedAt: true,
          redeemedBy: true,
          redeemedAt: true,
          expiresAt: true,
          isRevoked: true,
          revokedAt: true,
          notes: true,
          instanceId: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: keys,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });

    } catch (error: any) {
      console.error('License listing error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch license keys' },
        { status: 500 }
      );
    }
  });
}

/**
 * PATCH - Revoke a license key
 */
export async function PATCH(request: NextRequest) {
  return requireAdmin(request, async (req, user) => {
    try {
      const body = await req.json();
      const { licenseId, action } = body;

      if (!licenseId) {
        return NextResponse.json(
          { error: 'License ID is required' },
          { status: 400 }
        );
      }

      if (action !== 'revoke') {
        return NextResponse.json(
          { error: 'Invalid action. Only "revoke" is supported.' },
          { status: 400 }
        );
      }

      // Find the license key
      const license = await prisma.licenseKey.findUnique({
        where: { id: licenseId },
      });

      if (!license) {
        return NextResponse.json(
          { error: 'License key not found' },
          { status: 404 }
        );
      }

      if (license.isRevoked) {
        return NextResponse.json(
          { error: 'License key is already revoked' },
          { status: 400 }
        );
      }

      // Revoke the license
      const updated = await prisma.licenseKey.update({
        where: { id: licenseId },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revokedBy: user.userId,
        },
      });

      // If the license was redeemed, downgrade the user
      if (updated.redeemedBy) {
        await prisma.user.update({
          where: { id: updated.redeemedBy },
          data: {
            premiumTier: 'free',
            premiumExpiresAt: null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'License key revoked successfully',
        license: updated,
      });

    } catch (error: any) {
      console.error('License revocation error:', error);
      return NextResponse.json(
        { error: 'Failed to revoke license key' },
        { status: 500 }
      );
    }
  });
}
