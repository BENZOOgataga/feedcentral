// Mock setup for all test files
const { mockPrisma } = require('../helpers/prisma-mock');

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: mockPrisma,
  default: mockPrisma,
}));
