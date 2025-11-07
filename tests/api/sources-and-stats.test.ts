/**
 * Tests for /api/sources and /api/stats
 * Public endpoints for default sources and statistics
 */

import { GET as sourcesGet } from '@/app/api/sources/route';
import { GET as statsGet } from '@/app/api/stats/route';
import { getResponseData } from '../helpers/test-utils';
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

describe('GET /api/sources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should return all active sources', async () => {
    const mockSources = [
      {
        id: 'source1',
        name: 'Test Source',
        url: 'https://example.com',
        feedUrl: 'https://example.com/feed.xml',
        isActive: true,
        categoryId: 'cat1',
        category: { id: 'cat1', name: 'Tech', slug: 'tech' },
      },
    ];

    mockPrisma.source.findMany.mockResolvedValue(mockSources);

    const response = await sourcesGet();
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.sources).toHaveLength(1);
    expect(data.sources[0].name).toBe('Test Source');
  });
});

describe('GET /api/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return feed statistics', async () => {
    const mockCategories = [
      {
        id: 'cat1',
        name: 'Technology',
        slug: 'tech',
        icon: 'cpu',
        color: '#0000ff',
        _count: { articles: 100 },
      },
    ];

    const mockTopSources = [
      { id: 'source1', name: 'Top Source' },
    ];

    mockPrisma.source.count.mockResolvedValue(13);
    mockPrisma.article.count.mockResolvedValue(500);
    mockPrisma.category.findMany.mockResolvedValue(mockCategories);
    mockPrisma.source.findMany.mockResolvedValue(mockTopSources);
    mockPrisma.feedJob.findMany.mockResolvedValue([]);

    const response = await statsGet();
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.activeSources).toBe(13);
    expect(data.data.totalArticles).toBe(500);
    expect(data.data.categories).toHaveLength(1);
  });

  it('should include recent articles count', async () => {
    mockPrisma.source.count.mockResolvedValue(0);
    mockPrisma.article.count
      .mockResolvedValueOnce(0) // totalArticles
      .mockResolvedValueOnce(25); // recentArticles (last 24h)
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.source.findMany.mockResolvedValue([]);
    mockPrisma.feedJob.findMany.mockResolvedValue([]);

    const response = await statsGet();
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.data.todayArticles).toBe(25);
  });
});
