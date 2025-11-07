/**
 * Tests for /api/user/sources
 * Custom RSS sources management endpoints
 */

import { GET as sourcesGet, POST as sourcesPost } from '@/app/api/user/sources/route';
import { PATCH as sourceUpdate, DELETE as sourceDelete } from '@/app/api/user/sources/[id]/route';
import { POST as sourceRefresh } from '@/app/api/user/sources/[id]/refresh/route';
import { createMockRequest, getResponseData, createMockParams } from '../helpers/test-utils';
import { resetAllMocks } from '../helpers/prisma-mock';

jest.mock('@/lib/prisma', () => {
  const { mockPrisma } = require('../helpers/prisma-mock');
  return {
    __esModule: true,
    prisma: mockPrisma,
    default: mockPrisma,
  };
});

const { mockPrisma } = require('./../../tests/helpers/prisma-mock');

// Mock RSS parser module with a spy we can control
const mockFetchAndStoreUserArticles = jest.fn();
jest.mock('@/lib/rss-parser', () => ({
  __esModule: true,
  fetchAndStoreUserArticles: (...args: any[]) => mockFetchAndStoreUserArticles(...args),
}));

describe('GET /api/user/sources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should return user sources for authenticated user', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };

    const mockSources = [
      {
        id: 'source1',
        feedUrl: 'https://example.com/feed.xml',
        customName: 'My Feed',
        feedTitle: 'Example Feed',
        isEnabled: true,
        categoryId: 'cat1',
        articleCount: 10,
        lastFetchedAt: new Date(),
        category: { id: 'cat1', name: 'Tech', slug: 'tech' },
      },
    ];

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userSource.findMany as jest.Mock).mockResolvedValue(mockSources);
    (mockPrisma.userSource.count as jest.Mock).mockResolvedValue(1);

    const request = createMockRequest('http://localhost:3000/api/user/sources', {
      userId: 'user123',
    });

    const response = await sourcesGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.sources).toBeDefined();
    expect(data.sources).toHaveLength(1);
    expect(data.sources[0].customName).toBe('My Feed');
  });

  it('should return 401 for unauthenticated user', async () => {
    const request = createMockRequest('http://localhost:3000/api/user/sources');
    const response = await sourcesGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('POST /api/user/sources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should create a new custom source', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };

    const mockSource = {
      id: 'new-source',
      feedUrl: 'https://example.com/feed.xml',
      customName: 'New Feed',
      userId: 'user123',
      isEnabled: true,
      categoryId: 'cat1',
      category: { id: 'cat1', name: 'Tech', slug: 'tech' },
    };

    const mockRSSParser = require('@/lib/rss-parser');
    mockRSSParser.validateRSSFeed = jest.fn().mockResolvedValue({
      isValid: true,
      feedTitle: 'Example Feed',
      siteUrl: 'https://example.com',
    });

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userSource.count as jest.Mock).mockResolvedValue(5);
    (mockPrisma.userSource.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.userSource.create as jest.Mock).mockResolvedValue(mockSource);

    const request = createMockRequest('http://localhost:3000/api/user/sources', {
      method: 'POST',
      userId: 'user123',
      body: {
        feedUrl: 'https://example.com/feed.xml',
        customName: 'New Feed',
        categoryId: 'cat1',
      },
    });

    const response = await sourcesPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(201);
    expect(data.message).toBe('Source added successfully');
    expect(data.source.customName).toBe('New Feed');
  });

  it('should reject duplicate feed URL', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userSource.count as jest.Mock).mockResolvedValue(5);
    (mockPrisma.userSource.findFirst as jest.Mock).mockResolvedValue({ id: 'existing' });

    const request = createMockRequest('http://localhost:3000/api/user/sources', {
      method: 'POST',
      userId: 'user123',
      body: {
        feedUrl: 'https://example.com/feed.xml',
        customName: 'Duplicate Feed',
      },
    });

    const response = await sourcesPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(409);
    expect(data.error).toBeDefined();
    expect(data.error).toContain('already added');
  });

  it('should enforce source limit', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.userSource.count as jest.Mock).mockResolvedValue(10);

    const request = createMockRequest('http://localhost:3000/api/user/sources', {
      method: 'POST',
      userId: 'user123',
      body: {
        feedUrl: 'https://example.com/feed.xml',
        customName: 'Too Many Feeds',
      },
    });

    const response = await sourcesPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(403);
    expect(data.error).toBeDefined();
    expect(data.error).toContain('Free tier limit reached');
  });

  it('should validate required fields', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const request = createMockRequest('http://localhost:3000/api/user/sources', {
      method: 'POST',
      userId: 'user123',
      body: {
        // Missing feedUrl
        customName: 'Invalid Feed',
      },
    });

    const response = await sourcesPost(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(400);
    expect(data.error).toBeDefined();
  });
});

describe('PATCH /api/user/sources/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a custom source', async () => {
    const mockSource = {
      id: 'source1',
      userId: 'user123',
      feedUrl: 'https://example.com/feed.xml',
    };

    const updatedSource = {
      ...mockSource,
      customName: 'Updated Name',
      isEnabled: false,
    };

    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(mockSource);
    (mockPrisma.userSource.update as jest.Mock).mockResolvedValue(updatedSource);

    const request = createMockRequest('http://localhost:3000/api/user/sources/source1', {
      method: 'PATCH',
      userId: 'user123',
      body: {
        customName: 'Updated Name',
        isEnabled: false,
      },
    });

    const response = await sourceUpdate(request, { params: createMockParams({ id: 'source1' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.message).toBeDefined();
    expect(data.source.customName).toBe('Updated Name');
  });

  it('should return 404 for non-existent source', async () => {
    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/user/sources/nonexistent', {
      method: 'PATCH',
      userId: 'user123',
      body: { customName: 'Test' },
    });

    const response = await sourceUpdate(request, { params: createMockParams({ id: 'nonexistent' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it('should prevent updating another user\'s source', async () => {
    const mockSource = {
      id: 'source1',
      userId: 'other-user',
    };

    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(mockSource);

    const request = createMockRequest('http://localhost:3000/api/user/sources/source1', {
      method: 'PATCH',
      userId: 'user123',
      body: { customName: 'Hacked' },
    });

    const response = await sourceUpdate(request, { params: createMockParams({ id: 'source1' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(403);
    expect(data.error).toBeDefined();
  });
});

describe('DELETE /api/user/sources/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a custom source', async () => {
    const mockSource = {
      id: 'source1',
      userId: 'user123',
    };

    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(mockSource);
    (mockPrisma.userSource.delete as jest.Mock).mockResolvedValue(mockSource);

    const request = createMockRequest('http://localhost:3000/api/user/sources/source1', {
      method: 'DELETE',
      userId: 'user123',
    });

    const response = await sourceDelete(request, { params: createMockParams({ id: 'source1' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.message).toBeDefined();
    expect(data.message).toContain('deleted');
  });
});

describe('POST /api/user/sources/[id]/refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should refresh a custom source', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      premiumTier: 'free',
    };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const mockSource = {
      id: 'source1',
      userId: 'user123',
      feedUrl: 'https://example.com/feed.xml',
    };

    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(mockSource);

    // Mock the fetchAndStoreUserArticles function
    mockFetchAndStoreUserArticles.mockResolvedValue({
      found: 10,
      added: 5,
    });

    const request = createMockRequest('http://localhost:3000/api/user/sources/source1/refresh', {
      method: 'POST',
      userId: 'user123',
    });

    const response = await sourceRefresh(request, { params: createMockParams({ id: 'source1' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.message).toBeDefined();
  });

  it('should return 404 for non-existent source', async () => {
    (mockPrisma.userSource.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createMockRequest('http://localhost:3000/api/user/sources/nonexistent/refresh', {
      method: 'POST',
      userId: 'user123',
    });

    const response = await sourceRefresh(request, { params: createMockParams({ id: 'nonexistent' }) });
    const { status, data } = await getResponseData(response);

    expect(status).toBe(404);
    expect(data.error).toBeDefined();
  });
});
