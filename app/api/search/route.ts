import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({
      success: false,
      error: 'Query parameter is required',
    }, { status: 400 });
  }

  // Mock response - replace with actual full-text search
  return NextResponse.json({
    success: true,
    data: {
      articles: [],
      total: 0,
      query,
    },
  });
}
