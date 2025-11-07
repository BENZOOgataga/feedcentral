/**
 * Tests for /api/user/source-preferences
 * Default source toggle preferences
 */

import { GET as preferencesGet, PATCH as preferencesPatch } from '@/app/api/user/source-preferences/route';
import { createMockRequest, getResponseData } from '../helpers/test-utils';
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

describe('GET /api/user/source-preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should return user source preferences', async () => {
    const mockPreferences = [
      {
        id: 'pref1',
        userId: 'user123',
        sourceId: 'source1',
        isEnabled: false,
        source: {
          id: 'source1',
          name: 'Test Source',
          url: 'https://example.com',
        },
      },
    ];

    (mockPrisma.userSourcePreference.findMany as jest.Mock).mockResolvedValue(mockPreferences);

    const request = createMockRequest('http://localhost:3000/api/user/source-preferences', {
      userId: 'user123',
    });

    const response = await preferencesGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.preferences).toBeDefined();
    expect(data.preferences).toHaveLength(1);
    expect(data.preferences[0].isEnabled).toBe(false);
  });

  it('should return 401 for unauthenticated user', async () => {
    const request = createMockRequest('http://localhost:3000/api/user/source-preferences');
    const response = await preferencesGet(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('PATCH /api/user/source-preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllMocks();
  });

  it('should toggle source preference', async () => {
    const mockPreference = {
      id: 'pref1',
      userId: 'user123',
      sourceId: 'source1',
      isEnabled: false,
    };

    const mockSource = {
      id: 'source1',
      name: 'Test Source',
    };

    (mockPrisma.source.findUnique as jest.Mock).mockResolvedValue(mockSource);
    (mockPrisma.userSourcePreference.upsert as jest.Mock).mockResolvedValue(mockPreference);

    const request = createMockRequest('http://localhost:3000/api/user/source-preferences', {
      method: 'PATCH',
      userId: 'user123',
      body: {
        sourceId: 'source1',
        isEnabled: false,
      },
    });

    const response = await preferencesPatch(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(200);
    expect(data.message).toBe('Preference updated successfully');
    expect(data.preference.isEnabled).toBe(false);
  });

  it('should validate required fields', async () => {
    const request = createMockRequest('http://localhost:3000/api/user/source-preferences', {
      method: 'PATCH',
      userId: 'user123',
      body: {
        // Missing sourceId
        isEnabled: false,
      },
    });

    const response = await preferencesPatch(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should require authentication', async () => {
    const request = createMockRequest('http://localhost:3000/api/user/source-preferences', {
      method: 'PATCH',
      body: {
        sourceId: 'source1',
        isEnabled: false,
      },
    });

    const response = await preferencesPatch(request);
    const { status, data } = await getResponseData(response);

    expect(status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});
