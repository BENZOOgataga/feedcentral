# API Tests

Comprehensive test suite for all FeedCentral API routes.

## Test Structure

```
tests/
├── helpers/
│   └── test-utils.ts          # Testing utilities and mocks
└── api/
    ├── articles.test.ts        # /api/articles - Main feed endpoint
    ├── articles-by-id.test.ts  # /api/articles/[id] - Single article
    ├── auth.test.ts            # /api/auth/* - Authentication
    ├── user-sources.test.ts    # /api/user/sources - Custom RSS sources
    ├── source-preferences.test.ts # /api/user/source-preferences - Toggle defaults
    └── sources-and-stats.test.ts  # /api/sources & /api/stats - Public endpoints
```

## Test Coverage

### Authentication (`auth.test.ts`)
- ✅ Login with valid credentials
- ✅ Reject invalid email/password
- ✅ Field validation
- ✅ Logout functionality
- ✅ Get current user info
- ✅ Unauthorized access handling

### Articles Feed (`articles.test.ts`)
- ✅ Paginated article listing
- ✅ Category filtering
- ✅ Source filtering
- ✅ Anonymous vs authenticated users
- ✅ Merge custom and default articles
- ✅ Filter disabled sources
- ✅ Pagination parameters

### Single Article (`articles-by-id.test.ts`)
- ✅ Fetch default article by ID
- ✅ Fetch custom source article by ID
- ✅ Fallback from Article to UserArticle table
- ✅ 404 handling for non-existent articles
- ✅ Soft-delete exclusion
- ✅ Error handling

### Custom Sources (`user-sources.test.ts`)
- ✅ List user's custom sources
- ✅ Create new custom source
- ✅ Update custom source
- ✅ Delete custom source
- ✅ Refresh custom source
- ✅ Duplicate feed detection
- ✅ Source limit enforcement (max 10)
- ✅ Ownership verification
- ✅ Field validation

### Source Preferences (`source-preferences.test.ts`)
- ✅ Get user preferences
- ✅ Toggle default source on/off
- ✅ Upsert preferences
- ✅ Field validation
- ✅ Authentication required

### Public Endpoints (`sources-and-stats.test.ts`)
- ✅ List all default sources
- ✅ Filter sources by category
- ✅ Only active sources shown
- ✅ Feed statistics
- ✅ Article counts (total, recent)
- ✅ Category statistics

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test articles.test.ts

# Run with coverage
npm test -- --coverage

# Run tests matching pattern
npm test -- --testNamePattern="should return"
```

## Test Utilities

### `createMockRequest(url, options)`
Creates a mock NextRequest with optional authentication and body.

```typescript
const request = createMockRequest('http://localhost:3000/api/articles', {
  method: 'POST',
  userId: 'user123', // Adds auth token
  body: { title: 'Test' },
  searchParams: { category: 'tech' },
});
```

### `getResponseData(response)`
Extracts JSON data and status from NextResponse.

```typescript
const response = await GET(request);
const { status, data } = await getResponseData(response);
expect(status).toBe(200);
expect(data.success).toBe(true);
```

### `createMockParams(params)`
Creates async params for dynamic routes.

```typescript
const response = await GET(request, { 
  params: createMockParams({ id: 'article123' }) 
});
```

## Mocking

Tests use Jest mocks for:
- **Prisma Client**: All database operations
- **bcryptjs**: Password hashing
- **RSS Parser**: Feed fetching
- **JWT**: Token generation/verification

## Environment Variables

Tests use default test values:
- `JWT_SECRET`: 'test-secret-key-for-testing-only'
- Database operations are fully mocked

## CI/CD Integration

Tests can be run in CI pipelines:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --ci --coverage
```

## Best Practices

1. **Isolation**: Each test is independent, no shared state
2. **Mocking**: All external dependencies mocked
3. **Clear Names**: Descriptive test names following "should..." pattern
4. **Setup/Teardown**: `beforeEach` clears all mocks
5. **Error Cases**: Both success and failure paths tested
6. **Type Safety**: Full TypeScript support

## Writing New Tests

Template for new API route tests:

```typescript
import { GET } from '@/app/api/your-route/route';
import { createMockRequest, getResponseData } from '../helpers/test-utils';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('GET /api/your-route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    (prisma.model.method as any) = jest.fn().mockResolvedValue(mockData);
    
    // Act
    const request = createMockRequest('http://localhost:3000/api/your-route');
    const response = await GET(request);
    const { status, data } = await getResponseData(response);
    
    // Assert
    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Troubleshooting

### TypeScript Errors
- The Prisma client types may not include custom models during testing
- Use `as any` for type casting in mocks: `(prisma.userSource.findMany as any)`

### Async Issues
- Always `await` response methods: `await getResponseData(response)`
- Use `createMockParams()` for dynamic route params

### Mock Not Working
- Ensure `jest.clearAllMocks()` in `beforeEach`
- Check mock is defined before test runs
- Verify correct import path in `jest.mock()`

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Current coverage can be viewed with:
```bash
npm test -- --coverage
```
