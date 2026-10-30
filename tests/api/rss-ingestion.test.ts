import { fetchAndStoreArticles, RSSFeedParser } from '@/lib/rss-parser';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    feedJob: { create: jest.fn(), update: jest.fn() },
    article: { findMany: jest.fn(), createMany: jest.fn() },
    source: { update: jest.fn() },
  },
}));
jest.mock('@/lib/env', () => ({ getAllowedFeedCidrs: () => [] }));
jest.mock('dns/promises', () => ({
  __esModule: true,
  default: { lookup: jest.fn(async () => [{ address: '93.184.216.34', family: 4 }]) },
}));

const db = prisma as jest.Mocked<typeof prisma>;
const source = {
  id: 'source-1',
  name: 'Example',
  categoryId: 'category-1',
  feedUrl: 'https://example.com/feed.xml',
} as Parameters<typeof fetchAndStoreArticles>[0];
const article = (url: string) => ({
  title: 'Article', description: 'Description', url,
  publishedAt: new Date('2026-10-29T12:00:00Z'),
});

describe('RSS ingestion accounting', () => {
  beforeEach(() => {
    // Keep the DNS mock implementation; resetAllMocks() removes its lookup response.
    jest.clearAllMocks();
    jest.spyOn(RSSFeedParser.prototype, 'fetchFeed').mockResolvedValue([
      article('https://example.com/1'),
      article('https://example.com/2'),
    ]);
    (db.feedJob.create as jest.Mock).mockResolvedValue({ id: 'job-1' });
    (db.feedJob.update as jest.Mock).mockResolvedValue({});
    (db.source.update as jest.Mock).mockResolvedValue({});
    (db.article.findMany as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('uses the number actually inserted, including skipped unique conflicts', async () => {
    (db.article.createMany as jest.Mock).mockResolvedValue({ count: 1 });
    const result = await fetchAndStoreArticles(source);

    expect(result).toEqual({ found: 2, added: 1 });
    expect(db.article.createMany).toHaveBeenCalledWith(expect.objectContaining({
      skipDuplicates: true,
    }));
    expect(db.feedJob.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: 'COMPLETED', articlesFound: 2, articlesAdded: 1,
      }),
    }));
  });

  it('deduplicates against articles belonging to any source', async () => {
    (db.article.findMany as jest.Mock).mockResolvedValue([{ url: 'https://example.com/1' }]);
    (db.article.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    await fetchAndStoreArticles(source);

    expect(db.article.findMany).toHaveBeenCalledWith({
      where: { url: { in: ['https://example.com/1', 'https://example.com/2'] } },
      select: { url: true },
    });
    expect((db.article.createMany as jest.Mock).mock.calls[0][0].data).toHaveLength(1);
  });

  it('marks database insertion errors as failed, not completed', async () => {
    (db.article.createMany as jest.Mock).mockRejectedValue(new Error('database insert failed'));
    const result = await fetchAndStoreArticles(source);

    expect(result).toEqual({ found: 2, added: 0, error: 'database insert failed' });
    expect(db.feedJob.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: 'FAILED', articlesFound: 2, articlesAdded: 0,
        error: 'database insert failed',
      }),
    }));
  });
});
