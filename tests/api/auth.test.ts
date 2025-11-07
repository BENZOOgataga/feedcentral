/**
 * Tests for /api/auth/* routes
 * Authentication endpoints: login, logout, me
 */

import { POST as loginPost } from '@/app/api/auth/login/route';
import { POST as logoutPost } from '@/app/api/auth/logout/route';
import { GET as meGet } from '@/app/api/auth/me/route';
import { createMockRequest, getResponseData } from '../helpers/test-utils';
import { resetAllMocks } from '../helpers/prisma-mock';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/prisma', () => {
  const { mockPrisma } = require('../helpers/prisma-mock');
  return {
    __esModule: true,
    prisma: mockPrisma,
    default: mockPrisma,
  };
});

const { mockPrisma } = require('./../../tests/helpers/prisma-mock');

jest.mock('bcryptjs');

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should login with valid credentials', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      name: 'Test User',
      role: 'USER',
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.user.update as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const request = createMockRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const response = await loginPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user).toBeDefined();
    expect(data.data.user.email).toBe('test@example.com');
    expect(response.headers.get('set-cookie')).toContain('auth_token=');
  });

  it('should reject invalid email', async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    });

    const response = await loginPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should reject invalid password', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrong-password',
      },
    });

    const response = await loginPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should validate required fields', async () => {
    const request = createMockRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        // Missing password
      },
    });

    const response = await loginPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(400);
    expect(data.success).toBe(false);
  });
});

describe('POST /api/auth/logout', () => {
  it('should clear auth cookie on logout', async () => {
    const response = await logoutPost();
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(response.headers.get('set-cookie')).toContain('auth_token=;');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user info for authenticated user', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      avatar: null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const request = createMockRequest('http://localhost:3000/api/auth/me', {
      userId: 'user123',
    });

    const response = await meGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('test@example.com');
  });

  it('should return 401 for unauthenticated user', async () => {
    const request = createMockRequest('http://localhost:3000/api/auth/me');
    const response = await meGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.success).toBe(false);
  });
});
