import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/env';

/**
 * PATCH /api/user/profile
 * Update user profile (name and/or email)
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
    const { name, email } = body;

    // Validate input
    if (!name && !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one field (name or email) must be provided',
        },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email format',
          },
          { status: 400 }
        );
      }

      // Check if email is already in use by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: decoded.userId,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email is already in use',
          },
          { status: 409 }
        );
      }
    }

    // Validate name if provided
    if (name && !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name cannot be empty',
        },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
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
        error: 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
