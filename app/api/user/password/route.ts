import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';

/**
 * PATCH /api/user/password
 * Update user password
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = 
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, getJwtSecret()) as {
      userId: string;
      email: string;
      role: string;
    };

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'All password fields are required',
        },
        { status: 400 }
      );
    }

    // Validate new password matches confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'New passwords do not match',
        },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

    // Get user from database with password hash
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Current password is incorrect',
        },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid authentication token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update password',
      },
      { status: 500 }
    );
  }
}
