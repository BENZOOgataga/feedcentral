import { NextRequest } from 'next/server';
import { POST } from '@/app/mcp/route';
import { GET as settingsGet } from '@/app/api/admin/mcp/route';
import { enabled, sameOrigin } from '@/lib/mcp-auth';

jest.mock('@/lib/prisma', () => ({
  prisma: { mcpSettings: { findUnique: jest.fn() } },
}));
jest.mock('@/lib/rss-parser', () => ({
  fetchAllActiveSources: jest.fn(), fetchSingleSource: jest.fn(), validateRSSFeed: jest.fn(),
}));
jest.mock('@/lib/mcp-auth', () => ({
  enabled: jest.fn(), verifyMcp: jest.fn(), audit: jest.fn(),
  origin: 'https://feed.benzoogataga.com',
  sameOrigin: jest.fn(),
}));
jest.mock('@/lib/auth', () => ({
  requireAdmin: jest.fn(async (_req, callback) => callback()),
}));
const { prisma } = require('@/lib/prisma');
const mockedEnabled = enabled as jest.MockedFunction<typeof enabled>;
const mockedSameOrigin = sameOrigin as jest.MockedFunction<typeof sameOrigin>;

describe('Embedded MCP safety defaults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSameOrigin.mockReturnValue(true);
  });

  it('keeps MCP disabled when no settings exist', async () => {
    mockedEnabled.mockResolvedValue({ enabled: false, allowWrites: false });
    const response = await POST(new NextRequest('https://feed.benzoogataga.com/mcp', {
      method: 'POST', headers: { Accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 1 }),
    }));
    expect(response.status).toBe(404);
  });

  it('rejects requests with a foreign origin', async () => {
    mockedSameOrigin.mockReturnValue(false);
    const response = await POST(new NextRequest('https://feed.benzoogataga.com/mcp', {
      method: 'POST', headers: { Origin: 'https://evil.example' },
      body: '{}',
    }));
    expect(response.status).toBe(403);
  });

  it('defaults dashboard settings to disabled and read-only', async () => {
    prisma.mcpSettings.findUnique.mockResolvedValue(null);
    const response = await settingsGet(new NextRequest('https://feed.benzoogataga.com/api/admin/mcp'));
    expect(await response.json()).toEqual({
      success: true, data: { enabled: false, allowWrites: false },
    });
  });
});
