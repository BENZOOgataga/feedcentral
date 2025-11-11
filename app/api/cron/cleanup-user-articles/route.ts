import { NextRequest, NextResponse } from 'next/server';

/**
 * Deprecated endpoint.
 * Cleanup for user-provided articles has been merged into
 * `/api/cron/cleanup-articles`. This route is kept for compatibility but
 * returns 410 Gone to signal clients to use the unified endpoint.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Deprecated: use /api/cron/cleanup-articles',
    },
    { status: 410 }
  );
}

export async function POST(request: NextRequest) {
  return GET(request);
}
